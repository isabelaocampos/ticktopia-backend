import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto/create-event.dto';
import { PaginationDto } from 'src/commons/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { UpdateEventDto } from './dto/update-event.dto/update-event.dto';

@Injectable()
export class EventService {
    private logger = new Logger('EventService');
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        private readonly dataSource: DataSource
    ){}

    async create(createEventDto: CreateEventDto) {
        try{
            const event = this.eventRepository.create(createEventDto as DeepPartial<Event>);
            await this.eventRepository.save(event);
            return event;
        }catch(error){
            this.logger.error(error.detail);
            this.handleExceptions(error);
        }
    }

    async findAll(paginationDto: PaginationDto) {
        try{
            const {limit=10, offset=0 } = paginationDto;
            return await this.eventRepository.find({
                take: limit,
                skip: offset
            });
        }catch(error){
            this.handleExceptions(error);
        }
    }

    async findOne(term: string) {
        let event: Event | null;
        if(isUUID(term)){
            event = await this.eventRepository.findOneBy({ idEvent: term });
        }else{
            const queryBuilder = this.eventRepository.createQueryBuilder('event');
            event = await queryBuilder.where('UPPER(name)=:name or nickname=:nickname',{
                name: term.toUpperCase(),
                nickname: term
            }).getOne();
        }

        if(!event)
            throw new NotFoundException(`Event with id ${term} not found`);

        return event;
    }

    async update(id: string, updateEventDto: UpdateEventDto) {
        try{
            const event = await this.findOne(id);
            this.eventRepository.merge(event, updateEventDto as DeepPartial<Event>);
            return await this.eventRepository.save(event);
        }catch(error){
            this.logger.error(error.detail);
            this.handleExceptions(error);
        }
    }

    async remove(id: string) {
        try{
            const event = await this.findOne(id);
            await this.eventRepository.remove(event);
            return event;
        }catch(error){
            this.logger.error(error.detail);
            this.handleExceptions(error);
        }
    }

    deleteAllEvents() {
        const query = this.eventRepository.createQueryBuilder();
        try{
            return query
                .delete()
                .where({})
                .execute();
        }catch(error){
            this.handleExceptions(error);
        }
    }

    private handleExceptions(error: any){
        if(error.code === "23505")
          throw new BadRequestException(error.detail);
    
        this.logger.error(error.detail);
        throw new InternalServerErrorException('Unspected error, check your server');
      }
}

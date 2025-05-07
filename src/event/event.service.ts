import { Injectable, Logger, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../auth/entities/user.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
// Removed duplicate import of CreateEventDto
import { PaginationDto } from 'src/commons/dto/pagination.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class EventService {
  private readonly logger = new Logger('EventService');

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {}

    async create(createEventDto: CreateEventDto) {
        try{
            const event = this.eventRepository.create(createEventDto);
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
            event = await this.eventRepository.findOneBy({ id: term });
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
            this.eventRepository.merge(event, updateEventDto);
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

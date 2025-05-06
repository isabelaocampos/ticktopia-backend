import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from 'src/auth/entities/user.entity';

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
    try {
      const user = await this.userRepository.findOneBy({ id: createEventDto.userId });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const newEvent = this.eventRepository.create(createEventDto);
      await this.eventRepository.save({...newEvent, user});
      return newEvent;
    } catch (error) {
      this.logger.error('Error creating event', error.stack);
      throw new InternalServerErrorException('Error creating event');
    }
  }

  async findAll() {
    try {
      const events = await this.eventRepository.find();
      return events;
    } catch (error) {
      this.logger.error('Error fetching events', error.stack);
      throw new InternalServerErrorException('Error fetching events');
    }
  }

  async findOne(id: string) {
    try {
      const event = await this.eventRepository.findOne({ where: { id: id } });
      return event;
    } catch (error) {
      this.logger.error(`Error fetching event with ID ${id}`, error.stack);
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      await this.eventRepository.update(id, updateEventDto);
      const updatedEvent = await this.findOne(id); // Re-fetch the updated event
      return updatedEvent;
    } catch (error) {
      this.logger.error(`Error updating event with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Error updating event');
    }
  }

  async remove(id: string) {
    try {
      const eventToRemove = await this.findOne(id);
      if (!eventToRemove) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      await this.eventRepository.remove(eventToRemove);
      return eventToRemove;
    } catch (error) {
      this.logger.error(`Error deleting event with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Error deleting event');
    }
  }
}

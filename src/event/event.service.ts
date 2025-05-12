import { Injectable, Logger, NotFoundException, InternalServerErrorException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../auth/entities/user.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
// Removed duplicate import of CreateEventDto
import { isUUID } from 'class-validator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class EventService {
  private readonly logger = new Logger('EventService');

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) { }

  async create(createEventDto: CreateEventDto) {
  try {
    const user = await this.userRepository.findOneBy({ id: createEventDto.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allowedRoles = [ValidRoles.eventManager, ValidRoles.admin];
    const hasPermission = user.roles.some(role => allowedRoles.includes(role as ValidRoles));
    if (!hasPermission) {
      throw new ForbiddenException('User does not have permission to create an event');
    }

    const newEvent = this.eventRepository.create(createEventDto);
    await this.eventRepository.save({ ...newEvent, user });
    return newEvent;
    
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof ForbiddenException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }
    this.logger.error('Error creating event', error.stack);
    throw new InternalServerErrorException('Error creating event');
  }
}

async update(id: string, updateEventDto: UpdateEventDto, user: User) {
  try {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const isAdmin = user.roles.includes(ValidRoles.admin);
    const isEventManager = user.roles.includes(ValidRoles.eventManager);

    if (isEventManager && event.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own events');
    }

    await this.eventRepository.update(id, updateEventDto);
    const updatedEvent = await this.findOne(id, user);
    return updatedEvent;
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof ForbiddenException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }
    this.logger.error(`Error updating event with ID ${id}`, error.stack);
    throw new InternalServerErrorException('Error updating event');
  }
}

async remove(id: string, user: User) {
  try {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const isAdmin = user.roles.includes(ValidRoles.admin);
    const isEventManager = user.roles.includes(ValidRoles.eventManager);

    if (isEventManager && event.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.eventRepository.remove(event);
    return event;
  } catch (error) {
    if (
      error instanceof NotFoundException ||
      error instanceof ForbiddenException ||
      error instanceof BadRequestException
    ) {
      throw error;  // Re-throw expected exceptions
    }
    this.logger.error(error.detail || error.message);
    this.handleExceptions(error);
    throw new InternalServerErrorException('Unexpected error occurred during event removal');  // Ensure error is thrown
  }
}


async findOne(term: string, user: User): Promise<Event> {
  const event = await this.eventRepository.findOne({
    where: [{ id: term }, { name: term }],
    relations: ['user'],
  });

  if (!event) {
    throw new NotFoundException(`Event with id or name "${term}" not found`);
  }

  const isAdmin = user.roles.includes(ValidRoles.admin);
  const isOwner = event.user.id === user.id;

  if (!isAdmin && !isOwner) {
    throw new ForbiddenException('Access to this event is restricted');
  }

  return event;
}


  async findAll(limit = 10, offset = 0) {
        try{
            return await this.eventRepository.find({
                take: limit,
                skip: offset
            });
        }catch(error){
            this.handleExceptions(error);
        }
  }

  async findAllByUserId(userId: string) {
  try {
    const events = await this.eventRepository.find({
      where: { user: { id: userId } }
    });

    return events;
  } catch (error) {
    this.logger.error(`Error fetching events for user ${userId}`, error.stack);
    throw new InternalServerErrorException('Error fetching events for user');
  }
  }

  async deleteAll() {
    try {
      await this.eventRepository.delete({});
      return { message: `All events deleted successfully` };
    } catch (error) {
      this.logger.error('Error deleting all events', error.stack);
      throw new InternalServerErrorException('Error deleting all events');
    }
  }

  private handleExceptions(error: any): never {
        if (error.code === "23505")
          throw new BadRequestException(error.detail);
      
        this.logger.error(error.detail);
        throw new InternalServerErrorException('Unexpected error, check your server');
  }
}
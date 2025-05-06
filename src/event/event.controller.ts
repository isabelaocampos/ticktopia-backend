import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { NotFoundException, Logger } from '@nestjs/common';

@Controller('event')
export class EventController {
  private readonly logger = new Logger('EventController');

  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    try {
      if (createEventDto.isPublic === undefined) {
        createEventDto.isPublic = true;
      }
      const newEvent = await this.eventService.create(createEventDto);
      return newEvent;
    } catch (error) {
      this.logger.error('Error creating event', error.stack);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const events = await this.eventService.findAll();
      return events;
    } catch (error) {
      this.logger.error('Error fetching events', error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const event = await this.eventService.findOne(id);
      if (!event) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      return event;
    } catch (error) {
      this.logger.error(`Error fetching event with ID ${id}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    try {
      const updatedEvent = await this.eventService.update(id, updateEventDto);
      if (!updatedEvent) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      return updatedEvent;
    } catch (error) {
      this.logger.error(`Error updating event with ID ${id}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedEvent = await this.eventService.remove(id);
      if (!deletedEvent) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      return { message: `Event with ID ${id} has been deleted successfully` };
    } catch (error) {
      this.logger.error(`Error deleting event with ID ${id}`, error.stack);
      throw error;
    }
  }
}

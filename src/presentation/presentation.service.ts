import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presentation } from './entities/presentation.entity';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { Event } from 'src/event/entities/event.entity';
import e from 'express';

@Injectable()
export class PresentationService {
  private readonly logger = new Logger('PresentationService');

  constructor(
    @InjectRepository(Presentation)
    private readonly presentationRepository: Repository<Presentation>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createPresentationDto: CreatePresentationDto) {
    try {
      const event = await this.eventRepository.findOneBy({ id: createPresentationDto.eventId});

      if (!event) {
        throw new NotFoundException(`Event with ID ${createPresentationDto.eventId} not found`);
      }
      const newPresentation = this.presentationRepository.create({...createPresentationDto, event: event});
      await this.presentationRepository.save(newPresentation);
      return newPresentation;
    } catch (error) {
      this.logger.error('Error creating presentation', error.stack);
      throw new InternalServerErrorException('Error creating presentation');
    }
  }

  async findAll() {
    try {
      const presentations = await this.presentationRepository.find();
      return presentations;
    } catch (error) {
      this.logger.error('Error fetching presentations', error.stack);
      throw new InternalServerErrorException('Error fetching presentations');
    }
  }

  async findOne(id: string) {
    try {
      const presentation = await this.presentationRepository.findOne({ where: { idPresentation: id } });
      return presentation;
    } catch (error) {
      this.logger.error(`Error fetching presentation with ID ${id}`, error.stack);
      throw new NotFoundException(`Presentation with ID ${id} not found`);
    }
  }

  async update(id: string, updatePresentationDto: UpdatePresentationDto) {
    try {
      await this.presentationRepository.update(id, updatePresentationDto);
      const updatedPresentation = await this.findOne(id); // Re-fetch the updated presentation
      return updatedPresentation;
    } catch (error) {
      this.logger.error(`Error updating presentation with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Error updating presentation');
    }
  }

  async remove(id: string) {
    try {
      const presentationToRemove = await this.findOne(id);
      if (!presentationToRemove) {
        throw new NotFoundException(`Presentation with ID ${id} not found`);
      }
      await this.presentationRepository.remove(presentationToRemove);
      return presentationToRemove;
    } catch (error) {
      this.logger.error(`Error deleting presentation with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Error deleting presentation');
    }
  }
}

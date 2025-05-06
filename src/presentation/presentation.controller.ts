import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { NotFoundException, Logger } from '@nestjs/common';

@Controller('presentation')
export class PresentationController {
  private readonly logger = new Logger('PresentationController');

  constructor(private readonly presentationService: PresentationService) {}

  @Post()
  async create(@Body() createPresentationDto: CreatePresentationDto) {
    try {
      const newPresentation = await this.presentationService.create(createPresentationDto);
      return newPresentation;
    } catch (error) {
      this.logger.error('Error creating presentation', error.stack);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      const presentations = await this.presentationService.findAll();
      return presentations;
    } catch (error) {
      this.logger.error('Error fetching presentations', error.stack);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const presentation = await this.presentationService.findOne(id);
      if (!presentation) {
        throw new NotFoundException(`Presentation with ID ${id} not found`);
      }
      return presentation;
    } catch (error) {
      this.logger.error(`Error fetching presentation with ID ${id}`, error.stack);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePresentationDto: UpdatePresentationDto) {
    try {
      const updatedPresentation = await this.presentationService.update(id, updatePresentationDto);
      if (!updatedPresentation) {
        throw new NotFoundException(`Presentation with ID ${id} not found`);
      }
      return updatedPresentation;
    } catch (error) {
      this.logger.error(`Error updating presentation with ID ${id}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedPresentation = await this.presentationService.remove(id);
      if (!deletedPresentation) {
        throw new NotFoundException(`Presentation with ID ${id} not found`);
      }
      return { message: `Presentation with ID ${id} has been deleted successfully` };
    } catch (error) {
      this.logger.error(`Error deleting presentation with ID ${id}`, error.stack);
      throw error;
    }
  }
}

import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto/create-event.dto';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { PaginationDto } from 'src/commons/dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateEventDto } from './dto/update-event.dto/update-event.dto';

ApiTags('Event')
@Controller('event')
export class EventController {
    constructor(private readonly EventService: EventService){}

    @Post()
    @ApiResponse({ status: 201, description: 'Event was created', type: Event })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createEventDto: CreateEventDto) {
        return this.EventService.create(createEventDto);
    }

    @Get()
    @Auth(ValidRoles.admin)
    findAll(@Query() paginationDto: PaginationDto) {
        return this.EventService.findAll(paginationDto);
    }

    @Get(':term')
    findOne(@Param('term') term: string) {
        return this.EventService.findOne(term);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
        return this.EventService.update(id, updateEventDto);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Event was removed' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
    @Auth(ValidRoles.admin, ValidRoles.eventManager)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.EventService.remove(id);
    }


}

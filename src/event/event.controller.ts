import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';


@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly EventService: EventService,) { }

  @Post('create')
  @ApiResponse({ status: 201, description: 'Event was created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Auth(ValidRoles.eventManager)
  create(@Body() createEventDto: CreateEventDto, @GetUser() user: User) {
    // Asegura que el userId sea el del usuario autenticado
    return this.EventService.create({ ...createEventDto, userId: user.id });
  }

  @Get('findAll')
  @ApiResponse({ status: 200, description: 'All events returned' })
  findAll(@Query('limit') limit: string, @Query('offset') offset: string) {
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedOffset = parseInt(offset, 10) || 0;
    return this.EventService.findAll(parsedLimit, parsedOffset);
  }

  @Get('find/user')
  @Auth(ValidRoles.admin, ValidRoles.eventManager)
  async findAllByUserId(@GetUser() user: User) {
    return this.EventService.findAllByUserId(user.id);
  }

  @Get('find/manager/:term')
  @Auth(ValidRoles.admin, ValidRoles.eventManager)
  findOneUnrestricted(@Param('term') term: string) {
    return this.EventService.findOneUnrestricted(term);
  }

  @Get('find/:term')
  findOne(@Param('term') term: string) {
    return this.EventService.findOne(term);
  }

  @Put('update/:id')
  @Auth(ValidRoles.eventManager)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @GetUser() user: User,
  ) {
    return this.EventService.update(id, updateEventDto, user);
  }

  @Delete('delete/:id')
  @ApiResponse({ status: 200, description: 'Event was removed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Auth(ValidRoles.admin, ValidRoles.eventManager)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.EventService.remove(id, user);
  }

  @Delete('deleteAll')
  @ApiResponse({ status: 200, description: 'All events removed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Auth(ValidRoles.admin)
  deleteAll() {
    return this.EventService.deleteAll();
  }
}
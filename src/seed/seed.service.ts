import { Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { initialData } from './data/seed-data';
import { Student } from '../students/entities/student.entity';
import { EventService } from 'src/event/event.service';

@Injectable()
export class SeedService {

  constructor(private readonly studentService: StudentsService,
              private readonly eventService: EventService){}


async runSeed() {
    await this.insertNewStudents();
    return 'SEED EXECUTED';
  }

async insertNewStudents(){
  await this.studentService.deleteAllStudents();

  const students = initialData.students;

  const insertPromises: Promise<Student | undefined>[] = [];

  students.forEach(student => {
    insertPromises.push(this.studentService.create(student))
  });

  await Promise.all(insertPromises);

  return true;
}

async insertNewEvents(){
  await this.eventService.deleteAllEvents();
  const events = initialData.events;
  const insertPromises: Promise<Event | undefined>[] = [];
  events.forEach(event => {
    insertPromises.push(this.eventService.create(event))
  });
  await Promise.all(insertPromises);
  return true;

}

}

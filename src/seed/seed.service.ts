import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {

  constructor(){}


async runSeed() {
 
    return 'SEED EXECUTED';
  }

// async insertNewStudents(){
//   await this.studentService.deleteAllStudents();

//   const students = initialData.students;


//   await Promise.all(insertPromises);

//   return true;
// }

}

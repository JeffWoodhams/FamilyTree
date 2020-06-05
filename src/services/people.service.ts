import { Injectable } from '@angular/core';
import { PersonApi, Person, LoopBackFilter } from '../../sdk';


@Injectable()
export class PeopleService {
  constructor(
    private peopleApi: PersonApi){}

  person: Person;
  deletePerson(personID: string){
    return this.peopleApi.deleteById<Person>(personID)
    .toPromise()
  }

  upsertPerson(data){
    return this.peopleApi.upsert<Person>(data)
    .toPromise()
  }

  getPeople(){
   return this.peopleApi.find<Person>().toPromise()
  }

  getFamily(ID){
    let filter: LoopBackFilter  = {
      "include":{"events":true}
    }
    return this.peopleApi.find<Person>(filter).toPromise();
  }
}


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
  
  getKeyPeople(){
    let filter: LoopBackFilter  = {
      "where":{"or":[{"personID":"SheilaMaryPreece1953"},{"personID":"JefferyEdwinWoodhams1950"},{"personID":"PeterWoodhams1928"},{"personID":"BarbaraMaryJoyceLevey1931"}
      ,{"personID":"JohnPreece1921"},{"personID":"FlorenceJoanWilliams1924"}]}
    }
    return this.peopleApi.find<Person>(filter).toPromise()
   }

  getFamily(ID){
    let filter: LoopBackFilter  = {
      "include":{"events":true}
    }
    return this.peopleApi.find<Person>(filter).toPromise();
  }
}


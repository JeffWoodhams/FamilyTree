import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { PeopleService } from '../../services/people.service';

@Injectable()
export class PeopleListResolver implements Resolve<any> {

  constructor(
    private peopleService: PeopleService
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
 
    return new Promise((resolve, reject) => {
      this.peopleService.getPeople()
      .then(people => {
        return resolve({
          people: people
        });
      },
      err => {
        console.log(err);
        return resolve(null);
      })
    });
  }
}

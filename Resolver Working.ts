import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, NavigationStart } from "@angular/router";
import { PeopleService } from '../../services/people.service';

@Injectable()
export class FamilyChartResolver implements Resolve<any> {

  constructor(
    private peopleService: PeopleService
  ) { }


  resolve(route: ActivatedRouteSnapshot) {
 
    let keyID = route.paramMap.get('personID')

    return new Promise((resolve, reject) => {
      this.peopleService.getFamily(keyID)
        .then(people => {
          return resolve({
            people : people
          });
      },
      err => {
        console.log(err);
        return resolve(null);
      })
    });
  }
}
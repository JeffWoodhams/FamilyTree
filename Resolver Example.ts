import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, NavigationStart } from "@angular/router";
import { PeopleService } from '../../services/people.service';

@Injectable()
export class FamilyChartResolver implements Resolve<any> {

  constructor(
    private peopleService: PeopleService
  ) { }


  resolve(route: ActivatedRouteSnapshot) {
 
    let keyID = route.paramMap.get('id')

    return new Promise((resolve, reject) => {
      this.peopleService.getKeyPerson(keyID)
      .then(keyPerson => {
        return new Promise((resolve, reject) => {
          this.peopleService.getFamily(keyPerson)
          .then(family => {
            return resolve({
              family : family
            });
          })
        })
      },
      err => {
        console.log(err);
        return resolve(null);
      })
    });
  }
}
/* tslint:disable */
import {
  Event
} from '../index';

declare var Object: any;
export interface PersonInterface {
  "personID": string;
  "name"?: string;
  "surname"?: string;
  "birthYear"?: number;
  "motherID"?: string;
  "fatherID"?: string;
  "spouseID"?: string;
  "spouse2ID"?: string;
  "personalImage"?: Array<any>;
  events?: Event[];
}

export class Person implements PersonInterface {
  "personID": string;
  "name": string;
  "surname": string;
  "birthYear": number;
  "motherID": string;
  "fatherID": string;
  "spouseID": string;
  "spouse2ID": string;
  "personalImage": Array<any>;
  events: Event[];
  constructor(data?: PersonInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Person`.
   */
  public static getModelName() {
    return "Person";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Person for dynamic purposes.
  **/
  public static factory(data: PersonInterface): Person{
    return new Person(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Person',
      plural: 'People',
      path: 'People',
      idName: 'personID',
      properties: {
        "personID": {
          name: 'personID',
          type: 'string'
        },
        "name": {
          name: 'name',
          type: 'string'
        },
        "surname": {
          name: 'surname',
          type: 'string'
        },
        "birthYear": {
          name: 'birthYear',
          type: 'number'
        },
        "motherID": {
          name: 'motherID',
          type: 'string'
        },
        "fatherID": {
          name: 'fatherID',
          type: 'string'
        },
        "spouseID": {
          name: 'spouseID',
          type: 'string'
        },
        "spouse2ID": {
          name: 'spouse2ID',
          type: 'string'
        },
        "personalImage": {
          name: 'personalImage',
          type: 'Array&lt;any&gt;'
        },
      },
      relations: {
        events: {
          name: 'events',
          type: 'Event[]',
          model: 'Event',
          relationType: 'hasMany',
                  keyFrom: 'personID',
          keyTo: 'personID'
        },
      }
    }
  }
}

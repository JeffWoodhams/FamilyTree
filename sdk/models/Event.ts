/* tslint:disable */

declare var Object: any;
export interface EventInterface {
  "eventID": string;
  "personID": string;
  "date": Date;
  "dateString": string;
  "description": string;
  "occupation"?: string;
  "place"?: string;
  "location"?: string;
  "single"?: boolean;
  "images"?: Array<any>;
}

export class Event implements EventInterface {
  "eventID": string;
  "personID": string;
  "date": Date;
  "dateString": string;
  "description": string;
  "occupation": string;
  "place": string;
  "location": string;
  "single": boolean;
  "images": Array<any>;
  constructor(data?: EventInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Event`.
   */
  public static getModelName() {
    return "Event";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Event for dynamic purposes.
  **/
  public static factory(data: EventInterface): Event{
    return new Event(data);
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
      name: 'Event',
      plural: 'Events',
      path: 'Events',
      idName: 'eventID',
      properties: {
        "eventID": {
          name: 'eventID',
          type: 'string'
        },
        "personID": {
          name: 'personID',
          type: 'string'
        },
        "date": {
          name: 'date',
          type: 'Date'
        },
        "dateString": {
          name: 'dateString',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "occupation": {
          name: 'occupation',
          type: 'string'
        },
        "place": {
          name: 'place',
          type: 'string'
        },
        "location": {
          name: 'location',
          type: 'string'
        },
        "single": {
          name: 'single',
          type: 'boolean'
        },
        "images": {
          name: 'images',
          type: 'Array&lt;any&gt;'
        },
      },
      relations: {
      }
    }
  }
}

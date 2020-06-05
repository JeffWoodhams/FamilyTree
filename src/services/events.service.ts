import { Injectable } from '@angular/core';
import { EventApi, Event, LoopBackFilter } from '../../sdk';


@Injectable()
export class EventService {
  constructor(
    private eventApi: EventApi ){}

  event: Event

  deleteEvent(eventID: string){
    return this.eventApi.deleteById<Event>(eventID)
    .toPromise()
  }

  upsertEvent(data){
    return this.eventApi.upsert<Event>(data)
    .toPromise()
  }

  getEvents(searchPersonID){
    let filter: LoopBackFilter  = {
      "where":{"personID": searchPersonID}
    }
   return this.eventApi.find<Event>(filter).toPromise()
  }
  getAllEvents(){
   return this.eventApi.find<Event>().toPromise()
  }

}


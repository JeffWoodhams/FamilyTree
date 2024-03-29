/* tslint:disable */
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Person } from '../../models/Person';
import { Event } from '../../models/Event';

export interface Models { [name: string]: any }

@Injectable()
export class SDKModels {

  private models: Models = {
    User: User,
    Person: Person,
    Event: Event,
    
  };

  public get(modelName: string): any {
    return this.models[modelName];
  }

  public getAll(): Models {
    return this.models;
  }

  public getModelNames(): string[] {
    return Object.keys(this.models);
  }
}

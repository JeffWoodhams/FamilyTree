import { Component, OnInit, ViewChild } from '@angular/core';
import { Event, Person } from 'sdk';
import { ActivatedRoute, Router } from '@angular/router';
import { AddPersonComponent } from '../add-person/add-person.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EventService } from 'src/services/events.service';
import * as peopleData from '../../assets/People.json'
@Component({
  selector: 'people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})

export class PeopleListComponent implements OnInit{

  displayedColumns = ["name", "birthYear"];
  public people = new MatTableDataSource<Person>(); 

  constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, public eventService: EventService){}


  ngOnInit(): void {
    this.people.filterPredicate = (data: Person, filter: string) => {
      return data.personID.toLowerCase().startsWith(filter);
     };
    this.people.data = (peopleData as any).default;
  }

  openAddPerson() {
    let isCreate = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;  
    dialogConfig.data = {
      people: this.people.data, isCreate 
    };
    this.dialog.open(AddPersonComponent, dialogConfig);
  }

  openEditPerson(personID: string) {
    let isCreate = false;
    var personEvents: Event[];
    const promise = this.eventService.getEvents(personID);
    promise.then((events) =>{
         const dialogConfig = new MatDialogConfig();
         dialogConfig.disableClose = true;
         dialogConfig.autoFocus = true;  
         dialogConfig.data = {
           people: this.people.data, isCreate, personID, events
         };
         this.dialog.open(AddPersonComponent, dialogConfig);
      }, (error)=>{
        console.log("Promise rejected with " + JSON.stringify(error));
    })
  }
  openFamilyChart(personID: string) {
    this.router.navigate(['family-chart/',personID]);
  }
  public doFilter = (value: string) => {
    this.people.filter = value.toLowerCase();
  }

}




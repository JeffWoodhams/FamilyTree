import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog} from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PeopleService } from '../../services/people.service';
import { EventService } from '../../services/events.service';
import { Event, Person } from 'sdk';
import { AddEventComponent } from '../add-event/add-event.component';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {
//#region Variables
  form: FormGroup;
  name:string;
  surname:string;
  father:string;
  mother:string;
  spouse:string;
  spouse2:string;
  personID:string;
  birthYear:number;
  personalImage: string;
  people: Person[];
  events: Event[];
  placeList: string[] = [];
  personEvent: Event;
  isCreate: boolean;
  title: string;
  imageModals: string[] = ["BroadGreen1913Map","Broadoak1899Map","Chapel&ChurchMayfield","ChapelMayfield","Croydon1913Map","WestThorntonHeath1935Map","CroydonDistrict1960Map","EastCroydon1935Map","Edenholme","FiveAshes1899Map","FreemansFarmMap","Heathfield1929Map","Heathfield1960Map","JarvisBrook1879Map","Leigh1960Map","MaresfieldFiveAshDownMap","Mayfield1910Map","OldHeathfield1899Map","PunnetsTown1899Map","SouthCroydon1895Map","ThorntonHeath1936Map","UckfieldSouth1911Map","Waddon1947Map","WestSussexNorth1960Map","Lewes1960Map","LewesEast1960Map"]

//#endregion
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddPersonComponent>,
     @Inject(MAT_DIALOG_DATA) data, public peopleService: PeopleService, public eventService: EventService, private dialog: MatDialog) 
  {
    let currentPerson: Person = data.people.find(person => person.personID == data.personID);
    if (!data.isCreate) {
      this.name = currentPerson.name;
      this.surname = currentPerson.surname;
      this.birthYear = currentPerson.birthYear;
      this.father = currentPerson.fatherID;
      this.mother= currentPerson.motherID;
      this.spouse = currentPerson.spouseID;
      this.spouse2 = currentPerson.spouse2ID;
      this.personID = currentPerson.personID;
      this.events = data.events;
      if (currentPerson.personalImage) this.personalImage = currentPerson.personalImage[0].image;
    }
    else {
      this.father = "";
      this.mother =  "";
    }
    this.people = data.people;
    this.isCreate = data.isCreate;
    this.imageModals.sort();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name:this.name,
      surname:this.surname,
      father:this.father,
      mother:this.mother,
      spouse:this.spouse,
      spouse2:this.spouse2,
      birthYear:this.birthYear,
      personEvent:this.personEvent,
      personalImage:this.personalImage
    });
    if (this.isCreate){
      this.title = "Add a Person";
      document.getElementById("deleteButton").hidden = true;  
    }
    else {
      this.title = "Edit " + this.name + " " + this.surname;
      document.getElementById("deleteButton").hidden = false;  
    }
    const promise = this.eventService.getAllEvents();
    promise.then(events => {
      events.forEach(event => {
        if (event.place && event.place != null && !this.placeList.includes(event.place)) {
          this.placeList.push(event.place)
        }
        this.placeList.sort();
      });
    });
  }

  submit() {
    let data : any = {};
    let values = this.form.value;
    data.name = values.name;
    data.surname = values.surname;
    data.fatherID= values.father;
    data.motherID= values.mother;
    data.spouseID= values.spouse;
    data.spouse2ID= values.spouse2;
    data.birthYear= values.birthYear;
    data.personID = data.name.replace(/\s/g, "") + data.surname;
    if (data.birthYear){
      data.personID += data.birthYear;
    }
    if (values.personalImage != null && values.personalImage != "") {
      let type = "Photo";
      let image = values.personalImage;
      data.personalImage = [{type, image}]
    }
    let promise = this.peopleService.upsertPerson(data);
    promise.then(() =>{
      this.dialogRef.close(this.form.value);
   }, (error)=>{
     console.log("Promise rejected with " + JSON.stringify(error));
    })
  }

  openCreateEvent() {
    let isCreate = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;  
    dialogConfig.data = {
      people: this.people, personID:this.personID, isCreate, imageModals:this.imageModals, placeList:this.placeList
    };
    this.dialog.open(AddEventComponent, dialogConfig);
  }
  openEditEvent() {
    let isCreate = false;
    var currentEvent = this.events.find(event => event.eventID == this.form.value.personEvent);
    if (currentEvent) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;  
    dialogConfig.data = {
      people: this.people, personID:this.personID, currentEvent, isCreate, imageModals:this.imageModals, placeList:this.placeList
    };
    this.dialog.open(AddEventComponent, dialogConfig);
  }
  }
  
  delete() {
    this.events.filter(event => event.personID == this.personID).forEach(event => {
      this.eventService.deleteEvent(event.eventID);
    });
    const promise = this.peopleService.deletePerson(this.personID);
    promise.then(() =>{
      this.dialogRef.close(this.form.value);
   }, (error)=>{
     console.log("Promise rejected with " + JSON.stringify(error));
    })
  }

  close() {
      this.dialogRef.close();
  }
}
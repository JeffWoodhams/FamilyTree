import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { EventService } from '../../services/events.service';
import { Event, Person} from 'sdk';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
//#region Variables
  form: FormGroup;
  personID: string;
  single: boolean;
  eventID: string;
  date: Date;
  dateString: string;
  occupation: string;
  location:string;
  place = new FormControl();
  placeList: string[] = [];
  filteredPlaces: Observable<string[]>;
  images:any[];
  people: Person[];
  isCreate: boolean;
  types: string[] = ["Census","Birth","Christening","Marriage","Death","Funeral","Marriage2","Marriage3", ""];
  imageTypes: string[] = ["Census","Birth","Death","Map","Marriage", "Photo","Document","Newspaper","Comment","Memory",""];
  filteredModals1: Observable<string[]>;
  filteredModals2: Observable<string[]>;
  filteredModals3: Observable<string[]>;
  filteredModals4: Observable<string[]>;
  type: string;
  customType: string;
  imageModals: string[] = [];
  imageType1: string;
  image1 = new FormControl();
  imageType2: string;
  image2 = new FormControl();
  imageType3: string;
  image3 = new FormControl();
  imageType4: string;
  image4 = new FormControl();
  title: string;
  suffix: number;
//#endregion

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddEventComponent>,  @Inject(MAT_DIALOG_DATA) data,
                   public eventService: EventService, public datepipe: DatePipe, private dateAdapter: DateAdapter<Date>) 
  {
    this.dateAdapter.setLocale('en-GB'); 
    this.personID = data.personID;
    this.people = data.people;
    this.placeList = data.placeList;
    this.imageModals = data.imageModals;
    this.isCreate = data.isCreate;
    if (!this.isCreate) {
      this.eventID = data.currentEvent.eventID;
      this.type = data.currentEvent.description;
      this.date = data.currentEvent.date;
      this.single = data.currentEvent.single;
      this.dateString = data.currentEvent.dateString;
      this.occupation = data.currentEvent.occupation;
      this.location = data.currentEvent.location;
      this.place.setValue(data.currentEvent.place);
      if (this.types.includes(data.currentEvent.description)) {
        this.type = data.currentEvent.description;
      }
      else {
        this.customType = data.currentEvent.description;
      }
      if (data.currentEvent.images) {
        if (data.currentEvent.images.length >= 1) {
          this.imageType1 = data.currentEvent.images[0].type;
          this.image1.setValue(data.currentEvent.images[0].image);
        }
        if (data.currentEvent.images.length >= 2) {
          this.imageType2 = data.currentEvent.images[1].type;
          this.image2.setValue(data.currentEvent.images[1].image);
        }
        if (data.currentEvent.images.length >= 3) {
          this.imageType3 = data.currentEvent.images[2].type;
          this.image3.setValue(data.currentEvent.images[2].image);
        }
        if (data.currentEvent.images.length >= 4) {
          this.imageType4 = data.currentEvent.images[3].type;
          this.image4.setValue(data.currentEvent.images[3].image);
        }
      }
    }
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      type:this.type,
      customType:this.customType,
      date:this.date,
      suffix:this.suffix,
      single:this.single,
      dateString:this.dateString,
      occupation:this.occupation,
      location:this.location,
      place:this.place,
      image1:this.image1,
      image2:this.image2,
      image3:this.image3,
      image4:this.image4,
      imageType1:this.imageType1,
      imageType2:this.imageType2,
      imageType3:this.imageType3,
      imageType4:this.imageType4
    });

    if (this.isCreate){
      this.single = false;
      this.title = "Add an Event";
    }
    else {
      this.title = "Edit " + this.type + " Event";
    }
    
    this.filteredModals1 = this.image1.valueChanges
    .pipe(
      startWith(''),
      map(value => this._imageFilter(value))
    );
    this.filteredModals2 = this.image2.valueChanges
    .pipe(
      startWith(''),
      map(value => this._imageFilter(value))
    );
    this.filteredModals3 = this.image3.valueChanges
    .pipe(
      startWith(''),
      map(value => this._imageFilter(value))
    );
    this.filteredModals4 = this.image4.valueChanges
    .pipe(
      startWith(''),
      map(value => this._imageFilter(value))
    );
    this.filteredPlaces = this.place.valueChanges
    .pipe(
      startWith(''),
      map(value => this._placeFilter(value))
    );
  }
  private _imageFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.imageModals.filter(modal => modal.toLowerCase().includes(filterValue));
  }
  private _placeFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.placeList.filter(site => site.toLowerCase().includes(filterValue));
  }
  submit() {
    var data : Event = new Event();
    var values = this.form.value;
    if (values.customType != null && values.customType != "") {
      data.description = values.customType;
    }
    else {
      data.description = values.type;
    }
    data.personID = this.personID;
    if (values.type == "Death" || values.type == "Funeral") {
      data.single = true;
    }
    else {
      data.single = values.single;
    }
    data.date = new Date(values.date);
    if (this.isCreate) {
      if (data.description == "Marriage2") {
        data.eventID = this.personID + "M2";
      }
      else if (data.description == "Marriage3") {
        data.eventID = this.personID + "M3";
      }
      else if (this.types.includes(data.description) && data.description != "Census") {
          data.eventID = this.personID + data.description.substring(0,1);
      }
      else {
        data.eventID = this.personID + data.date.getFullYear();
      }
    }
    else data.eventID = this.eventID;
    if (values.suffix !=null) data.eventID += values.suffix;
    if (values.dateString == null || values.dateString == "") data.dateString = this.datepipe.transform(data.date, 'dd MMM yyyy');
    else data.dateString = values.dateString;
    if (values.occupation != null) data.occupation = values.occupation;
    else data.occupation = "";
    if (values.location != null) data.location = values.location;
    else data.location = "";
    data.place = values.place;
    if (values.image1 != null && values.image1 != "") {
      let type = values.imageType1;
      let image = values.image1;
      data.images = [{type, image}]
    }
    if (values.image2 != null && values.image2 != "") {
      let type = values.imageType2;
      let image = values.image2;
      data.images.push({type, image});
    }
    if (values.image3 != null && values.image3 != "") {
      let type = values.imageType3;
      let image = values.image3;
      data.images.push({type, image});
    }
    if (values.image4 != null && values.image4 != "") {
      let type = values.imageType4;
      let image = values.image4;
      data.images.push({type, image});
    }
    const promise = this.eventService.upsertEvent(data);
    promise.then(() =>{
      this.dialogRef.close(this.form.value);
   }, (error)=>{
     console.log("Promise rejected with " + JSON.stringify(error));
    })
  }

  delete() {
    this.eventService.deleteEvent(this.eventID)
    this.dialogRef.close(this.form.value);
  }

close() {
    this.dialogRef.close();
}
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { EventApi, PersonApi, SDKModels, LoopBackAuth, InternalStorage } from 'sdk';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SocketConnection } from 'sdk/sockets/socket.connections';
import { SocketDriver } from 'sdk/sockets/socket.driver';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FamilyChartComponent } from './family-chart/family-chart.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ModalModule } from './_modal';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE} from '@angular/material/core';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { FamilyCircleComponent } from './family-circle/family-circle.component';

@NgModule({
  declarations: [
    AppComponent,
    PeopleListComponent,
    FamilyChartComponent,
    FamilyCircleComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatDialogModule,
    MatTableModule,
    ModalModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatAutocompleteModule
  ],
  providers: [
    EventApi,
    PersonApi,
    HttpClient,
    SocketConnection,
    SocketDriver,
    SDKModels,
    LoopBackAuth,
    InternalStorage,
    ErrorHandler,
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

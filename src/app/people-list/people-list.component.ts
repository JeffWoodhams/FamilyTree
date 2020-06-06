import { Component, OnInit} from '@angular/core';
import { Person } from 'sdk';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import * as peopleData from '../../assets/People.json'

@Component({
  selector: 'people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})

export class PeopleListComponent implements OnInit{

  displayedColumns = ["name", "birthYear"];
  public people = new MatTableDataSource<Person>(); 

  constructor(private router: Router){}


  ngOnInit(): void {
    this.people = (peopleData as any).default;
    this.people.filterPredicate = (data: Person, filter: string) => data.name.toLowerCase().startsWith(filter);
  }

  openFamilyChart(personID: string) {
    this.router.navigate(['family-chart/',personID]);
  }

  public doFilter = (value: string) => {
    this.people.filter = value.toLowerCase();
  }

}




import { Component, OnInit, ViewChild } from '@angular/core';
import { Person } from 'sdk';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private router: Router){}


  ngOnInit(): void {
    this.people.filterPredicate = (data: Person, filter: string) => {
      return data.personID.toLowerCase().startsWith(filter);
     };
    this.people.data = (peopleData as any).default;
  }

  openFamilyChart(personID: string) {
    this.router.navigate(['family-chart/',personID]);
  }
  public doFilter = (value: string) => {
    this.people.filter = value.toLowerCase();
  }

}




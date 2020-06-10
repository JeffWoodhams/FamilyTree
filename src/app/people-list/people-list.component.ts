import { Component, OnInit} from '@angular/core';
import { Person } from 'sdk';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import * as peopleData from '../../assets/KeyPeople.json'
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
    this.route.paramMap.subscribe(route => {
      if (route.get('personID') != null) {
        this.router.navigate(['family-chart/',route.get('personID')]);
      }
    });
    this.people.data = (peopleData as any).default;
  }

  openFamilyChart(personID: string) {
    this.router.navigate(['family-chart/',personID]);
  }
  openFamilyCircle(personID: string) {
    this.router.navigate(['family-circle/',personID]);
  }
}




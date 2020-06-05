import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleListComponent } from './people-list/people-list.component';
import { FamilyChartComponent } from './family-chart/family-chart.component';



const routes: Routes = [
  {
    path: '',
    component: PeopleListComponent
  },
  {
    path: 'people-list/:personID',
    component: PeopleListComponent
  },
  {
    path: 'family-chart/:personID',
    component: FamilyChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleListComponent } from './people-list/people-list.component';
import { FamilyChartComponent } from './family-chart/family-chart.component';
import { FamilyCircleComponent } from './family-circle/family-circle.component';



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
  },
  {
    path: 'family-circle/:personID',
    component: FamilyCircleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FamilyChartComponent } from './family-chart/family-chart.component';
import { FamilyCircleComponent } from './family-circle/family-circle.component';



const routes: Routes = [
  {
    path: '',
    component: FamilyCircleComponent
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

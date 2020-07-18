import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleListResolver } from './people-list/people-list.resolver';
import { FamilyChartResolver } from './family-chart/family-chart.resolver';
import { FamilyChartComponent } from './family-chart/family-chart.component';
import { FamilyCircleComponent } from './family-circle/family-circle.component';

const routes: Routes = [
  {
    path: '',
    component: FamilyCircleComponent
/*     component: PeopleListComponent,
    resolve: {
      data: PeopleListResolver
    } */
  },
  {
    path: 'people-list/:personID',
    component: PeopleListComponent,
    resolve: {
      data: PeopleListResolver
    }
  },
  {
    path: 'family-chart/:personID',
    component: FamilyChartComponent,
    resolve: {
      data: FamilyChartResolver
    },
    runGuardsAndResolvers: "paramsChange"
  },
  {
    path: 'family-circle/:personID',
    component: FamilyCircleComponent,
/*     resolve: {
      data: FamilyChartResolver
    }, 
    runGuardsAndResolvers: "paramsChange"*/
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

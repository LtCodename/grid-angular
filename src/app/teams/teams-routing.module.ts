import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamsPageComponent } from './teams-page/teams-page.component';

const routes: Routes = [
  {
      path: '',
      component: TeamsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }

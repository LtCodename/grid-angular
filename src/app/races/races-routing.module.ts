import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacePageComponent } from './race-page/race-page.component';

const routes: Routes = [
  { path: ':race', component: RacePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RacesRoutingModule { }
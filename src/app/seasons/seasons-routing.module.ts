import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeasonsPageComponent } from './seasons-page/seasons-page.component';

const routes: Routes = [
  {
      path: '',
      component: SeasonsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeasonsRoutingModule { }

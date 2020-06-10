import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriversPageComponent } from './drivers-page/drivers-page.component';
import { DriverPageComponent } from './driver-page/driver-page.component';

const routes: Routes = [
  {
    path: '',
    component: DriversPageComponent,
  },
  { path: ':driver', component: DriverPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversRoutingModule { }

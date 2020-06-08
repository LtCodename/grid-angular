import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversPageComponent } from './drivers-page/drivers-page.component';
import { DriversRoutingModule } from './drivers-routing.module';



@NgModule({
  declarations: [DriversPageComponent],
  imports: [
    CommonModule,
    DriversRoutingModule
  ]
})
export class DriversModule { }

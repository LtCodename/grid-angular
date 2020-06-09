import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversPageComponent } from './drivers-page/drivers-page.component';
import { DriversRoutingModule } from './drivers-routing.module';
import { HttpClientModule } from "@angular/common/http";



@NgModule({
  declarations: [DriversPageComponent],
  imports: [
    CommonModule,
    DriversRoutingModule,
    HttpClientModule
  ]
})
export class DriversModule { }

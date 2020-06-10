import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversPageComponent } from './drivers-page/drivers-page.component';
import { DriversRoutingModule } from './drivers-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { DriverModule } from '../components/driver/driver.component';
import { DriverPageComponent } from './driver-page/driver-page.component';



@NgModule({
  declarations: [DriversPageComponent, DriverPageComponent],
  imports: [
    CommonModule,
    DriversRoutingModule,
    HttpClientModule,
    DriverModule
  ]
})
export class DriversModule { }

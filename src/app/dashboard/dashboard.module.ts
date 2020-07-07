import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DriverEditFormComponent } from './driver-edit-form/driver-edit-form.component';
import { TeamEditFormComponent } from './team-edit-form/team-edit-form.component';



@NgModule({
  declarations: [DashboardPageComponent, DriverEditFormComponent, TeamEditFormComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule
  ]
})
export class DashboardModule { }

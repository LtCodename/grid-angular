import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDriver } from '../drivers-model';
import { DriversService } from '../drivers.service';

@Component({
  selector: 'app-driver-page',
  templateUrl: './driver-page.component.html',
  styleUrls: ['./driver-page.component.scss']
})
export class DriverPageComponent implements OnInit {

  driverId: string = "";
  driver: IDriver;
  allDrivers: IDriver[] = [];
  showData: boolean = false;
  tabName: string = "ach";
  driverAge: number = 0;

  constructor(private route: ActivatedRoute, private driversService: DriversService) {

    this.getQueryParam();
    
    this.driversService.getDriversData().subscribe(data => {
      this.allDrivers = data;
      this.driver = this.allDrivers.find((dr: IDriver) => dr.id === this.driverId);
      if(this.driver){
        const dob: number = parseInt(this.driver["date-of-birth"]);
        const currentYear: number = new Date().getFullYear();
        this.driverAge = currentYear - dob;

        this.showData = true;
        console.log(this.driver);
      }
    });
  }

  getQueryParam(): void {
    this.route.paramMap.subscribe(params => {
      this.driverId = params.get("driver");
    });
  }

  toggleTab(): void {
    if (this.tabName === "ach") {
      this.tabName = "sum";
    } else {
      this.tabName = "ach";
    }
  }

  ngOnInit(): void {
    this.getQueryParam();
  }
}

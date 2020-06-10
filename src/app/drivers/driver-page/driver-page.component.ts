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

  constructor(private route: ActivatedRoute, private driversService: DriversService) {

    this.getQueryParam();
    
    this.driversService.drivers$.subscribe(data => {
      this.allDrivers = data;
      this.driver = this.allDrivers.find((dr: IDriver) => dr.id === this.driverId);
      if(this.driver){
        this.showData = true;
      }
    });
  }

  getQueryParam(): void {
    this.route.paramMap.subscribe(params => {
      this.driverId = params.get("driver");
    });
  }

  ngOnInit(): void {
    this.getQueryParam();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDriver } from '../drivers-model';
import { DriversService } from '../drivers.service';
import { ArrowDown, ArrowRight, Profile, Trophie } from 'src/iconsService';
import { DomSanitizer } from '@angular/platform-browser';

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
  url: string = "";
  champs = [];

  readonly arrowIconDown = this.sanitized.bypassSecurityTrustHtml(ArrowDown);
  readonly arrowIconRight = this.sanitized.bypassSecurityTrustHtml(ArrowRight);
  readonly profileIcon = this.sanitized.bypassSecurityTrustHtml(Profile);
  readonly trophieIcon = this.sanitized.bypassSecurityTrustHtml(Trophie);

  constructor(private route: ActivatedRoute, private driversService: DriversService, private sanitized: DomSanitizer) {

    this.getQueryParam();
    
    this.driversService.getDriversData().subscribe(data => {
      this.allDrivers = data;
      this.driver = this.allDrivers.find((dr: IDriver) => dr.id === this.driverId);
      if(this.driver) {
        const dob: number = parseInt(this.driver["date-of-birth"]);
        const currentYear: number = new Date().getFullYear();
        this.driverAge = currentYear - dob;
        this.url = `/teams/${this.driver["team-id"]}`;
        
        for (let i = parseInt(this.driver.championships); i > 0; i--) {
          this.champs.push(i);
        }

        this.showData = true;
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

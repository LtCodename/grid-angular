import { Component, OnInit } from '@angular/core';
import { DriversService } from '../drivers.service';
import { IDriver } from '../model';

@Component({
  selector: 'app-drivers-page',
  templateUrl: './drivers-page.component.html',
  styleUrls: ['./drivers-page.component.scss']
})
export class DriversPageComponent implements OnInit {

  drivers: IDriver[] = [];

  constructor(private driversService: DriversService) {
    this.driversService.drivers$.subscribe((data: IDriver[]) => {
      this.drivers = data;
      console.log(data);
    })
   }

  ngOnInit(): void {
  }

}

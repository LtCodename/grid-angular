import { Component, OnInit } from '@angular/core';
import { DriversService } from '../drivers.service';
import { IDriver } from '../drivers-model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-drivers-page',
  templateUrl: './drivers-page.component.html',
  styleUrls: ['./drivers-page.component.scss']
})
export class DriversPageComponent implements OnInit {

  drivers: IDriver[] = [];
  showPreloader: boolean = true;

  private notifier = new Subject();

  constructor(private driversService: DriversService) {
    this.driversService.getDriversData().pipe(takeUntil(this.notifier)).subscribe((driversData: IDriver[]) => {
      this.drivers = driversData;

      //Sort drivers by name
      this.drivers.sort((a: IDriver, b: IDriver) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })

      if(this.drivers.length) {
        this.showPreloader = false;
      }
    }, () => {
      this.showPreloader = false;
    });
  }

  ngOnInit(): void {
  }

}

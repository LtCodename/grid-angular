import { Component, OnInit, Input } from '@angular/core';
import { ISeason } from 'src/app/seasons/seasons-model';
import { DriversService } from 'src/app/drivers/drivers.service';
import { IDriver } from 'src/app/drivers/drivers-model';
import { SeasonsService } from 'src/app/seasons/seasons.service';

interface IDriverToDisplay {
  id: string;
  name: string;
}

@Component({
  selector: 'app-season-edit-form',
  templateUrl: './season-edit-form.component.html',
  styleUrls: ['./season-edit-form.component.scss']
})
export class SeasonEditFormComponent implements OnInit {

  @Input() seasonData: ISeason;

  seasonName: string = "";
  driverToAdd: string = "";
  seasonCurrent: boolean = false;
  seasonDrivers: string[] = [];
  allDrivers: IDriver[] = [];
  driversToDisplay: IDriverToDisplay[] = [];
  driversToSelect: IDriver[] = [];

  constructor(private driversService: DriversService, private seasonService: SeasonsService) { 
    this.driversService.drivers$.subscribe(data => {
      this.allDrivers = data;
    });
  }

  ngOnInit(): void {
    if (this.seasonData) {
      this.updateData();
    }
  }

  ngOnChanges(): void {
    this.updateData();
  }

  updateData(): void {
    this.seasonName = this.seasonData.name;
    this.seasonCurrent = this.seasonData.current;
    this.seasonDrivers = this.seasonData.drivers;

    this.driversToDisplay = [];
    if(this.allDrivers) {
      this.seasonDrivers.forEach((driverId: string) => {
        this.driversToDisplay.push({
          id: driverId,
          name: this.allDrivers.find((driver: IDriver) => driver.id === driverId).name
        });
      });

      this.recalculateDriversToAdd();
    }
  }

  submitData(): void {
    this.seasonService.edit({
      id: this.seasonData.id,
      name: this.seasonName,
      current: this.seasonCurrent,
      drivers: this.seasonDrivers || []
    }).then(() => {
      console.log("Data updated succesfully!");
    }).catch(() => {
      console.log("Error!");
    });
  }

  deleteDriver(index: number):void {
    let fakeDrivers: IDriverToDisplay[] = [...this.driversToDisplay];
    fakeDrivers.splice(index, 1);
    this.driversToDisplay = fakeDrivers;
    this.recalculateDriversToAdd();
  }

  addDriver():void {
    if (this.driverToAdd === "") return;

    this.driversToDisplay.push({
      id: this.driverToAdd,
      name: this.allDrivers.find((driver: IDriver) => driver.id === this.driverToAdd).name
    });

    this.recalculateDriversToAdd();
  }

  recalculateDriversToAdd():void {
   this.driversToSelect = [];

   this.allDrivers.forEach((driver: IDriver) => {
     let found = this.driversToDisplay.find(dr => dr.id === driver.id);
     if  (!found) {
       this.driversToSelect.push(driver);
     }
   });

   this.driverToAdd = this.driversToSelect.length ? this.driversToSelect[0].id : "" || "";


   this.seasonDrivers = [];
   this.driversToDisplay.forEach((displayDriver: IDriverToDisplay) => {
     this.seasonDrivers.push(displayDriver.id);
   })
  }
}

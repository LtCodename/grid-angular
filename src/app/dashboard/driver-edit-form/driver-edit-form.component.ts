import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IDriver } from 'src/app/drivers/drivers-model';
import { DriversService } from 'src/app/drivers/drivers.service';

@Component({
  selector: 'app-driver-edit-form',
  templateUrl: './driver-edit-form.component.html',
  styleUrls: ['./driver-edit-form.component.scss']
})
export class DriverEditFormComponent implements OnInit, OnChanges {

  @Input() driverData: IDriver;

  driverName: string = "";
  driverNumber: string = "";
  driverDob: string = "";
  driverNationality: string = "";
  driverPoles: string = "";
  driverPodiums: string = "";
  driverWins: string = "";
  driverChamps: string = "";

  constructor(private driversService: DriversService) {
  }

  ngOnInit(): void {
    if (this.driverData) {
      this.updateData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateData();
  }

  updateData(): void {
    this.driverName = this.driverData.name;
    this.driverNumber = this.driverData.number;
    this.driverDob = this.driverData["date-of-birth"];
    this.driverNationality = this.driverData.nationality;
    this.driverPoles = this.driverData.poles;
    this.driverPodiums = this.driverData.podiums;
    this.driverWins = this.driverData.wins;
    this.driverChamps = this.driverData.championships;
  }

  submitData(): void {
    this.driversService.edit({
      id: this.driverData.id,
      name: this.driverName,
      number: this.driverNumber,
      "date-of-birth": this.driverDob,
      nationality: this.driverNationality,
      poles: this.driverPoles,
      podiums: this.driverPodiums,
      wins: this.driverWins,
      championships: this.driverChamps
    }).then(() => {
      console.log("Data updated succesfully!");
    }).catch(() => {
      console.log("Error!");
    });
  }
}

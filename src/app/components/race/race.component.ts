import { Component, OnInit, NgModule, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DriversService } from 'src/app/drivers/drivers.service';
import { IDriver } from 'src/app/drivers/drivers-model';
import { IPlace } from 'src/app/races/race-model';
import { OngoingEvent } from 'src/iconsService';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {
  podiumPlaces = [];
  allDrivers: IDriver[] = [];
  
  @Input() name: string;
  @Input() date: string;
  @Input() mode: string;
  @Input() ongoing: boolean;
  @Input() places: IPlace[];
  @Input() url: string = "";

  readonly ongoingIcon = this.sanitized.bypassSecurityTrustHtml(OngoingEvent);

  constructor(private driversService: DriversService, private sanitized: DomSanitizer) { }

  getDrivers(): void {
    this.driversService.getDriversData().subscribe(data => {
      this.allDrivers = data;

      if (this.allDrivers) {
        for (let i = 1; i <= 3; i++) {
          const driver: IDriver = this.allDrivers.find((dr: IDriver) => dr.id === this.places[i].driver);
          this.podiumPlaces.push(this.shortenName(driver.name));
        }
      }
    })
  }

  shortenName(longName: string): string {
    let shortName: string = "";
    const nameArray = longName.split(" ");
    const lastName: string = nameArray[1];
    if (lastName) {
      shortName = lastName.slice(0, 3).toLocaleUpperCase();
    }

    return shortName;
  }

  ngOnInit(): void {
    if(this.places && this.mode === "past") {
      this.getDrivers();
    }
  }
}

@NgModule({
  declarations: [RaceComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [RaceComponent]
})
export class RaceModule { }

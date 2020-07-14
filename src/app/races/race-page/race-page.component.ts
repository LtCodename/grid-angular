import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RacesService } from '../races.service';
import { IRace, IRaceResult } from '../race-model';
import { DomSanitizer } from '@angular/platform-browser';
import { ChequeredFlag } from 'src/iconsService';
import { DriversService } from 'src/app/drivers/drivers.service';
import { mergeMap, map } from 'rxjs/operators';
import { IDriver } from 'src/app/drivers/drivers-model';
import { ITeam } from 'src/app/teams/teams-model';
import { TeamsService } from 'src/app/teams/teams.service';
import { PositionsBlueprint } from 'src/app/app-model';

@Component({
  selector: 'app-race-page',
  templateUrl: './race-page.component.html',
  styleUrls: ['./race-page.component.scss']
})
export class RacePageComponent implements OnInit {

  raceId: string = "";
  allRaces: IRace[];
  allDrivers: IDriver[];
  allTeams: ITeam[];
  poleSitter: string = "";
  fastestDriver: string = "";
  race: IRace;
  raceResults: IRaceResult[] = [];
  showData: boolean = false;

  readonly flagIcon = this.sanitized.bypassSecurityTrustHtml(ChequeredFlag);

  constructor(
    private route: ActivatedRoute, 
    private racesService: RacesService, 
    private driversService: DriversService, 
    private teamsService: TeamsService, 
    private sanitized: DomSanitizer) { 
      this.getQueryParam();

      this.racesService.races$.pipe(
        mergeMap((allRaces: IRace[]) => this.driversService.drivers$.pipe(map((allDrivers: IDriver[]): [IRace[], IDriver[]] => [allRaces, allDrivers]))),
        mergeMap(([allRaces, allDrivers]) => this.teamsService.teams$.pipe(map((allTeams: ITeam[]): [IRace[], IDriver[], ITeam[]] => [allRaces, allDrivers, allTeams])))
      ).subscribe(([allRaces, allDrivers, allTeams]) => {
      this.allRaces = allRaces;
      this.allDrivers = allDrivers;
      this.allTeams = allTeams
      this.race = this.allRaces.find((rc: IRace) => rc.id === this.raceId);

      if(this.race && this.allDrivers.length && this.allRaces.length) {
        this.race.pole ? this.poleSitter = this.shortenName(this.allDrivers.find((dr: IDriver) => dr.id === this.race.pole).name) : this.poleSitter = "No Data";
        this.race.lap ? this.fastestDriver = this.shortenName(this.allDrivers.find((dr: IDriver) => dr.id === this.race.lap).name) : this.fastestDriver = "No Data";
        this.raceResults = this.race.places ? this.calculateResults() : [];
        this.showData = true;
      }
    }, () => {
      
    });
  }

  shortenName(name: string): string {
    const nameArray = name.split(" ");
    const lastName: string = nameArray[1];
    if (lastName) {
      return lastName.slice(0, 3).toLocaleUpperCase();
    }
    return "";
  }

  calculateResults(): IRaceResult[] {
    let results: IRaceResult[] = [];

    if(this.race.finished) {
      PositionsBlueprint.forEach(elem => {
        results.push({
          driver: this.allDrivers.find((driver: IDriver) => driver.id === this.race.places[elem.place].driver).name,
          team: this.allTeams.find((team: ITeam) => team.id === this.race.places[elem.place].team).name,
          points: elem.points,
          place: elem.place
        });
      });

      if(this.race.lap){
        const lapDriver: IDriver = this.allDrivers.find((driver: IDriver) => driver.id === this.race.lap);
        results.forEach(elem => {
          if(elem.driver === lapDriver.name) {
            elem.points += 1;
          }
        })
      }
    }

    return results;
  }

  getQueryParam(): void {
    this.route.paramMap.subscribe(params => {
      this.raceId = params.get("race");
    });
  }

  ngOnInit(): void {
    this.getQueryParam();
  }

}

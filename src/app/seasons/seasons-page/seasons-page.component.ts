import { Component, OnInit } from '@angular/core';
import { SeasonsService } from '../seasons.service';
import { ISeason } from '../seasons-model';
import { IRace } from 'src/app/races/race-model';
import { RacesService } from 'src/app/races/races.service';
import { PointsSystem } from 'src/app/app-model';
import { mergeMap, map } from 'rxjs/operators';
import { DriversService } from 'src/app/drivers/drivers.service';
import { IDriver } from 'src/app/drivers/drivers-model';
import { TeamsService } from 'src/app/teams/teams.service';
import { ITeam } from 'src/app/teams/teams-model';

@Component({
  selector: 'app-seasons-page',
  templateUrl: './seasons-page.component.html',
  styleUrls: ['./seasons-page.component.scss']
})
export class SeasonsPageComponent implements OnInit {

  allSeasons: ISeason[] = [];
  allRaces: IRace[] = [];
  seasonRaces: IRace[] = [];
  upcomingRaces: IRace[] = [];
  pastRaces: IRace[] = [];
  currentSeason: ISeason;
  driversStandings = [];
  teamsStandings = [];
  showData: boolean = false;
  eventsTabName: string = "upcoming";
  standingsTabName: string = "drivers";

  constructor(
    private seasonsService: SeasonsService,
    private racesService: RacesService,
    private driversService: DriversService,
    private teamsService: TeamsService
  ) {
    this.seasonsService.seasons$.pipe(
      mergeMap((allSeasons: ISeason[]) => this.racesService.races$.pipe(map((allRaces: IRace[]): [ISeason[], IRace[]] => [allSeasons, allRaces]))),
      mergeMap(([allSeasons, allRaces]) => this.driversService.drivers$.pipe(map((allDrivers: IDriver[]): [ISeason[], IRace[], IDriver[]] => [allSeasons, allRaces, allDrivers]))),
      mergeMap(([allSeasons, allRaces, allDrivers]) => this.teamsService.teams$.pipe(map((allTeams: ITeam[]): [ISeason[], IRace[], IDriver[], ITeam[]] => [allSeasons, allRaces, allDrivers, allTeams])))
    ).subscribe(([allSeasons, allRaces, allDrivers, allTeams]) => {
      if (allSeasons.length && allRaces.length && allDrivers.length) {
        this.allSeasons = allSeasons;
        this.currentSeason = this.setCurrentSeason(this.allSeasons);

        this.allRaces = allRaces;
        //Determine this season races
        this.seasonRaces = this.setSeasonRaces(this.allRaces);

        //Determine upcoming races
        this.upcomingRaces = this.setUpcomingRaces(this.seasonRaces);

        //Determine past races
        this.pastRaces = this.setPastRaces(this.seasonRaces);

        // Caclulate drivers standings
        this.driversStandings = this.calculateDriversStandings(this.pastRaces, allDrivers);

        // Caclulate teams standings
        this.teamsStandings = this.calculateTeamsStandings(this.pastRaces, allTeams);
        console.log(this.teamsStandings);
      }

      this.showData = true;
    }, () => {
      this.showData = true;
    });
  };

  setCurrentSeason(seasonsData: ISeason[]): ISeason {
    return seasonsData.find((season: ISeason) => season.current);
  }

  setSeasonRaces(racesData: IRace[]): IRace[] {
    return racesData.filter((race: IRace) => race["season-id"] === this.currentSeason.id);
  }

  setUpcomingRaces(racesData: IRace[]): IRace[] {
    return racesData.filter((race: IRace) => !race.finished).sort((a: IRace, b: IRace) => {
      if (a.round < b.round) {
        return -1;
      }
      if (a.round > b.round) {
        return 1;
      }
      return 0;
    });
  }

  setPastRaces(racesData: IRace[]): IRace[] {
    return racesData.filter((race: IRace) => race.finished).sort((a: IRace, b: IRace) => {
      if (a.round < b.round) {
        return -1;
      }
      if (a.round > b.round) {
        return 1;
      }
      return 0;
    });
  }

  calculateDriversStandings(racesData: IRace[], drivers: IDriver[]) {
    let standingsHash = {};
    let standings = [];

    racesData.forEach((race: IRace) => {
      if (race.places) {
        for (let place in race.places) {
          let driver: IDriver = drivers.find((dr: IDriver) => dr.id === race.places[place].driver);

          if (standingsHash[race.places[place].driver]) {
            standingsHash[driver.name] += PointsSystem[place];
          } else {
            standingsHash[driver.name] = PointsSystem[place];
          }
        }
      }

      if (race.lap) {
        standingsHash[race.lap] ++;
      }
    });

    //Convert drivers standings hash table into an array
    Object.keys(standingsHash).forEach((driverName: string) => {
      standings.push({
        name: this.shortenName(driverName),
        points: standingsHash[driverName]
      })
    });

    return standings.sort((a: any, b: any) => {
      if (a.points < b.points) {
        return 1;
      }
      if (a.points > b.points) {
        return -1;
      }
      return 0;
    });
  }

  calculateTeamsStandings(racesData: IRace[], teams: ITeam[]) {
    let standingsHash = {};

    racesData.forEach((race: IRace) => {
      if (race.places) {
        for (let place in race.places) {
          let constructor: ITeam = teams.find((tm: ITeam) => tm.id === race.places[place].team);

          if (standingsHash[race.places[place].team]) {
              standingsHash[constructor.name] += PointsSystem[place];
          } else {
              standingsHash[constructor.name] = PointsSystem[place];
          }
        }
      }

      if (race['lap-team'] && race['lap-team'] !== 'Not selected') {
        standingsHash[race['lap-team']] ++;
      }
    });

    let filteredStandings = [];

    for (let i in standingsHash) {
      filteredStandings.push({
        team: i,
        points: standingsHash[i] || 0
      })
    }

    return filteredStandings.sort((a, b) => {
      const pointsA = a.points;
      const pointsB = b.points;

      if (pointsA < pointsB) {
        return 1;
      }
      if (pointsA > pointsB) {
        return -1;
      }
      return 0;
  });
  }

  shortenName(name: string): string {
    const nameArray = name.split(" ");
    const lastName: string = nameArray[1];
    return lastName.slice(0, 3).toLocaleUpperCase();
  }

  toggleEventsTab(): void {
    if (this.eventsTabName === "upcoming") {
      this.eventsTabName = "past";
    } else {
      this.eventsTabName = "upcoming";
    }
  }

  toggleStandingsTab(): void {
    if (this.standingsTabName === "drivers") {
      this.standingsTabName = "teams";
    } else {
      this.standingsTabName = "drivers";
    }
  }

  ngOnInit(): void {
  }
}

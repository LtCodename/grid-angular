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

interface IStatUnit {
  name: string;
  podiums: string;
  podiumsThisSeason: string;
  poles: string;
  polesThisSeason: string;
  wins: string;
  winsThisSeason: string;
  champs: string;
  points: string;
}

@Component({
  selector: 'app-seasons-page',
  templateUrl: './seasons-page.component.html',
  styleUrls: ['./seasons-page.component.scss']
})
export class SeasonsPageComponent implements OnInit {

  allSeasons: ISeason[] = [];
  allRaces: IRace[] = [];
  allDrivers: IDriver[] = [];
  seasonRaces: IRace[] = [];
  upcomingRaces: IRace[] = [];
  pastRaces: IRace[] = [];
  currentSeason: ISeason;
  driversStandings = [];
  teamsStandings = [];
  statistics: IStatUnit[] = [];
  showData: boolean = false;
  eventsTabName: string = "past";
  standingsTabName: string = "teams";
  filter: string = "points";

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
        this.allDrivers = allDrivers
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
        const currentSeason: ISeason = this.allSeasons.find((season: ISeason) => season.current);
        const seasonTeams: ITeam[] = allTeams.filter((team: ITeam) => currentSeason.teams.indexOf(team.id) != -1);
        this.teamsStandings = this.calculateTeamsStandings(this.pastRaces, seasonTeams);

        //Calculate extended statistics
        this.statistics = this.calculateStatistics(allDrivers, this.pastRaces);
      }

      this.showData = true;
    }, () => {
      this.showData = true;
    });
  };

  setFilter(newFilter:string) {
    this.filter = newFilter;
    this.calculateStatistics(this.allDrivers, this.pastRaces);
  }

  calculateStatistics(drivers: IDriver[], races: IRace[]): IStatUnit[] {
    this.statistics = [];

    //Filter out current grid drivers
    const seasonDrivers: IDriver[] = drivers.filter((dr: IDriver) => this.currentSeason.drivers.indexOf(dr.id) !== -1)
    
    function setSeasonPoles(driverId: string): string {
      let result = 0;

      races.forEach((race: IRace) => {
        if(race.pole === driverId) {
          result += 1;
        }
      });
      
      return result.toString();
    }

    function setSeasonWins(driverId: string): string {
      let result = 0;

      races.forEach((race: IRace) => {
        if(race.places) {
          if (race.places[1].driver === driverId) {
            result += 1;
          }
        }
      });
      
      return result.toString();
    }

    function setSeasonPodiums(driverId: string): string {
      let result = 0;

      races.forEach((race: IRace) => {
        if(race.places) {
          if (race.places[1].driver === driverId) {
            result += 1;
          }
          if (race.places[2].driver === driverId) {
            result += 1;
          }
          if (race.places[3].driver === driverId) {
            result += 1;
          }
        }
      });
      
      return result.toString();
    }

    function setPoints(driverId: string, standings: any): string {
      let driver = standings.find((dr: any) => dr.id === driverId);
      
      return driver.points.toString();
    }

    seasonDrivers.forEach((driver: IDriver) => {
      this.statistics.push({
        name: this.shortenName(driver.name),
        poles: driver.poles,
        polesThisSeason: setSeasonPoles(driver.id),
        wins: driver.wins,
        winsThisSeason: setSeasonWins(driver.id),
        podiums: driver.podiums,
        podiumsThisSeason: setSeasonPodiums(driver.id),
        points: setPoints(driver.id, this.driversStandings),
        champs: driver.championships
      });
    });

    this.statistics.sort((a: IStatUnit, b: IStatUnit) => {
      if (parseInt(a[this.filter]) < parseInt(b[this.filter])) {
        return 1;
      }
      if (parseInt(a[this.filter]) > parseInt(b[this.filter])) {
        return -1;
      }
      return 0;
    });

    return this.statistics;
  }

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
          if (standingsHash[driver.name]) {
            standingsHash[driver.name] += PointsSystem[place];
          } else {
            standingsHash[driver.name] = PointsSystem[place];
          }
        }
      }

      if (race.lap) {
        let fastestDriver: IDriver = drivers.find((dr: IDriver) => dr.id === race.lap);
        if (standingsHash[fastestDriver.name]) {
          standingsHash[fastestDriver.name] ++;
        } else {
          standingsHash[fastestDriver.name] = 1;
        }
      }
    });

    //

    //Convert drivers standings hash table into an array
    Object.keys(standingsHash).forEach((driverName: string) => {
      standings.push({
        name: this.shortenName(driverName),
        points: standingsHash[driverName],
        id: this.allDrivers.find((dr: IDriver) => dr.name == driverName).id
      })
    });

    let completeStandings = [...standings];
    
    drivers.forEach((driversData: IDriver) => {
      let driverId: any = driversData.id;
      let foundElement = standings.find(elem => (elem.name === this.shortenName(driversData.name)));
      if (!foundElement && this.currentSeason.drivers.indexOf(driverId) !== -1) {
        completeStandings.push({
          name: this.shortenName(driversData.name),
          points: 0,
          id: this.allDrivers.find((dr: IDriver) => dr.name == driversData.name).id
        });
      }
    });

    return completeStandings.sort((a: any, b: any) => {
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

          if (standingsHash[constructor.name]) {
            standingsHash[constructor.name] += PointsSystem[place];
          } else {
            standingsHash[constructor.name] = PointsSystem[place];
          }
        }
      }

      if (race['lap-team'] && race['lap-team'] !== 'Not selected') {
        let fastestTeam: ITeam = teams.find((tm: ITeam) => tm.id === race['lap-team']);
        if (standingsHash[fastestTeam.name]) {
          standingsHash[fastestTeam.name] ++;
        } else {
          standingsHash[fastestTeam.name] = 1;
        }
      }
    });

    let standings = [];

    for (let i in standingsHash) {
      standings.push({
        team: i,
        points: standingsHash[i] || 0
      });
    }

    let completeStandings = [...standings];

    teams.forEach((teamData: ITeam) => {
      let foundElement = standings.find(elem => elem.team === teamData.name);
      if (!foundElement) {
        completeStandings.push({
          team: teamData.name,
          points: 0
        });
      }
    });

    return completeStandings.sort((a, b) => {
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
    if  (lastName) {
      return lastName.slice(0, 3).toLocaleUpperCase();
    }
    return "";
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

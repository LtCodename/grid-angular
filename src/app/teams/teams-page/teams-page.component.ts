import { Component, OnInit } from '@angular/core';
import { ITeam } from '../teams-model';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.scss']
})
export class TeamsPageComponent implements OnInit {

  teams: ITeam[] = [];
  showPreloader: boolean = true;

  constructor(private teamsService: TeamsService) { 
    this.teamsService.teams$.subscribe(data => {
      this.teams = data.sort((a: ITeam, b: ITeam) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      if(this.teams.length) {
        this.showPreloader = false;
      }
    });
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITeam } from '../teams-model';
import { TeamsService } from '../teams.service';

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.scss']
})
export class TeamPageComponent implements OnInit {

  team: ITeam;
  allTeams: ITeam[] = [];
  teamId: string;
  showData: boolean = false;
  champs = [];

  constructor(private route: ActivatedRoute, private teamsService: TeamsService) {
    this.getQueryParam();

    this.teamsService.teams$.subscribe(data => {
      this.allTeams = data;
      this.team = this.allTeams.find((tm: ITeam) => tm.id === this.teamId);

      if(this.team) {
        console.log(this.team);
        for (let i = parseInt(this.team["constructors-championships"]); i > 0; i--) {
          this.champs.push(i);
        }

        this.showData = true;
      }
    })
  }

  getQueryParam(): void {
    this.route.paramMap.subscribe(params => {
      this.teamId = params.get("team");
    });
  }

  ngOnInit(): void {
    this.getQueryParam();
  }
}

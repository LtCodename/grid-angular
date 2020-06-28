import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  email: string = "";
  password: string = "";

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
  }

  login(): void {
    this.dashboardService.loginUser(this.email, this.password).then(res => {
    }).catch(error => {
      console.log(error);
    })
  }

  logout(): void {
    this.dashboardService.logoutUser().then(res => {
    }).catch(error => {
      console.log(error);
    })
  }
}

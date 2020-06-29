import { Component, OnInit, NgZone} from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {

  email: string = "";
  password: string = "";
  user: any = undefined;
  showLoginPanel: boolean = false;
  showEditPanel: boolean = false;
  loginButtonText: string = "Login";
  logoutButtonText: string = "Logout";

  constructor(private dashboardService: DashboardService, private ngZone: NgZone) {
    this.dashboardService.authToken$
      .pipe(filter((data) => data !== 'first'))
      .subscribe(data => {
        this.ngZone.run(() => {
          this.user = data;
          if (this.user) {
            this.showLoginPanel = false;
            this.showEditPanel = true;
          } else {
            this.showLoginPanel = true;
            this.showEditPanel = false;
          }
          //console.log(this.user);
        });
      });
  }

  ngOnInit(): void {
  }

  login(): void {
    this.loginButtonText = "Wait...";
    this.dashboardService.loginUser(this.email, this.password).then(res => {
      console.log(res);
      this.loginButtonText = "Done";
      setTimeout(() => {
        this.loginButtonText = "Login";
      }, 1000);
    }).catch(error => {
      console.log(error);
      this.loginButtonText = "Error!";
      setTimeout(() => {
        this.loginButtonText = "Login";
      }, 2000);
    })
  }

  logout(): void {
    this.logoutButtonText = "Wait...";
    this.dashboardService.logoutUser().then(res => {
      console.log(res);
      this.logoutButtonText = "Done";
      setTimeout(() => {
        this.logoutButtonText = "Logout";
      }, 1000);
    }).catch(error => {
      console.log(error);
      this.logoutButtonText = "Error!";
      setTimeout(() => {
        this.logoutButtonText = "Logout";
      }, 2000);
    })
  }
}

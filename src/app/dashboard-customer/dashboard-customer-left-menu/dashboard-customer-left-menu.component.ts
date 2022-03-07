import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../../services/app/app.service';

@Component({
  selector: 'dashboard-customer-left-menu',
  templateUrl: './dashboard-customer-left-menu.component.html',
  styleUrls: ['./dashboard-customer-left-menu.component.scss']
})

export class DashBoardLeftMenuComponent {
  public activeLi: any;
  customerType: any;
  constructor(private router: Router,
    private appService: AppService,
    private cookieService: CookieService) {
    this.activeLi = this.router.url;
    this.CheckLogin();

    this.customerType = this.cookieService.get('CustomerTypeId') 
    if (this.customerType == 1) {
      this.router.navigate(["/vendor"]);
    }
     
  }

  CheckLogin() {
    this.appService.CheckLogin(this.cookieService.get('Login')).subscribe(
      data => {
        if (!data) {
          this.router.navigate(["/login"]);
        }
      });
    //this.isLoggedIn = true;
  }

}

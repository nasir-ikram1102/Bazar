import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';

import { SharedService } from '../../services/shared/shared.service';
import { AppService } from '../../services/app/app.service';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer/customer-model'; 
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu-vendor',
  templateUrl: './menu-vendor.component.html',
  styleUrls: ['./menu-vendor.component.scss']
})
/** dashboard-vendor.ts component*/
export class MenuVendorComponent {
  public activeLi: any;
  
  public showBell: boolean = false;
  symbol: string = "";
  public shopName: any;
  public coverImagePath: any;
  public heading: any;
  customerType: any;
  customerModel = new Customer();
  /** dashboard-vendor.ts ctor */
  constructor(private router: Router,
    private cookieService: CookieService,
    private readonly sharedService: SharedService,
    private appService: AppService,
    private customerService: CustomerService) {
    this.CheckLogin();
    this.activeLi = this.router.url;

    this.customerType = this.cookieService.get('CustomerTypeId') 

    if (this.customerType == 2) {
      this.router.navigate(["/customer"]);
    }

    //
    //if (this.activeLi = '/purchase-orders-vendor')
    //{
    //this.heading = "Purchase Orders"
    //}
    //if (this.activeLi = '/vendor')
    //{
    //  this.heading = "My DashBoard"
    //}
    //if (this.activeLi = '/products-vendor')
    //{
    //  this.heading = "Products"
    //}
    //if (this.activeLi = '/coupons-vendor')
    //{
    //  this.heading = "Coupons Management"
    //}
    //if (this.activeLi = '/account-setting-vendor')
    //{
    //  this.heading = "Account Setting"
    //}
    //if (this.activeLi = '/withdarawl-vendor')
    //{
    //  this.heading = "With Darawls"
    //}
    
    this.customerService.getCustomerByToken().subscribe(
      data => {
        if (data) {
          this.customerModel = data;
          this.shopName = this.customerModel.shopeName;
          this.coverImagePath = this.customerModel.coverImagePath;  
        }
      }
    )
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

  CurrencyChange(value: string) {
    this.symbol = value.split('/')[0];
    this.cookieService.set('Currency', value.toString());
    //called the filter method to change currency global value so that all listener can detect this change
    this.sharedService.setCurrencyChangeMessage("DummyText");
  }

}

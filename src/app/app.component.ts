import { Component, OnInit, ViewContainerRef, Injectable, Renderer2 } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, NavigationStart } from "@angular/router";
import { AppService } from './services/app/app.service';
import { Guid } from "guid-typescript";
import { CartService } from './services/cart/cart.service';
import { LoginService } from './services/login/login.service';
import { getHtmlTagDefinition } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public notificationList: Notification[];
  isLoggedIn: boolean = false;
  public showfooter: boolean;
  public showHeader: boolean;
  public dynamicUrl: any;
  public roleId: number;
  //private title: string = 'Push Notifications!';

  constructor(
    public toastr: ToastsManager,
    private readonly router: Router,
    vcr: ViewContainerRef,
    private appService: AppService,
    private loginService: LoginService,
    private cookieService: CookieService,
    private cartService: CartService,
    private renderer: Renderer2) {

    this.roleId = Number(this.cookieService.get("CustomerTypeID"));
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          let currentUrlSlug = event.url.slice(1);

          if (currentUrlSlug == "" || currentUrlSlug == "blog-list" || currentUrlSlug.includes('blog') || currentUrlSlug.includes('page') || currentUrlSlug == "forgot-password") {
            this.renderer.addClass(document.body, "gray");
          }
          else {
            this.renderer.removeClass(document.body, "gray");
          }
          if (currentUrlSlug == "login" || currentUrlSlug == "register-customer") {
            this.renderer.addClass(document.body, "height100");
          }
          else {
            this.renderer.removeClass(document.body, "height100");
          }
          currentUrlSlug = currentUrlSlug.split("?")[0];
          
          if (currentUrlSlug == "login" 
            || currentUrlSlug == "register-customer"
          ) {
            this.showfooter = true;
          }
          else {
            this.showfooter = false;

          }
        }
      });

    // this.notify();
    this.toastr.setRootViewContainerRef(vcr);

    this.loginService.IsUserLoggedIn().subscribe(data => {
      if (data) {
        this.cartService.UpdateBulkCart();
      }
    });

    var visitorId = this.cookieService.get("visitorID");
    var visitorId = this.cookieService.get("visitorID");
    if (visitorId == null || visitorId == "" || typeof visitorId == "undefined")
      this.cookieService.set("visitorID", Guid.create().toString());
  }

  GenerateCartToken() {
    this.appService.GenerateCartToken().subscribe(
      data => {
        if (data.status == 200) {
          this.cookieService.set('CartToken', data.data);
        }
      }
    );
  }


  CheckLogin() {
    this.appService.CheckLogin(this.cookieService.get('Login')).subscribe(
      data => {
        this.isLoggedIn = data
        if (!data) {
          this.router.navigate(["/login"]);
        }
      });
    //this.isLoggedIn = true;
  }
}





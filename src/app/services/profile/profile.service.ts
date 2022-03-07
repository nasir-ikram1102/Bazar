import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'; 
import { Customer } from '../../models/customer/customer-model';
@Injectable()
export class ProfileService {
  private service = "api/Customer"; //Controller Name 
  private serviceAnnouncement = "api/Announcement"; //Controller Name 
  constructor(private http: Http,
    private readonly router: Router,
    private cookieService: CookieService) { }

  getProfile() {
   return this.http.get(`${this.service}/GetProfile?token=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  } 

  GetCustomerViewModel() {
    return this.http.get(`${this.service}/GetCustomerViewModel?token=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  } 
  changePassword(changePasswordmodel: any) {
 
    return this.http.post(`${this.service}/ChangePassword`, changePasswordmodel, {})       
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  } 
  getAnnouncement() { 
    return this.http.get(`${this.serviceAnnouncement}/GetAnnouncementsByCustomerId?token=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }

  updateProfile(customerModel: Customer) { 
    return this.http.post(`${this.service}/UpdateProfile`, customerModel, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../../models/user/user-model';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class CustomerService {
  private serviceName = 'api/customer';
  private serviceSubscriber = 'api/subscribers';
  constructor(private http: Http, public toastr: ToastsManager, private cookieService: CookieService) {
  }

  getVendorsList() {
    return this.http.get(`${this.serviceName}/GetVendorsList`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getUsers() {
    return this.http.get(`${this.serviceName}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  ForgotPassword(email: string) {
    return this.http.get(`${this.serviceName}/ForgotPasswordAsync?email=` + email)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  ResetPassword(email: string, password: string, token: string) {

    return this.http.get(`${this.serviceName}/ResetPassword?email=` + email + `&password=` + password + `&token=` + token)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getUser(userId: string) {
    return this.http.get(`${this.serviceName}/GetUserById?id=` + userId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getCustomerByToken() {
    return this.http.get(`${this.serviceName}/GetProfile?token=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getVendorByShopName(shopName: any) {
    return this.http.get(`${this.serviceName}/GetVendorByShopName?shopName=` + shopName)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  SubscribeNewsLetter(email: any) {
    return this.http.get(`${this.serviceSubscriber}/AddNewLetterSubscriber?email=` + email)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  isUniqueEmail(email: string, customerId: number) {
    if (customerId == undefined) customerId = 0;

    return this.http
      .get(`${this.serviceName}/IsUniqueEmail?email=` + email + `&customerId=` + customerId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  isUniqueShopName(shopName: string, customerId: number) {
    if (customerId == undefined) customerId = 0;
    return this.http
      .get(`${this.serviceName}/IsUniqueShopName?shopName=` + shopName + `&customerId=` + customerId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  isUpdatedEmailUnique(email: string, customerId: number) {
    return this.http
      .get(`${this.serviceName}/isUpdatedEmailUnique?email=` + email + `&customerId=` + customerId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  ContactUs(firstName: string, LastName: string, email: string, message: string, phone: string) {
    return this.http
      .get(`${this.serviceName}/ContactUs?firstName=` + firstName + `&LastName=` + LastName + `&email=` + email + `&message=` + message + `&phone=` + phone)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }




  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

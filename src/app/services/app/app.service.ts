import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AppService {

  private serviceName = 'api/authentication';
  constructor(private http: Http,
    private cookieService: CookieService) {

  }

  CheckLogin(token: string) {
    return this.http.get(`${this.serviceName}/IsUserLoggedIn?token=` + token)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GenerateCartToken() {
    var token = this.cookieService.get('CartToken');
    if (token == null || token == "" || typeof token == "undefined")
      token = null;

    return this.http.get(`${this.serviceName}/GenerateCartToken?token=` + token)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  Logout(token: string) {
    return this.http.get(`${this.serviceName}/Logout?token=` + token)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http'; 
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class SubscriberService { 
  private serviceName = 'api/Subscribers'
  constructor(private http: Http, private cookieService: CookieService) { }

  AddSubscriber(email :any) {
    return this.http.get(`${this.serviceName}/AddNewSubscriber?email=` + email)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  } 
  GetSubscriberByEmail() { 
    return this.http.get(`${this.serviceName}/GetSubscriberByEmail?token=` + this.cookieService.get('Login'))    
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

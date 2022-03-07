import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';


import { Router } from "@angular/router";


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class SmsService {
  constructor(private http: Http, private readonly router: Router) { }
  private serviceName = 'api/Sms';

  sendSms(phoneNo: string) {
    
    return this.http.get(`${this.serviceName}/SendSmsAsync?phoneNo=` + phoneNo)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

 

  
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }

}

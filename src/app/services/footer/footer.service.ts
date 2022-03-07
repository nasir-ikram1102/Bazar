import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable()
export class FooterService {
  private serviceName = 'api/footer';
  constructor(private http: Http, private readonly router: Router) { }
  getAllPaymentMethods() {
    return this.http.get(`${this.serviceName}/GetAllPaymentMethods`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getAllFooterMenu() {
    return this.http.get(`${this.serviceName}/GetAllFooterMenu`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getSystemSetting() {
    return this.http.get(`${this.serviceName}/GetSystemSettingFirstOrDefault`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getApplicationSettingFirstOrDefault() {
    return this.http.get(`${this.serviceName}/GetApplicationSettingFirstOrDefault`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  //GetSystemSettingsById(id: string) {
  //  return this.http.get(`${this.serviceName}/GetApplicationSettingById?Id=` + id)
  //    .map((response: Response) => response.json())
  //    .catch(this.errorHandler);
  //}
  //getApplicationSetting() {
  //  return this.http.get(`${this.serviceName}/GetApplicationSetting`)
  //    .map((response: Response) => response.json())
  //    .catch(this.errorHandler);
  //}
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

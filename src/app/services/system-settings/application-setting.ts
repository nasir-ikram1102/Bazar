import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { ApplicationSetting } from '../../models/system-setting/application-setting';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()

export class ApplicationSettingsService {
  private service = "api/ApplicationSettings"; //Controller Name
  public systemSettingList: ApplicationSetting[];

  constructor(private http: Http, private readonly router: Router) { }

  AddSystemSetting(createSettingModel: ApplicationSetting): void {
    this.http
      .post(`${this.service}`, createSettingModel, { })
      .subscribe(result => {
        this.router.navigate(["/application-settings"]);
      });
  }
  UpdateSystemSetting(EditSettingModel: ApplicationSetting): void {
    this.http
      .put(`${this.service}`, EditSettingModel, {})
      .subscribe(result => {
        this.router.navigate(["/application-settings"]);
      });
  }
  GetSystemSettings() {
    return this.http.get(`${this.service}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetSystemSettingsById(id: string) {
    return this.http.get(`${this.service}/` + id)
      .map((response: Response) => <ApplicationSetting>response.json())
      .catch(this.errorHandler)
  }

  DeleteSystemSetting(id: string) {
    return this.http.delete(`${this.service}/` + id)
      .subscribe(result => {
      });
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

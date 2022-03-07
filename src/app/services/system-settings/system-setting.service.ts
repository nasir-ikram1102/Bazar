import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { SystemSetting } from '../../models/system-setting/system-setting.model';
import { ImageProcessing } from '../../models/system-setting/ImageProcessing.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()

export class SystemSettingService {
  private service = "api/SystemSetting"; //Controller Name
  public systemSettingList: SystemSetting[];

  constructor(private http: Http, private readonly router: Router) { }

  AddSystemSetting(createSettingModel: SystemSetting): void {
    this.http
      .post(`${this.service}`, createSettingModel, { })
      .subscribe(result => {
        this.router.navigate(["/System-Settings-List"]);
      });
  }
  UpdateSystemSetting(EditSettingModel: SystemSetting): void {
    this.http
      .put(`${this.service}`, EditSettingModel, {})
      .subscribe(result => {
        this.router.navigate(["/System-Settings-List"]);
      });
  }
  GetSystemSettings() {
    return this.http.get(`${this.service}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetSystemSettingsById(id: string) {
    return this.http.get(`${this.service}/` + id)
      .map((response: Response) => <SystemSetting>response.json())
      .catch(this.errorHandler)
  }
  GetImageServerPath() {
    return this.http.get(`${this.service}/ImageServerPath`)
      .map((response: Response) => <ImageProcessing>response.json())
      .catch(this.errorHandler);
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

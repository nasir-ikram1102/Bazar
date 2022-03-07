import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { retry } from 'rxjs/operator/retry';

@Injectable()
export class UtilitiesService {

  private serviceName = 'api/home'
  constructor(private http: Http, private readonly router: Router)
  {
  }

  
  intializeHome() {
    return this.http.get(`${this.serviceName}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  //generic search function from whole array object passing to it
  GetSearchedResult(dataArray: any[], searchText: string): any[] {
    return dataArray.filter(item =>
      Object.keys(item).some(k => item[k] != null &&
        item[k].toString().toLowerCase()
          .includes(searchText.trim().toLowerCase())));
  }

  GetRowsPerPageList(): number[] {
    let arrRows = [10, 25, 50,100];
    return arrRows;
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

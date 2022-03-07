import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { Store } from '../../models/store/store.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
@Injectable()
export class StoreService {
  private service = "api/Store"; //Controller Name
  public storeList: Store[];
  constructor(private http: Http, private readonly router: Router) { }

  AddStore(store: Store) {
    return this.http
      .post(`${this.service}`, store, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  AddStoreImages(formData: any):void {
    this.http
      .post(`${this.service}/SaveStoreImages`, formData, {})
      .subscribe(result => {
        this.router.navigate(["/store-list"]);
      });
  }
  UpdateStore(store: Store): void {
    this.http
      .put(`${this.service}`, store, {})
      .subscribe(result => {
        //this.router.navigate(["/store-list"]);
      });
  }
  UpdateActiveAndInactive(id: number) {

    return this.http
      .post(`${this.service}/UpdateActiveAndInactive?sid=` + id, null, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetStores() {
    return this.http.get(`${this.service}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetStoreById(id: string) {
    return this.http.get(`${this.service}/` + id)
      .map((response: Response) => <Store>response.json())
      .catch(this.errorHandler)
  }
  DeleteStore(id: string) {
    return this.http.delete(`${this.service}/` + id)
      .subscribe(result => {
      });
  }
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

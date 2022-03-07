import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Brand } from '../../models/brand/brand-model';
import { Observable } from 'rxjs/Observable';


import { Router } from "@angular/router";


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class BrandService {
  constructor(private http: Http, private readonly router: Router) { }
  private serviceName = 'api/Brand';


  getBrand() {
    return this.http.get(`${this.serviceName}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  addBrand(brandModel: Brand) {
    

    return this.http.post(`${this.serviceName}/CreateBrand`, brandModel)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateBrand(brandModel: Brand) {
    return this.http.post(`${this.serviceName}/UpdateBrand`, brandModel, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  deletebrand(id: string) {
    return this.http.get(`${this.serviceName}/DeleteBrand?id=` + id)
      .subscribe(result => {
      });
      //.map((response: Response) => response.json())
      //.catch(this.errorHandler);
  }

  getBrandById(brandId: string) {
    return this.http.get(`${this.serviceName}/GetBrandById?id=` + brandId)
      
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }

}

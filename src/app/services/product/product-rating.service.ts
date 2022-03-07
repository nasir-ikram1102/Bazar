import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { ProductRating } from '../../models/products/product-rating.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ProductRatingService {
  private serviceName = "api/ProductRating"; //Controller Name
  constructor(private http: Http, private readonly router: Router, private cookieService: CookieService) { } 

  AddRating(Ratingmodel: ProductRating) {
    return this.http
      .post(`${this.serviceName}`, Ratingmodel, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getRatingsByCustomer(pageNumber: number, pageSize: number) {
    return this.http.get(`${this.serviceName}/GetRatingsByCustomer?customerId=` + this.cookieService.get('CustomerID') +`&pageNumber=` + pageNumber + `&pageSize=` + pageSize)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  updateRating(Ratingmodel: ProductRating){
    return this.http
      .put(`${this.serviceName}`, Ratingmodel, {})
      .subscribe(result => {
        this.router.navigate(["/Rating"]);
      });
  }
  deleteRating(id: string) {
    return this.http.delete(`${this.serviceName}/` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getRatings() {
    return this.http.get(`${this.serviceName}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getCustomerInfo(id: number) {
    return this.http.get(`${this.serviceName}/GetCustomerInfo?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getProductRatingCount(url: string) {
    return this.http.get(`${this.serviceName}/GetProductRatingCount?url=` + url)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  UpdateActiveAndInactive(id: number) {
    return this.http
      .post(`${this.serviceName}/` + id, null, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getRating(id: string) {
    return this.http.get(`${this.serviceName}/` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
  getProductRatings(url: string) {
    return this.http.get(`${this.serviceName}/GetProductRatings?url=` + url)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
}

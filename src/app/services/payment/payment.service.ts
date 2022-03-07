import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { Payment } from '../../models/payment/payment-model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class PaymentService {
  private serviceName = 'api/payment';
  constructor(private http: Http, private readonly router: Router) { } 
  getPaymentMethods() {
    return this.http.get(`${this.serviceName}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  getPaymentMethodById(id: string) {
    return this.http.get(`${this.serviceName}/` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  PaymentMethodById(id: number) {
    return this.http.get(`${this.serviceName}/GetPaymentMethod?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

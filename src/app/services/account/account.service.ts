import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Customer } from '../../models/customer/customer-model';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AccountService {

  private serviceName = 'api/customer';
  constructor(private http: Http, public toastr: ToastsManager) {
  }

  registerCustomer(model: Customer) {
    return this.http.post(`${this.serviceName}/RegisterCustomer`, model)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  registerVendor(model: Customer) {
    return this.http.post(`${this.serviceName}/RegisterVendor`, model)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

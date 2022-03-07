import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { SupplierTicket } from '../../models/SupplierTicket/SupplierTicket-model';
import { Observable } from 'rxjs/Observable';


import { Router } from "@angular/router";


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class SupplierTicketService {
  constructor(private http: Http, private readonly router: Router) { }
  private serviceName = 'api/SupplierTicket';


  getSupplierTicket() {
    return this.http.get(`${this.serviceName}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  addSupplierTicket(SupplierTicketModel: SupplierTicket) {
    

    return this.http.post(`${this.serviceName}/CreateSupplierTicket`, SupplierTicketModel)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateSupplierTicket(SupplierTicketModel: SupplierTicket) {
    return this.http.post(`${this.serviceName}/UpdateSupplierTicket`, SupplierTicketModel, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  deleteSupplierTicket(id: string) {
    return this.http.get(`${this.serviceName}/DeleteSupplierTicket?id=` + id)
      .subscribe(result => {
      });
  
  }

  getDepartments() {
 return this.http.get(`${this.serviceName}/GetDepartments`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getSupplierTicketById(SupplierTicketId: string) {
    return this.http.get(`${this.serviceName}/GetSupplierTicketById?id=` + SupplierTicketId)
      
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }

}

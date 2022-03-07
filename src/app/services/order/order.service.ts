import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { Order } from '../../models/order/order.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class OrderService {
  private service = "api/Order"; //Controller Name
  private serviceUtility = "api/Utility"; //Controller Name
  public OrderList: Order[];
  constructor(private http: Http, private readonly router: Router, private cookieService: CookieService) { } 
   

  GetPurchaseOrderDetailByID(id: string) {
    return this.http.get(`${this.service}/GetPurchaseOrder?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetPurchaseOrderStatuses() {
    return this.http.get(`${this.serviceUtility}/GetPurchaseOrderStatuses`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetwithDrawlStatuses() {
    return this.http.get(`${this.serviceUtility}/GetwithDrawlStatuses`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetRecentPurchaseOrdersByVendor() {
    var vendorId = this.cookieService.get('CustomerID'); 
    return this.http.get(`${this.service}/GetRecentPurchaseOrdersByVendor?vendorId=` + vendorId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  
  GetPurchaseOrdersByVendor(searchStatus: number, searchDatePicker: string, PageNumber: number, PageSize: number) { 
    var vendorId = this.cookieService.get('CustomerID');
    return this.http.get(`${this.service}/GetPurchaseOrdersByVendor?vendorId=` + vendorId + '&searchStatus=' + searchStatus + '&searchDatePicker=' + searchDatePicker + '&PageNumber=' + PageNumber + '&PageSize=' + PageSize)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetPurchaseOrdersForWithDrawals(searchStatus: number, searchDatePicker: string, PageNumber: number, PageSize: number) {
    var vendorId = this.cookieService.get('CustomerID');
    return this.http.get(`${this.service}/GetPurchaseOrdersForWithDrawals?vendorId=` + vendorId + '&searchStatus=' + searchStatus + '&searchDatePicker=' + searchDatePicker + '&PageNumber=' + PageNumber + '&PageSize=' + PageSize)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetRecentSaleItemsByVendor() {
    var vendorId = this.cookieService.get('CustomerID');
    return this.http.get(`${this.service}/GetRecentSaleOrdersByVendor?vendorId=` + vendorId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetSalesByVendor() {
    var vendorId = this.cookieService.get('CustomerID');
    return this.http.get(`${this.service}/GetSalesByVendor?vendorId=` + vendorId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  UpdatePerchaseOrderStatus(PoId: any, StatusId: any) {
    return this.http.get(`${this.service}/UpdatePerchaseOrderStatus?id=` + PoId + `&statusId=` + StatusId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  UpdatePerchaseOrderStatusBulk(POList: any, StatusId: any) {
    return this.http.post(`${this.service}/UpdatePerchaseOrderStatusBulk?statusId=` + StatusId, POList)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetOrdersByCustomer(orderStatusId: number, pageNumber: number, pageSize: number) { 
    var customerId = this.cookieService.get('CustomerID');
    return this.http.get(`${this.service}/GetOrdersbyCustomer?customerId=` + customerId + `&orderStatusId=` + orderStatusId + `&pageNumber=` + pageNumber + `&pageSize=` + pageSize)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  } 
  GetOrderStatuses() { 
    return this.http.get(`${ this.serviceUtility }/GetOrderStatuses`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetOrderDetailByOrder(id: string) { 
    return this.http.get(`${this.service}/ViewOrderDetail?Id=` + id + `&isCustomer=` + true) 
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

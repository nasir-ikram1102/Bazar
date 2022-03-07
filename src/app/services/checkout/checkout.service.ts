import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { PaymentMethodModel } from '../../models/payment/paymentmethod.model';
import { EasyPaisaModel } from '../../models/payment/payment.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ShippingMethods } from '../../models/shippingMethods/shippingMethods.model';

@Injectable()
export class CheckoutService {
  private cartService = "api/Cart"; //Controller Name
  private checkoutService = "api/checkoutService"; //Controller Name
  constructor(private http: Http, private cookieService: CookieService) {

  }

  GetSiteContact() {
    return this.http
      .get(`${this.cartService}/GetSiteContact`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetShippingMethod() {
    return this.http
      .get(`${this.cartService}/GetShippingMethod?jwtoken=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  UpdateCartCustomer() {
    return this.http
      .get(`${this.cartService}/UpdateCartCustomer?jwtoken=` + this.cookieService.get('Login') + "&customerToken=" + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetShippingMethods() {
    return this.http
      .get(`${this.cartService}/GetShippingMethods`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  AddShippingMethod(method: ShippingMethods) {
    return this.http
      .post(`${this.cartService}/AddShippingMethod?jwtoken=` + this.cookieService.get('Login'), method)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  AddShippingAddress(address: any) {
    return this.http
      .post(`${this.cartService}/AddShippingAddress?jwtoken=` + this.cookieService.get('Login'), address)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }


  ProcessOrder() {
    return this.http
      .post(`${this.cartService}/ProcessOrder?jwtoken=` + this.cookieService.get('Login'), null)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  

  AddPaymentMethod(paymentMethod: PaymentMethodModel) {
    return this.http
      .post(`${this.cartService}/AddPaymentMethod?jwtoken=` + this.cookieService.get('Login'), paymentMethod)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetShippingAddress() {
    return this.http
      .get(`${this.cartService}/GetShippingAddress?jwtoken=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetPaymentMethods() {
    return this.http
      .get(`${this.cartService}/GetPaymentMethods`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  CalculateOrder() {
    return this.http
      .get(`${this.cartService}/CalculateOrder?jwtoken=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetEasyPayResponse(model: EasyPaisaModel) {
    console.log(model);
    console.log(this.cookieService.get('Login'));
    return this.http
      .post(`${this.cartService}/GetEasyPayResponse?token=` + this.cookieService.get('Login'), model)
      .map((response: Response) => response)
      .catch(this.errorHandler);
  }


  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

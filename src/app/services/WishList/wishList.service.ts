import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { WishList } from '../../models/WishList/wishList-model';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";

@Injectable()
export class WishListService {
  private serviceName = 'api/WishList';
  constructor(private http: Http,
    private readonly router: Router,
    private cookieService: CookieService,
    public toastr: ToastsManager) {

  }

  getWishListByCustomer() {
    return this.http.get(`${this.serviceName}/GetWishListByCustomer?token=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  addWishlist(wishList: WishList) {
   
    return this.http
      .post(`${this.serviceName}?jwtoken=` + this.cookieService.get("Login"), wishList)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }


  removeItem(wishListId: number) {
    return this.http.delete(`${this.serviceName}/` + wishListId)
      .subscribe(result => {
      });
  }

  UpdateWishList(wishList: WishList[]) {
    debugger
    return this.http.post(`${this.serviceName}/UpdateWishesList`, wishList)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }


  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

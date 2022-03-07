import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { CartCookieModel } from '../../models/cart/cart.model';
import { SharedService } from '../shared/shared.service';
import { LoginService } from '../login/login.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Product } from '../../models/products/product.model';

@Injectable()
export class CartService {
  private service = "api/Cart"; //Controller Name
  private chk: boolean = false;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  constructor(private http: Http,
    private loginService: LoginService,
    private cookieService: CookieService,
    private sharedService: SharedService,
    private readonly toastr: ToastsManager) {

  }

  GetCartItems() {
    return this.http.get(`${this.service}/GetCartItems?jwtoken=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetCartItemsByIds(ids: string) {
    return this.http.get(`${this.service}/GetCartItemsByIds?productIds=` + ids)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  ValidateQuantity(ids: Product[]) {
    return this.http.post(`${this.service}/ValidateQuantity?jwtoken=` + this.cookieService.get('Login'), ids)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetCartWithAppliedCoupon() {
    return this.http.get(`${this.service}/GetCartWithAppliedCoupon?jwtoken=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetCookieCartItems() {

    //return this.http.post(`${this.service}/GetCookieCartItems?jwtoken=` + this.cookieService.get('Login'), )
    //  .map((response: Response) => response.json())
    //  .catch(this.errorHandler);
  }

  GetAppliedCoupon() {
    return this.http.get(`${this.service}/GetAppliedCoupon?jwtoken=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  AddToCart(id: number, quantity: string) {
    if (quantity == null)
      quantity = "";
    return this.http.get(`${this.service}/AddToCart?jwtoken=` + this.cookieService.get('Login') + "&id=" + id + "&quantity=" + quantity)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }


  UpdateBulkCart(func?: any, message?: any) {

    var ct = localStorage.getItem('cart');
    let cart: CartCookieModel[] = [];
    if (ct != null && ct != "" && typeof ct != "undefined" && ct != "undefined") {
      cart = JSON.parse(ct);

      let symbol: string;
      if (typeof this.cookieService.get('Currency') != 'undefined' && this.cookieService.get('Currency') != null)
        symbol = this.cookieService.get('Currency').split('/')[0];
      else
        symbol = "$";

      cart.forEach(x => {
        x.currencySymbol = symbol;
      });
    }
    this.http.post(`${this.service}/UpdateBulkCart?jwtoken=` + this.cookieService.get('Login'), cart)
      .map((response: Response) => response.json())
      .catch(this.errorHandler).subscribe(cart => {
        if (cart.status == 200) {
          localStorage.setItem('cart', JSON.stringify(cart.data));
          if (func != null && typeof func != "undefined")
            func();

        if(message != null && typeof message != "undefined")
          message();
        }
        this.sharedService.filter('Register click');

        if (cart.status == 401) {
          if (message != null && typeof message != "undefined")
              message();
        }

      });
  }


  AddToCookieCart(product: Product, quantity: number, isRemove?: boolean) {

    let cart = localStorage.getItem('cart');
    let cartJson: CartCookieModel[] = null;
    if (cart != null && cart != "" && typeof cart != "undefined" && cart != "undefined") {
      cartJson = JSON.parse(cart);
      let existingProduct: CartCookieModel[] = cartJson.filter(y => y.productID == product.productID);

      if (existingProduct.length > 0) {
        if (quantity == null) {
          if (existingProduct[0].quantity == null || typeof existingProduct[0].quantity == "undefined")
            existingProduct[0].quantity = 1;
          else
            existingProduct[0].quantity += 1;
        }
        else
          existingProduct[0].quantity = quantity;
        existingProduct[0].isNew = true;
      }
      else {
        cartJson.push(this.AddNewProductInCookie(product, quantity));
      }
    }

    else {
      cartJson = [];
      cartJson.push(this.AddNewProductInCookie(product, quantity));
    }
    localStorage.setItem("cart", JSON.stringify(cartJson));


    this.sharedService.filter('Register click');
    let scope = this;
    this.UpdateBulkCart(null, function () {
      if (!isRemove)
        scope.toastr.success('Item added to cart', 'Success');
    });

    //if (!isRemove)
    //this.toastr.success('Item added to cart', 'Success');
  }

  AddNewProductInCookie(product: Product, quantity: number): CartCookieModel {

    let newProduct: CartCookieModel = new CartCookieModel();

    if (quantity == null) {
      if (newProduct.quantity == null || typeof newProduct.quantity == "undefined")
        newProduct.quantity = 1;
      else
        newProduct.quantity += 1;
    }
    else
      newProduct.quantity = quantity;
    newProduct.currencySymbol = product.currencySettings.currencySymbol;
    newProduct.imagePath = product.productDefaultThumbnail;
    newProduct.regularPrice = product.regularPrice;
    newProduct.productName = product.name;
    newProduct.salePrice = product.salePrice;
    newProduct.isNew = true;
    newProduct.appliedDiscoutType = product.appliedDiscoutType;
    newProduct.productID = product.productID;
    newProduct.url = product.url;
    return newProduct;
  }


  Checkout(products) {
    return this.http.put(`${this.service}/UpdateBulkCart?jwtoken=` + this.cookieService.get('Login'), products)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  RemoveFromCart(id: number) {
    this.sharedService.filter('Register click');
    return this.http
      .get(`${this.service}/RemoveFromCart?jwtoken=` + this.cookieService.get('Login') + "&id=" + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  UpdateCart(id: number, quantity: number) {
    return this.http
      .get(`${this.service}/UpdateCart?jwtoken=` + this.cookieService.get('Login') + "&id=" + id + "&quantity=" + quantity)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  ClearCart() {
    return this.http
      .get(`${this.service}/ClearCart?jwtoken=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  AddToWishlist(id: number) {
    return this.http
      .get(`${this.service}/AddToWishlist?jwtoken=` + this.cookieService.get('Login') + "&id=" + id + "&customerId=" + this.cookieService.get('CustomerID'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  RemoveFromWishlist(id: number) {
    return this.http
      .get(`${this.service}/RemoveFromWishlist?jwtoken=` + this.cookieService.get('Login') + "&id=" + id + "&customerId=" + this.cookieService.get('CustomerID'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  //ClearFromWishlist() {
  //  return this.http
  //    .get(`${this.service}/ClearFromWishlist?jwtoken=` + this.cookieService.get('CartToken'))
  //    .map((response: Response) => response.json())
  //    .catch(this.errorHandler);
  //}
 
 

  AddToCompareList(id: number) {
    var preIds = this.cookieService.get('productCounter');
    var pIds = [];
    if (preIds.toString().includes(",")) {
      pIds = preIds.split(',');
    } else {
      pIds = [];
    }

    if (pIds.filter(z => z == id).length <= 0) {
      this.cookieService.set('productCounter', id.toString() + ',' + preIds);
      this.chk = true;
    }
    else {
      this.chk = false;
    }
    return this.chk;
  }


  //AddToCompareList(id: number) {
  //  return this.http
  //    .get(`${this.service}/AddToCompareList?jwtoken=` + this.cookieService.get('CartToken') + "&id=" + id)
  //    .map((response: Response) => response.json())
  //    .catch(this.errorHandler);
  //}
 
  //RemoveFromCompareList(id: number) {
  //  return this.http
  //    .get(`${this.service}/RemoveFromCompareList?jwtoken=` + this.cookieService.get('CartToken') + "&id=" + id)
  //    .map((response: Response) => response.json())
  //    .catch(this.errorHandler);
  //}
  //ClearCompareList() {
  //  return this.http
  //    .get(`${this.service}/ClearCompareList?jwtoken=` + this.cookieService.get('CartToken'))
  //    .map((response: Response) => response.json())
  //    .catch(this.errorHandler);
  //}
  ApplyCouponCode(couponCode: string) {
    return this.http
      .post(`${this.service}/ApplyCouponCode?jwToken=` + this.cookieService.get('Login') + "&couponCode=" + couponCode, null)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }


  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

import { Component, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart/cart.service';
import { SharedService } from '../services/shared/shared.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Product } from '../models/products/product.model';
import { Cart } from '../models/cart/cart.model';
import { CookieService } from 'ngx-cookie-service';
import { CartCookieModel } from '../models/cart/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})


/** Cart component*/
export class CartComponent {
  /** Cart ctor */
  products: Product[];
  cartModel: Cart = new Cart();
  couponCode: string;
  isCouponApplied = true;
  couponAmount = 0;
  absoluteTotal = 0;
  public DummyCounter: number = 0;
  currencySymbol = "";
  
  
  constructor(private readonly router: Router,
    private readonly cartService: CartService,
    private cookieService: CookieService,
    private sharedService: SharedService,
    vcr: ViewContainerRef,
    public toastr: ToastsManager) {
    this.toastr.setRootViewContainerRef(vcr);
    this.GetCartItems();

    this.sharedService.listen().subscribe((m: any) => {
      this.GetCartItems();
    })
    //this.GetAppliedCoupon();
    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });
  
      window.scrollTo(0, 0);
    
  }

  onListenerTirgger() {
    this.DummyCounter += 1;
  }

  GetCartItems() {
    let cart = localStorage.getItem('cart');
    if (cart != null && cart != "" && typeof cart != "undefined" && cart != "undefined") {

      let jsonCart: CartCookieModel[] = JSON.parse(cart);
      let ids: string = "";

      if (jsonCart != null && jsonCart.length > 0 && typeof jsonCart != "undefined" && jsonCart.length > 0) {//jsonCart.filter(x => !x.isDeleted).length
        jsonCart.forEach(x => {
            if (ids != "")
              ids += ",";

            ids += x.productID;
        });

        this.cartService.GetCartItemsByIds(ids).subscribe(d => {
          if (d.status == 200) {
            this.products = d.data;

            if (this.products != null) {
              jsonCart.forEach(y => {
                  this.products.filter(z => z.productID == y.productID)[0].quantity = y.quantity;
              });
            }

            var total = 0;
            if (this.products != null && this.products.length > 0)
              this.currencySymbol = this.products[0].currencySettings.currencySymbol;

            this.products.forEach(obj => {
              obj.totalPrice = Math.round(((obj.quantity * ((obj.salePrice > 0) ? obj.salePrice : obj.regularPrice))) * 100) / 100;
              total += obj.totalPrice;

              obj.isQuantityExist = true;
            });
            this.cartModel.subTotal = Math.round(total * 100) / 100;
            this.absoluteTotal = Math.round(this.cartModel.subTotal * 100) / 100;
          }
        });
      }
      else
        this.products = null;
      
    }
  } 
  //keyPress(event: any) {
  //  if (this.quantity < 1) {
  //    this.quantity = 1;
  //  }
  //  let charCode = (event.which) ? event.which : event.keyCode;
  //  if (charCode != 46 && charCode > 31
  //    && (charCode < 48 || charCode > 57))
  //    return false;
  //  return true;
  //}
 
  ////keyPress(event: any) {
  ////  if (this.quantity < 1) {
  ////    this.quantity = 1;
  ////  }
  ////  let charCode = (event.which) ? event.which : event.keyCode;
  ////  if (charCode != 46 && charCode > 31
  ////    && (charCode < 48 || charCode > 57))
  ////    return false;
  ////  return true;
  ////}
 
  RemoveItemFromCart(productId, index) {
    if (confirm("Are you sure ?")) {

      this.products.splice(index, 1);
      let cartProducts: CartCookieModel[] = JSON.parse(localStorage.getItem('cart'));
      cartProducts.forEach((item, index) => {
        if (item.productID == productId) cartProducts.splice(index, 1);
      });
      localStorage.setItem("cart", JSON.stringify(cartProducts));

      this.toastr.success("Item removed from cart", 'Success');
      this.cartService.RemoveFromCart(productId).subscribe()
    }
  }

  Checkout() {
    this.cartService.ValidateQuantity(this.products).subscribe(d => {
      if (d.status == 200 && d.data != null && d.data != "" && d.data.length > 0) {
        d.data.forEach((item, index) => {
          let currentProduct: Product = this.products.filter(x => x.productID == item.productID)[0];
          if (currentProduct != null && typeof currentProduct != "undefined") 
            currentProduct.isQuantityExist = item.isQuantityExist;
        });

        var isNotExists = d.data.filter(x => x.isQuantityExist == false);
        if (isNotExists.length <= 0) {
          this.router.navigate(["/checkout"]);
        }
      }
    });
  }

  QuantityChanged(i) {
    var product = this.products[i];
    if (product.quantity == null || product.quantity == 0)
      product.quantity = 1;

    product.totalPrice = Math.round((product.quantity * ((product.salePrice > 0) ? product.salePrice : product.regularPrice) * 100) / 100);
    
    this.cartService.AddToCookieCart(product, product.quantity, true);

    var total = 0;
    this.products.forEach(obj => {
      total += obj.totalPrice;
    });

    this.cartModel.subTotal = Math.round((total) * 100) / 100;
    this.absoluteTotal = Math.round((this.cartModel.subTotal - this.couponAmount) * 100) / 100;
    this.cartModel.subTotal = total;
  }
}

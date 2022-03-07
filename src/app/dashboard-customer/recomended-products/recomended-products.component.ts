import { Component, ViewContainerRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../../models/products/product.model';
import { ProductService } from '../../services/product/product.service';
import { Router } from '@angular/router';
import { WishListService } from '../../services/wishlist/wishList.service';
import { Payment } from '../../models/payment/payment-model'; 
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Customer } from '../../models/customer/customer-model'; 
import { CartService } from '../../services/cart/cart.service'; 
import { WishList } from '../../models/WishList/wishList-model';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'recomended-products',
  templateUrl: './recomended-products.component.html',
  styleUrls: ['./recomended-products.component.scss']
})
export class RecomendedProductsCustomerComponent {
  // for wishlist
  public pId: number = 0;
  public wishlistcount: number;
  redirectUrl: string = "";
   //end
  customerModel = new Customer();
  public wishList: WishList = new WishList(); 
  public DummyCounter: number = 0; 
  products: Product[];
  selectedRadioBtnId: number;
  public paymentList: Payment[];
  constructor( 
    public toastr: ToastsManager,
    private readonly router: Router,
    private readonly cartService: CartService,
    private sharedService: SharedService,
    private readonly wishListService: WishListService, 
    private readonly productService: ProductService,
    private cookieService: CookieService, 
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.GetProducts();
    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });
  }
  onListenerTirgger() {
    this.DummyCounter += 1;
  }

  AddToCompareList(id: number) {
    if (this.cartService.AddToCompareList(id)) {
      this.toastr.success('Item added to compare list', 'success');
    }
    else {
      this.toastr.error('Item already added to compare list', 'Error');
    }
  }

  //AddToWishList(id: number) {
  //  this.wishList.productID = id;
  //  this.wishList.customerID = Number(this.cookieService.get("CustomerID"));
  //  this.wishListService.addWishlist(this.wishList).subscribe(
  //    d => {
  //      if (d == 0) {
  //        this.toastr.info('Item already added to wish list', 'Information');
  //      }
  //      else {
  //        this.toastr.success('Item added to wish list', 'Success');
  //      }
  //    });

  //}

  //AddToCart(product: Product) {

  //  this.cartService.AddToCookieCart(product, null);
  //  this.loginService.IsUserLoggedIn().subscribe(x => {
  //    if (x) {
  //      this.cartService.AddToCart(product.productID, null).subscribe();
  //    }
  //  });
  //}

  AddToCart(Product: any) {
    this.cartService.AddToCookieCart(Product, null);
  }

  Buy(product: Product) {
    this.cartService.AddToCookieCart(product, null);
    this.router.navigate(["/cart"]);
  }

  //Buy(product: Product) { 
  //  this.cartService.AddToCookieCart(product, null);
  //  this.loginService.IsUserLoggedIn().subscribe(x => {
  //    if (x) {
  //      this.cartService.AddToCart(product.productID, null).subscribe(x => {
  //        this.router.navigate(["/cart"]);
  //      });
  //    }
  //    else {
  //      this.router.navigate(["/cart"]);
  //    }
  //  });
  //}

  GetProducts() {
    let customerId = 0;
    let vistorId = 0;
    // here we set CustomerProfilling
    var CustID = this.cookieService.get('CustomerID');
    if (CustID == null || CustID == "" || typeof CustID == "undefined") {
      CustID = "0";
    }
    else {
      CustID = this.cookieService.get('CustomerID');
    }
    this.productService.GetRecomandedProductList(Number(CustID), this.cookieService.get("visitorID"), 0, 15).subscribe(
      data => {
        this.products = data; 
      });
  }

  AddIntoWishList(id: number) {
    this.wishList.customerID = (this.cookieService.get("CustomerID") && this.cookieService.get("CustomerID") != "" && typeof this.cookieService.get("CustomerID") != "undefined") ? parseInt(this.cookieService.get("CustomerID")) : 0;// userdata.customerID;
    this.wishList.productID = id;

    this.wishListService.addWishlist(this.wishList).subscribe(
      d => {
        if (d == 0) {
          this.toastr.success('Item removed from wishlist', 'Success');
          var index = this.products.findIndex(x => x.productID == id);
          this.products[index].isFavourite = !this.products[index].isFavourite;
          this.wishlistcount = parseInt(this.cookieService.get('wishlistCounters')) - 1;
          this.cookieService.set('wishlistCounters', this.wishlistcount.toString());
        }
        else if (d == -1) {
          this.router.navigate(['/login'], { queryParams: { url: this.redirectUrl } });
          //this.modalRef = this.modalService.show(loginTemplate, this.config);
        }
        else {
          this.wishlistcount = parseInt(this.cookieService.get('wishlistCounters')) + 1;
          this.cookieService.set('wishlistCounters', this.wishlistcount.toString());
          this.toastr.success('Item added to wish list', 'Success');
          var index = this.products.findIndex(x => x.productID == id);
          this.products[index].isFavourite = !this.products[index].isFavourite;
        }

      });

  }
}



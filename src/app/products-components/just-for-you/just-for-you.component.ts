import { Component, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { Product } from '../../models/products/product.model';
import { ProductService } from '../../services/product/product.service';
import { LoginService } from '../../services/login/login.service';
import { CartService } from '../../services/cart/cart.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../../services/shared/shared.service';
import { WishListService } from '../../services/wishlist/wishList.service';
import { WishList } from '../../models/WishList/wishList-model';
@Component({
    selector: 'app-just-for-you',
    templateUrl: './just-for-you.component.html',
    styleUrls: ['./just-for-you.component.scss']
})
/** just-for-you component*/
export class JustForYouComponent {
  // for wishlist
  public pId: number = 0;
  public wishList: WishList = new WishList();
  public wishlistcount: number;
  redirectUrl: string = "";
  public deferLoadShow: boolean;
  //end
    /** just-for-you ctor */
  public DummyCounter: number = 0;
  products: Product[];
  prodImage = "";
  prodThumb = "";
  modalRef: BsModalRef;
  config = {
    animated: true
  };
  constructor(private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly loginService: LoginService,
    vcr: ViewContainerRef,
    private modalService: BsModalService,
    private readonly router: Router,
    private readonly toastr: ToastsManager,
    private cookieService: CookieService,
    private readonly sharedService: SharedService,
    private readonly wishListService: WishListService) {
    this.deferLoadShow = false;
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

  AddToWishList(id: number) {
    this.cartService.AddToWishlist(id).subscribe(
      d => {
        this.toastr.success('Item added to wish list', 'Success');
      });
  }

  AddToCart(product: Product) {
    this.cartService.AddToCookieCart(product, null);
  }

  Buy(product: Product) {
    this.cartService.AddToCookieCart(product, null);
    this.router.navigate(["/cart"]);
  }

  ProductDetail(url: string) {
    this.router.navigate(["/product/" + url]);
  }

  OpenModal(template: TemplateRef<any>, prodImage, prodThumb) {
    this.prodImage = prodImage;
    this.prodThumb = prodThumb;
    this.modalRef = this.modalService.show(template, this.config);
  }

  Decline() {
    this.prodImage = "";
    this.prodThumb = "";
    this.modalRef.hide();
  }
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
    this.productService.GetRecomandedProductList(Number(CustID),this.cookieService.get("visitorID"),0,15).subscribe(
      data => {
        this.products = data;
      });
  }
  chkJustForProduct(url: string) {
    this.router.navigate(["/product", url]);
    setTimeout(() => {
      this.sharedService.sameUrlProductFilter('');
    }, 1000);
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
          this.toastr.success('Item added to wishlist', 'Success');
          var index = this.products.findIndex(x => x.productID == id);
          this.products[index].isFavourite = !this.products[index].isFavourite;
        }

      });

  }
}

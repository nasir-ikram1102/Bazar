import { Component, ViewContainerRef, TemplateRef } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { Product } from '../../models/products/product.model';
import { ProductService } from '../../services/product/product.service';
import { Cart, CartCookieModel } from '../../models/cart/cart.model';
import { ProfileService } from '../../services/profile/profile.service';
import { SharedService } from '../../services/shared/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ApplicationSetting, SystemSetting } from '../../models/footer/footer-model';
import { FooterService } from '../../services/footer/footer.service';
import { SmsService } from '../../services/sms/sms.service';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
/** top-nav-bar component*/
export class TopNavBarComponent {
  /** top-nav-bar ctor */
  products: Product[];
  cartModel: Cart = new Cart();
  showToggle: boolean = false;
  WishlistCounter: number;
  public notificationCounter: number;
  public static compareCounters: number;
  public static wishlistCounters: number;
  public cartCounters: number;
  public showBell: boolean = false;
  public roleId: number;
  public userId: number;
  public phoneNo: string;
  public appleAppLink: string;
  public googleAppLink: string;
  public displayDropdown: boolean = false;
  public subTotal: number = 0;
  public cart: CartCookieModel[] = [];
  modalRef: BsModalRef;
  config = {
    animated: true
  };
  IsLogin: boolean = false;
  public myAngularxQrCode: string = null;
  public systemSetting = new SystemSetting();
  constructor(
    private _avRoute: ActivatedRoute,
    private readonly cartService: CartService,
    private modalService: BsModalService,
    private cookieService: CookieService,
    private readonly productService: ProductService,
    private readonly profileService: ProfileService,
    private readonly footerService: FooterService,
    private sharedSevice: SharedService,
    private readonly loginService: LoginService,
    private smsSevice: SmsService
  ) {
    this.onFilterClick();
    this.sharedSevice.listen().subscribe((m: any) => {
      this.onFilterClick();
    })
    this.sharedSevice.loginCredentialListner().subscribe((m: any) => {
      this.GetProfile();
    })

    this.GetCookieCartItems();

    this.GetProfile();
    this.getApplicationSettingFirstOrDefault();
    this.GetSystemSetting();
  }
  getApplicationSettingFirstOrDefault() {
    this.footerService.getApplicationSettingFirstOrDefault().subscribe(
      data => {
        if (data)
          if (data.appleAppLinkIsActive) {
            this.myAngularxQrCode = data.googleAppLink;
            this.appleAppLink = data.appleAppLink
            this.googleAppLink = data.appleAppLink
          }

      }
    )
  }
  onFilterClick() {
    var cart = localStorage.getItem('cart');
    if (cart != null && cart != "" && typeof cart != "undefined" && cart != "undefined") {
      this.cartCounters = JSON.parse(cart).length;
    }
    else {
      this.cartCounters = 0;
    }

    //Update items from cart, compare and wishlist




  }

  ShowCartBoxDetail() {
    this.GetCookieCartItems();
    this.displayDropdown = true;
  }


  GetCookieCartItems() {

    var cart = localStorage.getItem('cart');
    if (cart != null && cart != "" && typeof cart != "undefined" && cart != "undefined") {
      this.cart = JSON.parse(cart);

      this.subTotal = 0;
      this.cart.forEach(x => {
        if (x.salePrice < x.regularPrice && x.appliedDiscoutType > 0)
          this.subTotal += (x.salePrice * x.quantity);
        else
          this.subTotal += (x.regularPrice * x.quantity);
      });

      setTimeout(function () {
        this.subTotal = Math.round((this.subTotal) * 100) / 100;
      }, 500);
      console.log(this.subTotal);
      //;
    }
  }

  CalculateTotal() {

    let subTotal: number = 0;
    this.cart.forEach(x => {
      if (x.salePrice < x.regularPrice && x.appliedDiscoutType > 0)
        subTotal += (x.salePrice * x.quantity);
      else
        subTotal += (x.regularPrice * x.quantity);
    });

    return subTotal;
  }


  GetProfile() {
    this.profileService.getProfile().subscribe(
      data => {
        if (data) {
          this.userId = data.customerID;
          this.roleId = Number(data.customerTypeID)
          this.productService.GetCounters(data.customerID);
        }
        else {
          this.cookieService.set('wishlistCounters', (0).toString());
          this.cookieService.set('cartCounters', (0).toString());
          this.showBell = false;
        }
      });
  }

  focusout() {
    this.showToggle = false;
  }
  get compareCount() {
    if (typeof this.cookieService.get('productCounter') != 'undefined' && this.cookieService.get('productCounter') != null)
      return TopNavBarComponent.compareCounters = this.cookieService.get('productCounter').split(',').length - 1;

  }
  get wishlistCount() {
    if (typeof this.cookieService.get('wishlistCounters') == 'undefined' || this.cookieService.get('wishlistCounters') == null)
      this.cookieService.set('wishlistCounters', (0).toString());
    return TopNavBarComponent.wishlistCounters = parseInt(this.cookieService.get('wishlistCounters'));

  }
  openModal(loginTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(loginTemplate, this.config);
  }
  _keyPress(event: any) {
    if (event.charCode !== 0) {
      const pattern = /[0-9\+\-\ ]/;
      const inputChar = String.fromCharCode(event.charCode);

      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }

  }
  onFocus(event: any) {
    if (event.target.value == "") {
      this.phoneNo = '+92';
      event.target.value = this.phoneNo;
    }
    
  }
  focusOutFunction(event: any) {
    if (event.target.value == "+92") {
      this.phoneNo = "";
      event.target.value = this.phoneNo;
    }
  }
  GetSystemSetting() {
    this.footerService.getSystemSetting().subscribe(
      data => {
        if (data)
          this.systemSetting = data;
        document.getElementById("favId").setAttribute("href", data.siteFavIcon);
      }
    )
  }
} 

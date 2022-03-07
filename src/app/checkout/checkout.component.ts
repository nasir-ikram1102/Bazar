import { Component, ViewContainerRef, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CheckoutService } from '../services/checkout/checkout.service';
import { CartService } from '../services/cart/cart.service';
import { LoginService } from '../services/login/login.service';
import { LoginModel } from '../models/user/login-model';
import { Customer } from '../models/customer/customer-model';
import { ShippingMethods } from '../models/shippingMethods/shippingMethods.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared/shared.service';
import { CustomerService } from '../services/customer/customer.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs';
import { Cart, CartCookieModel, PaymentMethods } from '../models/cart/cart.model';
import { Product } from '../models/products/product.model';
import { PaymentMethodModel } from '../models/payment/paymentmethod.model';
import { TabsetComponent } from 'ngx-bootstrap';
import { AccountService } from '../services/account/account.service';
import * as CryptoJS from 'crypto-js';
import { EasyPaisaModel } from '../models/payment/payment.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
/** checkout component*/
export class CheckoutComponent implements AfterViewInit {
  /** checkout ctor */
  isProcessing: boolean = false;
  isLoggedIn: boolean = false;
  loginModel: LoginModel = new LoginModel();
  selectedPaymentMethod: PaymentMethodModel = new PaymentMethodModel();
  selectedShippingMethod: ShippingMethods = new ShippingMethods();
  stateId = "";
  countryId = "";
  cityId = "";
  shippingMethodID = "";
  countryName: string = null;
  stateName: string = null;
  isPasswordMatch = true;
  cityName: string = null;
  orderSummary: any = null;
  cartItems: CartCookieModel[] = [];
  customer: Customer = new Customer();
  paymentMethods: any;
  shippingMethods: ShippingMethods[];
  selectedItemId: number;
  products: Product[];
  cartModel: Cart = new Cart();
  isCouponApplied: boolean = false;
  subTotal: number = 0;
  couponAmount: number = 0;
  isCountryValidated: boolean = true;
  isStateValidated: boolean = true;
  isCityValidated: boolean = true;
  asyncSelected: string;
  orderId: number;
  sitePhone: string;
  public DummyCounter: number = 0;
  userModel = new Customer();
  couponCode: string;
  isUnique = true;
  isLoaderShow = false;
  isSubmitted = false;
  order: any = {};
  total: number = 0;
  isCheckoutSubmitted = false;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;


  @ViewChild('pp_Amount') pp_Amount: ElementRef;
  @ViewChild('pp_BankID') pp_BankID: ElementRef;
  @ViewChild('pp_BillReference') pp_BillReference: ElementRef;
  @ViewChild('pp_Description') pp_Description: ElementRef;
  @ViewChild('pp_Language') pp_Language: ElementRef;
  @ViewChild('pp_MerchantID') pp_MerchantID: ElementRef;
  @ViewChild('pp_Password') pp_Password: ElementRef;
  @ViewChild('pp_ProductID') pp_ProductID: ElementRef;
  @ViewChild('pp_ReturnURL') pp_ReturnURL: ElementRef;
  @ViewChild('pp_SubMerchantID') pp_SubMerchantID: ElementRef;
  @ViewChild('pp_TxnCurrency') pp_TxnCurrency: ElementRef;
  @ViewChild('pp_TxnExpiryDateTime') pp_TxnExpiryDateTime: ElementRef;
  @ViewChild('pp_TxnRefNo') pp_TxnRefNo: ElementRef;
  @ViewChild('pp_TxnType') pp_TxnType: ElementRef;
  @ViewChild('pp_Version') pp_Version: ElementRef;
  @ViewChild('pp_TxnDateTime') pp_TxnDateTime: ElementRef;
  @ViewChild('ppmpf_1') ppmpf_1: ElementRef;
  @ViewChild('ppmpf_2') ppmpf_2: ElementRef;
  @ViewChild('ppmpf_3') ppmpf_3: ElementRef;
  @ViewChild('ppmpf_4') ppmpf_4: ElementRef;
  @ViewChild('ppmpf_5') ppmpf_5: ElementRef;
  @ViewChild('salt') salt: ElementRef;
  @ViewChild('pp_SecureHash') pp_SecureHash: ElementRef;
  @ViewChild('hashValuesString') hashValuesString: ElementRef;
  @ViewChild('jsform') jsform: ElementRef;
  @ViewChild('easyPaisaForm') epform: ElementRef;



  constructor(private readonly loginService: LoginService,
    private readonly cartService: CartService,
    private readonly accountService: AccountService,
    private readonly checkoutService: CheckoutService,
    private cookieService: CookieService,
    public toastr: ToastsManager,
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private sharedService: SharedService,
    private vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);

    this.GetSiteContact();
    this.CheckIsLoggedIn();
    this.GetShippingMethods();
    this.GetPaymentMethods();

    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });

    window.scrollTo(0, 0);
  }
  onListenerTirgger() {
    this.DummyCounter += 1;
  }


  ngAfterViewInit() {

    var IntegritySalt = this.salt.nativeElement.innerText;
    var hashString = '';

    hashString += IntegritySalt + '&';

    var d = new Date();
    var currentTime = d.getFullYear() +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      ('0' + d.getDate()).slice(-2) +
      ('0' + d.getHours()).slice(-2) +
      ('0' + d.getMinutes()).slice(-2) +
      ('0' + d.getSeconds()).slice(-2);

    var expiryTime = d.getFullYear() +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      ('0' + d.getDate()).slice(-2) +
      ('0' + d.getHours()).slice(-2) +
      ('0' + d.getMinutes() + 2).slice(-2) +
      ('0' + d.getSeconds()).slice(-2);

    
    this.pp_TxnRefNo.nativeElement.value = "T" + currentTime;
    this.pp_TxnDateTime.nativeElement.value = currentTime;
    this.pp_TxnExpiryDateTime.nativeElement.value = expiryTime;

    if (this.pp_Amount.nativeElement.value != '') {
      hashString += this.pp_Amount.nativeElement.value + '&';
    }
    if (this.pp_BankID.nativeElement.value != '') {
      hashString += this.pp_BankID.nativeElement.value + '&';
    }
    if (this.pp_BillReference.nativeElement.value != '') {
      hashString += this.pp_BillReference.nativeElement.value + '&';
    }
    if (this.pp_Description.nativeElement.value != '') {
      hashString += this.pp_Description.nativeElement.value + '&';
    }
    if (this.pp_Language.nativeElement.value != '') {
      hashString += this.pp_Language.nativeElement.value + '&';
    }
    if (this.pp_MerchantID.nativeElement.value != '') {
      hashString += this.pp_MerchantID.nativeElement.value + '&';
    }
    if (this.pp_Password.nativeElement.value != '') {
      hashString += this.pp_Password.nativeElement.value + '&';
    }
    if (this.pp_ProductID.nativeElement.value != '') {
      hashString += this.pp_ProductID.nativeElement.value + '&';
    }
    if (this.pp_ReturnURL.nativeElement.value != '') {
      hashString += this.pp_ReturnURL.nativeElement.value + '&';
    }
    if (this.pp_SubMerchantID.nativeElement.value != '') {
      hashString += this.pp_SubMerchantID.nativeElement.value + '&';
    }
    if (this.pp_TxnCurrency.nativeElement.value != '') {
      hashString += this.pp_TxnCurrency.nativeElement.value + '&';
    }
    if (this.pp_TxnDateTime.nativeElement.value != '') {
      hashString += this.pp_TxnDateTime.nativeElement.value + '&';
    }
    if (this.pp_TxnExpiryDateTime.nativeElement.value != '') {
      hashString += this.pp_TxnExpiryDateTime.nativeElement.value + '&';
    }
    if (this.pp_TxnRefNo.nativeElement.value != '') {
      hashString += this.pp_TxnRefNo.nativeElement.value + '&';
    }
    if (this.pp_TxnType.nativeElement.value != '') {
      hashString += this.pp_TxnType.nativeElement.value + '&';
    }
    if (this.pp_Version.nativeElement.value != '') {
      hashString += this.pp_Version.nativeElement.value + '&';
    }
    if (this.ppmpf_1.nativeElement.value != '') {
      hashString += this.ppmpf_1.nativeElement.value + '&';
    }
    if (this.ppmpf_2.nativeElement.value != '') {
      hashString += this.ppmpf_2.nativeElement.value + '&';
    }
    if (this.ppmpf_3.nativeElement.value != '') {
      hashString += this.ppmpf_3.nativeElement.value + '&';
    }
    if (this.ppmpf_4.nativeElement.value != '') {
      hashString += this.ppmpf_4.nativeElement.value + '&';
    }
    if (this.ppmpf_5.nativeElement.value != '') {
      hashString += this.ppmpf_5.nativeElement.value + '&';
    }

    hashString = hashString.slice(0, -1);
    this.pp_SecureHash.nativeElement.value = CryptoJS.HmacSHA256(hashString, IntegritySalt) + '';
    this.hashValuesString.nativeElement.value = hashString;
  }

  jazzCashSubmit() {

    this.ngAfterViewInit();
    //this.pp_SecureHash.nativeElement.value = CryptoJS.HmacSHA256(this.hashValuesString.nativeElement.value, this.salt.nativeElement.innerText) + '';
    this.jsform.nativeElement.submit();
  }

  IsUniqueEmail() {
    this.customerService.isUniqueEmail(this.userModel.email, this.userModel.customerID).subscribe(
      data => {
        if (data) {
          this.isUnique = true;
        }
        else {
          this.isUnique = false;
        }
      });
  }

  Register() {
    this.isSubmitted = true;
    this.accountService.registerCustomer(this.userModel).subscribe(
      data => {
        if (data) {
          this.loginModel.email = this.userModel.email;
          this.loginModel.password = this.userModel.password;
          this.Login();
        }
        else {
          this.toastr.error('Error occurred. Please try again', 'Success');
          this.isSubmitted = false;
        }
      });
  }


  KeyPressEvenet() {
    this.isUnique = true;
  }


  GetSiteContact() {
    this.checkoutService.GetSiteContact().subscribe(data => {
      this.sitePhone = data.phone;
    });
  }

  GetShippingMethod() {
    this.checkoutService.GetShippingMethod().subscribe(data => {
      if (data.status == 200) {
        //this.shippingMethodID = data.data.shippingMethodID;
      }
    });
  }

  Login() {
    this.isLoaderShow = true;
    this.loginService.authenticateLogin(this.loginModel).subscribe(data => {
      if (data.status == 200) {
        this.cookieService.set('Login', data.data.token);
        this.cookieService.set('CustomerID', data.data.customerID);
        this.cookieService.set('CustomerEmail', data.data.email);
        this.cookieService.set('CustomerName', data.data.name);
        this.cookieService.set('CustomerTypeId', data.data.customerType);
        this.toastr.success('Login successfully', 'Success');
        this.isLoggedIn = true;

        this.UpdateBulkCart();
      }
      else {
        this.isLoggedIn = false;
        this.toastr.error('Invalid email or password', 'Error');
      }

      this.disableTabs();
    });
  }

  UpdateBulkCart() {

    let scope = this;
    this.cartService.UpdateBulkCart(function () {

      let ct: string = localStorage.getItem('cart');
      if (ct != null && ct != "" && typeof ct != "undefined") {
        let model: CartCookieModel[] = JSON.parse(ct);
        if (model.length <= 0) {

          setTimeout(function () {
            scope.toastr.info('There are no items in your cart', 'Info');
            scope.router.navigate(['/']);
          }, 2000);
          return;
        }
      }

      scope.GetCart();
    });
  }





  CheckIsLoggedIn() {
    this.isLoaderShow = true;
    this.loginService.IsUserLoggedIn().subscribe(data => {
      if (data) {
        this.isLoggedIn = true;
        this.UpdateBulkCart();
      }
      else {
        this.isLoggedIn = false;
      }
      this.disableTabs();
    });
  }

  LoginNotification() {
    this.toastr.warning('Please login to continue');
  }

  GetCustomer() {
    this.customerService.getCustomerByToken().subscribe(data => {
      if (data != null)
        this.customer = data;
    });
  }

  UpdateCartCustomer() {
    this.checkoutService.UpdateCartCustomer().subscribe(data => {
      this.GetCustomer();
    });
  }

  GetCart() {

    var c = localStorage.getItem('cart');
    if (c != null && c != "" && typeof c != "undefined" && c != "undefined") {
      this.cartItems = JSON.parse(c);
      this.cartItems.forEach(x => x.isQuantityExist = true);
    }

      this.cartService.GetCartWithAppliedCoupon().subscribe(
        d => {
          this.order = d;



          this.order.cartItems.forEach(x => {
            let product = this.cartItems.filter(y => y.productID == x.productID)[0];

            if (typeof product != "undefined") {
              product.couponCode = x.couponCode;
              product.couponID = x.couponID;
              product.couponType = x.couponType;
              product.isCouponApplied = x.isCouponApplied;
              product.sku = x.sku;
              product.productVarients = x.productVarients;
            }
          });






          this.products = d.cartItems;
          this.CalculateTotalUnitPrice(this.cartItems);
          var item = this.order.cartItems[0];
          this.couponAmount = 0;

          this.subTotal = (this.cartItems.map(c => c.totalUnitPrice)
            .reduce((a, b) => a + b));

          if (this.cartItems.filter(x => x.isCouponApplied).length > 0) {
            if (this.cartItems.filter(x => x.isCouponApplied).length == this.order.cartItems.length) {
              if (item.couponType == "percent")
                this.couponAmount = this.subTotal * (item.couponAmount / 100);
              else
                this.couponAmount = item.couponAmount;

              this.total = this.subTotal - this.couponAmount;
              if (this.total < 0) {
                this.total = 0;
                this.couponAmount = this.subTotal;
              }
            }
            else {
              var total = (this.cartItems.filter(x => x.isCouponApplied)
                .map(c => c.totalUnitPrice)
                .reduce((a, b) => a + b));

              if (item.couponType == "percent")
                this.couponAmount = total * (item.couponAmount / 100);
              else
                this.couponAmount = item.couponAmount;

              this.total = (total - this.couponAmount);
              if (this.total < 0) {
                this.total = 0;
                this.couponAmount = total;
              }

              this.total += this.cartItems.filter(x => !x.isCouponApplied)
                .map(c => c.totalUnitPrice)
                .reduce((a, b) => a + b);
            }
          }
          else {
            this.total = this.subTotal;
            this.couponAmount = 0;
          }

          if (this.products != null && this.products.length > 0) {
            this.GetShippingAddress();
            this.CalculateOrder();
            this.GetShippingMethod();
            this.sharedService.loginCredentialFilter('');
        }
      });
  }

  CalculateTotalUnitPrice(cart: CartCookieModel[]) {
    cart.forEach(x => {
      x.totalUnitPrice = (x.appliedDiscoutType > 0 && x.salePrice < x.regularPrice) ? (x.quantity * x.salePrice) : (x.quantity * x.regularPrice);
    });

   // this.CalculateTotalPrice();
  }

  CalculateTotalPrice() {
    var subTotal = 0;
    
    this.cartItems.forEach(x => {
      subTotal += (x.isCouponApplied) ? (x.totalUnitPrice - x.couponAmount) : (x.totalUnitPrice);
      x.isQuantityExist = true;
    });
    this.subTotal = (subTotal < 0) ? 0 : subTotal;
    //if (this.order.couponType == "percent" && this.order.couponAmount > 0) {
    //  this.order.couponAmount = (this.order.couponAmount / 100) * this.subTotal;
    //}
  }

  AddPaymentMethod() {
    this.checkoutService.AddPaymentMethod(this.selectedPaymentMethod).subscribe(data => {
      if (data.status == 200) {
        this.enableTabs();
        this.staticTabs.tabs[3].active = true;
        this.disableAllTabs();
        this.orderSummary = data.data;
        window.scrollTo(0, 0);
      }
      else {
        this.toastr.error(data.message, 'Error');
      }
    });
  }

  AddShippingMethod(method) {
    this.shippingMethodID = method.shippingMethodID;
    this.checkoutService.AddShippingMethod(method).subscribe();
  }

  GetShippingAddress() {
    this.checkoutService.GetShippingAddress().subscribe(data => {
    });
  }

  GetShippingMethods() {
    this.checkoutService.GetShippingMethods().subscribe(data => {
      this.shippingMethods = data;
      if (this.shippingMethods != null && this.shippingMethods.length > 0)
        this.selectedShippingMethod = this.shippingMethods[0];
    });
  }

  AddShippingAddress() {

    if (this.shippingMethodID == null || this.shippingMethodID == "" || typeof this.shippingMethodID == "undefined") {
      this.toastr.error("Please select a shipping method", "Error");
      return;
    }

    this.checkoutService.AddShippingAddress({}).subscribe(
      data => {
        if (data.status == 200) {

          this.selectedItemId = data.data;
          this.selectedPaymentMethod = this.paymentMethods.filter(x => x.paymentID == this.selectedItemId)[0];
          this.GetCustomer();
          this.enableTabs();
          this.staticTabs.tabs[2].active = true;
          this.disableAllTabs();
          window.scrollTo(0, 0);
        }
        else {
          this.toastr.error(data.message, "Error");
        }
      });
  }

  GetPaymentMethods() {
    this.checkoutService.GetPaymentMethods().subscribe(
      data => {
        this.paymentMethods = data;
        if (this.paymentMethods != null && this.paymentMethods.length > 0) {
          this.selectedItemId = this.paymentMethods[0].paymentID;
          this.selectedPaymentMethod = this.paymentMethods[0];
        }
      });
  }

  GetAppliedCoupon() {
    this.cartService.GetAppliedCoupon().subscribe(data => {
      if (data.status == 200 && data.data != null) {
        this.isCouponApplied = true;
        this.couponAmount = data.data.couponAmount;
      }
      else {
        this.isCouponApplied = false;
        this.couponAmount = 0;
      }
    });
  }

  ApplyCouponCode() {
    this.cartService.ApplyCouponCode(this.couponCode).subscribe(
      d => {
        if (d.status == 200)
          this.toastr.success(d.message, 'Success');
        else
          this.toastr.error(d.message, 'Error');
        
        this.GetCart();
      })
  }

  CalculateOrder() {
    this.checkoutService.CalculateOrder().subscribe(data => {
    });
  }

  ProcessOrder() {
    if (!this.isCheckoutSubmitted) {
      this.isCheckoutSubmitted = true;
      this.ProcessFinalOrder();
    }
  }

  EasyPaisaSubmit(){

    let model: EasyPaisaModel = new EasyPaisaModel();
    model.amount = (this.total + this.orderSummary.order.shippingTotal).toString();
    //model.emailAddr = "3344adan@gmail.com";
    //model.expiryDate = "20190606 211521";
    //model.mobileNum = "03246428468";
    model.orderRefNum = "2100";

    this.checkoutService.GetEasyPayResponse(model).subscribe(
      data => {
        if (data != null && data != "") {
          window.location.href = data._body;
        }
        else {
          this.toastr.error(data.response.message, "Error");
        }
      });
//    this.epform.nativeElement.submit();
  }

  ProcessFinalOrder() {
    this.isProcessing = true;
    this.checkoutService.ProcessOrder().subscribe(
      data => {
        if (data.response.status == 200) { 

          if (this.selectedPaymentMethod.paymentID == PaymentMethods.JazzCash) {
            this.jazzCashSubmit();
          }
          else if (this.selectedPaymentMethod.paymentID == PaymentMethods.EasyPaisa) {
            this.EasyPaisaSubmit();
          }
          else if (this.selectedPaymentMethod.paymentID == PaymentMethods.CashOnDelivery) {

            this.orderId = data.response.data;

            window.scrollTo(0, 0);
            this.toastr.success('Order processes successfully', "Success");
            this.isProcessing = false;

            this.enableTabs();
            this.staticTabs.tabs[4].active = true;
            this.disableAllTabs();
          }
        }
        else if (data.response.status == 100 && data.response.data != null && data.response.data != "" && data.response.data.length > 0) {
          data.response.data.forEach((item, index) => {
            let currentProduct: CartCookieModel = this.cartItems.filter(x => x.productID == item.productID)[0];
              if (currentProduct != null && typeof currentProduct != "undefined")
                currentProduct.isQuantityExist = item.isQuantityExist;
            });

          var isNotExists = data.response.data.filter(x => x.isQuantityExist == false);
            if (isNotExists.length <= 0) {
              this.router.navigate(["/checkout"]);
          }
          this.isProcessing = false;
        }
        else {
          this.toastr.error(data.response.message, "Error");
          this.isProcessing = false;
        }
        this.isCheckoutSubmitted = false;
      });
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    
  }

  ActivePaymentType(payment) {
    this.selectedItemId = payment.paymentID;
    this.selectedPaymentMethod = payment;
  }

  OpenCart() {
    this.router.navigate(['/cart']);
  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
    window.scrollTo(0, 0);
  }

  enableTabs() {
    this.staticTabs.tabs.forEach((x, i) => {
      x.disabled = false;
    });
  }
  disableAllTabs() {
    var scope = this;
    setTimeout(function () {
      scope.staticTabs.tabs.forEach((x, i) => {
        if (i == 0)
          x.disabled = false;
        else
          x.disabled = true;
      });
    }, 2000);
  }

  disableTabs() {
    var scope = this;
    setTimeout(function () {
      scope.selectTab(1);
      scope.staticTabs.tabs.forEach((x, i) => {
        if (i == 0)
          x.disabled = false;
        else
          x.disabled = true;
      });
      scope.isLoaderShow = false;
    }, 2000);
  }

  StepBack(index) {
    this.enableTabs();
    this.staticTabs.tabs[index].active = true;
    this.disableAllTabs();
    window.scrollTo(0, 0);
  }

  checkPasswords() {
    if (this.userModel.confirmPassword != this.userModel.password)
      this.isPasswordMatch = false;
    else
      this.isPasswordMatch = true;
  }

  GetTotal() {


    return this.total + this.orderSummary.order.shippingTotal;

    //if (this.subTotal - this.order.couponAmount < 0)
    //  return (0 + this.orderSummary.order.shippingTotal);
    //else
    //  return (this.subTotal + this.orderSummary.order.shippingTotal - this.order.couponAmount);
  }
}

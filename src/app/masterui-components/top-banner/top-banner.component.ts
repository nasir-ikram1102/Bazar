import { Component, OnInit  } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../services/app/app.service';
import { ProductService } from '../../services/product/product.service';
import { SharedService } from '../../services/shared/shared.service';
import { FooterService } from '../../services/footer/footer.service';
import { SystemSetting } from '../../models/system-setting/system-setting.model';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss']
})
/** top-banner component*/
export class TopBannerComponent implements OnInit {
  /** top-banner ctor */
  isCustomer: boolean = false;
  isSellWith: boolean = false;
  isShop: boolean = false;
  isLoggedIn: boolean = false;
  customerId: any;
  symbol: string = "";
public systemSetting = new SystemSetting();
  constructor(private readonly appService: AppService, private cookieService: CookieService,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly sharedService: SharedService,
    private readonly footerService: FooterService, private titleService: Title
  ) {
    this.CurrencyConversion(); 
    this.sharedService.loginCredentialListner().subscribe((m: any) => {
      this.CheckLogin();
    })
    this.GetSystemSetting();
    this.CheckLogin();
    
    try {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      window.scrollTo(0, 0);
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }


  CheckLogin() {

    this.appService.CheckLogin(this.cookieService.get('Login')).subscribe(
      data => {
        this.isLoggedIn = data;

        this.customerId = Number(this.cookieService.get('CustomerTypeId'));
        if (this.cookieService.get('CustomerTypeId') == '1' || this.cookieService.get('CustomerTypeId') == '2') {
          this.isSellWith = true;
        }
        else {
          this.isSellWith = false;
        }
      });
  }

  ngOnInit() { }

  Logout() {
    this.appService.Logout(this.cookieService.get('Login')).subscribe(
      data => {
        if (data) {
          this.cookieService.delete('Login');
          this.cookieService.delete('CustomerID');
          this.cookieService.delete('CustomerEmail');
          this.cookieService.delete('CustomerName');
          this.cookieService.delete('CustomerTypeId');
          this.cookieService.set('wishlistCounter', '0');
          localStorage.setItem('cart', JSON.stringify([]));
          this.sharedService.filter('Register click');
         // this.router.navigate(["login"]);
          document.location.href = '/login';

          
        }
      });
  } 

  CheckCustomerType() {
    var customerId = Number(this.cookieService.get('CustomerID'));
    if (customerId == 1)
      this.isCustomer == false;
    if (customerId == 2)
      this.isCustomer == true;
     
  }

  CurrencyConversion() {
    this.productService.GetCurrencyList().subscribe(
      data => {
        if (data) {

        }
      });
  }

  CurrencyChange(value: string) {
    this.symbol = value.split('/')[0];
    this.cookieService.set('Currency', value.toString());
    //called the filter method to change currency global value so that all listener can detect this change
    this.sharedService.setCurrencyChangeMessage("DummyText");
  }

  GetSystemSetting() {
    this.footerService.getSystemSetting().subscribe(
      data => {
        if (data)
          this.systemSetting = data;
          this.titleService.setTitle(this.systemSetting.siteName);
      }
    )
  }
}

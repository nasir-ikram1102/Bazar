import { Component, ViewContainerRef, TemplateRef } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { CartService } from '../../services/cart/cart.service';
import { SharedService } from '../../services/shared/shared.service';
import { LoginModel, SocialMediaModel } from '../../models/user/login-model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router, Params, ActivatedRoute } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, LinkedinLoginProvider } from 'angular-6-social-login';
import { User } from '../../models/user/user-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
/** login component*/
export class LoginComponent {
  /** login ctor */
  modalRef: BsModalRef;
  isSubmitted = false;
  config = {
    animated: true
  };
  public emailForgotPassword: any;
  loginModel: LoginModel = new LoginModel();
  socialModel: SocialMediaModel = new SocialMediaModel();
  constructor(private readonly loginService: LoginService,
    public toastr: ToastsManager,
    private readonly router: Router,
    private cookieService: CookieService,
    vcr: ViewContainerRef,
    private modalService: BsModalService,
    private sharedService: SharedService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private socialAuthService: AuthService
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  OpenForgotPaswordModal(ratingTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(ratingTemplate, this.config);


  }
  ngSubmit() {
    this.loginService.authenticateLogin(this.loginModel).subscribe(
      data => {
        if (data.status == 200) {
          //this.cookieService.set('Login', data.data);
          this.cookieService.set('Login', data.data.token);
          this.cookieService.set('CustomerID', data.data.customerID);
          this.cookieService.set('CustomerEmail', data.data.email);
          this.cookieService.set('CustomerName', data.data.name);
          this.cookieService.set('CustomerTypeId', data.data.customerType);

          this.cartService.UpdateBulkCart();
          this.toastr.success('Login successfully.', 'Success');
          this.sharedService.loginCredentialFilter("");

          setTimeout(() => {
            this.activatedRoute.queryParams.subscribe(params => {
              let url = params['url'];
              console.log(url);

              if (url != "" && typeof url != "undefined" && url != null)
                this.router.navigate([url]);

              else if (data.data.customerType == 1)
                this.router.navigate(["vendor"]);

              else if (data.data.customerType == 2)
                this.router.navigate(["/customer"]);
            });
          }, 2000);
        }
        else if ((data.status == 400)) { this.toastr.error(data.message, 'Error'); }
        else {
          this.toastr.error(data.message, 'Error');
        }
      });
  }
  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "linkedin") {
      socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + " sign in data : ", userData);
        if (userData) {
          this.socialModel.email = userData.email;
          this.socialModel.provider = userData.provider;
          this.socialModel.image = userData.image;
          this.socialModel.token = userData.token;
          this.socialModel.socialId = userData.id;
          this.socialModel.firstName = userData.name.split(" ")[0];
          if ([this.socialModel.firstName[1]] != null) {
            this.socialModel.lastName = userData.name.split(" ")[1];
          }
          this.loginService.authenticateSocialMedia(this.socialModel).subscribe(
            data => {
              if (data.status == 200) {
                //this.cookieService.set('Login', data.data);
                this.cookieService.set('Login', data.data.token);
                this.cookieService.set('CustomerID', data.data.customerID);
                this.cookieService.set('CustomerEmail', data.data.email);
                this.cookieService.set('CustomerName', data.data.name);
                this.cookieService.set('CustomerTypeId', data.data.customerType);

                this.cartService.UpdateBulkCart();
                this.toastr.success('Login successfully.', 'Success');
                this.sharedService.loginCredentialFilter("");

                setTimeout(() => {
                  this.router.navigate(["/"]);
                }, 2000);
              }
              else {
                this.toastr.error(data.message, 'Error');
              }
            });

        }
      }
    ).catch(ex => {
      console.log(ex);
    });
  }
}

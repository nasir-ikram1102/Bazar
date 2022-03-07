import { Component, ViewChild, ElementRef, ViewContainerRef, TemplateRef } from '@angular/core';
import { Customer } from './../models/customer/customer-model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProfileService } from './../services/profile/profile.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SubscriberService } from './../services/subscribe/subscriber.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ChangePasssword } from './../models/customer/customer-changepassword-model';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'dashboard-customer',
  templateUrl: './dashboard-customer.component.html',
  styleUrls: ['./dashboard-customer.component.scss']
})

export class DashBoardComponent {
  @ViewChild('newPassword') newPasswordElement: ElementRef;
  returnDataGetSubscriber: Response;
  modalRef: BsModalRef;
  isSubmitted = false;
  config = {
    animated: true
  };
  subscriberStatus: any;
  subscriberMsg: any;
  shippingAdressModel: any;
  customerModel = new Customer();
  changePasswordModel = new ChangePasssword();
  constructor(private readonly toastr: ToastsManager,
    private readonly router: Router, vcr: ViewContainerRef,
    private readonly profileService: ProfileService,
    private cookieService: CookieService,
    private readonly subscriberService: SubscriberService,
    private modalService: BsModalService) { 
    this.GetSubscriberByEmail();
    this.GetProfile();    
  }

  GetProfile() {
    this.profileService.getProfile().subscribe(
      data => {
        if (data) {
          this.customerModel = data; 
        }
      }
    )
  }

  GetSubscriberByEmail() {
    this.subscriberService.GetSubscriberByEmail().subscribe(
      data => {
        if (data != null) {
          this.subscriberStatus = data.status;
          this.subscriberMsg = data.message;
        }
      });
  }

  SubscribeNewsLetter() { 
    this.subscriberService.AddSubscriber(this.customerModel.email).subscribe(
      result => { 
        if (result != null) {
          if (result.status == 0) { 
            this.toastr.error(result.message, 'Error');
          }
          else { 
            this.toastr.success(result.message, 'Success');
            setTimeout(() => {
              this.GetSubscriberByEmail(); 
            }, 500);
          }
        }
        else {
          this.toastr.error('Error occurred. Please try again', 'Error');
          this.isSubmitted = false;
        }

      });
  }

  OpenChangePasswordModel(ratingTemplate: TemplateRef<any>) {
    this.changePasswordModel = new ChangePasssword();
    this.modalRef = this.modalService.show(ratingTemplate, this.config);
  }

  changePassword() {
    this.isSubmitted = true;
    this.changePasswordModel.CustomerId = Number(this.cookieService.get('CustomerID'));
    if (this.changePasswordModel.newPassword != this.changePasswordModel.confirmPassword) {
      this.toastr.error('Password Mis Match', 'Error');
      this.changePasswordModel.newPassword = "";
      this.changePasswordModel.confirmPassword = "";
      this.isSubmitted = false;
    }

    else {
      this.profileService.changePassword(this.changePasswordModel).subscribe(result => {
        if (result != null) {
          if (result.status == 0) {
            this.toastr.error(result.message, 'Error');
          }
          else {
            this.toastr.success(result.message, 'Success');
            setTimeout(() => {
              this.modalRef.hide();
            }, 500);
          }
        }
        else {
          this.toastr.error('Error occurred. Please try again', 'Error');
          this.isSubmitted = false;
        }
      });

    }
  }

  ngSubmit() {
    this.isSubmitted = true;
    this.profileService.updateProfile(this.customerModel).subscribe(result => {
      if (result) {

        this.toastr.success('Profile updated successfully.', 'Success');
        setTimeout(() => {
          this.router.navigate(["/customer"]);
        }, 2000);
      }
      else {
        this.toastr.error('Error occurred. Please try again', 'Error');
        this.isSubmitted = false;
      }
    });
  }

  OpenShippingAddressModel(shipp : any) { }
}
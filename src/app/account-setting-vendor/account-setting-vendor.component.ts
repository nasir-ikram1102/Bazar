import { Component, ViewContainerRef, TemplateRef } from '@angular/core';
import { AccountService } from './../services/account/account.service';
import { Customer } from './../models/customer/customer-model';
import { Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ProfileService } from './../services/profile/profile.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserService } from './../services/user/user.service'; 
import { ChangePasssword } from './../models/customer/customer-changepassword-model';
import { CustomerService } from './../services/customer/customer.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'account-setting-vendor',
  templateUrl: './account-setting-vendor.component.html',
  styleUrls: ['./account-setting-vendor.component.scss']
})

/** register-vendor component*/
export class AccountSettingVendorComponent {
  /** register-vendor ctor */
  profileImage = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
  coverImage = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
  isDefaultImg = true;
  isDefaultCoverImg = true;
  imageChangedEvent: any = '';
  imageCoverChangedEvent: any = '';
  croppedImage: any = '';
  croppedCoverImage: any = '';
  cropperReady = false;
  CovercropperReady = false;

  showHideShipingDiv: boolean=true;
  customerModel = new Customer(); 
  changePasswordModel = new ChangePasssword();
  isSubmitted = true;
  isUnique = true;
  isUniqueShopName = true;
  isPasswordMatch = true;
  
  modalRef: BsModalRef;
  config = {
    animated: true
  };

  constructor(private readonly accountService: AccountService,
    public toastr: ToastsManager,
    private readonly router: Router,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    private modalService: BsModalService,
    private cookieService: CookieService,
    private readonly customerService: CustomerService,
    vcr: ViewContainerRef) {
   
    this.toastr.setRootViewContainerRef(vcr);
    this.croppedImage = "";
    this.profileImage = "";
    this.customerModel.mainCountryID = "";
    this.customerModel.mailingCountryID = "";
    this.customerModel.mainStateID = "";
    this.customerModel.mailingStateID = "";
    this.customerModel.mainCityId = "";
    this.customerModel.mailingCityId = "";
    this.GetProfile();
  }

  confirm(): void {
    this.profileImage = this.croppedImage; 
    this.modalRef.hide();
  }

  

  decline(): void { 
    if (this.profileImage != this.croppedImage && this.isDefaultImg) {
      this.imageChangedEvent = "";
      this.croppedImage = "";
    }
    this.modalRef.hide();
  }

  onTextChange(Value: string) {
    var i = 0, strLength = Value.length;
    for (i; i < strLength; i++) {
      Value = Value.replace(" ", "-");
      Value = Value.replace("&", "-");
      Value = Value.replace("&&", "-");
      Value = Value.replace("%", "-");
      Value = Value.replace("@", "-");
      Value = Value.replace("=", "-");
    }
    this.customerModel.shopeName = Value.toLowerCase();
  }
  declineCoverImage(): void {
    if (this.coverImage != this.croppedCoverImage && this.isDefaultCoverImg) {
      this.imageCoverChangedEvent = "";
      this.croppedCoverImage = "";
    }
    this.modalRef.hide();
  }
  CoverImageCroppedBase64(image: string) {
    this.croppedCoverImage = image;
  }

  fileChangeEventCoverImage(event: any): void {
    this.imageCoverChangedEvent = event;
  }

  DefaultCoverImg() {
    this.coverImage = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
    this.isDefaultCoverImg = true;
  }

  CoverImageLoaded() {
    this.CovercropperReady = true;
    this.croppedImage = this.profileImage;
  }
  confirmCoverImage(): void {
    this.coverImage = this.croppedCoverImage;
    this.modalRef.hide();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCroppedBase64(image: string) {
    this.croppedImage = image;
  }
  
  imageLoaded() {
    this.cropperReady = true; 
    this.croppedCoverImage = this.coverImage; 
  }
   

  imageLoadFailed() {
    console.log('Load failed');
  }
  DefaultImg() {
    this.profileImage = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
    this.isDefaultImg = true;
  }

  GetProfile() {
    this.profileService.getProfile().subscribe(
      data => {
        if (data) {
          this.customerModel = data; 
          this.profileImage = this.customerModel.profileImagePath;
          this.coverImage = this.customerModel.coverImagePath;
        }
      }
    )
  }

  IsUniqueEmail() {
    this.customerService.isUniqueEmail(this.customerModel.email, this.customerModel.customerID).subscribe(
      data => {
        if (data) {
          this.isUnique = true;
        }
        else {
          this.isUnique = false;
        }
      });
  }

  IsUniqueShopName() {
    this.customerService.isUniqueShopName(this.customerModel.shopeName, this.customerModel.customerID).subscribe(
      data => {
        if (data) {
          this.isUniqueShopName = true;
        }
        else {
          this.isUniqueShopName = false;
        }
      });
  }


  KeyPressEvenetEmail() {
    this.isUnique = true;
  }

  KeyPressEvenetShopName() {
    this.isUniqueShopName = true;
  }

  openModal(template: TemplateRef<any>) {
    //this.modalRef = this.modalService.show(template, this.config);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'modal-lg' })
    );
  }


  openCoverImageModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }
  ngSubmit() {
    if (this.isSubmitted) {
      this.isSubmitted = false;  
      if (this.showHideShipingDiv == true) {
        this.customerModel.mailingCountryID = this.customerModel.mainCountryID;
        this.customerModel.mailingStateID = this.customerModel.mainStateID;
        this.customerModel.mailingCityId = this.customerModel.mainCityId;
        this.customerModel.mailingZipCode = this.customerModel.mainZipCode;
        this.customerModel.mailingAddress = this.customerModel.mainAddress;
      }
      if (this.customerModel.mailingZipCode == "" || this.customerModel.mailingZipCode == null || typeof this.customerModel.mailingZipCode == 'undefined') this.customerModel.mailingZipCode = "";
      if (this.customerModel.mainZipCode == "" || this.customerModel.mainZipCode == null || typeof this.customerModel.mainZipCode == 'undefined') this.customerModel.mainZipCode = "";
      this.customerModel.profileImagePath = this.croppedImage;
      this.customerModel.coverImagePath = this.croppedCoverImage;

      this.profileService.updateProfile(this.customerModel).subscribe(result => {
        if (result) {
          this.toastr.success('Profile updated successfully.', 'Success');
          this.isSubmitted = true;
        }
        else {
          this.toastr.error('Error occurred. Please try again', 'Error');
          this.isSubmitted = true;
        }
      });
    }

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
}





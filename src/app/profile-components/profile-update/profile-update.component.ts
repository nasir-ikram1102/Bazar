import { Component, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Customer } from '../../models/customer/customer-model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';
import { CustomerService } from '../../services/customer/customer.service';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
/** user-edit component*/
export class ProfileUpdateComponent { 
  customerModel = new Customer();
  userID: string;
  isUnique = true;
  errorMessage: any; 
  isSubmitted = false;
  maxDate: Date;

  profileImage = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
  isDefaultImg = true;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperReady = false;

  modalRef: BsModalRef;
  config = {
    animated: true
  };

  /** user-edit ctor */
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly profileService: ProfileService,
    private readonly customerService: CustomerService,
    private readonly toastr: ToastsManager,
    private readonly router: Router, vcr: ViewContainerRef,
    private modalService: BsModalService)
  {
    this.toastr.setRootViewContainerRef(vcr);
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.GetProfile();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userID = params['id'];
    });
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCroppedBase64(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
    this.cropperReady = true;
    this.croppedImage = this.profileImage;
    //}
  }
  imageLoadFailed() {
    console.log('Load failed');
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }
  GetProfile() { 
    this.profileService.getProfile().subscribe(
      data => {
        if (data) { 
          this.customerModel = data;
          this.profileImage = this.customerModel.profileImagePath; 
          this.customerModel.birthDate = new Date(this.customerModel.birthDate); 
          this.isDefaultImg = false;
        }
      }
    )
  }

  KeyPressEvenet() { }  

  IsUniqueEmail() {
    this.customerService.isUpdatedEmailUnique(this.customerModel.email, this.customerModel.customerID).subscribe(
      data => {
        if (data) {
          this.isUnique = true;
        }
        else {
          this.isUnique = false;
        }
      });
  }
  DefaultImg() {
    this.profileImage = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
    this.isDefaultImg = true;
  }

  ngSubmit() {  
    this.customerModel.profileImagePath =
      //(this.croppedImage && this.croppedImage.indexOf(',') > -1) ? this.croppedImage.split(',')[1] :
      this.croppedImage;
    this.isSubmitted = true;
    this.profileService.updateProfile(this.customerModel).subscribe(result => {
      if (result) { 
        this.toastr.success('Profile updated successfully.', 'Success');  
      }
      else {
        this.toastr.error('Error occurred. Please try again', 'Error');
        this.isSubmitted = false;
      }
    });
  }

  selectBirthDate(e) {
    this.customerModel.birthDate = e;
  }

}





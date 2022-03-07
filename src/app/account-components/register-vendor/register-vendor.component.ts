import { Component, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../services/account/account.service';
import { Customer } from '../../models/customer/customer-model';
import { Router } from "@angular/router";
import { UserService } from '../../services/user/user.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CustomerService } from '../../services/customer/customer.service';
@Component({
  selector: 'app-register-vendor',
  templateUrl: './register-vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
/** register-vendor component*/
export class RegisterVendorComponent {
  /** register-vendor ctor */
  showHideShipingDiv: boolean = true;
  customerModel = new Customer();
  isSubmitted: boolean = true;
  isUnique = true;
  isUniqueShopName = true;
  isPasswordMatch = true;

  constructor(private readonly accountService: AccountService,
    private readonly userService: UserService,
    public toastr: ToastsManager,
    private readonly router: Router,
    private readonly customerService: CustomerService,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.customerModel.mainCountryID = "";
    this.customerModel.mailingCountryID = "";
    this.customerModel.mainStateID = "";
    this.customerModel.mailingStateID = "";
    this.customerModel.mainCityId = "";
    this.customerModel.mailingCityId = "";

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
    if (this.customerModel.shopeName == "" || this.customerModel.shopeName == null) {
      this.isUniqueShopName = true;
    }
    else {
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
  }

  KeyPressEvenetEmail() {
    this.isUnique = true;
  }

  KeyPressEvenetShopName() {
    this.isUniqueShopName = true;
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

  ngSubmit() {
    if (this.isSubmitted) {
      this.IsUniqueShopName();
      if (this.customerModel.confirmPassword != this.customerModel.password) {
        this.toastr.error('Password Mismatch', 'Error');
        this.customerModel.confirmPassword = "";
        this.customerModel.password = "";
        this.isSubmitted = true;
      }

      else if (this.isUniqueShopName = false) {
        this.toastr.error('Shope Name is already taken ', 'Error');
        this.isSubmitted = true;
      }

      else {
        if (this.customerModel.mailingZipCode == "" || this.customerModel.mailingZipCode == null || typeof this.customerModel.mailingZipCode == 'undefined') this.customerModel.mailingZipCode = "";
        if (this.customerModel.mainZipCode == "" || this.customerModel.mainZipCode == null || typeof this.customerModel.mainZipCode == 'undefined') this.customerModel.mainZipCode = "";
        this.customerModel.shopeName = this.customerModel.shopeName.replace(" ", "-");
        this.customerModel.shopeName = this.customerModel.shopeName.replace("&", "-");
        this.customerModel.shopeName = this.customerModel.shopeName.replace("&&", "-");
        this.customerModel.shopeName = this.customerModel.shopeName.replace("%", "-");
        this.customerModel.shopeName = this.customerModel.shopeName.replace("@", "-");
        this.customerModel.shopeName = this.customerModel.shopeName.replace("=", "-");
        this.isSubmitted = false;
        if (this.showHideShipingDiv == true) {
          this.customerModel.mailingCountryID = this.customerModel.mainCountryID;
          this.customerModel.mailingStateID = this.customerModel.mainStateID;
          this.customerModel.mailingCityId = this.customerModel.mainCityId;
          this.customerModel.mailingZipCode = this.customerModel.mainZipCode;
          this.customerModel.mailingAddress = this.customerModel.mainAddress;
        }

        this.accountService.registerVendor(this.customerModel).subscribe(
          data => {
            if (data.status == 1) {
              this.isSubmitted = true;
              this.toastr.success('Vendor registered successfully.', 'Success');
              setTimeout(() => {
                this.router.navigate(["/login"]); 
              }, 2000);
            }
            else if (data.status == 2) {
              this.isSubmitted = true;
            }
            else {
              this.toastr.error('Error occurred. Please try again', 'Error');
              this.isSubmitted = true;
            }
          });
      }
    }
  }

  checkPasswords() {
    if (this.customerModel.confirmPassword != this.customerModel.password)
      this.isPasswordMatch = false;
    else
      this.isPasswordMatch = true;
  }
}





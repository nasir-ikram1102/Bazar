import { Component, ViewContainerRef } from '@angular/core';
import { AccountService } from '../../services/account/account.service';
import { Customer } from '../../models/customer/customer-model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from "@angular/router";
import { CustomerService } from '../../services/customer/customer.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-register-customer',
    templateUrl: './register-customer.component.html',
    styleUrls: ['./register-customer.component.scss']
})
/** register-customer component*/
export class RegisterCustomerComponent {
    /** register-customer ctor */

  userModel = new Customer();
  isSubmitted = true;
  isUnique = true;
  isPasswordMatch = true;
  maxDate: Date;
  public dateOfBirthElement: any; 

  constructor(private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
    public toastr: ToastsManager,
    private readonly router: Router,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() -1);
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

  KeyPressEvenet() {
    this.isUnique = true;
  }

  ngSubmit() {
    if (this.isSubmitted) {
      this.isSubmitted = false; 
      if (this.userModel.confirmPassword != this.userModel.password) {
        this.toastr.error('Password Mismatch', 'Error');
        this.userModel.confirmPassword = "";
        this.userModel.password = "";
        this.isSubmitted = true;
      }
      else {
        this.accountService.registerCustomer(this.userModel).subscribe(
          data => {
            if (data.status == 1) {
              this.isSubmitted = true;
              this.toastr.success('Customer registered successfully.', 'Success');
              setTimeout(() => {
                this.router.navigate(["/login"]);
              }, 2000);
            }

            else if (data.status == 2) {
              this.isSubmitted = true;
            }
            else {
              this.isSubmitted = true;
              this.toastr.error('Error occurred. Please try again', 'Success');
            }
          });
      }
    }
  } 

  checkPasswords() {
    if (this.userModel.confirmPassword != this.userModel.password) 
      this.isPasswordMatch = false;
    else
      this.isPasswordMatch = true;
  }

  selectBirthDate(e) {
    this.userModel.birthDate = e;
  }
}

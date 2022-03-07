import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from "@angular/router";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
/** contact-us component*/
export class ContactUsComponent {
  isSubmitted: boolean;
  public firstName: string;
  public LastName: string;
  public email: string;
  public message: string;
  public phone: string;
  /** contact-us ctor */
  constructor(
    private readonly customerService: CustomerService, public toastr: ToastsManager,
    private readonly router: Router, ) {
    this.isSubmitted = true;
    this.phone = "";
  }

  public ngSubmit() { 
    this.isSubmitted = false;  
    if (typeof this.phone == "undefined" || this.phone == "")
    {
      this.phone = "NotGiven";
    } 
    this.customerService.ContactUs(this.firstName, this.LastName, this.email, this.message, this.phone).subscribe(
      data => {
        if (data.status == 1) {
          this.toastr.success(data.message, 'Success');
          this.isSubmitted = false;
          setTimeout(() => {
            this.router.navigate(["/"]);
            this.isSubmitted = true;
          }, 1000);
        }

        else {
          this.toastr.error(data.message, 'Error');
          this.isSubmitted = true;
        }
      });
  }
}

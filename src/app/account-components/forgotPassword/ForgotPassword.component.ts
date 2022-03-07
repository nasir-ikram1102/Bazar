import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-ForgotPassword',
  templateUrl: './ForgotPassword.component.html',
  styleUrls: ['./ForgotPassword.component.css']
})
/** login component*/
export class ForgotPasswordComponent {
  validate: boolean;
  emailForgotPassword: any;
  constructor(private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly toastr: ToastsManager) {
    this.validate = true;
  }

  ForgotPassword() { 
    this.validate = false;
    this.customerService.ForgotPassword(this.emailForgotPassword).subscribe(
      result => {
        if (result != null) { 
          if (result.status == 0) {
            this.toastr.info(result.message, 'Info');
            this.validate = true;
          }

          else {
            this.toastr.success(result.message, 'Success');
            setTimeout(() => {
              this.router.navigate(["/login"]);
            }, 1000);
          }
        }
        else {
          alert(result.message);
          this.toastr.error('Error occurred. Please try again', 'Error');
        }

      });
  }
}

import { Component } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CustomerService } from '../../services/customer/customer.service';



@Component({
  selector: 'app-ResetPassword',
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.css']
})
/** login component*/
export class ResetPasswordComponent {
  isSubmitted: boolean = true;
  /** login ctor */
  emailForgotPassword: any;
  forgotNewPassword: any;
  forgotConfirmPassword: any;
  forgotPasswordtoken: any;
  constructor(private readonly toastr: ToastsManager,
    private readonly router: Router,
    private readonly customerService: CustomerService,
    private readonly activatedRoute: ActivatedRoute)
  {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.forgotPasswordtoken = params['token'];   
    });

  }

  ResetPassword() {
    this.isSubmitted = false;
    if (this.forgotNewPassword != this.forgotConfirmPassword) {
      this.toastr.error('Password Mis Match', 'Error');
      this.forgotNewPassword = "";
      this.forgotConfirmPassword = "";
      this.isSubmitted = true;
    }  
    else { 
      this.customerService.ResetPassword(this.emailForgotPassword, this.forgotNewPassword, this.forgotPasswordtoken).subscribe(
        result => {
          if (result != null) {
            if (result.status == 0) {
              this.toastr.info(result.message, 'Info');
              this.isSubmitted = true;
            }

            else {
              this.toastr.success(result.message, 'Success');
              this.isSubmitted = true;
              setTimeout(() => {
                this.router.navigate(["/login"]);
              }, 1000);
            }
          }
          else {
            this.toastr.error('Error occurred. Please try again', 'Error'); 
          }

        });

    } 

  }
}

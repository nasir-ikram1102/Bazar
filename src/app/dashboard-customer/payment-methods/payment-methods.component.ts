import { Component, ViewContainerRef } from '@angular/core'; 
import { PagerService } from '../../services/shared/pager.service';
import { Payment } from '../../models/payment/payment-model';
import { PaymentService } from '../../services/payment/payment.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Customer } from '../../models/customer/customer-model';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsCustomerComponent {
  customerModel = new Customer();
  selectedRadioBtnId: number;
  public paymentList: Payment[];
  constructor(private readonly paymentService: PaymentService,
    public toastr: ToastsManager,
    private readonly profileService: ProfileService,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    this.GetPaymentMethods();
    this.GetCustomerViewModel();
  }

  onSelectionChange(rbId: any) { 
    this.selectedRadioBtnId = rbId;
  }

  GetCustomerViewModel() {
    this.profileService.GetCustomerViewModel().subscribe(
      data => {
        if (data) { 
          this.customerModel = data; 
        }
      }
    )
  }

  GetPaymentMethods() {
    this.paymentService.getPaymentMethods().subscribe(
      data => {
        this.paymentList = data;
 
      }
    )
  }

  ngSubmit() {
     if (typeof this.selectedRadioBtnId != 'undefined') {
      this.customerModel.paymentMethodID = this.selectedRadioBtnId; 
      this.profileService.updateProfile(this.customerModel).subscribe(result => {
        if (result) { 
          this.toastr.success('Payment method updated successfully.', 'Success');
          setTimeout(() => {
            this.GetCustomerViewModel();
          }, 500);
        }
        else {
          this.toastr.error('Error occurred. Please try again', 'Error');

        }
      });
    }
    else {
      this.toastr.warning('At least one payment method must be selected.', 'Warning');   
    }
   
  }
   
}



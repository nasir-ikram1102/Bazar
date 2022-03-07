import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.css']
})
/** thank-you component*/
export class ThankYouComponent {
  /** thank-you ctor */
  orderNumber: string;
  constructor(private _avRoute: ActivatedRoute) {

    this.orderNumber = this._avRoute.snapshot.queryParamMap.get('orderRefNumber');
    console.log(this._avRoute.snapshot.queryParamMap.get('paymentToken'));
    console.log(this._avRoute.snapshot.queryParamMap.get('tokenExpiryDate'));
    console.log(this._avRoute.snapshot.queryParamMap.get('orderRefNumber'));

  }

}

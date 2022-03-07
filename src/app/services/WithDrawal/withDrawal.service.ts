import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { WishList } from '../../models/WishList/wishList-model';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class WithDrawalService {
  private serviceName = 'api/Withdrawals';
  constructor(private http: Http,
    private cookieService: CookieService,
    public toastr: ToastsManager) {

  }

  AddWithDrawalRequest(totalAmmount: any, selectedPurchaseOrderIds: any) {
    var requestedBy = this.cookieService.get('CustomerID'); 
    return this.http.get(`${this.serviceName}/AddWithDrawalRequest?requestedBy=` + requestedBy + `&totalAmmount=` + totalAmmount + `&selectedPurchaseOrderIds=` + selectedPurchaseOrderIds)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetWithDrawalsByVendor(searchWithDrawalStatus: number, PageNumber: number, PageSize: number) {
    var vendorId = this.cookieService.get('CustomerID'); 
    return this.http.get(`${this.serviceName}/GetWithDrawalsByVendor?vendorId=` + vendorId + '&searchStatus=' + searchWithDrawalStatus + '&PageNumber=' + PageNumber + '&PageSize=' + PageSize)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }


  GetWithDrawalDetail(withDrawalId: number) { 
    return this.http.get(`${this.serviceName}/GetWithDrawalDetail?withDrawalId=` + withDrawalId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  removeItem(wishListId: number) {
    return this.http.delete(`${this.serviceName} / ` + wishListId)
      .subscribe(result => {
      });
  }

  UpdateWishList(wishList: any) {
    return this.http.post(`${this.serviceName} / UpdateWishesList`, wishList)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

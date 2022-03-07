import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorPromotionsService } from '../services/vendor-promotions/vendor-promotions.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Product } from '../models/products/product.model';
import { vendorPrmotions, JoinedSales, SaleProducts } from '../models/vendor-promotions/vendor-promotions.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-vendor-promotions-products',
  templateUrl: './vendor-promotions-products.component.html',
  styleUrls: ['./vendor-promotions-products.component.scss']
})


/** vendor-promotions-products component*/
export class VendorpromotionsProductsComponent {
  /** vendor-promotions-products ctor */
  saleProductList: SaleProducts[]=[];
  filteredItems: any[];
  joinSales: JoinedSales = new JoinedSales();

  constructor(private readonly router: Router,
    private cookieService: CookieService,
    private _avRoute: ActivatedRoute,
    private readonly vendorpromotionsService: VendorPromotionsService,
    private readonly toastr: ToastsManager) {
    this.GetSaleproductList(this._avRoute.snapshot.params["id"], parseInt(this.cookieService.get('CustomerID')));
    try {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      window.scrollTo(0, 0);
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }
  
  GetSaleproductList(saleId: number, vendorId: number) {
    
    this.vendorpromotionsService.GetSaleProducts(saleId, vendorId).subscribe(
      data => {
        
        this.saleProductList = data;
        this.filteredItems = data;
      });
  }
  onSubmit() {
    
    var i = this.saleProductList;
    this.vendorpromotionsService.updateSaleProducts(this.saleProductList).subscribe( 
      data => {
        if (data) {
          this.router.navigate(["/vendor-promotions/"]);
        }
      });
  }
  ChangeStatus(id) {
    var updateStatus = this.saleProductList.findIndex(x => x.id == id);
    if (updateStatus!=-1)
    this.saleProductList[updateStatus].isEnable = !this.saleProductList[updateStatus].isEnable;
    //this.vendorpromotionsService.UpdateActiveAndInactive(id).subscribe(
    //  data => {
    //    if (data) {
    //      this.toastr.success('Rating Status has been Updated.', 'Success');
    //      //setTimeout(() => {
    //      //  setTimeout(this.getratings(), 400);
    //      //}, 2000);
    //    } else {
    //      this.toastr.error('Not Updated.', 'Oops!');
    //    }
    //  }
   // );

  }
  keyPress(event: any, id: any) {
    
    if (event.target.value == "" || event.target.value<0) {
      event.target.value = 0;
      this.saleProductList[id].venderParticipation = 0;
     }
  }

}

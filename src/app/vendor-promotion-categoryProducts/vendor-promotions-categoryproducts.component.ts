import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorPromotionsService } from '../services/vendor-promotions/vendor-promotions.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Product } from '../models/products/product.model';
import { vendorPrmotions, JoinedSales, CategorySaleProducts } from '../models/vendor-promotions/vendor-promotions.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-vendor-promotions-categoryproducts',
  templateUrl: './vendor-promotions-categoryproducts.component.html',
  styleUrls: ['./vendor-promotions-categoryproducts.component.scss']
})


/** vendor-promotions-categoryproducts component*/
export class VendorCategorypromotionsProductsComponent {
  /** vendor-promotions-categoryproducts ctor */
  categorysaleProductList: CategorySaleProducts[] = [];
  filteredItems: any[];
  public currentId: any;
  vendorId: number;
  saleId: number;
  joinSales: JoinedSales = new JoinedSales();

  constructor(private readonly router: Router,
    private _avRoute: ActivatedRoute,
    private cookieService: CookieService,
    private readonly vendorpromotionsService: VendorPromotionsService,
    private readonly toastr: ToastsManager) {
    this.vendorId = parseInt( this.cookieService.get('CustomerID'));
    this.saleId = this._avRoute.snapshot.params["id"];
    this.GetCategorySaleproductList(this.saleId, this.vendorId);

  }

  GetCategorySaleproductList(saleId: number, vendorId: number) {
    
    this.vendorpromotionsService.GetCategorySaleProduct(vendorId, saleId).subscribe(
      data => {
        
        this.categorysaleProductList = data;
        this.categorysaleProductList.forEach(x => {
          if (x.discountCriteria<=0)
          x.discountCriteria = x.givenCriteria;
        });
        this.filteredItems = data;
      });
  }
  onSubmit() {
    var i = this.categorysaleProductList;
    this.categorysaleProductList.forEach(x => {
      x.vendorID = this.vendorId;
      x.saleID = this.saleId;
    });
    this.vendorpromotionsService.updateCategorySaleProducts(this.categorysaleProductList).subscribe(
      data => {
        if (data) {
          this.toastr.success('You have Promoted your products', 'success');
          this.router.navigate(["/vendor-promotions/"]);
        }
      });
  }
  keyPress(event: any, givenCriteria: number, discountCriteria: number, id: any) {
    

    if (givenCriteria > discountCriteria) {
      event.target.value = 0;
      event.target.value = givenCriteria;
      this.categorysaleProductList[id].discountCriteria = givenCriteria;
    }

  }
  ChangeStatus(id) {
    var updateStatus = this.categorysaleProductList.findIndex(x => x.id == id);
    if (updateStatus != -1)
      this.categorysaleProductList[updateStatus].isEnable = !this.categorysaleProductList[updateStatus].isEnable;


  }

}

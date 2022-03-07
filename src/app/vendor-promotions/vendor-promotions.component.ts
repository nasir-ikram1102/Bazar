import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { VendorPromotionsService } from '../services/vendor-promotions/vendor-promotions.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Product } from '../models/products/product.model';
import { vendorPrmotions, JoinedSales } from '../models/vendor-promotions/vendor-promotions.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { CategoryService } from '../services/category/category.service';
import { Sales, SaleCategories } from '../models/sales/sales.model';
import { PaymentService } from '../services/payment/payment.service';
import { Payment } from '../models/payment/payment-model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-vendor-promotions',
  templateUrl: './vendor-promotions.component.html',
  styleUrls: ['./vendor-promotions.component.scss']
})


/** vendor-promotions component*/
export class VendorpromotionsComponent {
  /** vendor-promotions ctor */
  products: Product[];
  prmotionsList: vendorPrmotions[]=[];
  myprmotionsList: vendorPrmotions[]=[];
  myJoinedList: JoinedSales[];
  filteredItems: any[];
  joinSales: JoinedSales = new JoinedSales();
saleCategoryList: SaleCategories[] = [];
  public sales = new Sales();
  public paymentMethod = new Payment();
  vendorId: number;
  modalRef: BsModalRef;
  config = {
    animated: true
  };
  constructor(private readonly router: Router,
    private readonly vendorpromotionsService: VendorPromotionsService,
    private readonly toastr: ToastsManager,
    private cookieService: CookieService,
    private readonly categoryService: CategoryService,
    private paymentService: PaymentService,
    private modalService: BsModalService) {
    this.vendorId = parseInt(this.cookieService.get('CustomerID'));
    this.GetPromotionsList();
    
    try {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      window.scrollTo(0, 0);
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }
  openModal(template: TemplateRef<any>, id: string) {
    
    this.getsaleById(id);
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  GetPromotionsList() {
    this.vendorpromotionsService.GetSales(this.vendorId).subscribe(
      data => {
        this.prmotionsList = data;
        this.GetJoinedPromotionsList(this.vendorId);
        //this.filteredItems = data;
      });
  }
  GetJoinedPromotionsList(id: number) {
    
    this.vendorpromotionsService.GetJoinedSale(id).subscribe(
      data => {
        
        //this.myJoinedList = data;
        this.myprmotionsList = data;
        //this.myJoinedList.forEach(y => {
        //  var index = this.prmotionsList.findIndex(x => x.saleID == y.saleID);
        //  if (index != -1) {
            
        //    //this.myprmotionsList.push(this.prmotionsList[index]);
        //    this.prmotionsList.splice(index, 1);
        //  }

        //});

      });
  }
  JoinSale(id: number, saleTypeId: number) {
    this.joinSales.vendorID = this.vendorId;
    this.joinSales.saleID = id;
    
    this.vendorpromotionsService.JoinSale(this.joinSales).subscribe(
      data => {
        if (data) {
          this.toastr.success('You have joined Promotions', 'success');
          this.GetJoinedPromotionsList(this.vendorId);
        }
        else {
          //this.toastr.error('You have already joined Promotions', 'error');
        }
        if (saleTypeId==1)
        this.router.navigate(["/vendor-promotions-products/" + id]);
        if (saleTypeId==2)
        this.router.navigate(["/vendor-promotions-categoryproducts/" + id]);

      });
  }
  formatDate(date: string): string {
    let newDate: any = date.split('-');
    let days: number = parseInt(newDate[2]) + 1;
    let months: number = parseInt(newDate[1]);
    let year: number = parseInt(newDate[0]);
    return months + "/" + days + "/" + year;
  }
 
  getsaleById(id: string) {
    this.vendorpromotionsService.GetSaleById(id).subscribe(
      data => {
        
        this.sales = data;
        this.sales.startDate = this.formatDate(this.sales.startDate);
        this.sales.endDate = this.formatDate(this.sales.endDate);
        if (this.sales.saleTypeID == 2) {
          this.vendorpromotionsService.GetSaleCategoriesById(this.sales.saleID).subscribe(
            data => {
              
              this.saleCategoryList = data;
            })
        }
        if (this.sales.saleTypeID == 3) {
          this.paymentService.PaymentMethodById(this.sales.paymentMethodID).subscribe(
            data => {
              this.paymentMethod = data;
            }
          )
        }

      }
    )
  }

}

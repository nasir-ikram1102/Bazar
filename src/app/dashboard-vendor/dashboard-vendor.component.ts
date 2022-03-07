import { Component, TemplateRef } from '@angular/core';
import { AdminOrder } from './../models/PurchaseOrder/purchase-order.model';
import { OrderService } from './../services/order/order.service';
import { Product } from './../models/products/product.model';
import { ProductService } from './../services/product/product.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal'; 
import { RecentItemsSaleByVendorViewModel } from './../models/PurchaseOrder/RecentItemsSaleByVendorViewModel'

@Component({
  selector: 'app-dashboard-vendor',
  templateUrl: './dashboard-vendor.component.html',
  styleUrls: ['./dashboard-vendor.component.scss']
})
/** dashboard-vendor.ts component*/
export class DashboardVendorComponent {
  public orderList: AdminOrder[];
  public recentItemsSale: RecentItemsSaleByVendorViewModel[];
  public ProductList: Product[];
  public ProductType: string;
  public WeeklySale: any;
  public MonthlySale: any;
  public YearlySale: any;
  public LifeTimeSale: any;
  modalRef: BsModalRef;
  config = {
    animated: true
  };
  /** dashboard-vendor.ts ctor */
  constructor(private readonly orderService: OrderService,
    private readonly ProductService: ProductService,
    private modalService: BsModalService, ) {
    this.GetPurchaseOrders();
    this.GetSales(); 
    this.GetRecentSaleItemsByVendor();

  }
  GetPurchaseOrders() {
    this.orderService.GetPurchaseOrdersByVendor(0, "", 0, 10).subscribe(
      data => {
        this.orderList = data;
      });
  }

  GetRecentSaleItemsByVendor() {
    this.orderService.GetRecentSaleItemsByVendor().subscribe(
      data => {
        this.recentItemsSale = data;
      });
  }

  GetSales() {
    this.orderService.GetSalesByVendor().subscribe(
      data => {
        if (data.status == 200) { 
          this.WeeklySale = data.data.weeklySale;
          this.MonthlySale = data.data.monthlySale;
          this.YearlySale = data.data.yearlySale;
          this.LifeTimeSale = data.data.lifeTimeSale;
        }
        else {
          this.WeeklySale = 0;
          this.MonthlySale = 0;
          this.YearlySale = 0;
          this.LifeTimeSale = 0;
        }
      });
  }
}

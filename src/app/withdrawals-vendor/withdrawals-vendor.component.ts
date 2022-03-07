import { Component, ViewContainerRef, TemplateRef, ViewChild, ElementRef } from '@angular/core';

import { Router } from '@angular/router';
import { OrderService } from './../services/order/order.service';
import { OrderDetail } from './../models/order/order-detail.model';
import { Customer } from './../models/customer/customer-model';
import { Product } from './../models/products/product.model';
import { WithDrawal } from './../models/WithDrawal/WithDrawal.model';

import { WithDrawalService } from './../services/WithDrawal/withDrawal.service';

import { EnumDropDown } from './../models/shared/enum-dropdown'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UtilitiesService } from './../services/shared/utilities.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AdminOrder } from './../models/PurchaseOrder/purchase-order.model';
import { PurchaseOrderDetailView } from './../models/PurchaseOrder/purchase-order-detail-view.model';


@Component({
  selector: 'withdrawals-vendor',
  templateUrl: './withdrawals-vendor.component.html',
  styleUrls: ['./withdrawals-vendor.component.scss']
})
/** purchase-order-list component*/
export class WithDrawalsVendorComponent {

  @ViewChild('printSection') myDiv: ElementRef;
  /** purchase-order-list ctor */
  public orderDetails: OrderDetail[];
  public orderList: AdminOrder[];
  public withDrawalmodel: WithDrawal;
  public withDrawalDetail: WithDrawal;
  public withDrawalList: WithDrawal[];
  public filteredItems: AdminOrder[];

  public bulkChechUnCheck: any;
  public SelectedPurchaseOrders: AdminOrder[];
  public SelectedPurchaseOrdersIds: any;
  public totalAmmount: any;
  public totalComission: any;
  public totalBalance: any;
  public NumberOfSelectedPurchaseOrder: any;
  public ProductType: string;
  public ProductList: Product[];
  public customerList: Customer[];
  public sumQuantity: number;
  totalRecords: number = 0;
  totalRecordsPO: number = 0;
  public total: number;
  public orderDetail: PurchaseOrderDetailView;
  public purchasOrderStatuses: EnumDropDown[];
  public withDrawlStatuses: EnumDropDown[];
  modalRef: BsModalRef;
  config = {
    animated: true
  };
  public searchDatePicker: string;
  public searchStatus: any;
  public sortById: any;
  public vendorID: string;
  public searchWithDrawalStatus: any;
  public arrRowsPerPage: number[];
  public rowsOnPage: number;
  public POStatusId: string;
  public PageNumber: number;
  public rowsPerPage: number;

  constructor(private readonly orderService: OrderService,
    private readonly router: Router,
    private readonly withDrawalService: WithDrawalService,
    private readonly utilitiesService: UtilitiesService,
    private modalService: BsModalService,
    private readonly toastr: ToastsManager) {
    this.vendorID = "";
    this.GetRowsPerPageList();
    this.sortById = "1";
    this.PageNumber = 1;
    this.bulkChechUnCheck = false;
    this.totalComission = 0;
    this.totalAmmount = 0;
    this.totalBalance = 0;
    this.searchWithDrawalStatus = "0";
    this.searchStatus = "0";
    this.getProcessOrderStatuses();
    this.GetPurchaseOrders();
    this.GetwithDrawlStatuses();
    this.GetWithDrawals();
  }

  GetPurchaseOrders() {
    var i;
    if (this.rowsPerPage == undefined) this.rowsPerPage = 10;
    this.orderService.GetPurchaseOrdersForWithDrawals(this.searchStatus, "", this.PageNumber - 1, this.rowsPerPage).subscribe(
      data => {
        this.orderList = data;
        this.filteredItems = this.orderList
        this.orderList.forEach(x => {
          x.totalCommision = parseFloat((Math.round(x.totalCommision * 100) / 100).toFixed(2));//parseFloat(Math.round(num3 * 100) / 100).toFixed(2);
        });
        if (this.orderList != null && this.orderList.length > 0)
          this.totalRecordsPO = this.orderList[0].totalRecords;
      });
  }

  PageChangedPO($event) {
    this.PageNumber = $event.page;
    this.rowsPerPage = $event.itemsPerPage;
    this.GetPurchaseOrders();
  }

  getProcessOrderStatuses() {
    this.sortById = "1";
    this.orderService.GetPurchaseOrderStatuses().subscribe(
      data => {
        this.purchasOrderStatuses = data;
      }
    )
  }

  GetwithDrawlStatuses() {
    this.orderService.GetwithDrawlStatuses().subscribe(
      data => {
        this.withDrawlStatuses = data;
      }
    )
  }


  GetWithDrawals() {
    if (this.rowsPerPage == undefined) this.rowsPerPage = 10;
    this.withDrawalService.GetWithDrawalsByVendor(this.searchWithDrawalStatus, this.PageNumber - 1, this.rowsPerPage).subscribe(
      data => {
        this.withDrawalList = data;
        if (this.withDrawalList != null && this.withDrawalList.length > 0)
          this.totalRecords = this.withDrawalList[0].totalRecords;
      });


  }
  PageChangedWithDrawal($event) {
    this.PageNumber = $event.page;
    this.rowsPerPage = $event.itemsPerPage;
    this.GetWithDrawals();
  }

  OpenModel(ratingTemplate: TemplateRef<any>) {
    this.totalAmmount = 0;
    this.SelectedPurchaseOrders = null;
    this.SelectedPurchaseOrdersIds = "";
    this.NumberOfSelectedPurchaseOrder = 0;
    this.SelectedPurchaseOrders = this.filteredItems.filter(x => x.isCheck == true);

    if (this.SelectedPurchaseOrders.length <= 0) {
      this.toastr.info('Select any purchase order to perform this option.', 'Info');
    }

    else {
      this.SelectedPurchaseOrdersIds = Array.prototype.map.call(this.SelectedPurchaseOrders, s => s.purchaseOrderID).toString();
      this.NumberOfSelectedPurchaseOrder = this.SelectedPurchaseOrders.length;
      for (let x in this.SelectedPurchaseOrders) {
        this.totalComission += this.SelectedPurchaseOrders[x].totalCommision;
        this.totalBalance += this.SelectedPurchaseOrders[x].withdrawalAmount;
        this.totalAmmount += this.SelectedPurchaseOrders[x].shippingPrice;
      };

      this.modalRef = this.modalService.show(ratingTemplate, this.config);
    }
  }

  GetRowsPerPageList() {
    this.arrRowsPerPage = this.utilitiesService.GetRowsPerPageList();
    this.rowsOnPage = this.arrRowsPerPage[0];
  }

  OpenWithDrawalDetailModal(withDrawalId: any, ratingTemplatee: TemplateRef<any>) {
    this.withDrawalService.GetWithDrawalDetail(withDrawalId).subscribe(
      data => {
        this.withDrawalDetail = data;
        let v = Array.prototype.map.call(this.withDrawalDetail, s => s.purchaseOrderIds).toString();
     
        this.modalRef = this.modalService.show(ratingTemplatee, this.config);
      });


  }
  RequestForWithDrawal() {
    this.withDrawalService.AddWithDrawalRequest(this.totalBalance, this.SelectedPurchaseOrdersIds).subscribe(
      data => {
        if (data.status == 0) {
          this.toastr.info(data.message, 'Info');
          this.modalRef.hide();
          setTimeout(() => {
            this.router.navigate(["/account-setting-vendor"]);
          }, 2000);
        }

        else if (data.status == 1) {
          this.modalRef.hide();
          this.toastr.info(data.message, 'Info');
          setTimeout(() => {
            this.GetPurchaseOrders();
            this.GetWithDrawals();
          }, 500);
        }

        else {
          this.toastr.error(data.Message, 'Error');
        }
      }
    )
  }

  BulkCheckUnCheked() {
    if (this.bulkChechUnCheck == false) {
      this.orderList.forEach((item, index) => {
        this.orderList[index].isCheck = true;//true ? false : true;  
      });
    }
    if (this.bulkChechUnCheck == true) {
      this.orderList.forEach((item, index) => {
        this.orderList[index].isCheck = false;//true ? false : true;  
      });
    }
  }
}


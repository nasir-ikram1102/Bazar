import { Component} from '@angular/core';
import { UtilitiesService } from '../../services/shared/utilities.service';
import { Order } from '../../models/order/order.model';
import { OrderService } from '../../services/order/order.service';
import { EnumDropDown } from '../../models/shared/enum-dropdown' 
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'myorder-customer',
  templateUrl: './myorder-customer.component.html',
  styleUrls: ['./myorder-customer.component.scss']
})

export class MyorderCustomerComponent {

  public orderList: Order[];
  public searchKeyword: string;
  orderStatusId: number;
  public DummyCounter: number = 0;
  public orderStatuses: EnumDropDown[];
  
  //For pagging items from grid
  pageNumber: number;
  pageSize: number = 10; 
  totalRecords: number = 0;

  /** order-list ctor */
  constructor(private readonly orderService: OrderService, private sharedService: SharedService)
  {
    this.pageNumber = 1;
    this.GetOrders();
    this.orderStatusId = 0; 
    this.GetOrderStatuses(); 
    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });
  }
  onListenerTirgger() {
    this.DummyCounter += 1;
  }

  GetOrders() {
    if (typeof this.pageSize == 'undefined') this.pageSize = 10;
    if ( typeof this.orderStatusId == 'undefined') this.orderStatusId = 0; 
    this.orderService.GetOrdersByCustomer(this.orderStatusId, this.pageNumber -1, this.pageSize).subscribe(
      data => {
        this.orderList = data; 
        if (data != null && data.length > 0)
          this.totalRecords = data[0].totalRecords;

      });
  }

  GetOrderStatuses() {
    this.orderService.GetOrderStatuses().subscribe(
      data => {
        this.orderStatuses = data;
      }
    )
  }

  OnFilterChange() {
    this.pageNumber = 1;
    this.GetOrders();
  }

  PageChanged($event) {
    this.pageNumber = $event.page;
    this.pageSize = $event.itemsPerPage;
    this.GetOrders();
  }

}

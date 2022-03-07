export class CreatePurchaseOrder {
  public orderDetails: number[];
}
export class AdminOrderDetail {
  public id: string;
  public purchaseOrderDetailID: number;
  public purchaseOrderID: number;
  public orderDetailID: number;
  public vendorID: number;
  public productID: number;
  public brandID: number;
  public categoryID: number;
  public price: number;
  public quantity: number;
  public purchaseOrder: any;
}
export class AdminOrder {
  public purchaseOrderID: number;
  public orderID: number;
  public isWithdrawal: boolean;
  public vendorID: number;
  public orderDate: number;
  public shippingPrice: number;
  public orderStatus: number;
  public orderDetails: any[];
  public orderStatusName: string;
  public id: string;
  public isCheck: boolean;
  public totalRecords: number;
  public totalCommision: number;
  public withdrawalAmount: number;

  public price: number;
  
}

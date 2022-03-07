 
export class PurchaseOrderDetailView {
  public id: string; 
  public orderStatusName: string; 
  public pOTotal: number;
  public pODate: Date;
  public purchaseOrderId: number;
  public products: POProducts[]; 
  public orderStatus: number; 
  
}

export class POProducts {
  public name: string;
  public imagePath: string;
  public quantity: number;
  public unitPrice: number;
  public url: string;
  public unitComission: number; 
}

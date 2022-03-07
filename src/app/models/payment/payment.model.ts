
export class PaymentMethods {
  public description: string;
  public paymentType: number;
  public transactionID: string;
  public refernceID: string;
}


export class EasyPaisaModel {
  public storeId: string;
  public amount: string;
  public postBackURL: string;
  public orderRefNum: string;
  public expiryDate: string;
  public merchantHashedReq: string;
  public autoRedirect: string;
  public paymentMethod: string;
  public emailAddr: string;
  public mobileNum: string;
}

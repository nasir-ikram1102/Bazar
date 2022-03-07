 

export class WishList {  
  public wishListID : number;
  public productID : number;
  public comments : string;
  public customerID : number;
  public createdDate: Date;  
  public name: number;//
  public regularPrice: number; //
  public productDefaultImage: string;//
  public appliedDiscoutType: any;
  public salePrice: any;
  public currencySettings: CurrencySettings;
  public url: any;
}

export class CurrencySettings {
  public currencyCode: "";
  public currencySymbol: "";
}

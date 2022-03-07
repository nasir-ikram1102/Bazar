
export class vendorPrmotions {
  public id: string;
  public saleID: number;
  public saleTypeID: number;
  public paymentMethodID: number;
  public domainType: number;
  public title: string;
  public description: string;
  public isActive: boolean;
  public startDate: string;
  public LastDatetoRegister: string = "01/2/2018";
  public endDate: string;
  public dicsountPercent: number;
  //public saleCategories: SaleCategories[];
}
export class JoinedSales {
  public id: string;
  public saleID: number;
  public vendorID: number;
  public joiningDate: Date;
}

export class SaleProducts {
  public id: string;
  public saleID: number;
  public productID: number;
  public productName: number;
  public companyParticipation: number;
  public venderParticipation: number;
  public productSku: string;
  public isEnable: boolean;
  public regularPrice: number;
  public discountType: number;
  public venderID: number;
}
export class CategorySaleProducts {
  public id: string;
  public saleID: number;
  public productID: number;
  public productName: number;
  public productSku: string;
  public isEnable: boolean;
  public regularPrice: number;
  public discountCriteria: number;
  public vendorID: number;
  public givenCriteria: number;
}

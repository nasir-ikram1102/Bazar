
export class Sales 
{
  public id: string;
  public saleID: number;
  public saleTypeID: number;
  public paymentMethodID: number;
  public domainType: number;
  public  title: string;
  public  description: string;
  public isActive: boolean;
  public startDate: string;
  public endDate: string;
  public applyDate: string; 
  //public applyDate: string;
  public dicsountPercent: number;
  public saleLogo: string;
  public saleCategories: SaleCategories[];
  public saleProducts: SaleProducts[];
}
export class SaleCategories {
  public id: string;
  public saleID: number;  
  public parentCategoryID : number;
  public categoryID: number;
  public subCategoryID: number;
  public parentCategoryName: string;
  public categoryName: string;
  public subCategoryName: string;
  public criteria: number;
}
export class SaleProducts {
  public id: string;
  public saleID: number;
  public productID: number;
  public productName: string;
  public companyParticipation: number;
  public venderParticipation: number;
  public productSku: string;
  public isEnable: boolean;
  public regularPrice: number;
  public discountType: number;
  public venderID: number;
  public venderName: string; 
}







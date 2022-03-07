import { Data } from "@angular/router";

export class Store {
  public storeID: number;
  public storeName: string;
  public profileImage: string;
  public bannerImage: string;
  public address: string;
  public phoneNumber: string;
  public email: string;
  public preferedMethod: string;
  public payPalEmail: string;
  public otherBankDetail: string;
  public numberOfProductsPerPage: number;
  public isActive: boolean;
  public createdBy: number;
  public createdDate: Date;
}

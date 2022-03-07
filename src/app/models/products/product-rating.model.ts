import { ProductVariants } from "../products/product.model";
export class ProductRating {
  public id: string;
  public starRatingId: number;
  public isActive: boolean;
  public approved: boolean;
  public votes: number;
  public rating: number;
  public descriptionMessage: string;
  public productName: string;
  public userName: string;
  public userId: number;
  public categoryId: number;
  public productId: number;
  public blogPostId: number;
  public createdDate: Date;
  public userEmail: string;
  public url: string;
  
  public totalRecords: any;
  public productSKU: string;
  public profileImage: string;
  
}



export class ProductAttributes {
  public type: string;
  //public data: ProductVariants[];//
  public data: Array<ProductVariants>;
  public dist: any[] =[];
  
}

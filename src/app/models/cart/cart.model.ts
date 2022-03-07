import { ProductVariants } from "../products/product.model";
export class Cart {
  public subTotal: number;
  public absoluteTotal: number;
}

export class CartCookieModel {
  public productID: number;
  public quantity: number;
  public productName: string;
  public imagePath: string;
  public salePrice: number;
  public regularPrice: number;
  public currencySymbol: string;
  public appliedDiscoutType: number;
  public totalPrice: number;
  public totalUnitPrice: number;
  public couponAmount: number;
  public couponCode: string;
  public couponID: number;
  public couponType: string;
  public isCouponApplied: boolean;
  public isNew: boolean = false;
  public productVarients: ProductVariants[];
  public sku: string;
  public url: string;
  public isQuantityExist: boolean;
}



export enum PaymentMethods {
  JazzCash = 2,
  EasyPaisa = 3,
  CashOnDelivery = 5,
}

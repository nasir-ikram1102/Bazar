import { User } from '../user/user-model';
import { Customer } from '../customer/customer-model';
import { Shippment } from '../shippment/shippment-model';
import { OrderDetail } from './order-detail.model';

export class Order { 
  public orderID: number;
  public orderBy: number;
  public orderDate: Date;
  public orderStatus: number;
  public strOrderStatus: string; 
  public strPaymentMethod: string;
  public StrShipTo: string
  public total: number;
  public taxtTotal: number;
  public subTotal: number;
  public address: string;
  public city: string;
  public stateID: number;
  public countryID: number;
  public couponID: number;
  public trackingNumber: string;
  public paymentType: number;
  public shippingPrice: number;
  public shipMethodID: number;
  public shipCarrierID: number;
  public currancyCode: string;
  public languageID: string;
  public shippingCountry: string;
  public shippingState: string;
  public billingCountry: string;
  public billingState: string;
  public shippingAddress: string;
  public shippingCity: string;
  public billingAddress: string;
  public billingCity: string;
  public user: User;
  public customer: Customer;
  public shipmentMethod: Shippment;
  public order: Order;
  public orderDetails: OrderDetail[];
}

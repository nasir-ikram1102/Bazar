import { User } from '../user/user-model';
import { Shippment } from '../shippment/shippment-model';
import { OrderDetail } from './order-detail.model';
import { Customer } from '../customer/customer-model';
import { Order } from './order.model'; 

export class OrderViewModel {

  public shippingCountry: string;
  public shippingState: string;
  public billingCountry: string;
  public billingState: string;
  public orderDetails: OrderDetail[];
  //public ShippingMethod: ShippingMethod;
  public strPaymentMethod: string;
  public strOrderStatus: string;
  public customer: Customer;
  public order: Order; 
}

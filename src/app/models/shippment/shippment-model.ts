import { Order } from "../order/order.model"; 
export class Shippment
{
  public id: string;
  public shippingMethodID: number;
  public title: string;
  public logo: string;
  public url: string;
  public description: string;
  public isActive: boolean;
  public orders: Order[];

}

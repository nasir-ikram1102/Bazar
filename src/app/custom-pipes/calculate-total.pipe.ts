import { PipeTransform, Pipe } from "@angular/core";
import { CartCookieModel } from '../models/cart/cart.model';

@Pipe({ name: 'calculateTotal' })
export class CalculateTotalPipe implements PipeTransform {
  constructor() { }
  transform(cart: CartCookieModel[]) {

    let subTotal: number = 0;
    cart.forEach(x => {
      //if (!x.isDeleted) {
        if (x.salePrice < x.regularPrice && x.appliedDiscoutType > 0)
          subTotal += (x.salePrice * x.quantity);
        else
          subTotal += (x.regularPrice * x.quantity);
      //}
    });
    return Math.round((subTotal) * 100) / 100;
  }
}

import { CartCookieModel } from '../models/cart/cart.model';
import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: 'calculateUnitTotal' })
export class CalculateUnitTotalPipe implements PipeTransform {
  constructor() { }
  transform(cart: CartCookieModel) {
    if (cart.salePrice < cart.regularPrice && cart.appliedDiscoutType > 0)
      return Math.round((cart.salePrice * cart.quantity) * 100) / 100;
    else
      return Math.round((cart.regularPrice * cart.quantity) * 100) / 100;
  }
}

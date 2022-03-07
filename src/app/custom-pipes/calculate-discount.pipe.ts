
import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: 'calculateDiscount' })
export class CalculateDiscountPipe implements PipeTransform {
  constructor() { }
  transform(regularPrice: number, salePrice: number) {
    if (regularPrice == 0)
      return 0;
    return (100 - ((salePrice * 100) / regularPrice)).toFixed(2);
  }
}

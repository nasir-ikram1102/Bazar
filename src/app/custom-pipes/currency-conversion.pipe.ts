
import { PipeTransform, Pipe } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Pipe({
  name: 'currencyConversion'
})
export class CurrencyConversionPipe implements PipeTransform {
  constructor(private cookieService: CookieService) { }
  transform(price: number, triggerCounter: number) {
    let symbol: string;
    let rate: number = 1;
    if (typeof this.cookieService.get('Currency') != 'undefined' && this.cookieService.get('Currency') != null) {
      // data structure $/345 => Symbol/Rate
      symbol = this.cookieService.get('Currency').split('/')[0];
    }
    if (typeof this.cookieService.get('Currency') != 'undefined' && this.cookieService.get('Currency') != null) {
      var v = this.cookieService.get('Currency');
      var q = v.split('/')
      rate = parseFloat(q[1]);
    }
    let calculatedPrice = price * rate;

    return symbol + " " + calculatedPrice.toFixed(2);
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http , Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs';
import { JoinedSales, SaleProducts, CategorySaleProducts } from '../../models/vendor-promotions/vendor-promotions.model';
@Injectable()
export class VendorPromotionsService {

  private service = "api/VendorPromotions"; //Controller Name
  constructor(
    private http: Http,
    private readonly router: Router
  ) {

  }

  GetSales(vendorId: number) {
    return this.http.get(`${this.service}/GetSalesByCurrentlyAvailable?vendorId=` + vendorId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetSaleProducts(saleId: number, vendorId: number) {
    return this.http.get(`${this.service}/GetSaleProducts?saleId=` + saleId+'&vendorId=' + vendorId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetCategorySaleProduct(vendorId: number,saleId: number) {
    return this.http.get(`${this.service}/GetCategorySaleProduct?vendorId=` + vendorId+'&saleId=' + saleId )
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetJoinedSale(vendorId: number) {
    return this.http.get(`${this.service}/GetJoinedSale?vendorId=` + vendorId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  JoinSale(joinedSales: JoinedSales) {
    return this.http.post(`${this.service}/JoinSales`, joinedSales)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateSaleProducts(saleProducts: SaleProducts[]) {
    return this.http.post(`${this.service}/UpdateSaleProducts` , saleProducts)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  updateCategorySaleProducts(CategorysaleProducts: CategorySaleProducts[]) {
    
    return this.http.post(`${this.service}/UpdateOrAddCategorySaleProducts`, CategorysaleProducts).map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  

  GetSaleById(id: string) {
    return this.http.get(`${this.service}/GetSaleById?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetSaleCategoriesById(id: number) {
    return this.http.get(`${this.service}/GetSaleCategoriesById?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

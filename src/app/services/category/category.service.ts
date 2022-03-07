import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { Category } from '../../models/category/category.model';
import { VendorCategoryLevelSale } from '../../models/category/vendor-category-sales.model';
import { Observable } from 'rxjs/Observable'; 
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class CategoryService {
  private service = "api/Category"; //Controller Name
  constructor(private http: Http, private readonly router: Router, private cookieService: CookieService) { }

  AddParentCategory(formData: any, parentCategoryID: number): void {
    this.http
      .post(`${this.service}/SaveParentCategory`, formData, {})
      .subscribe(result => {
        if (parentCategoryID > 0)
          this.router.navigate(["/Category-List"]);
        else
          this.router.navigate(["/Parent-Category-List"]);
      });
  }
  GetAllCategoryList() {
    return this.http.get(`${this.service}/GetAllCategories`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  CategoriesSuggestions(text: string) {
    return this.http.get(`${this.service}/CategoriesSuggestions?search=` + text)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetProductCategory(id: string) {
    return this.http.get(`${this.service}/GetProductCategory?ids=` + id)
      .map((response: Response) => <Category>response.json())
      .catch(this.errorHandler)
  }
  GetCategoryLevelSaleById(id: number) {
    return this.http.get(`${this.service}/GetCategoryLevelSaleById?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  AddFields(formData: any){
    return this.http
      .post(`${this.service}/AddField`, formData, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  DeleteField(id: string) {
    return this.http.delete(`${this.service}/DeleteField` + id)
      .subscribe(result => {
      });
  } 

  UpdateVendorCategoryLevelSaleStatus(id: string) {
    return this.http.get(`${this.service}/UpdateVendorCategoryLevelSaleStatus?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetVendorCategoryLevelSales(id : number) {
    return this.http.get(`${this.service}/GetVendorCategoryLevelSales?id=`+id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetVendorCategoryLevelSale(id : string) {
    return this.http.get(`${this.service}/GetVendorCategoryLevelSale?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  UpdateVendorCategoryLevelSale(VendorCategoryLevelSale: VendorCategoryLevelSale) {
    return this.http
      .post(`${this.service}/UpdateVendorCategoryLevelSale`, VendorCategoryLevelSale, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  AddSubCategory(formData: any): void {
    this.http
      .post(`${this.service}/SaveParentCategory`, formData, {})
      .subscribe(result => {
          this.router.navigate(["/Subcategory-List"]);
      });
  }

  //passing ParentCategoryID 0 to get first level categories
  GetCategoryList() {
    return this.http.get(`${this.service}/GetCategories?ParentCategoryID=0`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetCategoryListByVendorId() {
    var vendorId = this.cookieService.get('CustomerID'); 
    return this.http.get(`${this.service}/GetCategoryListByVendorId?VendorId=` + vendorId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetDisplayCategoryList() {
    return this.http.get(`${this.service}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  SearchCategories(search: string) {
    return this.http.get(`${this.service}/SearchCategories?search=` + search)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  //Get Generic Fields For categoryFields
  GetGenericFieldsList() {
    return this.http.get(`${this.service}/GetFields`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  //Get Category Fields 
  GetCateoryFieldsList(categoryID: number) {
    return this.http.get(`${this.service}/GetCategoryFields?CategoryID=`+ categoryID)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  //Get category by Parent category
  GetCategoryListByParent(parentCategoryID: number) {
    return this.http.get(`${this.service}/GetCategories?ParentCategoryID=` + parentCategoryID)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  //Add CategoryFields 
  AddCategoryFields(formData: any) {
    return this.http
      .post(`${this.service}/AddCategoryFields`, formData, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
   // getting second level categories
  GetCategoryListUnderParent() {
    return this.http.get(`${this.service}/GetCategoryListUnderParent`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  // getting third level categories
  GetSubCategoryList() {
    return this.http.get(`${this.service}/GetSubCategoryList`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetCategoryById(id: string) {
    return this.http.get(`${this.service}/GetCategoryById?id=` + id)
      .map((response: Response) => <Category>response.json())
      .catch(this.errorHandler)
  }
  GetCategoryByCategoryUrl(url: string) {
    return this.http.get(`${this.service}/GetCategoryByCategoryUrl?url=` + url)
      .map((response: Response) => <Category>response.json())
      .catch(this.errorHandler)
  }


  GetCategoryByCategoryId(categoryID: number) {
    return this.http.get(`${this.service}/GetCategoryByCategoryId?categoryID=` + categoryID)
      .map((response: Response) => <Category>response.json())
      .catch(this.errorHandler)
  }

  AddVendorCategoryLevelSale(VendorCategoryLevelSale: VendorCategoryLevelSale) {
    return this.http
      .post(`${this.service}/AddVendorCategoryLevelSale`, VendorCategoryLevelSale, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  

  DeleteCategory(id: string) {
    return this.http.delete(`${this.service}/` + id)
      .subscribe(result => {
      });
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

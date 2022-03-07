import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { Product } from '../../models/products/product.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'; 
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ProductService {
  chk: boolean = false;
  private service = "api/Products";
  private utilityService = "api/Utility";//Controller Name
  public Product: Product[];
  constructor(private http: Http, private readonly router: Router, private cookieService: CookieService) { }

  ProductSuggestions(text: string) {
    var vendorId = this.cookieService.get('CustomerID');
    return this.http.get(`${this.service}/ProductSuggestionsForVendor?search=` + text + `&vendorID=` + vendorId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  ProductSuggestionsForVendor(text: string) {
    var vendorId = this.cookieService.get('CustomerID');
    return this.http.get(`${this.service}/ProductSuggestionsForVendor?search=` + text + `&vendorID=` + vendorId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  AddProduct(formData: any) {
    return this.http
      .post(`${this.service}/AddProduct`, formData, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetProductById(id: number) {
    return this.http.get(`${this.service}/GetProductById?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  UpdateProductStatusBulk(ProductList: any, StatusId: any) {
    return this.http.post(`${this.service}/UpdateProductStatusBulk?statusId=` + StatusId, ProductList)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  ExportProducts(ProductList: any) {
    if (ProductList == null) { ProductList = [];}
    var vendorId = this.cookieService.get('CustomerID');
    return this.http.post(`${this.service}/ExportProducts?vendorID=`+vendorId ,ProductList)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  toggleButtonAnimation(btn: any) {
    if (btn.nativeElement.firstElementChild.hidden) {
      btn.nativeElement.disabled = false;
      btn.nativeElement.firstElementChild.hidden = false;
      btn.nativeElement.lastElementChild.hidden = true;

    }
    else {
      btn.nativeElement.disabled = true;
      btn.nativeElement.firstElementChild.hidden = true;
      btn.nativeElement.lastElementChild.hidden = false;

    }
  }


  GetBreadCrumbs(id: any) {
    return this.http.get(`${this.service}/GetBreadcrumbs?categoryId=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetProductBreadcrumbs(id: number) {
    return this.http.get(`${this.service}/GetProductBreadcrumbs?productId=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetMasterVaribaleProduct(master: string, variant: string) {
    return this.http.get(`${this.service}/GetMasterVaribaleProduct?Master=` + master + `&Variant=` + variant)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  UpdateVariableSimpleProduct(formData: Product[]) {
    return this.http
      .post(`${this.service}/UpdateVariableSimpleProduct`, formData, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetVednorProducts(isActive: string, isFeature: string, inStock: string, CategoryID, CategoryType: number, brandID: number, productStatusId: number, searchKeyword: string, PageNumber: number, PageSize: number) {
    var vendorId = this.cookieService.get('CustomerID');
    return this.http.get(`${this.service}/GetVednorProducts?isActive=` + isActive + '&isFeature=' + isFeature + '&inStock=' + inStock + '&CategoryID=' + CategoryID + '&CategoryType=' + CategoryType + '&brandID=' + brandID + '&productStatusId=' + productStatusId + '&vendorID=' + vendorId + '&searchKeyword=' + searchKeyword + '&PageNumber=' + PageNumber + '&PageSize=' + PageSize)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  DeleteProduct(id: string) {
    return this.http.delete(`${this.service}/DeleteProduct?id=` + id)
      .subscribe(result => {
      });
  }
  GetReturnPolicy() {
    return this.http.get(`${this.service}/GetReturnPolicy`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetVariants(ids: string) {
    return this.http.get(`${this.service}/GetVariants?ids=` + ids)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  UpdateVariableProduct(formData: Product[]) {
    return this.http
      .post(`${this.service}/UpdateVariableProduct`, formData, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetAllVariantsList() {
    return this.http.get(`${this.service}/GetAllVariants`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetProductVariations(id: string) {
    return this.http.get(`${this.service}/GetProductVariations?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  UpdateSimpleProduct(formData: Product[]) {
    return this.http
      .post(`${this.service}/UpdateSimpleProduct`, formData, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetMasterProduct(id: string) { 
    return this.http.get(`${this.service}/GetMasterProduct?ID=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetAttributeList() {
    return this.http.get(`${this.service}/GetAttributeList`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  //passing ParentCategoryID 0 to get first level categories
  GetProductList(type: string) {
    return this.http.get(`${this.service}/GetProductsByType?Type=` + type + `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetALLProducts() {
    return this.http.get(`${this.service}/GetALLProducts`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetFlashSaleProducts(saleId: number) {
    return this.http.get(`${this.service}/GetFlashSaleProducts?saleId=` + saleId + `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetDealOfMonth() {
    return this.http.get(`${this.service}/GetDealOfMonth`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetRecomandedProductList(customerID: number, visitorID: string, skip: number, take: number) {
    return this.http.get(`${this.service}/GetRecomandedProductList?CustomerID=` + customerID + "&visitorID=" + visitorID + "&Skip=" + skip + "&take=" + take
      + `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0)
    )
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetProductsList(type: string, vendorId: any, pagenumber: number, pagesize: number, brands: string, categories: string, MinPrice: string, MaxPrice: string, firstLoad: boolean, sortType: string) {
    return this.http.get(`${this.service}/GetProducts?Type=` + type + '&vendorId=' + vendorId + '&PageNumber=' + pagenumber + '&pagesize=' + pagesize + '&brands=' + brands + '&categories=' + categories + '&MinPrice=' + MinPrice + '&MaxPrice=' + MaxPrice
      + '&firstLoad=' + firstLoad
      + `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0) + `&SortType=` + sortType

    )
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetSaleProductsList(saleID: any, pagenumber: number, pagesize: number, brands: string, categories: string, MinPrice: string, MaxPrice: string, firstLoad: boolean,
    customerID: number, sortType: string) {
    return this.http.get(`${this.service}/GetSaleProductsList?saleId=` + saleID + '&PageNumber=' + pagenumber + '&pagesize=' + pagesize + '&brands=' + brands + '&categories=' + categories + '&MinPrice=' + MinPrice + '&MaxPrice=' + MaxPrice + '&firstLoad=' + firstLoad
      + `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0) + `&SortType=` + sortType)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetBrandProductsList(pagenumber: number, pagesize: number, brandname: string, categories: string, MinPrice: string, MaxPrice: string, firstLoad: boolean,
    customerID: number, sortType: string) {
    return this.http.get(`${this.service}/GetProductsByBrand?PageNumber=` + pagenumber + '&pagesize=' + pagesize + '&brandname=' + brandname + '&categories=' + categories + '&MinPrice=' + MinPrice + '&MaxPrice=' + MaxPrice + '&firstLoad=' + firstLoad

      + `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0) + `&SortType=` + sortType)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }



  GetSearchProductsList(search: string, pagenumber: number, pagesize: number, brands: string, categories: string, MinPrice: string, MaxPrice: string, firstLoad: boolean, sortType: string) {
    return this.http.get(`${this.service}/GetSearchProductsList?search=` + search + '&PageNumber=' + pagenumber + '&pagesize=' + pagesize + '&brands=' + brands + '&categories=' + categories + '&MinPrice=' + MinPrice + '&MaxPrice=' + MaxPrice + '&firstLoad=' + firstLoad + `&SortType=` + sortType
      + `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0
    ))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetBestVendors() {
    return this.http.get(`${this.service}/GetBestVendors`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetProducts() {
    return this.http.get(`${this.service}/GetALLProducts`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  SearchProduct(search: string) {
    return this.http.get(`${this.service}/SearchProduct?search=` + search)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }


  GetProductsByCategory(pagenumber: number,
    pagesize: number,
    brands: string,
    url: string,
    categories: string,
    fields: string,
    values: string,
    MinPrice: string,
    MaxPrice: string,
    firstLoad: boolean,
    level: string,
    sortType: string) {
    return this.http.get(`${this.service}/GetProductsByCategory?pagenumber=` + pagenumber +
      `&pagesize=` + pagesize +
      `&brands=` + brands +
      `&categories=` + categories +
      `&url=` + url +
      `&fields=` + fields +
      `&values=` + values +
      `&MinPrice=` + MinPrice +
      `&MaxPrice=` + MaxPrice +
      `&firstLoad=` + firstLoad +
      `&level=` + level +
      `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0) + `&SortType=` + sortType

    )
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }


  GetProductsByCategoryUrl(pagenumber: number,
    pagesize: number,
    brands: string,
    url: string,
    categories: string,
    fields: string,
    values: string,
    MinPrice: string,
    MaxPrice: string,
    firstLoad: boolean,
    // level: string,
    sortType: string) {
    return this.http.get(`${this.service}/GetProductsByCategoryUrl?pagenumber=` + pagenumber +
      `&pagesize=` + pagesize +
      `&brands=` + brands +
      `&categories=` + categories +
      `&url=` + url +
      `&fields=` + fields +
      `&values=` + values +
      `&MinPrice=` + MinPrice +
      `&MaxPrice=` + MaxPrice +
      `&firstLoad=` + firstLoad +
      `&visitorID=` + this.cookieService.get("visitorID") +
      // `&level=` + level +
      `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0) + `&SortType=` + sortType
     
    )
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetProduct(url: string, customerID: number, firstload: boolean) {

    return this.http.get(`${this.service}/GetProduct?url=` + url + `&customerID=` + customerID + `&visitorID=` + this.cookieService.get("visitorID") + `&firstload=` + firstload)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetProductStatus() {
    return this.http.get(`${this.utilityService}/GetProductStatuses`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetWarranties() {
    return this.http.get(`${this.service}/GetWarranties`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetProductsByCustomer() {
    return this.http.get(`${this.service}/GetProductsByCustomer?token=` + this.cookieService.get('Login'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
  GetProductAndAttributeIds(pIds: string, aIds: string) {
    return this.http.get(`${this.service}/GetProductVarientByProductIdsattributesIds?pIds=` + pIds + `&aIds=` + aIds)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetChildProductDetail(id: number, customerID: number) {
    return this.http.get(`${this.service}/GetChildProductDetail?id=` + id + `&customerID=` + customerID)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getMenuCounters(customerID: number) {
    return this.http.get(`${this.service}/GetMenuCounters?customerId=` + customerID + '&jwtoken=' + this.cookieService.get('CartToken'))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetCounters(customerId: number) {
    this.getMenuCounters(customerId).subscribe(
      counter => {

        this.cookieService.set('wishlistCounters', (0).toString());
        this.cookieService.set('cartCounters', (0).toString());


        if (typeof counter.wishlistCounter != 'undefined' && counter.wishlistCounter != null)
          this.cookieService.set('wishlistCounters', counter.wishlistCounter.toString());
        if (typeof counter.cartCounter.toString() != 'undefined' && counter.cartCounter.toString() != null)
          this.cookieService.set('cartCounters', counter.cartCounter.toString());

      }
    );

  }

  GetCurrencyList() {
    return this.http.get(`${this.service}/GetCurrencyList`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  AddCustomerProfilling(formData: any) {
    return this.http
      .post(`${this.service}/AddCustomerProfilling`, formData, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getProductColumns() {
    return this.http.get(`${this.service}/GetProductColumns`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetColumnsUploadFile(formData: any) {
    return this.http
      .post(`${this.service}/GetColumnsFromExcelFile`, formData, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  ReadCompleteFile(formData: any) {
    return this.http
      .post(`${this.service}/ReadCompleteFile?vendorId=` +(this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0), formData, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  AssociativeProductList(url: string) {
    return this.http.get(`${this.service}/AssociativeProductList?url=` + url
      +
      `&customerID=` + (this.cookieService.get('CustomerID') ? this.cookieService.get('CustomerID') : 0))
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  SyncPictures() {
    return this.http
      .get(`${this.service}/SyncPictures`)
      .map((response: Response) =>
        response)
      .catch(this.errorHandler);
  }

  SyncPicturesRemCount() {
    return this.http.get(`${this.service}/SyncPicturesRemCount`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  //AddToCompareList(id: number) {
  //  var preIds = this.cookieService.get('productCounter');
  //  var pIds = [];
  //  if (preIds.toString().includes(",")) {
  //    pIds = preIds.split(',');
  //  } else {
  //    pIds = [];
  //  }

  //  if (pIds.filter(z => z == id).length <= 0) {
  //    this.cookieService.set('productCounter', id.toString() + ',' + preIds);
  //    this.chk = true;
  //  }
  //  else {
  //    this.chk= false;
  //}
  //  return this.chk;
  //}
 
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    //const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    //const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //XLSX.writeFile(workbook, ProductService.toExportFileName(excelFileName));
  }

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }
}

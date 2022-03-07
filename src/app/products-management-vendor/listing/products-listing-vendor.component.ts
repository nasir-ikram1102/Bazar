import { Component, ViewContainerRef, TemplateRef, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/products/product.model';
import { SystemSettingService } from '../../services/system-settings/system-setting.service';
import { ImageProcessing } from '../../models/system-setting/ImageProcessing.model';
import { UtilitiesService } from '../../services/shared/utilities.service';
import { Customer } from '../../models/customer/customer-model'
import { CustomerService } from '../../services/customer/customer.service';
import { BrandService } from '../../services/brand/brand.service';
import { Brand } from '../../models/brand/brand-model';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category/category.model';
import { EnumDropDown } from '../../models/shared/enum-dropdown'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'products-listing-vendor',
  templateUrl: './products-listing-vendor.component.html',
  styleUrls: ['./products-listing-vendor.component.scss']
})
/** Product-List component*/
export class ProductsListingVendor {
  public ProductList: Product[];
  public ExportProductList: Product[];
  public ProductType: string;
  //Filter items from grid
  filteredItems: any[];
  public vendorsList: Customer[];
  public brandList: Brand[];
  imageProcessing: ImageProcessing;
  public imageServerPath: string;
  public rowsPerPage: number;
  public pagenumber: number;
  public DummyCounter: number = 0;
  public exportProductId: number = 1;
  public productStatusId: number;
  public totalRecords: number;
  public bulkActionId: any;
  public productStatusListForBulkAction: EnumDropDown[];
  public productStatusListForFiltration: EnumDropDown[];
  public arrRowsPerPage: number[];
  public parentCategoryList: Category[];
  public categoryListDropdown: Category[] = [];
  public subCategoryList: Category[];
  public parentCategoryID: number;
  public brandID: number;
  public bulkChechUnCheck: any = false;
  public vendorID: number;
  public isActive: string;
  public isFeature: string;
  public inStock: string;
  pageSize: number = 0;
  public searchKeyword: string;
  pager: any = {};
  public static currencyRate: number = 1;
  public static currencySymbol: string = "";
  isFileDownload: boolean;
  @ViewChild('fileDownload') fileDownload: ElementRef;
  /** Product-List ctor */
  constructor(private readonly SystemSettingService: SystemSettingService,
    private readonly brandsService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly toastr: ToastsManager,
    private sharedService: SharedService,
    private readonly customerService: CustomerService,
    private readonly ProductService: ProductService,
    private readonly utilitiesService: UtilitiesService,
    private cookieService: CookieService) {
    this.isFileDownload = true;
    this.brandID = 0;
    this.vendorID = 0;
    this.pagenumber = 1;
    this.parentCategoryID = 0;
    this.totalRecords = 0;
    this.isActive = "";
    this.isFeature = "";
    this.inStock = "";
    this.searchKeyword = "";
    this.ProductType = "Recent";
    this.productStatusId = 0;
    this.rowsPerPage = 10;
    this.getcustomers();
    this.bulkActionId = "1"
    this.getbrands();
    this.GetProductStatuses();
    this.GetProducts();
    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });
  }
  onListenerTirgger() {
    this.DummyCounter += 1;
  }


  deleteProduct(id) {
    var ans = confirm("Are you sure to delete Product: " + id);
    if (ans) {
      this.ProductService.DeleteProduct(id);
      setTimeout(() => {
        this.GetProducts();
      }, 3000);
    }
  }

  GetProductStatuses() {
    this.ProductService.GetProductStatus().subscribe(
      data => {
        this.productStatusListForFiltration = data;
        this.productStatusListForBulkAction = this.productStatusListForFiltration.filter(i => i.value !== 4);
      }
    )
  }

  GetCategoryListDropdown() {
    if (this.categoryListDropdown.length == 0) {
      this.categoryService.GetCategoryListUnderParent().subscribe(
        data => {
          this.categoryListDropdown = data;
        });

      this.categoryService.GetCategoryList().subscribe(
        data => {
          this.parentCategoryList = data;
        });

      this.categoryService.GetAllCategoryList().subscribe(
        data => {
          this.subCategoryList = data;
          this.subCategoryList = this.subCategoryList.filter(x => x.isParent === false);
        });
    }

  }

  OnFilterChange() {
    this.pagenumber = 1;
    this.totalRecords = 0;
    this.GetProducts();
  }

  getbrands() {
    this.brandsService.getBrand().subscribe(
      data => {
        this.brandList = data;
      }
    )
  }

  getcustomers() {
    this.customerService.getVendorsList().subscribe(
      data => {
        this.vendorsList = data;
      }
    )
  }

  getImageServerPath() {
    this.SystemSettingService.GetImageServerPath().subscribe(
      data => {
        this.imageProcessing = data;
        this.imageServerPath = this.imageProcessing.path;
      });
  }

  GetProducts() {
    var type: number = 0;
    if (this.parentCategoryID > 0) {
      var parent = this.parentCategoryList.findIndex(role => role.categoryID == this.parentCategoryID);
      var cat = this.categoryListDropdown.findIndex(role => role.categoryID == this.parentCategoryID);
      var sub = this.subCategoryList.findIndex(role => role.categoryID == this.parentCategoryID);

      if (parent > -1) {
        type = 0;
      }
      else if (cat > -1) {
        type = 1;
      }
      else {
        type = 2;
      }
    } else {
      type = 0;
    }

    if (this.rowsPerPage == undefined) this.rowsPerPage = 10;
    this.ProductService.GetVednorProducts(this.isActive, this.isFeature, this.inStock, this.parentCategoryID, type, this.brandID, this.productStatusId, this.searchKeyword, this.pagenumber - 1, this.rowsPerPage).subscribe(
      data => {
        this.ProductList = data;
        if (this.ProductList != null && this.ProductList.length > 0)
          this.totalRecords = this.ProductList[0].totalRecords; 
        this.ProductList.forEach((item, index) => {
          if (this.ProductList[index].salePrice == 0) {
            this.ProductList[index].commissionAmount = this.ProductList[index].regularPrice - this.ProductList[index].commissionPrices;
          }
          else if (this.ProductList[index].salePrice > 0 && this.ProductList[index].salePrice > this.ProductList[index].regularPrice) {
            this.ProductList[index].commissionAmount = this.ProductList[index].regularPrice - this.ProductList[index].commissionPrices;
          }
          else if (this.ProductList[index].salePrice > 0 && this.ProductList[index].salePrice < this.ProductList[index].regularPrice) {
            this.ProductList[index].commissionAmount = this.ProductList[index].salePrice - this.ProductList[index].commissionPrices;
          }
        });

      
      }
    )
  }

  PageChanged($event) {
    this.pagenumber = $event.page;
    this.rowsPerPage = $event.itemsPerPage;
    this.GetProducts();
  }


  BulkCheckUnCheked() {
    if (this.bulkChechUnCheck == false) {
      this.ProductList.forEach((item, index) => {
        this.ProductList[index].isCheck = true;//true ? false : true;  
      });
    }
    if (this.bulkChechUnCheck == true) {
      this.ProductList.forEach((item, index) => {
        this.ProductList[index].isCheck = false;//true ? false : true;  
      });
    }
  }

  BulkAction() {
    var ProductList = this.ProductList.filter(s => s.isCheck == true);
    if (ProductList.length <= 0) {
      this.toastr.info('Select any record to perform this option.', 'Info');
    }
    else {
      this.ProductService.UpdateProductStatusBulk(ProductList, this.bulkActionId).subscribe(
        data => {
          if (data) {
            this.toastr.success('Status has been updated.', 'Success');
            setTimeout(() => {
              this.GetProducts();
            }, 500);
          }
          else {
            this.toastr.error('Error occurred. Oop!', 'Error');
          }
        }
      )
    }
  }
  get currencyRate() {
    if (typeof this.cookieService.get('Currency') != 'undefined' && this.cookieService.get('Currency') != null) {
      return parseFloat(this.cookieService.get('Currency').split('/')[1]);
    }
    else
      return 1;

  }

  get currencySymbol() {
    if (typeof this.cookieService.get('Currency') != 'undefined' && this.cookieService.get('Currency') != null) {

      return this.cookieService.get('Currency').split('/')[0];
    }
    else
      return "";

  }

  exportProducts() {
    if (this.ProductList == null || this.ProductList.length <= 0) {
      this.toastr.info("No Products to Export", 'Info');
      this.isFileDownload = true; 
    }
    else {
      if (this.isFileDownload) {
        this.isFileDownload = false;
        if (this.exportProductId == 1) {
          this.ExportProductList = this.ProductList;
        }

        if (this.exportProductId == 2) {
          this.ExportProductList = null;
        }

        if (this.exportProductId == 3) { 
          this.ExportProductList = this.ProductList.filter(i => i.isCheck);
          if (this.ExportProductList == null || this.ExportProductList.length <= 0) {
            this.toastr.info("No Products to Export", 'Info');
            this.isFileDownload = true;
            return false;
          }
        } 
        this.ProductService.ExportProducts(this.ExportProductList).subscribe(
          data => {
            if (data.status == 1) {
              var path = data.data; 
              this.fileDownload.nativeElement.href = "/Files/" + path;
              this.fileDownload.nativeElement.click();
              this.toastr.success(data.message, 'Success');
              this.isFileDownload = true;
            }
            else {
              this.toastr.error(data.message, 'Error');
              this.isFileDownload = true;
            }
          })
      }
      //if (this.exportProductId == 2) {
      //  this.ProductService.ExportProducts(null).subscribe(
      //    data => {
      //      if (data.status == 1) {
      //        var path = data.data;
      //        this.fileDownload.nativeElement.href = "/Files/" + path;
      //        this.fileDownload.nativeElement.click();
      //        this.toastr.success(data.message, 'Success');
      //        this.isFileDownload = true;
      //      }
      //      else {
      //        this.toastr.error(data.message, 'Error');
      //        this.isFileDownload = true;
      //      }
      //    })
      //}
      //this.ProductService.exportAsExcelFile(data, "Test");
    }
  }
}
 

import { Component, ViewContainerRef } from '@angular/core';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category/category.model';
import { CategoryLevelSale } from '../../models/category/category-sales.model';
import { VendorCategoryLevelSale } from '../../models/category/vendor-category-sales.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-edit-vendor-category-sale',
    templateUrl: './edit-vendor-category-sale.component.html',
    styleUrls: ['./edit-vendor-category-sale.component.css']
})
/** edit-vendor-category-sale component*/
export class EditVendorCategorySaleComponent {
    /** edit-vendor-category-sale ctor */
  public subCategory = new Category();
  public category = new Category();
  public parentCategory = new Category();
  public categoryLevelSale = new CategoryLevelSale();
  public vendorCategoryLevelSale = new VendorCategoryLevelSale();
  /** vendor-catagory-sales ctor */
  constructor(private _avRoute: ActivatedRoute, private toastr: ToastsManager, vcr: ViewContainerRef, private readonly categoryService: CategoryService, private router: Router) {
    this.toastr.setRootViewContainerRef(vcr);

    if (this._avRoute.snapshot.params["id"]) {
      ;
      this.getCategorysaleById(this._avRoute.snapshot.params["id"]);
    }
  }

  getVendorCategoryLevelSale(id: string) {

    this.categoryService.GetVendorCategoryLevelSale(id).subscribe(
      data => {
        this.vendorCategoryLevelSale = data;
        this.getCategorysaleById(String(this.vendorCategoryLevelSale.categoryLevelSaleID));
      }
    )
  }

  getCategorysaleById(id: string) {
    this.categoryService.GetCategoryLevelSaleById(Number(id)).subscribe(
      data => {
        this.categoryLevelSale = data;
        this.categoryLevelSale.startDate = this.formatDate(this.categoryLevelSale.startDate);
        this.categoryLevelSale.endDate = this.formatDate(this.categoryLevelSale.endDate);
        this.getCategoryByID(this.categoryLevelSale.categoryID);

      }
    )
  }
  formatDate(date: string): string {
    let newDate: any = date.split('-');
    let days: number = parseInt(newDate[2]) + 1;
    let months: number = parseInt(newDate[1]);
    let year: number = parseInt(newDate[0]);
    return months + "/" + days + "/" + year;
  }


  getCategoryByID(id: number) {
    this.categoryService.GetCategoryByCategoryId(id).subscribe(
      data => {
        this.subCategory = data;
        this.getSubCategoryByID(this.subCategory.parentCategoryID);
      }
    )
  }
  getSubCategoryByID(id: number) {
    this.categoryService.GetCategoryByCategoryId(id).subscribe(
      data => {
        this.category = data;
        this.GetParentCategoryByCategoryId(this.category.parentCategoryID);
      }
    )
  }

  GetParentCategoryByCategoryId(categoryID: number) {
    this.categoryService.GetCategoryByCategoryId(categoryID).subscribe(
      data => {
        this.parentCategory = data;
      }
    )
  }
  onSubmit() {
    
    this.vendorCategoryLevelSale.vendorID = 1;
    this.vendorCategoryLevelSale.categoryLevelSaleID = this.categoryLevelSale.categoryLevelSaleID;
    this.vendorCategoryLevelSale.title = this.categoryLevelSale.title;
    this.vendorCategoryLevelSale.description = this.categoryLevelSale.description;
    this.vendorCategoryLevelSale.dicsountPercent = this.categoryLevelSale.dicsountPercent;
    this.vendorCategoryLevelSale.startDate = this.categoryLevelSale.startDate;
    this.vendorCategoryLevelSale.endDate = this.categoryLevelSale.endDate;
    this.categoryService.UpdateVendorCategoryLevelSale(this.vendorCategoryLevelSale).subscribe(
      data => {
        if (data) {
          this.toastr.success('Update Successfully.', 'Success!');
          this.router.navigate(['/vedor-category-sale-list']);
        }
        else {
          this.toastr.error('Unable to update', 'Fail!');
        }
      });

  }
}

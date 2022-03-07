import { Component, ViewContainerRef } from '@angular/core';
import { VendorCategoryLevelSale } from '../../models/category/vendor-category-sales.model';
import { CategoryService } from '../../services/category/category.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UtilitiesService } from '../../services/shared/utilities.service';
@Component({
    selector: 'app-vendor-category-sale-list',
    templateUrl: './vendor-category-sale-list.component.html',
    styleUrls: ['./vendor-category-sale-list.component.css']
})
/** vendor-category-sale-list component*/
export class VendorCategorySaleListComponent {
    /** vendor-category-sale-list ctor */

  vendorCategoryLevelSaleList: VendorCategoryLevelSale[];

  filteredItems: any[];
  public rowsOnPage: number;
  public arrRowsPerPage: number[];
  constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private readonly categoryService: CategoryService, private readonly utilitiesService: UtilitiesService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.VendorCategorySaleList();
  }
  VendorCategorySaleList() {
    // pass vendor id
    this.categoryService.GetVendorCategoryLevelSales(1).subscribe(
      data => {
        this.vendorCategoryLevelSaleList = data;
        this.filteredItems = data;
        console.log(data);
      });
  }
  // Populate the row per page list
  GetRowsPerPageList() {
    this.arrRowsPerPage = this.utilitiesService.GetRowsPerPageList();
    this.rowsOnPage = this.arrRowsPerPage[0];
  }
  // Search the Grid
  onSearch(searchText: string) {
    if (searchText != "") {
      this.filteredItems = this.utilitiesService.GetSearchedResult(this.vendorCategoryLevelSaleList, searchText);

    } else {
      this.filteredItems = this.vendorCategoryLevelSaleList;
    }
  }
  onChange(id: string) {
    this.categoryService.UpdateVendorCategoryLevelSaleStatus(id).subscribe(
      data => {
        console.log(data)
        if (data) {
          this.toastr.success('Updated successfully.', 'Success');
        } else {
          this.toastr.error( 'Not Updated.', 'Oops!');
        }
      }
    );

  }
}

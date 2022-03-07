import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from '../../../services/shared/pager.service';
import { Category } from '../../../models/category/category.model';
import { CategoryService } from '../../../services/category/category.service';

@Component({
    selector: 'app-subcategory-list',
    templateUrl: './subcategory-list.component.html',
    styleUrls: ['./subcategory-list.component.css']
})
/** subcategory-list component*/
export class SubcategoryListComponent {
  public subcategoryList: Category[];
  pager: any = {};
  searchQuery: string;
  pageSize: number;
  // paged items
  pagedItems: any[];
    /** subcategory-list ctor */
  constructor(private readonly categoryService: CategoryService, private readonly pagerService: PagerService) {
    this.GetCategoryList();
    this.pageSize = 10;
  }
  GetCategoryList() {
    this.categoryService.GetSubCategoryList().subscribe(
      data => {
        this.subcategoryList = data;
        this.setPage(1);
      }
    )
  }

  deleteCategory(id) {
    var ans = confirm("Are you sure to delete with Id: " + id);
    if (ans) {
      this.categoryService.DeleteCategory(id);
      setTimeout(() => {
        this.GetCategoryList();
      }, 3000);
    }
  }

  setPage(page: number) {

    // get pager object from service
    this.pager = this.pagerService.getPager(this.subcategoryList.length, page, this.pageSize);

    // get current page of items
    this.pagedItems = this.subcategoryList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}

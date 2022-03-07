import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from '../../../services/shared/pager.service';
import { Category } from '../../../models/category/category.model';
import { CategoryService } from '../../../services/category/category.service';

@Component({
    selector: 'app-parent-category-list',
    templateUrl: './parent-category-list.component.html',
    styleUrls: ['./parent-category-list.component.css']
})
/** parent-category-list component*/
export class ParentCategoryListComponent {
  public categoryList: Category[];
  pager: any = {};
  searchQuery: string;
  pageSize: number;
  // paged items
  pagedItems: any[];
  /** parent-category-list ctor */
  constructor(private readonly categoryService: CategoryService, private readonly pagerService: PagerService) {
    this.GetCategoryList();
  }
  GetCategoryList() {
    this.categoryService.GetCategoryList().subscribe(
      data => {
        this.categoryList = data;
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
    this.pager = this.pagerService.getPager(this.categoryList.length, page, this.pageSize);

    // get current page of items
    this.pagedItems = this.categoryList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}

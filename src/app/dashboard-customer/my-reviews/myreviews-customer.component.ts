import { Component} from '@angular/core';
import { ProductRatingService } from './../../services/product/product-rating.service';
import { PagerService } from './../../services/shared/pager.service';
import { ProductRating } from './../../models/products/product-rating.model';

 
@Component({
  selector: 'myreviews-customer',
  templateUrl: './myreviews-customer.component.html',
  styleUrls: ['./myreviews-customer.component.scss']
})

export class MyReviewsCustomerComponent {
  /** product-star-rating-list ctor */
  public productRatingList: ProductRating[];

  //For pagging items from grid
  pageNumber: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;

  constructor(private readonly productRatingService: ProductRatingService, private readonly pagerService: PagerService) {
    this.getratings();

  }

  getratings() {
    if (typeof this.pageSize == 'undefined') this.pageSize = 10;
    this.productRatingService.getRatingsByCustomer(this.pageNumber, this.pageSize).subscribe(
      data => {
        this.productRatingList = data;
        if (this.productRatingList != null && this.productRatingList.length > 0)
          this.totalRecords = this.productRatingList[0].totalRecords;
      }
    )
  }

  //setPage(page: number) { 
  //  // get pager object from service
  //  this.pager = this.pagerService.getPager(this.productRatingList.length, page, this.pageSize);

  //  // get current page of items
  //  this.pagedItems = this.productRatingList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  //}

  PageChanged($event) {
    this.pageNumber = $event.page;
    this.pageSize = $event.itemsPerPage;
    this.getratings();
  }
}
 
 

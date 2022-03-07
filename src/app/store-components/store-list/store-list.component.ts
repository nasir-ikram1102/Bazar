import { Component, ViewContainerRef, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from '../../services/shared/pager.service';
import { Store } from '../../models/store/store.model';
import { StoreService } from '../../services/store/store.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';



@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
/** store-list component*/
export class StoreListComponent {
  public storeList: Store[];
  public store = new Store();
  public chk: boolean;
  // pager object
  pager: any = {};
  searchQuery: string;
  pageSize: number;
  // paged items
  pagedItems: any[];
  constructor(public toastr: ToastsManager, vcr: ViewContainerRef,private readonly storeService: StoreService, private readonly pagerService: PagerService) {
    this.GetStores();
    this.toastr.setRootViewContainerRef(vcr);
    this.pageSize = 10;
  }

  GetStores() {
    this.storeService.GetStores().subscribe(
      data => {
        this.storeList = data
        this.setPage(1);
      }
    )
  }

  deleteStore(id) {
    var ans = confirm("Are you sure to delete with Id: " + id);
    if (ans) {
      this.storeService.DeleteStore(id);
      setTimeout(() => {
        this.GetStores();
      }, 3000);
    }
  }
  setPage(page: number) {

    // get pager object from service
    this.pager = this.pagerService.getPager(this.storeList.length, page, this.pageSize);

    // get current page of items
    this.pagedItems = this.storeList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  
  }
  showSuccess() {
    this.toastr.success('You are awesome!', 'Success!');
  }

  showError() {
    this.toastr.error('This is not good!', 'Oops!');
  }
  onChange(id: number) {



    this.storeService.UpdateActiveAndInactive(id).subscribe(
      data => {
        if (data) {

          var name = "";
          this.storeList.forEach(obj => {
            if (obj.storeID == id) {
              name = obj.storeName;
              return false;
            }
            //              this.storeList = parentChecked;
          });

          this.toastr.success(name + ' updated successfully.', 'Success');
        } else {
          this.toastr.error('Not Updated.', 'Oops!');
        }
      }
    );

  }
}

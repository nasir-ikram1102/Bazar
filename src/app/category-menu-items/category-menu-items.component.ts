import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryDisplay } from '../models/category/categorydisplay.model';
import { CategoryService } from '../services/category/category.service';
import { SharedService } from '../services/shared/shared.service';

@Component({
    selector: 'app-category-menu-items',
    templateUrl: './category-menu-items.component.html',
    styleUrls: ['./category-menu-items.component.css']
})
/** Category-Menu-Items component*/
export class CategoryMenuItemsComponent {
  public categoryList: CategoryDisplay[]=[];
  public displayCategoryList: CategoryDisplay[] = [];
  public displaySubCategoryList: CategoryDisplay[] = [];
  /** Category-Menu-Items ctor */
  constructor(private readonly categoryService: CategoryService, private readonly sharedService: SharedService, private readonly router: Router) {
    this.getDispalyCategoryMenu();
  }
  getDispalyCategoryMenu() {
    
    this.categoryService.GetDisplayCategoryList().subscribe(data => {
      this.categoryList = data;
      this.displayCategoryList = this.categoryList.filter(i => i.parentCategoryID === 0);
      this.displaySubCategoryList = this.categoryList.filter(i => i.isParent == false);
      this.displayCategoryList.forEach(element => {
        element.subCategory = this.categoryList.filter(i => i.parentCategoryID === element.categoryID);
        //element.subCategory.forEach(child => {
        //  child.subCategory = this.categoryList.filter(i => i.parentCategoryID === child.categoryID);
        //});
      });
    })
  }
  dropdownStatus = "";
  mouseEnter() {
    this.dropdownStatus = "open";
  }
  mouseLeave() {
    this.dropdownStatus = "";
  }

  SubMenuMouseEnter(Element) {
    console.log(Element);
    var el = document.getElementsByClassName('CategorShow-' + Element);
    el[0].classList.add('subMenu');
  }
  SubMenuMouseLeave(Element) {
    console.log(Element);
    var el = document.getElementsByClassName('CategorShow-' + Element);
    el[0].classList.remove('subMenu');
  }
  MenuItemsToggle() {
    if (this.dropdownStatus == "") {
      this.dropdownStatus = "open";
    } else {
      this.dropdownStatus = "";
    }
  }
  chk1CategoryProduct(url: string,id: number) {
    this.router.navigate([url, id]);
    setTimeout(() => {
      this.sharedService.sameUrlCategoryFilter('');
    }, 1000);
  }
  chk2CategoryProduct(url: string,id: number) {
    this.router.navigate([url, id]);
    setTimeout(() => {
      this.sharedService.sameUrlCategoryFilter('');
    }, 1000);
  }
  chk3CategoryProduct(url: string,id: number) {
    this.router.navigate([url, id]);
    setTimeout(() => {
      this.sharedService.sameUrlCategoryFilter('');
    }, 2000);
  }
}




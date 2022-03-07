import { Component, ViewContainerRef } from '@angular/core';
import { ProductService } from './../services/product/product.service';
import { ProductResponseModel, CategoryFilters, CategoryFilterValues, TreeviewItem, Product, CustomerProfilling } from './../models/products/product.model';
import { Brand } from './../models/brand/brand-model';
import { Options } from 'ng5-slider';
import { LoginService } from './../services/login/login.service';
import { CartService } from './../services/cart/cart.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from './../models/Category/category.model';
import { CookieService } from 'ngx-cookie-service';
import { CustomerService } from './../services/customer/customer.service';
import { Customer } from './../models/customer/customer-model';
import { AppService } from './../services/app/app.service';
import { SharedService } from './../services/shared/shared.service';
import { WishList } from './../models/WishList/wishList-model';
import { WishListService } from './../services/wishlist/wishList.service';

@Component({
  selector: 'store-vendor',
  templateUrl: './store-vendor.component.html',
  styleUrls: ['./store-vendor.component.scss']
})
/** product-list component*/
export class StoreVendorComponent {
  // for wishlist
  public pId: number = 0;
  public wishList: WishList = new WishList();
  public wishlistcount: number;
  redirectUrl: string = "";
  public deferLoadShow: boolean;
  //end
  profileImage = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
  customerType: any;
  coverImage: any;
  customerModel = new Customer();
  pageNumber: number = 0;
  pageSize: number = 12;
  sortType = "";
  brands: string = "";
  brandList: Brand[] = [];
  categoryList: TreeviewItem[] = [];
  categories: string = "";
  bannerCategories = [];
  minPrice: number = 0;
  maxPrice: number = 0;
  currentCurrencyMinPrice = 0;
  currentCurrencyMaxPrice = 0;
  pkrMaxPrice = "";
  pkrMinPrice = "";
  totalRecords: number = 0;
  breadcrumbs; any;
  isSliderShow: boolean = true;
  options: Options = {
    floor: 0,
    ceil: 0,
  };


  values: number[];
  treeConfig = {
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500
  };

  public DummyCounter: number = 0;
  vendorShopName: any;
  storeName: any;
  vendorId: any;
  shopTitle: any;
  filtersList: CategoryFilters[] = [];
  filtersValuesList: CategoryFilterValues[] = [];
  isCategory = false;
  type = "";
  categoryBreadCrumbs: boolean = true;
  index = "";
  products: ProductResponseModel = new ProductResponseModel();
  prodImage = "";
  prodThumb = "";
  modalRef: BsModalRef;
  id = "";
  fields = "";
  cValues = "";
  level = "";
  heading = "";
  firstLoad: boolean = true; 
  config = {
    animated: true
  }
  customerProfilling: CustomerProfilling;
  categoryBannerImage: string = null;
  brandActiveClass = "";

  constructor(private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly wishListService: WishListService,
    private readonly loginService: LoginService,
    private readonly router: Router,
    private appService: AppService,
    private customerService: CustomerService,
    private cookieService: CookieService,
    vcr: ViewContainerRef,
    private sharedService: SharedService,
    private readonly toastr: ToastsManager) {
    this.sortType = "";
    this.products.products = [];
    this.toastr.setRootViewContainerRef(vcr);
    this.customerProfilling = new CustomerProfilling();
    window.scrollTo(0, 0);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.vendorShopName = params['name'];
      if (this.vendorShopName != 'undefined' || this.vendorShopName != null) {
        this.customerService.getVendorByShopName(this.vendorShopName).subscribe(
          data => {
            if (data) {
              this.customerModel = data;
              this.vendorId = this.customerModel.customerID;
              this.customerType = this.customerModel.customerTypeID;
              this.profileImage = this.customerModel.profileImagePath;
              this.coverImage = this.customerModel.coverImagePath;
              this.shopTitle = this.customerModel.shopTitle;
              if (this.customerModel.customerStatusID == 2 || this.customerModel.customerStatusID == 3) {
                this.router.navigate(["/"]);
              }
              this.GetProducts();
            }
            else { this.router.navigate(["/"]); }
          }
        )
      }
    });
    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });
  }
  onListenerTirgger() {
    this.isSliderShow = false;
    this.DummyCounter += 1;
    this.options.floor = this.ConvertCurrencyPipe(this.currentCurrencyMinPrice);
    this.options.ceil = this.ConvertCurrencyPipe(this.currentCurrencyMaxPrice);

    if ((this.pkrMaxPrice == "" && this.pkrMinPrice == "") || this.pkrMaxPrice == "0" && this.pkrMinPrice == "0") {
      this.maxPrice = this.ConvertCurrencyPipe(Number(this.currentCurrencyMaxPrice));
      this.minPrice = this.ConvertCurrencyPipe(Number(this.currentCurrencyMinPrice));
      //this.pkrMaxPrice = this.ConvertCurrencyToPkr(this.maxPrice).toString();
      //this.pkrMinPrice = this.ConvertCurrencyToPkr(this.minPrice).toString();
    }
    else {
      this.maxPrice = this.ConvertCurrencyPipe(Number(this.pkrMaxPrice));
      this.minPrice = this.ConvertCurrencyPipe(Number(this.pkrMinPrice));
    }
    var t = this;
    setTimeout(function () {
      t.isSliderShow = true;
    }, 1000);
  }


  DefaultImg() {
    this.profileImage = "http://ssl.gstatic.com/accounts/ui/avatar_2x.png";
  }

  CheckEquals(i) {
    return ((i + 1) == this.breadcrumbs.length);
  }

  GetIndex(i) {
    return (i + 1);
  }

  AddToCompareList(id: number) {
    if (this.cartService.AddToCompareList(id)) {
      this.toastr.success('Item added to compare list', 'success');
    }
    else {
      this.toastr.error('Item already added to compare list', 'error');
    }
  }


  ToggleClass(brand: Brand) {
    if (!brand.isChecked) {
      brand.selectedClass = "active";
    }
    else {
      brand.selectedClass = "";
    }
  }


  AddToWishList(id: number) {
    this.appService.CheckLogin(this.cookieService.get('Login')).subscribe(
      data => {
        if (!data) {
          this.toastr.info('Please Login into Your account to perform this action', 'info');
        }
        else {
          this.wishList.productID = id;
          this.wishList.customerID = Number(this.cookieService.get("CustomerID"));
          this.wishListService.addWishlist(this.wishList).subscribe(
            d => {
              if (d == 0) {
                this.toastr.info('Item already added to wish list', 'Information');
              }
              else {
                this.toastr.success('Item added to wish list', 'Success');
              }
            });
        }
      });
  }

  AddToCart(Product: any) {
    this.cartService.AddToCookieCart(Product, null);
  }

  Buy(product: Product) {
    this.cartService.AddToCookieCart(product, null);
    this.router.navigate(["/cart"]);
  }

  OnBrandSelect() {
    var brands = "";
    this.brandList.forEach(x => {
      if (x.isChecked) {
        if (brands == "")
          brands = x.brandID.toString();
        else
          brands = brands + "," + x.brandID;
      }
    });
    this.brands = brands;
    if (typeof this.type != "undefined")
      this.GetProducts();
    else if (typeof this.index != "undefined" && typeof this.id != "undefined")
      this.GetProductsByCategory();
  }

  RangeValueChange() {
    if (typeof this.type != "undefined")
      this.GetProducts();
    else if (typeof this.index != "undefined" && typeof this.id != "undefined")
      this.GetProductsByCategory();
  }


  GetProductsByCategory() {
    // here we set CustomerProfilling
    try {
      var CustID = this.cookieService.get('CustomerID');
      if (CustID == null || CustID == "" || typeof CustID == "undefined") {
        this.customerProfilling.customerID = 0;
      }
      else {
        this.customerProfilling.customerID = Number(this.cookieService.get('CustomerID'));
      }

      this.customerProfilling.type = 1;
      this.customerProfilling.value = this.id.toString();
      this.customerProfilling.visitorID = this.cookieService.get("visitorID");

      this.productService.AddCustomerProfilling(this.customerProfilling).subscribe(
        data => {
        }
      )
    } catch (e) {

    }
    this.pkrMaxPrice = this.ConvertCurrencyToPkr(this.maxPrice).toString();
    this.pkrMinPrice = this.ConvertCurrencyToPkr(this.minPrice).toString();
    this.productService.GetProductsByCategory(
      this.pageNumber,
      this.pageSize,
      this.brands,
      this.id,
      this.categories,
      this.fields,
      this.cValues,
      this.pkrMinPrice,
      this.pkrMaxPrice,
      this.firstLoad,
      this.index, this.sortType).subscribe(
        data => {
          if (this.firstLoad) {
            this.currentCurrencyMinPrice = data.minPrice;
            this.currentCurrencyMaxPrice = data.maxPrice;

            this.maxPrice = this.ConvertCurrencyPipe(data.maxPrice);
            this.minPrice = this.ConvertCurrencyPipe(data.minPrice);
            this.options.floor = this.ConvertCurrencyPipe(data.minPrice);
            this.options.ceil = this.ConvertCurrencyPipe(data.maxPrice);
          }
          this.products = data;
          if (this.firstLoad) {
            if (data != null && typeof data.products != "undefined") {
              this.brandList = JSON.parse(JSON.stringify(this.products.brands));
              this.categoryList = this.GetCategories(this.products.categories);

              this.categoryBannerImage = this.products.categoryBannerImage;

              if (this.products.categories != null && this.products.categories.length > 0) {
                this.products.categories.forEach(x => {
                  if (!x.isParent) {
                    this.bannerCategories.push(JSON.parse(JSON.stringify(x)));
                  }
                });
              }

              if (this.products.categoryFilters != null)
                this.filtersList = JSON.parse(JSON.stringify(this.products.categoryFilters));
              if (this.products.filtersValues != null)
                this.filtersValuesList = JSON.parse(JSON.stringify(this.products.filtersValues));
            }
          }

          if (data.products != null && data.products.length > 0)
            this.totalRecords = data.products[0].totalRecords;

          this.firstLoad = false;
        });
  }

  GetProducts() { 
    if (typeof this.vendorId == 'undefined' || (this.vendorId == null)) this.vendorId = 0; 
    this.pkrMaxPrice = this.ConvertCurrencyToPkr(this.maxPrice).toString();
    this.pkrMinPrice = this.ConvertCurrencyToPkr(this.minPrice).toString();
    this.productService.GetProductsList("",
      this.vendorId,
      this.pageNumber,
      this.pageSize,
      this.brands,
      this.categories,
      this.pkrMinPrice,
      this.pkrMaxPrice,
      this.firstLoad, this.sortType).subscribe(
        data => {
          if (this.firstLoad) {
            this.currentCurrencyMinPrice = data.minPrice;
            this.currentCurrencyMaxPrice = data.maxPrice;

            this.maxPrice = this.ConvertCurrencyPipe(data.maxPrice);
            this.minPrice = this.ConvertCurrencyPipe(data.minPrice);
            this.options.floor = this.ConvertCurrencyPipe(data.minPrice);
            this.options.ceil = this.ConvertCurrencyPipe(data.maxPrice);
          }
          this.products = data;
          if (this.firstLoad) {
            if (data != null && typeof data.products != "undefined") {
              this.brandList = JSON.parse(JSON.stringify(this.products.brands));
              this.categoryList = this.GetCategories(this.products.categories);


            }
          }

          if (data.products != null && data.products.length > 0)
            this.totalRecords = data.products[0].totalRecords;

          this.firstLoad = false;
        });
  }

  OnFilterChange() {

    if (typeof this.type != "undefined")
      this.GetProducts();
    else if (typeof this.index != "undefined" && typeof this.id != "undefined")
      this.GetProductsByCategory();

  }
  OnDynamicFilterChange(value) {
    value.active = !value.active;
    let selectedFilter: CategoryFilterValues[] = this.filtersValuesList.filter(x => x.active);
    var fields = this.fields = "";
    var values = this.cValues = "";
    selectedFilter.forEach(x => {

      if (fields == "")
        fields = x.fieldID.toString();
      else
        fields = fields + "," + x.fieldID;

      if (values == "")
        values = x.value;
      else
        values = values + "," + x.value;
    });


    this.fields = fields;
    this.cValues = values;

    if (typeof this.type != "undefined")
      this.GetProducts();
    else if (typeof this.index != "undefined" && typeof this.id != "undefined")
      this.GetProductsByCategory();
  }

  PageChanged($event) {
    this.pageNumber = ($event.page) - 1;
    this.pageSize = $event.itemsPerPage;

    if (typeof this.type != "undefined")
      this.GetProducts();
    else if (typeof this.index != "undefined" && typeof this.id != "undefined")
      this.GetProductsByCategory();
  }

  OnSelectedChange($event, id: any) {
    //this.categories = "";
    //$event.forEach(x => {
    //  if (this.categories != "")
    //    this.categories = this.categories + "," + x;
    //  else
    //    this.categories = x;
    //});

    //if (typeof this.type != "undefined") 
    //else if (typeof this.index != "undefined" && typeof this.id != "undefined")
    //  this.GetProductsByCategory();

    this.categories = id;
    this.pageNumber = 0;
    this.GetProducts();
  }

  ResetFiltration() {
    let path = "/store/" + this.customerModel.shopeName;
    this.router.navigate([path]);
    this.maxPrice = this.options.ceil;
    this.minPrice = this.options.floor;
    if (this.brandList != null) {
      for (var i = 0; i < this.brandList.length; i++) {
        this.brandList[i].isChecked = false;
        this.brandList[i].selectedClass = "";
      }
    }
    this.categories = "";
    this.pageNumber = 0;
    this.pageSize = 12;
    this.brands = "";
    this.pkrMinPrice = "";
    this.pkrMaxPrice = "";
    this.pageNumber = 0;
    this.GetProducts();
  }

  ToggleShow(parent) {
    parent.isShow = !parent.isShow;
  }

  GetBreadCrumbs() {

    this.productService.GetBreadCrumbs(this.id).subscribe(d => {
      this.breadcrumbs = d;
    });


  }

  GetCategories(categoryList: Category[]): TreeviewItem[] {

    let finalCategoryList = [];
    if (categoryList != null) {
      categoryList.forEach(category => {
        if (category.isParent && category.parentCategoryID == 0) {
          finalCategoryList.push({
            text: category.categoryName,
            value: category.categoryID,
            isShow: false
          });
        }
      });

      let secondLevelChild: Category[] = categoryList.filter(x => x.isParent && x.parentCategoryID > 0);
      secondLevelChild.forEach(x => {
        let parentCategory = finalCategoryList.filter(y => y.value == x.parentCategoryID);
        if (parentCategory.length > 0) {
          if (parentCategory[0].children == null || typeof parentCategory[0].children == "undefined") {
            parentCategory[0].children = [{
              text: x.categoryName,
              value: x.categoryID,
              isShow: false
            }];
          }
          else {
            parentCategory[0].children.push({
              text: x.categoryName,
              value: x.categoryID,
            });
          }
        }
      });

      let thirdLevelChild: Category[] = categoryList.filter(x => !x.isParent && x.parentCategoryID > 0);
      thirdLevelChild.forEach(x => {
        finalCategoryList.forEach(finalFirst => {
          if (typeof finalFirst.children != 'undefined') {
            let parentCategory = finalFirst.children.filter(z => z.value == x.parentCategoryID);
            if (parentCategory.length > 0) {
              if (parentCategory[0].children == null || typeof parentCategory[0].children == "undefined") {
                parentCategory[0].children = [{
                  text: x.categoryName,
                  value: x.categoryID,
                }];
              }
              else {
                parentCategory[0].children.push({
                  text: x.categoryName,
                  value: x.categoryID,
                });
              }
            }
          }
        });
      });
    }

    return finalCategoryList;
  }

  ConvertCurrencyPipe(price: number): number {
    let rate: number = 1;
    if (typeof this.cookieService.get('Currency') != 'undefined' && this.cookieService.get('Currency') != null)
      rate = parseFloat(this.cookieService.get('Currency').split('/')[1]);

    let calculatedPrice = price * rate;
    return Number(calculatedPrice.toFixed(2));
  }


  ConvertCurrencyToPkr(price: number): number {
    let rate: number = 1;
    let calculatedPrice = price;
    if (this.cookieService.get('Currency').split('/')[0].toLowerCase() != "pkr") {
      rate = parseFloat(this.cookieService.get('Currency').split('/')[1]);
      calculatedPrice = price / rate;
    }

    return Number(calculatedPrice.toFixed(2));
  }
  AddIntoWishList(id: number) {
    this.wishList.customerID = (this.cookieService.get("CustomerID") && this.cookieService.get("CustomerID") != "" && typeof this.cookieService.get("CustomerID") != "undefined") ? parseInt(this.cookieService.get("CustomerID")) : 0;// userdata.customerID;
    this.wishList.productID = id;

    this.wishListService.addWishlist(this.wishList).subscribe(
      d => {
        if (d == 0) {
          this.toastr.success('Item removed from wishlist', 'Success');
          var index = this.products.products.findIndex(x => x.productID == id);
          this.products.products[index].isFavourite = !this.products.products[index].isFavourite;
          this.wishlistcount = parseInt(this.cookieService.get('wishlistCounters')) - 1;
          this.cookieService.set('wishlistCounters', this.wishlistcount.toString());
        }
        else if (d == -1) {
          this.router.navigate(['/login'], { queryParams: { url: this.redirectUrl } });
          //this.modalRef = this.modalService.show(loginTemplate, this.config);
        }
        else {
          this.wishlistcount = parseInt(this.cookieService.get('wishlistCounters')) + 1;
          this.cookieService.set('wishlistCounters', this.wishlistcount.toString());
          this.toastr.success('Item added to wishlist', 'Success');
          var index = this.products.products.findIndex(x => x.productID == id);
          this.products.products[index].isFavourite = !this.products.products[index].isFavourite;
        }

      });

  }

}

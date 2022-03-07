import { Component, ViewContainerRef } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ProductResponseModel, CategoryFilters, CategoryFilterValues, TreeviewItem, Product, CustomerProfilling } from '../../models/products/product.model';
import { Brand } from '../../models/brand/brand-model';
import { Options } from 'ng5-slider';
import { LoginService } from '../../services/login/login.service';
import { CartService } from '../../services/cart/cart.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../models/category/category.model';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../../services/shared/shared.service';
import { WishList } from '../../models/WishList/wishList-model';
import { WishListService } from '../../services/wishlist/wishList.service';
@Component({
    selector: 'app-search-list',
    templateUrl: './search-list.component.html',
    styleUrls: ['./search-list.component.css']
})
/** search-list component*/
export class SearchListComponent {
  // for wishlist
  public pId: number = 0;
  public wishList: WishList = new WishList();
  public wishlistcount: number;
  redirectUrl: string = "";
  public deferLoadShow: boolean;
  //end
    /** search-list ctor */
  pageNumber: number = 0;
  pageSize: number = 12;
  isSliderShow: boolean = true;
  brands: string = "";
  sortType = "";
  showFilter: boolean = false;
  brandFilter: boolean = false;
  priceFilter: boolean = false;
  variantFilter: boolean = false;
  brandList: Brand[] = [];
  imageServerPath: string;
  categoryList: TreeviewItem[] = [];
  categories: string = "";
  saleID: number;
  pkrMaxPrice = "";
  pkrMinPrice = "";
  minPrice: number = 0;
  maxPrice: number = 0;
  bannerCategories = [];
  currentCurrencyMinPrice = 0;
  currentCurrencyMaxPrice = 0;
  totalRecords: number = 0;
  breadcrumbs: any;
  public DummyCounter: number = 0;
  options: Options = {
    floor: 0,
    ceil: 0,
  };
  carouselOptions: any = {
    nav: true,
    dots: false,
    loop: false,
    items: 6,
    itemslideSpeed: 2000,
    autoplay: false,
    responsiveRefreshRate: 200,
    autoplayHoverPause: true,
    navText: ["<i class='fa fa-angle-left' aria-hidden='true'></i>", "<i class='fa fa-angle-right' aria-hidden='true'></i>"],
    responsive: {
      0: {
        items: 1,
        nav: false,
        dots: false,
      },
      401: {
        items: 2,
        nav: false,
        dots: false,
      },
      460: {
        items: 3,
        nav: false,
        dots: false,
      },
      768: {
        items: 4,
        nav: false,
        dots: true,
      },
      1200: {
        items: 6,
        nav: false,
        dots: true,
      },
      1201: {
        items: 6,
        nav: true,
        dots: false,
      }
    }
  }


  bannerImages: any[]
  values: number[];
  treeConfig = {
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500
  };

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
  
  fields = "";
  cValues = "";
  level = "";
  heading = "";
  search = "";
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
    private readonly loginService: LoginService,
    private sharedService: SharedService,
    private readonly router: Router,
    private cookieService: CookieService,
    vcr: ViewContainerRef,
    private readonly toastr: ToastsManager,
    private readonly wishListService: WishListService) {
    this.sortType = "";
    this.toastr.setRootViewContainerRef(vcr);
    this.customerProfilling = new CustomerProfilling();
    this.saleID = 0;
    this.imageServerPath = "";
    this.heading="Search List Product's"

    var search = localStorage.getItem("seachText");
    if (search == null || search == "" || typeof search == "undefined") {
      this.search = "";
    }
    else {
      this.search = localStorage.getItem("seachText");
    }



    //this.activatedRoute.params.subscribe((params: Params) => {
    //  this.search = params['search'];
    //});

    if (typeof this.search != "undefined") {
    // call funtion here to get products
    this.products = new ProductResponseModel();
    this.products.products = [];
    this.GetSearchProducts();
    }
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


  OnFilterChange() {

    if (typeof this.search != "undefined") {
      // call funtion here to get products
      this.products = new ProductResponseModel();
      this.products.products = [];
      this.GetSearchProducts();
    }

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
    this.cartService.AddToWishlist(id).subscribe(
      d => {
        this.toastr.success('Item added to wish list', 'Success');
      });
  }

  AddToCart(product: Product) {
    this.cartService.AddToCookieCart(product, null);
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
    if (typeof this.search != "undefined")
      this.GetSearchProducts();
    this.showFilter = true;
    this.brandFilter = true;
  }

  RangeValueChange() {
    if (typeof this.search != "undefined")
      this.GetSearchProducts();
    this.showFilter = true;
    this.priceFilter = true;
  }

  GetSearchProducts() {



    try {
      var CustID = this.cookieService.get('CustomerID');
      if (CustID == null || CustID == "" || typeof CustID == "undefined") {
        this.customerProfilling.customerID = 0;
      }
      else {
        this.customerProfilling.customerID = Number(this.cookieService.get('CustomerID'));
      }
      this.customerProfilling.type = 2;
      this.customerProfilling.value = this.search.toString();
      this.customerProfilling.visitorID = this.cookieService.get("visitorID");
      this.productService.AddCustomerProfilling(this.customerProfilling).subscribe(
        data => {
        }
      )
    } catch (e) {
    }

    this.pkrMaxPrice = this.ConvertCurrencyToPkr(this.maxPrice).toString();
    this.pkrMinPrice = this.ConvertCurrencyToPkr(this.minPrice).toString();



    this.productService.GetSearchProductsList(
      decodeURI(this.search),
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
          debugger
          if (data != null && typeof data.products != "undefined") {
            this.brandList = JSON.parse(JSON.stringify(this.products.brands));
            this.categoryList = this.GetCategories(this.products.categories);

            this.categoryBannerImage = this.products.categoryBannerImage;


            if (this.products.categories != null)
              this.bannerImages = this.products.categories.filter(x => x.isParent && x.parentCategoryID == 0);

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
  
  

  PageChanged($event) {
    this.pageNumber = ($event.page) - 1;
    this.pageSize = $event.itemsPerPage;
    if (typeof this.search != "undefined")
      this.GetSearchProducts();
  }

  OnSelectedChange($event) {

    this.categories = "";
    $event.forEach(x => {
      if (this.categories != "")
        this.categories = this.categories + "," + x;
      else
        this.categories = x;
    });
    if (typeof this.search != "undefined")
      this.GetSearchProducts();
  }

  ToggleShow(parent) {
    parent.isShow = !parent.isShow;
  }



  GetCategories(categoryList: Category[]): TreeviewItem[] {

    let finalCategoryList = [];
    if (categoryList != null) {
      categoryList.forEach(category => {
        if (category.isParent && category.parentCategoryID == 0) {
          finalCategoryList.push({
            text: category.categoryName,
            value: category.categoryID,
            url: category.url,
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
              url: x.url,
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
          if (typeof finalFirst.children != "undefined") {
            let parentCategory = finalFirst.children.filter(z => z.value == x.parentCategoryID);
          if (parentCategory.length > 0) {
            if (parentCategory[0].children == null || typeof parentCategory[0].children == "undefined") {
              parentCategory[0].children = [{
                text: x.categoryName,
                value: x.categoryID,
                url: x.url,
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

  setFilterPrice() {
    this.showFilter = true;
    this.priceFilter = true;
  }
  clearBrand() {
    this.brands = "";
    this.categories = "";
    this.pageNumber = 0;
   // this.currentPage = 1;
    try {
      if (this.brandList != null) {
        for (var i = 0; i < this.brandList.length; i++) {
          this.brandList[i].isChecked = false;
          this.brandList[i].selectedClass = "";
        }
      }
    } catch (e) {

    }
    this.brandFilter = false;
    if (typeof this.search != "undefined")
      this.GetSearchProducts();
    if (this.variantFilter == false && this.priceFilter == false && this.brandFilter == false) {
      this.showFilter = false;
    }
  }
  clearFilterPrice() {
    this.pageNumber = 0;
   // this.currentPage = 1;
    this.maxPrice = this.options.ceil;
    this.minPrice = this.options.floor;
    if (typeof this.search != "undefined")
      this.GetSearchProducts();
    this.priceFilter = false;
    if (this.variantFilter == false && this.priceFilter == false && this.brandFilter == false) {
      this.showFilter = false;
    }
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

    //if (typeof this.cookieService.get('Currency') != 'undefined' && this.cookieService.get('Currency') != null)
    //  rate = parseFloat(this.cookieService.get('Currency').split('/')[1]);

    //let calculatedPrice = price * rate;
    return Number(calculatedPrice.toFixed(2));
  }
  clearVariationFilter() {
    this.pageNumber = 0;
    //this.currentPage = 1;
    this.fields = "";
    this.cValues = "";
    try {
      if (this.filtersValuesList != null) {
        for (var i = 0; i < this.filtersValuesList.length; i++) {
          this.filtersValuesList[i].active = false;

        }
      }
    } catch (e) {

    }
    this.variantFilter = false;
    if (typeof this.search != "undefined")
      this.GetSearchProducts();
    if (this.variantFilter == false && this.priceFilter == false && this.brandFilter == false) {
      this.showFilter = false;
    }
  }
  clearAllFilter() {
    this.brands = "";
    this.categories = "";
    try {
      if (this.brandList != null) {
        for (var i = 0; i < this.brandList.length; i++) {
          this.brandList[i].isChecked = false;
          this.brandList[i].selectedClass = "";
        }
      }
    } catch (e) {

    }
    try {
      if (this.filtersValuesList != null) {
        for (var i = 0; i < this.filtersValuesList.length; i++) {
          this.filtersValuesList[i].active = false;

        }
      }
    } catch (e) {

    }
    this.fields = "";
    this.cValues = "";
    this.maxPrice = this.options.ceil;
    this.minPrice = this.options.floor;
    this.showFilter = false;
    this.variantFilter = false;
    this.priceFilter = false;
    this.brandFilter = false;
    this.pageNumber = 0;
  //  this.currentPage = 1;
    if (typeof this.search != "undefined")
      this.GetSearchProducts();
   
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

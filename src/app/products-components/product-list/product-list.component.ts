import { Component, ViewContainerRef } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ProductResponseModel, CategoryFilters, CategoryFilterValues, TreeviewItem, Product, CustomerProfilling } from '../../models/products/product.model';
import { Brand } from '../../models/brand/brand-model';
import { Options } from 'ng5-slider';
import { LoginService } from '../../services/login/login.service';
import { CartService } from '../../services/cart/cart.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from '../../models/category/category.model';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../../services/shared/shared.service';
import { CurrencyConversionPipe } from '../../custom-pipes/currency-conversion.pipe';
import { UrlRedirectionService } from '../../services/url-redirection/url-redirection.service';
import { Location } from '@angular/common';
import { WishList } from '../../models/WishList/wishList-model';
import { WishListService } from '../../services/wishlist/wishList.service';
import { CategoryService } from '../../services/category/category.service';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
/** product-list component*/
export class ProductListComponent {


  isSliderShow: boolean = true;
  // for wishlist
  public pId: number = 0;
  public wishList: WishList = new WishList();
  public wishlistcount: number;
  customerID: number;
  //end
  public categoryDetail = new Category();
  pageNumber: number = 0;
  pageSize: number = 12;
  totalRecords: number = 0;
  brands: string = "";
  brandList: Brand[] = [];
  imageServerPath: string;
  categoryList: TreeviewItem[] = [];
  categories: string = "";
  saleID: number;
  bannerCategories = [];
  showFilter: boolean = false;
  brandFilter: boolean = false;
  priceFilter: boolean = false;
  variantFilter: boolean = false;
  minPrice: number = 0;
  maxPrice: number = 0;
  isLoaded = false;
  currentCurrencyMinPrice = 0;
  currentCurrencyMaxPrice = 0;
  pkrMaxPrice = "";
  pkrMinPrice = "";
  isThirdLevel: boolean = false;
  currentPage = 1;
  //minPrice: string = "";
  //maxPrice: string = "";
  sortType = "";
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
  currentLocation: string;
  public urlHit: string;
  filtersList: CategoryFilters[] = [];
  filtersValuesList: CategoryFilterValues[] = [];
  isCategory = false;
  type = "";
  url = "";
  category: Category;
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
  redirectUrl: string = "";
  constructor(private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly loginService: LoginService,
    private readonly router: Router,
    private cookieService: CookieService,
    vcr: ViewContainerRef,
    private location: Location,
    private UrlService: UrlRedirectionService,
    private sharedService: SharedService,
    private categoryService: CategoryService,
    private readonly toastr: ToastsManager,
    private readonly wishListService: WishListService, public meta: Meta, private titleService: Title) {
    this.sortType = "";
    this.toastr.setRootViewContainerRef(vcr);
    this.customerProfilling = new CustomerProfilling();
    this.imageServerPath = "";
    this.activatedRoute.params.subscribe((params: Params) => {
      this.saleID = params['id'];
      //this.id = params['id'];
      //this.index = params['index'];
      //this.type = params['type'];  
      this.url = params['url'];
      this.redirectUrl = this.router.url;
      try {
        if (this.cookieService.get('CustomerID')) {

          this.customerID = parseInt(this.cookieService.get('CustomerID'));
        }
        else {
          this.customerID = 0;
        }
      } catch (e) {
        this.customerID = 0;
      }
    });
    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }


    //  if (typeof this.type != "undefined") {
    //  //  this.GetProducts();
    //  //  this.isCategory = false;

    //  //  if (this.type.toLocaleLowerCase() == "feature")
    //  //    this.heading = "Featured Products";
    //  //  else if (this.type.toLocaleLowerCase() == "sale")
    //  //    this.heading = "On Sale Products";
    //  //  else if (this.type.toLocaleLowerCase() == "topselling")
    //  //    this.heading = "Top selling Products";
    //  //  else if (this.type.toLocaleLowerCase() == "rated")
    //  //    this.heading = "Top Rated Products";
    //  //  else if (this.type.toLocaleLowerCase() == "bestvendor")
    //  //    this.heading = "Best Vendor Products";

    //  //  this.categoryBreadCrumbs = false;
    //  //
    //}

    //  else
    //  if (typeof this.index != "undefined" && typeof this.id != "undefined") {

    //  this.heading = "";

    //  if (this.index != "3")
    //    this.isCategory = false;
    //  else
    //    this.isCategory = true;


    //  this.categoryBreadCrumbs = true;
    //  this.GetProductsByCategory();
    //}
    //else if (typeof this.id != "undefined") {

    //  this.saleID = Number(this.id);
    //  // call funtion here to get products
    //  this.GetSaleProducts();
    //  this.categoryBreadCrumbs = false;
    //}

    //if (this.categoryBreadCrumbs) {
    //  this.GetBreadCrumbs();
    //}
    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });

  }
  getCategoryInfo(categoryId: number) {
    this.productService.GetBreadCrumbs(categoryId).subscribe(d => {

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
    this.pageNumber = 0;
    this.currentPage = 1;
    this.brandList.forEach(x => {
      if (x.isChecked) {
        if (brands == "")
          brands = x.brandID.toString();
        else
          brands = brands + "," + x.brandID;
      }
    });
    this.brands = brands;

    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }
    this.showFilter = true;
    this.brandFilter = true;

  }

  RangeValueChange() {

    this.pageNumber = 0;
    this.currentPage = 1;
    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }
    this.showFilter = true;
    this.priceFilter = true;
  }




  OnFilterChange() {
    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }
  }
  setFilterPrice() {
    this.showFilter = true;
    this.priceFilter = true;
  }
  clearBrand() {
    this.brands = "";
    this.categories = "";
    this.pageNumber = 0;
    this.currentPage = 1;
    try {
      if (this.brandList != null) {
        for (var i = 0; i < this.brandList.length; i++) {
          this.brandList[i].isChecked = false;
          this.brandList[i].selectedClass = "";
        }
      }
    } catch (e) {

    }
    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }
    this.brandFilter = false;
    if (this.variantFilter == false && this.priceFilter == false && this.brandFilter == false) {
      this.showFilter = false;
    }
  }
  clearFilterPrice() {
    this.pageNumber = 0;
    this.currentPage = 1;
    this.maxPrice = this.options.ceil;
    this.minPrice = this.options.floor;
    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }
    this.priceFilter = false;
    if (this.variantFilter == false && this.priceFilter == false && this.brandFilter == false) {
      this.showFilter = false;
    }
  }
  clearVariationFilter() {
    this.pageNumber = 0;
    this.currentPage = 1;
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
    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
      this.getCategoryDetail();
    }
    else {
      this.GetProductsByCategory();
    }
    this.variantFilter = false;
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
    this.currentPage = 1;
    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }
  }
  GetSaleProducts() {
    this.pkrMaxPrice = this.ConvertCurrencyToPkr(this.maxPrice).toString();
    this.pkrMinPrice = this.ConvertCurrencyToPkr(this.minPrice).toString();

    this.productService.GetSaleProductsList(
      this.saleID,
      this.pageNumber,
      this.pageSize,
      this.brands,
      this.categories,
      this.pkrMinPrice,
      this.pkrMaxPrice,
      this.firstLoad,
      this.customerID,
      this.sortType).subscribe(
        data => {
          if (this.firstLoad) {
            this.currentCurrencyMinPrice = data.minPrice;
            this.currentCurrencyMaxPrice = data.maxPrice;

            this.maxPrice = this.ConvertCurrencyPipe(data.maxPrice);
            this.minPrice = this.ConvertCurrencyPipe(data.minPrice);
            this.options.floor = this.ConvertCurrencyPipe(data.minPrice);
            this.options.ceil = this.ConvertCurrencyPipe(data.maxPrice);

            //this.maxPrice = data.maxPrice;
            //this.minPrice = data.minPrice;
            //this.options.floor = data.minPrice;
            //this.options.ceil = data.maxPrice;
          }
          this.products = data;
          this.imageServerPath == this.products.imageServerPath;
          if (this.firstLoad) {
            this.bannerImages = [];
            this.bannerImages.push(this.products.sale.saleLogo);

            this.categoryBannerImage = this.products.categoryBannerImage;
            if (data != null && typeof data.products != "undefined") {
              this.brandList = JSON.parse(JSON.stringify(this.products.brands));
              this.categoryList = this.GetCategories(this.products.categories);

              if (this.products.categories != null && this.products.categories.length > 0) {
                this.products.categories.forEach(x => {
                  if (!x.isParent) {
                    this.bannerCategories.push(JSON.parse(JSON.stringify(x)));
                  }
                });
              }
            }
          }

          if (data.products != null && data.products.length > 0)
            this.totalRecords = data.products[0].totalRecords;
          else
            this.totalRecords = 0;

          this.firstLoad = false;
        });
  }
  getCategoryDetail() {
    this.categoryService.GetCategoryByCategoryUrl(this.url).subscribe(
      data => {
        if (data) {
          this.categoryDetail = data;
          if (this.categoryDetail.metaDescription != null && this.categoryDetail.metaDescription != "" && this.categoryDetail.metaDescription != "null") {
            this.meta.updateTag({ name: 'description', content: this.categoryDetail.metaDescription });
          }
          if (this.categoryDetail.metaTag != null && this.categoryDetail.metaTag != "" && this.categoryDetail.metaTag != "null") {
            this.meta.updateTag({ name: 'keywords', content: this.categoryDetail.metaTag });
          }
          if (this.categoryDetail.metaTitle != null && this.categoryDetail.metaTitle != "" && this.categoryDetail.metaTitle != "null") {
            this.titleService.setTitle(this.categoryDetail.metaTitle);
          }
          else {
            this.titleService.setTitle(this.categoryDetail.categoryName);
          }

        }

      })
  }
  GetProductsByCategory() {
    this.pkrMaxPrice = this.ConvertCurrencyToPkr(this.maxPrice).toString();
    this.pkrMinPrice = this.ConvertCurrencyToPkr(this.minPrice).toString();
    this.productService.GetProductsByCategoryUrl(
      this.pageNumber,
      this.pageSize,
      this.brands,
      this.url,
      this.categories,
      this.fields,
      this.cValues,
      this.pkrMinPrice,
      this.pkrMaxPrice,
      this.firstLoad,
      //this.index,
      this.sortType,
    ).subscribe(
      data => {
        //RedirectToHomePage = true,
        //  RedirectToCategoryUrl = false,
        //  RedirectToNewUrl = false,
        //  RedirectToNotFound = false,
        this.isLoaded = true;
        if (data.redirectToCategoryUrl) {
          if (data.newUrl) {

            this.router.navigate(["/" + data.newUrl]);
          }

          if (this.firstLoad) {

            this.breadcrumbs = data.breadCrumbs;
            if (data.breadCrumbs != null) {
              this.heading = data.breadCrumbs[data.breadCrumbs.length - 1].categoryName;
            }
            this.getCategoryInfo(data.breadCrumbs[data.breadCrumbs.length - 1].categoryID);
            //this.maxPrice = data.maxPrice;
            //this.minPrice = data.minPrice;
            //this.options.floor = data.minPrice;
            //this.options.ceil = data.maxPrice;
            this.currentCurrencyMinPrice = data.minPrice;
            this.currentCurrencyMaxPrice = data.maxPrice;

            this.maxPrice = this.ConvertCurrencyPipe(data.maxPrice);
            this.minPrice = this.ConvertCurrencyPipe(data.minPrice);
            this.options.floor = this.ConvertCurrencyPipe(data.minPrice);
            this.options.ceil = this.ConvertCurrencyPipe(data.maxPrice);
          }

          this.products = data;
          if (this.firstLoad) {

            //get category detail too

            this.getCategoryDetail();



            if (data != null && typeof data.products != "undefined") {
              this.brandList = JSON.parse(JSON.stringify(this.products.brands));
              this.categoryList = this.GetCategories(this.products.categories);

              this.categoryBannerImage = this.products.categoryBannerImage;


              if (this.products.categories != null)
                this.bannerImages = this.products.categories.filter(x => x.url == this.url);
              else {
                this.isThirdLevel = true;
                this.bannerImages = [{ largeImage: this.products.categoryBannerImage }];
              }

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
          else
            this.totalRecords = 0;
          this.firstLoad = false;
        }
        else if (data.redirectToHomePage) {

          this.router.navigate(["/"]);
        }
        else if (data.redirectToNewUrl) {
          this.router.navigate(["/" + data.newUrl]);
        }
        else if (data.redirectToNotFound) {
          this.router.navigate(["/404"]);
        }


      });
  }

  GetProducts() {


    this.pkrMaxPrice = this.ConvertCurrencyToPkr(this.maxPrice).toString();
    this.pkrMinPrice = this.ConvertCurrencyToPkr(this.minPrice).toString();

    this.productService.GetProductsList(this.type,
      0,
      this.pageNumber,
      this.pageSize,
      this.brands,
      this.categories,
      this.pkrMinPrice,
      this.pkrMaxPrice,
      this.firstLoad, this.sortType).subscribe(
        data => {
          if (this.firstLoad) {
            //this.maxPrice = data.maxPrice;
            //this.minPrice = data.minPrice;
            //this.options.floor = data.minPrice;
            //this.options.ceil = data.maxPrice;

            this.currentCurrencyMinPrice = data.minPrice;
            this.currentCurrencyMaxPrice = data.maxPrice;

            this.maxPrice = this.ConvertCurrencyPipe(data.maxPrice);
            this.minPrice = this.ConvertCurrencyPipe(data.minPrice);
            this.options.floor = this.ConvertCurrencyPipe(data.minPrice);
            this.options.ceil = this.ConvertCurrencyPipe(data.maxPrice);

          }
          this.products = data;
          if (this.firstLoad) {

            if (this.products.categories != null)
              this.bannerImages = this.products.categories.filter(x => x.isParent && x.parentCategoryID == 0);

            this.categoryBannerImage = this.products.categoryBannerImage;
            if (data != null && typeof data.products != "undefined") {
              this.brandList = JSON.parse(JSON.stringify(this.products.brands));
              this.categoryList = this.GetCategories(this.products.categories);

              if (this.products.categories != null && this.products.categories.length > 0) {
                this.products.categories.forEach(x => {
                  if (!x.isParent) {
                    this.bannerCategories.push(JSON.parse(JSON.stringify(x)));
                  }
                });
              }
            }
          }

          if (data.products != null && data.products.length > 0)
            this.totalRecords = data.products[0].totalRecords;
          else
            this.totalRecords = 0;

          this.firstLoad = false;
        });
  }


  OnDynamicFilterChange(value) {
    this.showFilter = true;
    this.variantFilter = true;
    this.pageNumber = 0;
    this.currentPage = 1;
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
    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }
  }

  PageChanged($event) {
    this.pageNumber = ($event.page) - 1;
    this.currentPage = ($event.page);
    this.pageSize = $event.itemsPerPage;

    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }
  }

  OnSelectedChange($event) {

    this.categories = "";
    $event.forEach(x => {
      if (this.categories != "")
        this.categories = this.categories + "," + x;
      else
        this.categories = x;
    });

    if (this.redirectUrl.includes("flash-sale")) {
      this.GetSaleProducts();
    }
    else {
      this.GetProductsByCategory();
    }
  }

  ToggleShow(parent) {
    parent.isShow = !parent.isShow;
  }

  GetBreadCrumbs() {

    this.productService.GetBreadCrumbs(this.id).subscribe(d => {
      this.breadcrumbs = d;
      if (d != null || typeof this.index != "undefined" && typeof this.id != "undefined") {
        this.heading = d[d.length - 1].categoryName;
      }
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
              url: x.url,
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
                  url: x.url,
                });
              }
            }
          }});
      
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

    //if (typeof this.cookieService.get('Currency') != 'undefined' && this.cookieService.get('Currency') != null)
    //  rate = parseFloat(this.cookieService.get('Currency').split('/')[1]);

    //let calculatedPrice = price * rate;
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
          this.toastr.success('Item added to wish list', 'Success');
          var index = this.products.products.findIndex(x => x.productID == id);
          this.products.products[index].isFavourite = !this.products.products[index].isFavourite;
        }

      });

  }
}

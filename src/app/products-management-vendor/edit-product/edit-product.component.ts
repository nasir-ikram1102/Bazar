import { Component, ViewContainerRef, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product, ProductAccessory, ProductInCategoies } from '../../models/products/product.model';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category/category.model';
import { DisplayCategory } from '../../models/category/DisplayCategory.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
 
import { Customer } from '../../models/customer/customer-model'
import { CustomerService } from '../../services/customer/customer.service';
import { BrandService } from '../../services/brand/brand.service';
import { Brand } from '../../models/brand/brand-model';
import { Subscription } from 'rxjs'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'; 
import { Warranty } from '../../models/products/product.model';
import { ReturnPolicy } from '../../models/products/product.model';
import { EnumDropDown } from '../../models/shared/enum-dropdown'; 
import { AppService } from '../../services/app/app.service'; 
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
/** Edit-Product component*/
export class EditProductComponent {

  product = new Product();
  public products: Product[] = [];
  public productImages: any[] = [];
  public productAccessories: Product[] = [];
  public productInCategoies: Category[] = [];
  public productStatus: EnumDropDown[];
  public selectedProductAccessories: Product[] = [];
  public selectedProductInCategoies: ProductInCategoies[] = [];
  public productsDropdownSettings = {
    singleSelection: false,
    idField: 'productID',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  public categoriesDropdownSettings = {
    singleSelection: false,
    idField: 'categoryID',
    textField: 'categoryName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  public modalRef: BsModalRef;
  config = {
    animated: true
  };

  public displayCategory: DisplayCategory[] = [];
  public warrantyList: Warranty[] = [];
  public returnPolicyLIst: ReturnPolicy[] = [];
  public vendorsList: Customer[];
  public brandList: Brand[];
  public fieldname: string;
  public parent = new Category();
  public category = new Category();
  public sub = new Category();

  public showCategorySuggestion: boolean = false;
  public showchoseCategory: boolean = false;
  public forecasts: any;
  public SelectedCategory: string;
  public specification: any;
  public shortDetail: any;
  public detail: any;
  public inputElement: any;
  public commissionType: boolean;
  public commissionAmount: number;

  public filename: string;
  public excelFile: any;
  //files: any;
  public urls: string[] = [];
  public productID: number;
  public progress: number;
  public message: string;
  public parentid: number;
  public categoryid: number;
  public showSuggestions: boolean;
  public accept = '*';
  public files: File[] = [];
  //progress: number
  public hasBaseDropZoneOver: boolean = false;
  public httpEmitter: Subscription;
  public httpEvent: HttpEvent<Event>;
  public lastFileAt: Date;
  public maxSize: number;
  public validComboDrag: boolean;
  public dragFiles: any;
  public masterProductID: string;
  salePriceMessage: boolean;
  sendableFormData: FormData//populated via ngfFormData directive
  configuration = {
    uiColor: '#ffffff',
    toolbarGroups: [{ name: 'clipboard', groups: ['clipboard', 'undo'] },
    { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
    { name: 'links' }, { name: 'insert' },
    { name: 'document', groups: ['mode', 'document', 'doctools'] },
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] },
    { name: 'styles' },
    { name: 'colors' }],
    resize_enabled: false,
    removePlugins: 'save',
    extraPlugins: 'smiley,justify,indentblock,colordialog',
    colorButton_foreStyle: {
      element: 'font',
      attributes: { 'color': '#(color)' }
    },
    height: 188,
    removeDialogTabs: '',
    removeButtons: '',
    format_tags: 'p;h1;h2;h3;pre;div'
  }
  /** edit-simple-product ctor */
  constructor(private _avRoute: ActivatedRoute, private readonly brandsService: BrandService, private modalService: BsModalService, private readonly customerService: CustomerService, public toastr: ToastsManager, vcr: ViewContainerRef, private http: HttpClient, private readonly categoryService: CategoryService, private readonly productService: ProductService,
    private readonly router: Router, private appService: AppService,
    public cookieService: CookieService) {
    this.CheckLogin();
    this.salePriceMessage = true;
    this.product.isActive = true;
    this.product.inStock = true;
    this.filename = "nofile"
    this.product.isFeature = true;
    this.product.categoryID = null;
    this.getbrands();
    this.SelectedCategory = "";
    this.showSuggestions = false;
    this.commissionType = true;
    this.product.reviewsEnable = true;
    this.product.isOnCash = true;
    this.product.salePrice = 0;
    this.product.commissionPrices = 0;
    this.product.regularPrice = 0;
    this.product.files = [];
    this.product.accessories = [];
    this.product.categories = [];
    this.validComboDrag = true;
    this.GetProductStatus();
    this.selectedProductAccessories = [];
    this.selectedProductInCategoies = [];
    this.product.vendorID = null;
    this.product.brandID = null;
    this.toastr.setRootViewContainerRef(vcr);
    this.masterProductID = "";

    if (this._avRoute.snapshot.params["id"]) {
      this.getProductById(this._avRoute.snapshot.params["master"], this._avRoute.snapshot.params["id"]);
    }
    if (this._avRoute.snapshot.params["master"]) {
      this.masterProductID = this._avRoute.snapshot.params["master"];
    }
  }
  CheckLogin() {
    this.appService.CheckLogin(this.cookieService.get('Login')).subscribe(
      data => {
        if (!data) {
          this.router.navigate(["/login"]);
        }
      });
    //this.isLoggedIn = true;
  }
  getProductById(master: string, variant: string) {
    this.productService.GetMasterVaribaleProduct(master, variant).subscribe(data => {
      this.product = data;

      if (this.product.commissionType == 1) {
        this.commissionType = true;
      }
      else {
        this.commissionType = false;
      }
      if (this.product.salePrice == 0 && this.commissionType == false) {
        this.commissionAmount = this.product.regularPrice - this.product.commissionPrices;
        this.commissionAmount = (this.commissionAmount / this.product.regularPrice) * 100;
      }
      else if (this.product.salePrice > 0 && this.commissionType == false) {
        this.commissionAmount = this.product.salePrice - this.product.commissionPrices;
        this.commissionAmount = (this.commissionAmount / this.product.salePrice) * 100;
      }
      else if (this.product.salePrice == 0 && this.commissionType == true) {
        this.commissionAmount = this.product.regularPrice - this.product.commissionPrices;
      }
      else if (this.product.salePrice > 0 && this.commissionType == true) {
        this.commissionAmount = this.product.salePrice - this.product.commissionPrices;
      }
      this.detail = this.product.detail;
      this.specification = this.product.specification;
      this.shortDetail = this.product.shortDetail;
      this.BindCategory(this.product.parentCategoryID, this.product.categoryID, this.product.subCategoryID);
      this.productImages = this.product.productImages;
      console.log(this.productImages);
    })

    this.getAccessoriesProducts();
    this.getproductInCategoies();
    this.GetWarranties();
    this.GetReturnPolicy();

    this.getbrands();
  }
  GetProductStatus() {
    this.productService.GetProductStatus().subscribe(
      data => {
        this.productStatus = data;
      }
    )
  }
  GetCommissionType(type: string) {

    if (type == "true") {
      this.commissionType = true;
    }
    else {
      this.commissionType = false;
    }
    var value = "0";
    try {
      value = this.commissionAmount.toString();
    } catch (e) {
    }
    this.calculateCommission(value);
  }

  GetWarranties() {

    this.productService.GetWarranties().subscribe(
      data => {
        this.warrantyList = data;
      }
    )
  }
  getAccessoriesProducts() {
    this.productService.GetProducts().subscribe(
      data => {
        this.productAccessories = data;
      }
    )
  }
  getproductInCategoies() {
    this.categoryService.GetCategoryList().subscribe(
      data => {
        this.productInCategoies = data;
      }
    )
  }
  getbrands() {

    this.brandsService.getBrand().subscribe(
      data => {
        this.brandList = data;
      }
    )
  }
  GetReturnPolicy() {

    this.productService.GetReturnPolicy().subscribe(
      data => {
        this.returnPolicyLIst = data;
      }
    )
  }
  BindCategory(PID: number, CID: number, SID: number) {
    var categoryList: Category[] = [];
    var ids: number[] = [];
    ids.push(PID);
    ids.push(CID);
    ids.push(SID);
    this.categoryService.GetProductCategory(ids.join()).subscribe(data => {
      categoryList = data;
      for (var i = 0; i < categoryList.length; i++) {
        if (categoryList[i].categoryID == PID) {
          this.parent = categoryList[i];
        }
        if (categoryList[i].categoryID == CID) {
          this.category = categoryList[i];
        }
        if (categoryList[i].categoryID == SID) {
          this.sub = categoryList[i];
        }
      }
      this.SelectedCategory = this.parent.categoryName + " >> " + this.category.categoryName + " >> " + this.sub.categoryName;
    });
  }

  onSubmit() {
    if (this.product.vendorID == null) {
      this.product.vendorID = 0;
    }
    if (this.product.brandID == null) {
      this.product.brandID = 0;
    }
    if (this.product.regularPrice === null) {
      this.product.regularPrice = 0;
    }
    if (this.product.salePrice === null) {
      this.product.salePrice = 0;
    }
    //if (this.product.salePrice === 0) {
    //  this.product.salePrice = this.product.regularPrice;
    //}
    if (this.commissionAmount === null) {
      this.commissionAmount = 0;
    }
    if (Number(this.product.salePrice) > Number(this.product.regularPrice)) {
      this.salePriceMessage = false;
      return;
    }

    this.selectedProductAccessories.forEach((element) => {

      var acc = new ProductAccessory();
      acc.accessoryID = element.productID;
      this.product.accessories.push(acc);
    });
    this.selectedProductInCategoies.forEach((element) => {

      var cat = new ProductInCategoies();
      cat.categoryID = element.categoryID;
      this.product.categories.push(cat);
    });
    this.product.regularPrice = this.product.regularPrice > 0 ? this.product.regularPrice : 0;
    this.product.salePrice = this.product.salePrice > 0 ? this.product.salePrice : 0;
    this.product.commissionPrices = this.product.commissionPrices > 0 ? this.product.commissionPrices : 0;
    this.product.detail = this.detail;
    this.product.shortDetail = this.shortDetail;
    this.product.specification = this.specification;
    this.product.createdBy = 1;//userid here
    var commissionamount = "0";
    try {
      commissionamount = this.commissionAmount.toString()
    } catch (e) {

    }
    this.calculateCommission(commissionamount);
    if (this.product.salePrice != 0 && this.product.salePrice != this.product.regularPrice) this.product.appliedDiscoutType = 4;
    if (Number(this.product.salePrice) > Number(this.product.regularPrice)) {
      this.product.salePrice = this.product.regularPrice;
    }
    this.product.commissionType = this.commissionType ? 1 : 0;


    this.product.files = [];
    if (this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        var imageid = "img-" + i;
        var elenment = document.getElementById(imageid).style.backgroundImage;
        var splitted = elenment.split(",");
        var image = splitted[1].replace('"', "").replace(')', "");
        var imgformate = splitted[0].split('/')[1].split(';')[0];
        this.product.files.push(imgformate + "," + image);
        if (i + 1 == this.files.length) {
          this.products.push(this.product);
          this.productService.UpdateVariableSimpleProduct(this.products).subscribe(data => {
            this.toastr.success('Product has been Updated Successfully ', 'Success');
            this.router.navigate(["/edit-variable-product-vendor", this.masterProductID]);
          });
        }
      }
    }
    else {
      this.products.push(this.product);
      this.productService.UpdateVariableSimpleProduct(this.products).subscribe(data => {
        this.toastr.success('Product has been Updated Successfully ', 'Success');
        this.router.navigate(["/edit-variable-product-vendor", this.masterProductID]);
      });

    }
  }
  addRelatedCategories(id: number, name: string) {

    var cat = new ProductInCategoies();
    cat.categoryID = id;
    cat.categoryName = name;
    if (!this.selectedProductInCategoies.some((item) => item.categoryID == cat.categoryID)) {
      this.selectedProductInCategoies.push(cat);

      this.showchoseCategory = true;
      this.showCategorySuggestion = false;
    }
    else {
      this.toastr.error('This item is already Exist', 'Fail!');
    }
    this.showCategorySuggestion = false;
  }
  removeCategory(index) {
    this.selectedProductInCategoies.splice(index, 1);
    if (this.selectedProductInCategoies.length == 0) {
      this.showchoseCategory = false;
    }
  }
  onSearch(searchText: string, id: number) {

    var length = 0;
    try {
      length = searchText.length;
    } catch (e) {
      if (id == 1) {
        this.showSuggestions = false;
      }
      else {
        this.showCategorySuggestion = false;
      }
      return;
    }
    if (length > 0) {
      this.categoryService.CategoriesSuggestions(searchText).subscribe(
        data => {
          this.forecasts = data;
          this.displayCategory = this.forecasts.filter(i => i.parentCategoryID === 0);
          this.displayCategory.forEach(element => {
            element.subCategory = this.forecasts.filter(i => i.parentCategoryID === element.categoryID);
            element.subCategory.forEach(child => {
              child.subCategory = this.forecasts.filter(i => i.parentCategoryID === child.categoryID);
            });
          });
          if (this.displayCategory.length > 0) {
            if (id == 1) {
              this.showSuggestions = true;
            }
            else {
              this.showCategorySuggestion = true;
            }
          }

        });
    }
    else {
      this.displayCategory = [];
      this.showSuggestions = false;
    }
  }
  calculateCommission(searchValue: string) {
    var price: number;
    try {
      var number = Number(searchValue);

      price = this.product.salePrice > 0 ? this.product.salePrice : this.product.regularPrice;
      if (this.commissionType) {
        if (number > price) number = price;
        price = price - number;
      }
      else {
        if (number > 100) number = 100;
        price = price - ((number / 100) * price);
      }
      this.product.commissionPrices = price;
    } catch (e) {

    }
  }
  keyPress(event: any) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
  //SalePriceCheck(searchValue: string) {
  //  var price: number;
  //  try {
  //    var number = Number(searchValue);
  //    if (number > this.product.regularPrice) this.product.salePrice = this.product.regularPrice;
  //  } catch (e) {
  //    number = 0;
  //  }

  //}
  SalePriceCheck() {
    if (Number(this.product.salePrice) > Number(this.product.regularPrice) && this.product.regularPrice != 0 && typeof this.product.regularPrice != "undefined") {
      this.salePriceMessage = false;
    }
    else {
      this.salePriceMessage = true;
    }
  }
  onTextChange(Value: string) {

    var i = 0, strLength = Value.length;
    for (i; i < strLength; i++) {
      Value = Value.replace(" ", "-");
    }
    this.product.url = Value.toLowerCase();
  }
  hideCommision() {
    if (this.product.salePrice === 0) {
      this.product.salePrice = null;
    }
    if (this.product.salePrice == null || this.product.salePrice.toString() == "") {
      this.product.commissionPrices = 0;
      this.commissionAmount = null;
    }
    if (this.product.regularPrice === 0) {
      this.product.regularPrice = null;
    }
  }
}

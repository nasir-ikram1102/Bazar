import { Component, ViewContainerRef, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product, ProductAccessory, ProductInCategoies } from '../../models/products/product.model';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { Category } from '../../models/category/category.model';
import { DisplayCategory } from '../../models/category/DisplayCategory.model';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpClient, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { Customer } from '../../models/customer/customer-model'
import { CustomerService } from '../../services/customer/customer.service';
import { BrandService } from '../../services/brand/brand.service';
import { Brand } from '../../models/brand/brand-model';
import { Subscription } from 'rxjs'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ProductVariants } from '../../models/products/product.model';
import { Variants } from '../../models/products/product.model';
import { Attributes } from '../../models/products/product.model';
import { ProductsListImages } from '../../models/products/product.model';
import { Warranty } from '../../models/products/product.model';
import { ReturnPolicy } from '../../models/products/product.model';
import { EnumDropDown } from '../../models/shared/enum-dropdown'
import { AppService } from '../../services/app/app.service';


@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})

/** Create-Product component*/
export class CreateProductComponent {
  product = new Product();
  public categryFields: any;
  public products: Product[] = [];
  public productAccessories: Product[] = [];
  public productInCategoies: Category[] = [];
  public selectedProductAccessories: Product[] = [];
  public productStatus: EnumDropDown[];
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
  public forecasts: any;
  public modalRef: BsModalRef;
  config = {
    animated: true
  };

  //variants section start 
  public attributes: Attributes[] = [];
  public showLoader: boolean = false;
  public ProductLiveSearch: Product[] = [];
  public attributesList: Attributes[] = [];
  public productattributesList: Attributes[] = [];
  public disableSubmit: boolean = false;
  public variants: Variants[] = [];
  public variantsList: Variants[] = [];
  public productvariantsList: Variants[] = [];
  public productAttributeVariants: ProductVariants[] = [];
  public images: ProductsListImages[] = [];
  public attributeindex: number;
  public productType: boolean;
  public commissionType: boolean;
  public commissionAmount: number;
  public commissionPrice: number;
  public warrantyList: Warranty[] = [];
  public returnPolicyLIst: ReturnPolicy[] = [];

  //variants section  end
  public displayCategory: DisplayCategory[] = [];

  public parentCategoryList: Category[] = [];
  public categoryList: Category[] = [];
  public SubcategoryList: Category[] = [];
  public inputElement: any;
  public specification: any;
  public shortDetail: any;
  public detail: any;
  public pId: number;
  public cId: number;
  public sId: number;

  public SelectedCategory: string;
  public Parentname: string;
  public cName: string;
  public Parentproduct: number;

  public fieldname: string;
  public filename: string;
  public excelFile: any;
  //files: any;
  public urls: string[] = [];
  public productID: number;
  public progress: number;
  public message: string;
  public parentid: number;
  public categoryid: number;
  public vendorsList: Customer[];
  public brandList: Brand[];
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
  public smallnumPages: number;
  salePriceMessage: boolean;
  public categoryExist: boolean;
  IsDisable: boolean;
  public showSuggestionsLive: boolean = false;
  public showProduct: boolean = false;
  public showchoseCategory: boolean = false; 
  public showCategorySuggestion: boolean = false;
  public addProduct = new Product();
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
  constructor(private readonly brandsService: BrandService,
    private modalService: BsModalService,
    private readonly customerService: CustomerService,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private http: HttpClient,
    public cookieService: CookieService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly router: Router,
    private appService: AppService) {
    this.CheckLogin();
    this.product.metaDiscription = "";
    this.product.metaKeyWords = "";
    this.product.metaTitle = "";
    this.categoryExist = false;
    this.salePriceMessage = true;
    this.toastr.setRootViewContainerRef(vcr);
    this.product.isActive = true;
    this.product.inStock = true;
    this.filename = "nofile"
    this.product.isFeature = true;
    this.showLoader = false;
    this.GetCategoryList();
    this.product.categoryID = null;
    this.getbrands();
    this.pId = 0
    this.cId = 0
    this.sId = 0 
    this.product.isProducPending = true;
    this.SelectedCategory = "";
    this.showSuggestions = false;
    this.attributeindex = 0;
    this.GetAttributeList();
    this.GetAllVariantsList();
    //this.getAccessoriesProducts();
    this.getproductInCategoies();
    this.GetWarranties();
    this.GetReturnPolicy();
    this.productType = true;
    this.commissionType = true;
    this.Parentproduct = 0;
    this.product.reviewsEnable = true;
    this.product.isOnCash = true;
    this.product.salePrice = 0;
    this.product.commissionPrices = 0;
    this.product.regularPrice = 0;
    this.commissionPrice = 0;
    this.product.files = [];
    this.product.productStatusId = 1
    this.product.accessories = [];
    this.product.categories = [];
    this.validComboDrag = true;
    this.selectedProductAccessories = [];
    this.selectedProductInCategoies = [];
    this.product.vendorID = Number(this.cookieService.get('CustomerID'));
    this.product.brandID = null;
    this.smallnumPages = 0;
    this.GetProductStatus();
    this.IsDisable = true;
    this.product.stockQuantity = 0;
    this.product.returnPolicy = null;
    this.product.warentyType = null;

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
  GetWarranties() {
    this.productService.GetWarranties().subscribe(
      data => {
        this.warrantyList = data;
        //this.product.warentyType = this.warrantyList[0].warrantyID;
      }
    )
  }

  GetProductStatus() {
    this.productService.GetProductStatus().subscribe(
      data => {
        this.productStatus = data;
      }
    )
  }

  //getAccessoriesProducts() {
  //  this.productService.GetProducts().subscribe(
  //    data => {
  //      this.productAccessories = data;
  //    }
  //  )
  //}
  getproductInCategoies() {
    this.categoryService.GetCategoryList().subscribe(
      data => {
        this.productInCategoies = data;
      }
    )
  }

  GetReturnPolicy() {
    this.productService.GetReturnPolicy().subscribe(
      data => {
        this.returnPolicyLIst = data;
        //this.product.returnPolicy = this.returnPolicyLIst[0].returnPolicyID;
      }
    )
  }
  GetCategoryList() {
    this.categoryService.GetCategoryList().subscribe(
      data => {
        this.parentCategoryList = data;
      }
    )
    this.categoryList = [];
    this.SubcategoryList = [];
    this.pId = 0;
    this.Parentname = "";
    this.cId = 0;
    this.cName = "";
    this.sId = 0;
  }
  getbrands() {

    this.brandsService.getBrand().subscribe(
      data => {
        this.brandList = data;
      }
    )
  }
  GetAllVariantsList() {

    this.productService.GetAllVariantsList().subscribe(
      data => {
        this.variants = data;
        this.variantsList = data;
        this.attributeindex = 0;
      }
    )
  }
  AddProductVariants(index: number) {
    var variant = new Variants();
    variant = this.variantsList[index];
    this.productvariantsList.push(variant);
    this.variantsList.splice(index, 1);
    var i = this.productAttributeVariants.findIndex(x => x.attributeID == variant.attributeID);
    var firstnode = this.productvariantsList.filter(x => x.attributeID == variant.attributeID)[0];
    this.productAttributeVariants[i].slug = firstnode.slug;
    this.products = [];
  }
  removeProductVariants(index: number) {
    var variant = new Variants();
    variant = this.productvariantsList[index];
    this.variantsList.push(variant);
    this.productvariantsList.splice(index, 1);
  }

  removeProductAttributes(index: number) {
    var attribute = new Attributes();
    attribute = this.productattributesList[index];
    this.attributesList.push(attribute);
    this.productattributesList.splice(index, 1);
    this.attributeindex = 0;
    var index = this.productAttributeVariants.findIndex(x => x.attributeID == attribute.attributeID);
    this.productAttributeVariants.splice(index, 1);


    var variants = this.productvariantsList.filter(x => x.attributeID == attribute.attributeID);
    for (var i = 0; i < variants.length; i++) {
      var j = this.productvariantsList.findIndex(x => x.attributeID == variants[i].attributeID && x.slug == variants[i].slug);
      this.productvariantsList.splice(j, 1);
      this.variantsList.push(variants[i])
    }
    this.products = [];
  }
  setSlugValue(id: number, name: string) {
    var i = this.productAttributeVariants.findIndex(x => x.attributeID == id);
    this.productAttributeVariants[i].slug = name;
  }
  AddProductAttributes(index: number) {
    var index = this.attributeindex;
    var attribute = new Attributes();
    attribute = this.attributesList[index];
    this.productattributesList.push(attribute);
    this.attributesList.splice(index, 1);
    this.attributeindex = 0;

    // add attribute to productlist
    var productAttributeVariants = new ProductVariants();
    productAttributeVariants.attributeID = attribute.attributeID;
    productAttributeVariants.name = attribute.name;
    this.productAttributeVariants.push(productAttributeVariants);
    this.products = [];
  }

  GetAttributeList() {

    this.productService.GetAttributeList().subscribe(
      data => {
        this.attributes = data;
        this.attributesList = data;
      }
    )
  }

  GetCategoryListByParent(parentCategoryId: number, parentCategoryName: string) {
    this.categoryExist = false;
    this.pId = parentCategoryId;
    this.Parentname = parentCategoryName;
    this.categoryService.GetCategoryListByParent(parentCategoryId).subscribe(
      data => {
        this.categoryList = data;
      }
    )
    this.SubcategoryList = [];
    this.cId = 0;
    this.sId = 0;
  }
  GetSubCategoryListByParent(parentCategoryId: number, name: string) {
    this.categoryExist = false;
    this.cId = parentCategoryId;
    this.cName = name;
    this.categoryService.GetCategoryListByParent(parentCategoryId).subscribe(
      data => {
        this.SubcategoryList = data;
      }
    )
  }
  // get category Fields 
  GetCategoryFieldsList(categoryId: number) {
    this.categoryService.GetCateoryFieldsList(categoryId).subscribe(
      data => {
        this.categryFields = data;
      }
    )
  }

  UploadImages(event) {
    this.urls = [];
    let files = event;

  }
  fileChange(fileInput: Event) {
    this.excelFile = (<HTMLInputElement>fileInput.target).files[0];
    this.filename = this.excelFile.name;
  }

  BulkUploadingProducts() {
    document.getElementById('fUpload');
    if (this.filename == "nofile") {
      alert("Please select a file.");
      return false;
    }
    else {
      var formData = new FormData();
      var file = this.excelFile;
      formData.append("file", file);
      
      const uploadReq = new HttpRequest('POST', "api/Products/UploadFiles", formData, {
        reportProgress: true,
      });
      this.http.request(uploadReq).subscribe(event => {

      });
    }
  }

  GetProductType(type: string) {
    if (type == "true") {
      this.productType = true;
    }
    else {
      this.productType = false;
    }

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
    this.categoryExist = false;
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


  getCatgoryValuesValue(pId: number, pName: string, cId: number, cName: string, sId: number, sName: string) {

    this.pId = pId;
    this.cId = cId;
    this.sId = sId;
    this.GetCategoryFieldsList(this.sId);
    this.displayCategory = [];
    this.SelectedCategory = pName + " >> " + cName + " >> " + sName
    this.showSuggestions = false;
  }
  onItemSelect(item: any) {
    console.log(item);

    //this.emailTemplate.emailTemplateRoleIds.push(item.roleID);
  }
  onSelectAll(items: any) {
    console.log(items);

  }
  BindCategory(id: number, name: string) {
    this.categoryExist = false;
    this.sId = id;
    this.GetCategoryFieldsList(this.sId);
    this.SelectedCategory = this.Parentname + " >> " + this.cName + " >> " + name;
    this.displayCategory = [];
    this.modalRef.hide();
    this.showSuggestions = false;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }
  confirm(): void {
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }

  addVariant() {
    if (this.sId == 0) {
      this.toastr.error('Please Select Category', 'Error');
      return false;
    }
    try {
      this.product.Variants = this.productAttributeVariants;
    } catch (e) {

    }
    if (this.product.vendorID == null) {
      this.product.vendorID = 0;
    }
    if (this.product.brandID == null) {
      this.product.brandID = 0;
    }
    if (this.product.regularPrice === null) {
      this.product.regularPrice = 0;
    }
    if (!this.productType) {
      this.product.productType = 2; // for variation product
    }
    else {
      this.product.productType = 1;// for simple product

    }
    this.selectedProductAccessories.forEach((element) => {

      var acc = new ProductAccessory();
      /// public categories: ProductInCategoies[];
      acc.accessoryID = element.productID;
      this.product.accessories.push(acc);
    });
    this.selectedProductInCategoies.forEach((element) => {

      var cat = new ProductInCategoies();
      cat.categoryID = element.categoryID;
      this.product.categories.push(cat);
    });

    this.product.parentCategoryID = this.pId;
    this.product.categoryID = this.cId;
    this.product.subCategoryID = this.sId;
    this.categryFields.forEach((element) => {
      this.fieldname = "input-" + element.fieldName;
      this.inputElement = document.getElementById(this.fieldname) as HTMLElement;
      element.value = this.inputElement.value;
    });
    this.product.regularPrice = this.product.regularPrice > 0 ? this.product.regularPrice : 0;
    this.product.salePrice = this.product.salePrice > 0 ? this.product.salePrice : 0;
    this.product.commissionPrices = this.product.commissionPrices > 0 ? this.product.commissionPrices : 0;
    this.product.detail = this.detail;
    this.product.shortDetail = this.shortDetail;
    this.product.specification = this.specification;
    this.product.fields = this.categryFields;
    this.product.createdBy = Number(this.cookieService.get('CustomerID'));
    var commissionamount = "0";
    try {
      commissionamount = this.commissionAmount.toString()
    } catch (e) {

    }
    this.calculateCommission(commissionamount);
    if (this.product.salePrice > 0) this.product.appliedDiscoutType = 4;
    if (Number(this.product.salePrice) > Number(this.product.regularPrice)) {
      this.product.salePrice = this.product.regularPrice;
    }
    this.product.commissionType = this.commissionType ? 1 : 2;
    var prod = new Product();
    prod = this.product;
    let copy = JSON.parse(JSON.stringify(prod));

    if (this.files) {
      for (let file of this.files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          copy.files.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
    this.products.push(copy);
  }


  addVariantDynamic(variants: ProductVariants[]) {
    if (this.sId == 0) {
      this.toastr.error('Please Select Category', 'Error');
      return false;
    }


    try {
      this.product.Variants = variants;
    } catch (e) {

    }
    if (this.product.vendorID == null) {
      this.product.vendorID = 0;
    }
    if (this.product.brandID == null) {
      this.product.brandID = 0;
    }
    if (this.product.regularPrice === null) {
      this.product.regularPrice = 0;
    }
    if (!this.productType) {
      this.product.productType = 2; // for variation product
    }
    else {
      this.product.productType = 1;// for simple product

    }
    this.selectedProductAccessories.forEach((element) => {

      var acc = new ProductAccessory();
      /// public categories: ProductInCategoies[];
      acc.accessoryID = element.productID;
      this.product.accessories.push(acc);
    });
    this.selectedProductInCategoies.forEach((element) => {

      var cat = new ProductInCategoies();
      cat.categoryID = element.categoryID;
      this.product.categories.push(cat);
    });

    this.product.parentCategoryID = this.pId;
    this.product.categoryID = this.cId;
    this.product.subCategoryID = this.sId;
    this.categryFields.forEach((element) => {
      this.fieldname = "input-" + element.fieldName;
      this.inputElement = document.getElementById(this.fieldname) as HTMLElement;
      element.value = this.inputElement.value;
    });
    this.product.regularPrice = this.product.regularPrice > 0 ? this.product.regularPrice : 0;
    this.product.salePrice = this.product.salePrice > 0 ? this.product.salePrice : 0;
    this.product.commissionPrices = this.product.commissionPrices > 0 ? this.product.commissionPrices : 0;
    this.product.detail = this.detail;
    this.product.shortDetail = this.shortDetail;
    this.product.specification = this.specification;
    this.product.fields = this.categryFields;
    this.product.createdBy = 1;//userid here
    var commissionamount = "0";
    try {
      commissionamount = this.commissionAmount.toString()
    } catch (e) {

    }
    this.calculateCommission(commissionamount);
    if (this.product.salePrice > 0) this.product.appliedDiscoutType = 4;
    if (Number(this.product.salePrice) > Number(this.product.regularPrice)) {
      this.product.salePrice = this.product.regularPrice;
    }
    this.product.commissionType = this.commissionType ? 1 : 2;
    var prod = new Product();
    prod = this.product;
    let copy = JSON.parse(JSON.stringify(prod));

    if (this.files.length > 0) {
      for (var i = 0; i < this.files.length; i++) {
        var imageid = "img-" + i;
        var elenment = document.getElementById(imageid).style.backgroundImage;
        var splitted = elenment.split(",");
        var image = splitted[1].replace('"', "").replace(')', "");
        var imgformate = splitted[0].split('/')[1].split(';')[0];
        copy.files.push(imgformate + "," + image);
        if (i + 1 == this.files.length) {
          this.products.push(copy);

        }
      }
    }
    else {
      this.products.push(copy);
    }
  }

  upload(files: File[]) {
    if (files.length === 0)
      return;
    const formData = new FormData();
    for (let file of files) formData.append(file.name, file);
    // add ProductID
    formData.append("ProductID", this.productID.toString());
    const uploadReq = new HttpRequest('POST', `api/Products/UploadFile`, formData, {
      reportProgress: true,
    });
    this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response)
        this.message = event.body.toString();
      this.toastr.success('Product Added Successfully ', 'Success');
      this.router.navigate(["/products-vendor"]);
    });
  }
  hideZero() {
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
   

  onSubmit() {
    if (this.product.isProducPending === true) {
      this.product.productStatusId = 1;
    }
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

    if (!this.productType) {
      if (this.products.length == 0) {
        this.toastr.error('Please Add Variant', 'Error');
        return false;
      }
      this.IsDisable = false;

      this.productService.AddProduct(this.products).subscribe(data => {
        this.toastr.success('Product Added Successfully ', 'Success');
        this.router.navigate(["/products-vendor"]);
      });
    }
    else {

      if (this.sId == 0) {
        this.toastr.error('Please Select Category', 'Error');
        this.categoryExist = true;
        window.scroll(0, 0);
        return false;
      }

      else {
        this.categoryExist = false;
      }

      try {
        this.product.Variants = [];
      } catch (e) {

      }
      this.IsDisable = false;
      if (!this.productType) {
        this.product.productType = 2; // for variation product
      }
      else {
        this.product.productType = 1;// for simple product

      }
      this.selectedProductAccessories.forEach((element) => {
        var acc = new ProductAccessory();
        /// public categories: ProductInCategoies[];
        acc.accessoryID = element.productID;
        this.product.accessories.push(acc);
      });
      this.selectedProductInCategoies.forEach((element) => {

        var cat = new ProductInCategoies();
        cat.categoryID = element.categoryID;
        this.product.categories.push(cat);
      });
      this.product.parentCategoryID = this.pId;
      this.product.categoryID = this.cId;
      this.product.subCategoryID = this.sId;
      this.categryFields.forEach((element) => {
        this.fieldname = "input-" + element.fieldName;
        this.inputElement = document.getElementById(this.fieldname) as HTMLElement;
        element.value = this.inputElement.value;
      });
      this.product.regularPrice = this.product.regularPrice > 0 ? this.product.regularPrice : 0;
      this.product.salePrice = this.product.salePrice > 0 ? this.product.salePrice : 0;
      this.product.commissionPrices = this.product.commissionPrices > 0 ? this.product.commissionPrices : 0;
      this.product.detail = this.detail;
      this.product.shortDetail = this.shortDetail;
      this.product.specification = this.specification;
      this.product.fields = this.categryFields;
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
      if (this.files.length > 0) {

        for (var i = 0; i < this.files.length; i++) {
          var imageid = "img-" + i;
          var elenment = document.getElementById(imageid).style.backgroundImage;
          var splitted = elenment.split(",");
          var image = splitted[1].replace('"', "").replace(')', "");
          var imgformate = splitted[0].split('/')[1].split(';')[0];
          this.product.files.push(imgformate + "," + image);
          if (i + 1 == this.files.length) {
            var prod = new Product();
            prod = this.product;
            let copy = JSON.parse(JSON.stringify(prod));
            this.products.push(copy);
            this.IsDisable = false;
            this.productService.AddProduct(this.products).subscribe(data => {
              this.toastr.success('Product has been Saved Successfully ', 'Success');
              this.router.navigate(["/products-vendor"]);
            });
          }
        }
      }
      else {

        var prod = new Product();
        prod = this.product;
        let copy = JSON.parse(JSON.stringify(prod));
        this.products.push(copy);
        this.productService.AddProduct(this.products).subscribe(data => {
          this.toastr.success('Product has been Saved Successfully ', 'Success');
          this.router.navigate(["/products-vendor"]);
        });
      }


    }
  }
  SaveDraft() {
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



    try {
      this.product.Variants = [];
    } catch (e) {

    }
    this.IsDisable = false;
    this.product.productStatusId = 5// from draft
    this.product.productType = 1;// for simple product

    if (this.product.returnPolicy == null) this.product.returnPolicy = 0;
    if (this.product.warentyType == null) this.product.warentyType = 0;
    this.product.accessories = [];
    this.product.categories = [];
    this.product.parentCategoryID = this.pId;
    this.product.categoryID = this.cId;
    this.product.subCategoryID = this.sId;
    this.categryFields.forEach((element) => {
      this.fieldname = "input-" + element.fieldName;
      this.inputElement = document.getElementById(this.fieldname) as HTMLElement;
      element.value = this.inputElement.value;
    });
    this.product.regularPrice = this.product.regularPrice > 0 ? this.product.regularPrice : 0;
    this.product.salePrice = this.product.salePrice > 0 ? this.product.salePrice : 0;
    this.product.commissionPrices = this.product.commissionPrices > 0 ? this.product.commissionPrices : 0;
    this.product.detail = this.detail;
    this.product.shortDetail = this.shortDetail;
    this.product.specification = this.specification;
    this.product.fields = this.categryFields;
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
    this.product.commissionType = this.commissionType ? 1 : 2;
    if (this.files.length > 0) {

      for (var i = 0; i < this.files.length; i++) {
        var imageid = "img-" + i;
        var elenment = document.getElementById(imageid).style.backgroundImage;
        var splitted = elenment.split(",");
        var image = splitted[1].replace('"', "").replace(')', "");
        var imgformate = splitted[0].split('/')[1].split(';')[0];
        this.product.files.push(imgformate + "," + image);
        if (i + 1 == this.files.length) {
          var prod = new Product();
          prod = this.product;
          let copy = JSON.parse(JSON.stringify(prod));
          this.products.push(copy);
          this.IsDisable = false;
          this.productService.AddProduct(this.products).subscribe(data => {
            this.toastr.success('Product has been Saved as Draft Successfully ', 'Success');
            this.router.navigate(["/products-vendor"]);
          });
        }
      }
    }
    else {

      var prod = new Product();
      prod = this.product;
      let copy = JSON.parse(JSON.stringify(prod));
      this.products.push(copy);
      this.productService.AddProduct(this.products).subscribe(data => {
        this.toastr.success('Product has been Saved as Draft Successfully ', 'Success');
        this.router.navigate(["/products-vendor"]);
      });
    }



  }
  CreateVaritions(condition: any) {

    if (this.sId == 0) {
      this.toastr.error('Please Select Category', 'Error');
      return false;
    }
    if (this.product.name == "" || this.product.name == null || typeof this.product.name == "undefined") {
      this.toastr.error('Please Enter Product Name', 'Error');
      return false;
    }
    if (this.product.url == "" || this.product.url == null || typeof this.product.url == "undefined") {
      this.toastr.error('Please Enter Product Name', 'Error');
      return false;
    }
    if (this.product.vendorSKU == "" || this.product.vendorSKU == null || typeof this.product.vendorSKU == "undefined") {
      this.toastr.error('Please Enter SKU', 'Error');
      return false;
    }

    this.shortDetail = true;
    this.products = [];
    var firstlist: Variants[];
    var secondlist: Variants[];
    var thirdlist: Variants[];
    var forthlist: Variants[];
    var fifthlist: Variants[];
    var sixList: Variants[];
    for (var i = 0; i < this.productattributesList.length; i++) {
      if (i == 0) {
        firstlist = this.productvariantsList.filter(c => c.attributeID === this.productattributesList[i].attributeID);
      }
      else if (i == 1) {
        secondlist = this.productvariantsList.filter(c => c.attributeID === this.productattributesList[i].attributeID);
      }
      else if (i == 2) {
        thirdlist = this.productvariantsList.filter(c => c.attributeID === this.productattributesList[i].attributeID);
      }
      else if (i == 3) {
        forthlist = this.productvariantsList.filter(c => c.attributeID === this.productattributesList[i].attributeID);
      }
      else if (i == 4) {
        fifthlist = this.productvariantsList.filter(c => c.attributeID === this.productattributesList[i].attributeID);
      }
      else if (i == 5) {
        sixList = this.productvariantsList.filter(c => c.attributeID === this.productattributesList[i].attributeID);
      }

    }
    var productAttibutevariantslis: ProductVariants[] = [];
    var length = this.productattributesList.length;
    if (length == 1) {

      for (var i = 0; i < firstlist.length; i++) {
        productAttibutevariantslis = [];
        var first = new ProductVariants();
        first.attributeID = firstlist[i].attributeID;
        first.name = firstlist[i].name;
        first.slug = firstlist[i].slug;
        productAttibutevariantslis.push(first);
        this.addVariantDynamic(productAttibutevariantslis);
      }
    }
    if (length == 2) {
      for (var i = 0; i < firstlist.length; i++) {
        var First = new ProductVariants();
        First.attributeID = firstlist[i].attributeID;
        First.name = firstlist[i].name;
        First.slug = firstlist[i].slug;

        for (var j = 0; j < secondlist.length; j++) {
          productAttibutevariantslis = [];
          var second = new ProductVariants();
          second.attributeID = secondlist[j].attributeID;
          second.name = secondlist[j].name;
          second.slug = secondlist[j].slug;
          productAttibutevariantslis.push(First);
          productAttibutevariantslis.push(second);
          this.addVariantDynamic(productAttibutevariantslis);
        }
      }
    }
    if (length == 3) {
      for (var i = 0; i < firstlist.length; i++) {
        var First = new ProductVariants();
        First.attributeID = firstlist[i].attributeID;
        First.name = firstlist[i].name;
        First.slug = firstlist[i].slug;

        for (var j = 0; j < secondlist.length; j++) {
          var second = new ProductVariants();
          second.attributeID = secondlist[j].attributeID;
          second.name = secondlist[j].name;
          second.slug = secondlist[j].slug;

          for (var k = 0; k < thirdlist.length; k++) {
            productAttibutevariantslis = [];
            var third = new ProductVariants();
            third.attributeID = thirdlist[k].attributeID;
            third.name = thirdlist[k].name;
            third.slug = thirdlist[k].slug;
            productAttibutevariantslis.push(First);
            productAttibutevariantslis.push(second);
            productAttibutevariantslis.push(third);
            this.addVariantDynamic(productAttibutevariantslis);
          }
        }
      }
    }
    if (length == 4) {
      for (var i = 0; i < firstlist.length; i++) {
        var First = new ProductVariants();
        First.attributeID = firstlist[i].attributeID;
        First.name = firstlist[i].name;
        First.slug = firstlist[i].slug;

        for (var j = 0; j < secondlist.length; j++) {
          var second = new ProductVariants();
          second.attributeID = secondlist[j].attributeID;
          second.name = secondlist[j].name;
          second.slug = secondlist[j].slug;

          for (var k = 0; k < thirdlist.length; k++) {
            var third = new ProductVariants();
            third.attributeID = thirdlist[k].attributeID;
            third.name = thirdlist[k].name;
            third.slug = thirdlist[k].slug;
            for (var l = 0; l < forthlist.length; l++) {
              productAttibutevariantslis = [];
              var forth = new ProductVariants();
              forth.attributeID = forthlist[l].attributeID;
              forth.name = forthlist[l].name;
              forth.slug = forthlist[l].slug;
              productAttibutevariantslis.push(First);
              productAttibutevariantslis.push(second);
              productAttibutevariantslis.push(third);
              productAttibutevariantslis.push(forth);
              this.addVariantDynamic(productAttibutevariantslis);
            }
          }
        }
      }
    }
    if (length == 5) {
      for (var i = 0; i < firstlist.length; i++) {
        var First = new ProductVariants();
        First.attributeID = firstlist[i].attributeID;
        First.name = firstlist[i].name;
        First.slug = firstlist[i].slug;

        for (var j = 0; j < secondlist.length; j++) {
          var second = new ProductVariants();
          second.attributeID = secondlist[j].attributeID;
          second.name = secondlist[j].name;
          second.slug = secondlist[j].slug;

          for (var k = 0; k < thirdlist.length; k++) {
            var third = new ProductVariants();
            third.attributeID = thirdlist[k].attributeID;
            third.name = thirdlist[k].name;
            third.slug = thirdlist[k].slug;
            for (var l = 0; l < forthlist.length; l++) {

              var forth = new ProductVariants();
              forth.attributeID = forthlist[l].attributeID;
              forth.name = forthlist[l].name;
              forth.slug = forthlist[l].slug;
              for (var m = 0; m < fifthlist.length; m++) {
                productAttibutevariantslis = [];
                var fifth = new ProductVariants();
                fifth.attributeID = fifthlist[m].attributeID;
                fifth.name = fifthlist[m].name;
                fifth.slug = fifthlist[m].slug;
                productAttibutevariantslis.push(First);
                productAttibutevariantslis.push(second);
                productAttibutevariantslis.push(third);
                productAttibutevariantslis.push(forth);
                productAttibutevariantslis.push(fifth);
                this.addVariantDynamic(productAttibutevariantslis);
              }
            }
          }
        }
      }
    }
    if (length == 6) {
      for (var i = 0; i < firstlist.length; i++) {
        var First = new ProductVariants();
        First.attributeID = firstlist[i].attributeID;
        First.name = firstlist[i].name;
        First.slug = firstlist[i].slug;

        for (var j = 0; j < secondlist.length; j++) {
          var second = new ProductVariants();
          second.attributeID = secondlist[j].attributeID;
          second.name = secondlist[j].name;
          second.slug = secondlist[j].slug;

          for (var k = 0; k < thirdlist.length; k++) {
            var third = new ProductVariants();
            third.attributeID = thirdlist[k].attributeID;
            third.name = thirdlist[k].name;
            third.slug = thirdlist[k].slug;
            for (var l = 0; l < forthlist.length; l++) {

              var forth = new ProductVariants();
              forth.attributeID = forthlist[l].attributeID;
              forth.name = forthlist[l].name;
              forth.slug = forthlist[l].slug;
              for (var m = 0; m < fifthlist.length; m++) {
                var fifth = new ProductVariants();
                fifth.attributeID = fifthlist[m].attributeID;
                fifth.name = fifthlist[m].name;
                fifth.slug = fifthlist[m].slug;
                for (var six = 0; l < sixList.length; l++) {
                  productAttibutevariantslis = [];
                  var sixth = new ProductVariants();
                  sixth.attributeID = sixList[six].attributeID;
                  sixth.name = sixList[six].name;
                  sixth.slug = sixList[six].slug;

                  productAttibutevariantslis.push(First);
                  productAttibutevariantslis.push(second);
                  productAttibutevariantslis.push(third);
                  productAttibutevariantslis.push(forth);
                  productAttibutevariantslis.push(fifth);
                  productAttibutevariantslis.push(sixth);
                  this.addVariantDynamic(productAttibutevariantslis);
                }
              }
            }
          }
        }
      }
    }
    this.shortDetail = false;
  }
  keyPress(event: any) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
  LiveSearchProduct(searchText: string) {
    var length = 0;
    try {
      length = searchText.length;
    } catch (e) {
      this.showSuggestionsLive = false;
      return;
    }
    if (length > 0) {
      this.productService.ProductSuggestions(searchText).subscribe(
        data => {
          this.ProductLiveSearch = data;
          if (this.ProductLiveSearch.length > 0) {
            this.showSuggestionsLive = true;
          }
        });
    }
    else {
      this.ProductLiveSearch = [];
      this.showSuggestionsLive = false;
    }
  }
  SelectProduct(product: Product) {
    this.addProduct = product;
    if (!this.selectedProductAccessories.some((item) => item.productID == this.addProduct.productID)) {
      this.selectedProductAccessories.push(this.addProduct);

      this.showProduct = true;
      this.showSuggestionsLive = false;
    }
    else {
      this.toastr.error('This item is already Exist', 'Fail!');
    }
    this.showSuggestionsLive = false;
  }
  removeProduct(index) {
    this.selectedProductAccessories.splice(index, 1);
    if (this.selectedProductAccessories.length == 0) {
      this.showProduct = false;
    }
  }
}

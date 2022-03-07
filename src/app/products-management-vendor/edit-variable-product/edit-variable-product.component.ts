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
  selector: 'app-edit-variable-product',
  templateUrl: './edit-variable-product.component.html',
  styleUrls: ['./edit-variable-product.component.css']
})
/** edit-variable-product component*/
export class EditVariableProductComponent {
  public productStatus: EnumDropDown[];
  product = new Product();
  public productAccessories: Product[] = [];
  public files: File[] = [];
  public parentCategoryList: Category[] = [];
  public categoryList: Category[] = [];
  public SubcategoryList: Category[] = [];
  public productInCategoies: Category[] = [];
  public productAttributeVariants: ProductVariants[] = [];
  public selectedAttributeVariants: ProductVariants[] = [];
  public selectedProductAccessories: Product[];
  public selectedProductInCategoies: Category[];
  public Parentname: string;
  public cName: string;
  public attributes: Attributes[] = [];
  public attributesList: Attributes[] = [];
  public productattributesList: Attributes[] = [];

  newVariantRegularPrice: string;
  newVariantSalePrice: string;
  newVariantSku: string;
  newVariantStock: string;


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
  public warrantyList: Warranty[] = [];
  public returnPolicyLIst: ReturnPolicy[] = [];
  public vendorsList: Customer[];
  public brandList: Brand[];

  public pId: number;
  public cId: number;
  public sId: number;

  public parent = new Category();
  public category = new Category();
  public sub = new Category();
  public productVariants: ProductVariants[] = [];
  public SelectedCategory: string;
  public masterproduct: string;
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
  /** edit-variable-product ctor */
  constructor(private _avRoute: ActivatedRoute,
    private readonly brandsService: BrandService,
    private modalService: BsModalService,
    private readonly customerService: CustomerService,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private http: HttpClient,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly router: Router, private appService: AppService,
    public cookieService: CookieService) {
    this.CheckLogin();
    this.toastr.setRootViewContainerRef(vcr);
    this.getAccessoriesProducts();
    this.getproductInCategoies();
    this.GetWarranties();
    this.GetReturnPolicy();
    this.getcustomers();
    this.GetCategoryList();
    this.getbrands();
    this.GetAttributeList();

    this.pId = 0
    this.cId = 0
    this.sId = 0
    this.masterproduct = "";
    this.SelectedCategory = "";
    if (this._avRoute.snapshot.params["id"]) {
      this.getProductById(this._avRoute.snapshot.params["id"]);
    }

    this.selectedProductInCategoies = [];
    this.selectedProductAccessories = [];
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
  GetProductStatus() {
    this.productService.GetProductStatus().subscribe(
      data => {
        this.productStatus = data;
      }
    )
  }
  deleteProduct(id) {
    this.productService.DeleteProduct(id);
    this.toastr.success('Product Status has been Changed Successfully ', 'Success');
    var index = this.product.productVariations.findIndex(x => x.id == id);
    if (index != -1) {
      var status = this.product.productVariations[index].isActive;
      this.product.productVariations[index].isActive = status == true ? false : true;
    }

  }
  getProductById(id: string) {
    this.masterproduct = id;
    this.productService.GetProductVariations(id).subscribe(data => {
      this.product = data;
      this.product.productVariations.forEach((item, index) => {
        if (this.product.productVariations[index].salePrice == 0) {
          this.product.productVariations[index].commissionAmount = this.product.productVariations[index].regularPrice - this.product.productVariations[index].commissionPrices;
        }
        else if (this.product.productVariations[index].salePrice > 0 && this.product.productVariations[index].salePrice > this.product.productVariations[index].regularPrice) {
          this.product.productVariations[index].commissionAmount = this.product.productVariations[index].regularPrice - this.product.productVariations[index].commissionPrices;
        }
        else if (this.product.productVariations[index].salePrice > 0 && this.product.productVariations[index].salePrice < this.product.productVariations[index].regularPrice) {
          this.product.productVariations[index].commissionAmount = this.product.productVariations[index].salePrice - this.product.productVariations[index].commissionPrices;
        }
      });
      if (this.product.variants != null) {
        this.productAttributeVariants = this.product.variants;

        this.GetVariants(this.productAttributeVariants.map(a => a.attributeID).join());
      }

      this.BindCategory(this.product.parentCategoryID, this.product.categoryID, this.product.subCategoryID);
    });
  }

  GetVariants(ids: string) {
    this.productService.GetVariants(ids).subscribe(data => {
      this.selectedAttributeVariants = data;
    });
  }

  getcustomers() {
    this.customerService.getVendorsList().subscribe(
      data => {
        this.vendorsList = data;
      }
    )
  }

  GetAttributeList() {
    this.productService.GetAttributeList().subscribe(
      data => {
        this.attributes = data;
        this.attributesList = data;
      }
    )
  }

  openModal(template: TemplateRef<any>) {
    this.productVariants = [];

    this.newVariantRegularPrice = "";
    this.newVariantSalePrice = "";
    this.newVariantSku = "";
    this.newVariantStock = "";

    var ids = [];
    this.selectedAttributeVariants.forEach(x => {
      if (ids.filter(y => y == x.attributeID).length == 0) {
        var attr = this.selectedAttributeVariants.filter(y => y.attributeID == x.attributeID);
        if (attr.length > 0) {
          this.setSlugValue(attr[0].attributeID, attr[0].slug);
        }
        ids.push(x.attributeID);
      }
    });
    //this.setSlugValue();

    this.modalRef = this.modalService.show(template, this.config);
  }

  RemoveVariant(i) {
    this.product.productVariations.splice(i, i);
  }

  GetWarranties() {
    this.productService.GetWarranties().subscribe(
      data => {
        this.warrantyList = data;
        this.product.warentyType = this.warrantyList[0].warrantyID;
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

  GetCategoryList() {
    this.categoryService.GetCategoryList().subscribe(
      data => {
        this.parentCategoryList = data;
        this.GetCategoryListByParent(data[0].categoryID);
        this.pId = data[0].categoryID;
        this.Parentname = data[0].categoryName;
      }
    )
    this.categoryList = [];
    this.SubcategoryList = [];
  }

  GetCategoryListByParent(parentCategoryId: number) {
    this.categoryService.GetCategoryListByParent(parentCategoryId).subscribe(
      data => {
        this.categoryList = data;
        this.GetSubCategoryListByParent(data[0].categoryID);
        this.cId = data[0].categoryID;
        this.cName = data[0].categoryName;
      }
    )
    this.SubcategoryList = [];
  }

  GetSubCategoryListByParent(parentCategoryId: number) {
    this.categoryService.GetCategoryListByParent(parentCategoryId).subscribe(
      data => {
        this.SubcategoryList = data;
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
        this.product.returnPolicy = this.returnPolicyLIst[0].returnPolicyID;
      }
    )
  }


  setSlugValue(id: number, name: string) {

    if (this.productVariants.filter(x => x.attributeID == id).length <= 0) {
      let copy = JSON.parse(JSON.stringify(this.productAttributeVariants[this.productAttributeVariants.findIndex(x => x.attributeID == id)]));
      copy.slug = name;
      this.productVariants.push(copy);
    }

    else {
      var i = this.productVariants.findIndex(x => x.attributeID == id);
      this.productVariants[i].slug = name;
    }
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

  AddVariant() {

    if (this.product.productVariations == null || typeof this.product.productVariations == "undefined")
      this.product.productVariations = [];


    let prod: Product = new Product();
    prod = JSON.parse(JSON.stringify(this.product));
    prod.id = null;
    prod.salePrice = parseInt(this.newVariantRegularPrice);
    prod.regularPrice = parseInt(this.newVariantSalePrice);
    prod.vendorSKU = this.newVariantSku;
    prod.stockQuantity = parseInt(this.newVariantStock);
    prod.masterProduct = this.product.productID;
    prod.variants = this.productVariants;
    prod.productID = 0;
    //prod.appliedDiscoutType = 4;
    //prod.appliedDiscoutedAmount = 0;
    prod.brandID = this.product.brandID;
    prod.categoryID = this.product.categoryID;
    //prod.commissionPrices = 150;
    //prod.commissionType = 1;
    prod.detail = this.product.detail;
    prod.enableStock = this.product.enableStock;
    //prod.files = this.product.enableStock;
    prod.height = this.product.height;
    //prod.id = "5bbdcffebc75441d1cff102a";
    prod.inStock = this.product.inStock;
    prod.isActive = this.product.isActive;
    prod.isExcluded = this.product.isExcluded;
    prod.isFeature = this.product.isFeature;
    prod.isOnCash = this.product.isOnCash;
    prod.length = this.product.length;
    prod.masterProduct = this.product.productID;
    prod.metaDiscription = this.product.metaDiscription
    prod.metaKeyWords = this.product.metaKeyWords;
    prod.metaTitle = this.product.metaTitle;
    prod.name = this.product.name;
    prod.parentCategoryID = this.product.parentCategoryID;
    //prod.productID = this.product.enableStock;
    prod.productType = this.product.productType;
    prod.reviewsEnable = this.product.reviewsEnable;
    prod.vendorID = this.product.vendorID;
    prod.subCategoryID = this.product.subCategoryID;
    //prod.url = "";
    prod.specification = this.product.specification;
    prod.shortDetail = this.product.shortDetail;
 
    let copy = JSON.parse(JSON.stringify(prod));
    this.product.productVariations.push(copy);
    this.modalRef.hide();
  }


  keyPress(event: any) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
  onTextChange(Value: string) {

    var i = 0, strLength = Value.length;
    for (i; i < strLength; i++) {
      Value = Value.replace(" ", "-");
    }
    this.product.url = Value.toLowerCase();
  }
  onSubmit() {
    var product = [];
    if (this.product.productVariations.length != null && typeof this.product.productVariations != "undefined")
      this.product.productVariations.forEach(x => {
        product.push(x);
      });

    this.productService.UpdateVariableProduct(product).subscribe(data => {
      this.toastr.success('Product Updated Successfully ', 'Success');
      this.router.navigate(["/products-vendor"]);
    });
  }
}

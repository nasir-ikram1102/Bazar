import { Component, ViewContainerRef, TemplateRef, AfterViewInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product, ActiveSlugModel, CustomerProfilling } from '../../models/products/product.model';
import { CartService } from '../../services/cart/cart.service';
import { LoginService } from '../../services/login/login.service';
import { WishListService } from '../../services/wishlist/wishList.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { ProductRating, ProductAttributes } from '../../models/products/product-rating.model';
import { ProductRatingService } from '../../services/product/product-rating.service';
import { ProductRatingViewModel } from '../../models/products/product-rating -view.model';
import { ProfileService } from '../../services/profile/profile.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginModel } from '../../models/user/login-model';
import { WishList } from '../../models/WishList/wishList-model';
import { SharedService } from '../../services/shared/shared.service';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

/** product-detail component*/
export class ProductDetailComponent {
  public productRatingList: ProductRating[] = [];

  public ratingCount = new ProductRatingViewModel();
  public imagesUrl;
  public shippingAddress: any;
  public wishlistcount: number;
  public cartcount: number;
  public checkDefaultselect: boolean;
  public brandLogoNotExist: boolean = true;
  public attributes: any;
  public activeSlugModel: ActiveSlugModel;
  public previousSlugArray: ActiveSlugModel[] = [];
  public wasClickedSlug: number;
  public wasClickedAttribute: number;
  public emaill: any;
  public passwordd: any;
  public GlobelVariants: any[] = [];
  public unFilteredVariants: any[] = [];
  public AllVarients: any[];
  public result: ProductAttributes[] = [];
  public ratingModel: any;
  quantity: number;
  customerID: number;
  customerProfilling: CustomerProfilling;
  public loginModel: LoginModel = new LoginModel();
  i: number;
  modalRef: BsModalRef;
  config = {
    animated: true
  };
  img: any;
  lens: any;
  var: any;
  resultimages: any;
  cx: any;
  cy: any;
  categoryBreadCrumbs: boolean = true;
  /** product-detail ctor */
  breadcrumbs: any;
  product: Product = new Product();
  currentLocation: string;
  public urlHit: string;
  public urlOld: string;
  public DummyCounter: number = 0;
  public url: string = "";
  public pId: number = 0;
  alreadyChecked: any = "";
  firstImageChecked: any = "";
  public wishList: WishList = new WishList();

  constructor(private readonly productService: ProductService,
    private readonly cartService: CartService,
    private cookieService: CookieService,
    private readonly loginService: LoginService,
    private readonly wishListService: WishListService,
    public toastr: ToastsManager,
    private readonly profileService: ProfileService,
    private readonly ratingService: ProductRatingService,
    private readonly sharedService: SharedService,
    //private readonly drift: Drift,

    private readonly router: Router,
    vcr: ViewContainerRef,
    private activeRoute: ActivatedRoute, private meta: Meta, private titleService: Title) {
    this.quantity = 1;
    const routeParams = this.activeRoute.snapshot.params;
    this.previousSlugArray = [];
    this.activeSlugModel = new ActiveSlugModel();
    this.breadcrumbs = '';
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
    this.sharedService.sameUrlProductListner().subscribe((m: any) => {
      
     this.GetProduct(this.activeRoute.snapshot.params.url, this.customerID,false);
      this.imagesUrl = [];
      //this.GetProductBreadcrumbs(routeParams.url);
     // this.getRatingCount(routeParams.url);
      window.scrollTo(0, 0);
    });
    this.url = routeParams.url;
    this.GetProduct(routeParams.url, this.customerID, true);
    
    this.customerProfilling = new CustomerProfilling();
    this.profileService.getProfile().subscribe(
      data => {
        if (data) {

          this.shippingAddress = data;

        }
        else {

        }
      });
    this.toastr.setRootViewContainerRef(vcr);
    this.getRatingCount(this.activeRoute.snapshot.params.url);
    try {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
      window.scrollTo(0, 0);
    } catch (e) {
      window.scrollTo(0, 0);
    }

    // here we set CustomerProfilling



    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });

    this.product.fields = [];

    //
  }
  onListenerTirgger() {
    this.DummyCounter += 1;
  }

  openModal(loginTemplate: TemplateRef<any>, ratingTemplate: TemplateRef<any>, id: number) {
    this.wishList.customerID = (this.cookieService.get("CustomerID") && typeof this.cookieService.get("CustomerID") != "undefined") ? parseInt(this.cookieService.get("CustomerID")) : 0;// userdata.customerID;
    this.wishList.productID = id;

    this.wishListService.addWishlist(this.wishList).subscribe(
      d => {
        if (d == 0) {
          this.toastr.success('Item removed from wishlist', 'Success');
          this.product.isFavourite = !this.product.isFavourite;
          this.wishlistcount = parseInt(this.cookieService.get('wishlistCounters')) - 1;
          this.cookieService.set('wishlistCounters', this.wishlistcount.toString());

        }
        else if (d == -1) {
          this.router.navigate(['/login'], { queryParams: { url: 'product/' + this.url } });
          //this.modalRef = this.modalService.show(loginTemplate, this.config);
        }
        else {
          this.wishlistcount = parseInt(this.cookieService.get('wishlistCounters')) + 1;
          this.cookieService.set('wishlistCounters', this.wishlistcount.toString());
          this.toastr.success('Item added to wish list', 'Success');
          this.product.isFavourite = !this.product.isFavourite;
        }
      });
  }

  getRatingCount(url: string) {
    this.ratingService.getProductRatingCount(url).subscribe(
      data => {
        if (data.averageRating == "NaN" || isNaN(data.averageRating))
          data.averageRating = 0;

        this.ratingCount = data;
      });
  }
  ngOnInit() {
    this.imagesUrl = [];
  }
  //prdRating.get
  AddToCompareList(id: number) {

    if (this.cartService.AddToCompareList(id)) {
      this.toastr.success('Item added to compare list', 'success');
    }
    else {
      this.toastr.info('Item already added to compare list', 'Information');
    }
  }

  AddToWishList(id: number) { 
  }

  AddToCart(product: Product) {
    this.cartService.AddToCookieCart(product, this.quantity);
  }

  Buy(product: Product) {
    this.cartService.AddToCookieCart(product, this.quantity);
    this.router.navigate(["/cart"]);
  }

  groupBy(arr, key) {
    var newArr = [],
      types = {},
      newItem, i, j, cur;
    for (i = 0, j = arr.length; i < j; i++) {
      cur = arr[i];
      if (!(cur[key] in types)) {
        types[cur[key]] = { type: cur[key], data: [] };
        newArr.push(types[cur[key]]);
      }
      cur.ids = (arr[i].productID).toString();
      types[cur[key]].data.push(cur);
    }
    return newArr;

  }
  
  returnDistince() {
  }

  GetProduct(url: string, customerID: number, firstload: boolean) {
    this.productService.GetProduct(url, customerID, firstload).subscribe(
      data => {
        this.product = data;
        this.quantity = 1;
        if (this.product.metaDiscription != null && this.product.metaDiscription != "" && this.product.metaDiscription != "null") {
          this.meta.updateTag({ name: 'description', content: this.product.metaDiscription });
        }
        if (this.product.metaKeyWords != null && this.product.metaKeyWords != "" && this.product.metaKeyWords != "null") {
          this.meta.updateTag({ name: 'keywords', content: this.product.metaKeyWords });
        }
        if (this.product.metaTitle != null && this.product.metaTitle != "" && this.product.metaTitle != "null") {
          this.titleService.setTitle(this.product.metaTitle);
        }
        else {
          this.titleService.setTitle(this.product.name);
        }
        //temp code dor url testing
        this.pId = this.product.productID;
        this.customerProfilling.value = this.product.productID.toString();
        this.GetProductBreadcrumbs(this.product.productID);
        this.getRatingCount(this.activeRoute.snapshot.params.url); 

        if (typeof data.thumbnailimages != 'undefined' && data.thumbnailimages != null) {
          for (this.i = 0; this.i < data.thumbnailimages.length; this.i++) {
            this.imagesUrl.push(data.thumbnailimages[this.i]);
          }
         // var A = [1, 2, 3, 4, 5, 6, 7, 8, 9],
          var  x = 0, y = 1;
          this.imagesUrl[x] = this.imagesUrl.splice(y, 1, this.imagesUrl[x])[0];
        }
        setTimeout(() => {
          this.FirstImageSelected();
        }, 500);


        this.result = this.groupBy(data.productVarients, 'name');
        this.AllVarients = this.groupBy(data.productVarients, 'name');

        var unique = {};
        var attributeArray = [];
        var selectionBase = [];

        this.checkDefaultselect = true;
        var i = 0;
        this.result.forEach(x => {

          var distinctBase = [];
          x.data.forEach(y => {



            if (distinctBase.filter(z => z.attributeID == y.attributeID && z.slug == y.slug).length > 0) {
              var index = distinctBase.findIndex(z => z.attributeID == y.attributeID && z.slug.toLocaleLowerCase() == y.slug.toLocaleLowerCase());

              if (distinctBase[index].ids == null || typeof distinctBase[index].ids == "undefined")
                distinctBase[index].ids = "";
              if (distinctBase[index].aids == null || typeof distinctBase[index].aids == "undefined")
                distinctBase[index].aids = "";

              distinctBase[index].ids = distinctBase[index].ids + "," + y.productID;
              distinctBase[index].aids = distinctBase[index].aids + "," + y.attributeID;

            }
            else {
              distinctBase.push({
                productID: y.productID,
                attributeID: y.attributeID,
                slug: y.slug,
                ids: y.productID,
                aids: y.attributeID
              });
            }
          });


          attributeArray.push(distinctBase);
          this.result[i].data = [];
          this.result[i].data = distinctBase;
          i++;
          this.GlobelVariants = distinctBase;

        });

        if (data.productVarients.length > 0) {
          if (this.imagesUrl.length > 1) {
            this.product.productDefaultImage = this.imagesUrl[1].replace(/thmb/g, "img");
          }
          for (var i = 0; i < this.result.length; i++) {

            this.GetVariantProduct(this.result[i].data[0].ids.toString(), i, 0);
            setTimeout(() => {
              this.imageZoom("myimage", "myresult");
            }, 1000);
          }

        }
        else {

          setTimeout(() => {
            this.imageZoom("myimage", "myresult");
          }, 2000);
          if (this.imagesUrl.length > 1) {
            this.product.productDefaultImage = this.imagesUrl[1].replace(/thmb/g, "img");
          }
        }








      });


  }
  isAttributeActive(slugCounter: number, selectedIndex: number) {
    //Empty list if parent slug is selected
    this.activeSlugModel = this.previousSlugArray.filter(i => i.slug == slugCounter && i.attribute == selectedIndex)[0];
    if (this.activeSlugModel != undefined) {
      return (this.activeSlugModel.slug == slugCounter && this.activeSlugModel.attribute == selectedIndex);
    }
    else {
      return false;
    }
  }
  GetVariantProduct(productIds: string, index: number, selectedIndex: number, chekCallBack: boolean = true) {

    //this code is for span selected
    this.activeSlugModel = new ActiveSlugModel();
    var itemsToRemove = this.previousSlugArray.filter(i => i.slug == index);/*&& i.attribute != selectedIndex*/
    if (typeof itemsToRemove != 'undefined' && itemsToRemove.length > 0) {
      for (var i = 0; i < itemsToRemove.length; i++) {
        var indextoremove = this.previousSlugArray.findIndex(d => d == itemsToRemove[i]);
        this.previousSlugArray.splice(indextoremove, 1);
      }
    } else {

    }
    this.activeSlugModel.slug = index;
    this.activeSlugModel.attribute = selectedIndex;
    this.previousSlugArray.push(this.activeSlugModel);

    if (this.AllVarients.length - 1 == index) {
      this.productService.GetChildProductDetail(parseInt(productIds), this.customerID).subscribe(
        data => {
          this.brandLogoNotExist = true;
          this.product = data;
          setTimeout(() => {
            this.FirstImageSelected();
          }, 500);
        });

    }
    
    if (typeof this.result[index + 1] != "undefined") {
      var pIds = [];
      if (productIds.toString().includes(",")) {
        pIds = productIds.split(',');
      } else {
        pIds = [productIds];
      }
      this.unFilteredVariants = JSON.parse(JSON.stringify(this.AllVarients[index + 1].data));
      //if (typeof this.result[i + 1].data == 'undefined')
      this.result[index + 1].data = [];
      pIds.forEach(x => {
        if (this.unFilteredVariants != null && typeof this.unFilteredVariants != "undefined") {
          this.unFilteredVariants.forEach(y => {
            y.ids.split(",").forEach(z => {
              if (z == x) {
                //var index = this.result[index + 1].data.findIndex(a => a.slug == y.slug) ;
                if (this.result[index + 1].data.findIndex(a => a.slug == y.slug) == -1) {
                  this.result[index + 1].data.push(y);


                }
                else {
                  if (this.result[index + 1].data.filter(a => a.slug == y.slug).length > 0) {
                    var indexOfp = this.result[index + 1].data.findIndex(a => a.slug == y.slug);
                    this.result[index + 1].data[indexOfp].ids = this.result[index + 1].data[indexOfp].ids + "," + z;
                  }
                }
              }
            });
          });
        }
      });


    }

    if (index >= 0 && chekCallBack == false) {
      if (this.result.length > 0) {
        for (var i = 0 + index; i < this.result.length - 1; i++) {

          if (typeof this.result[i + 1].data != 'undefined') {
            this.GetVariantProduct(this.result[i + 1].data[0].ids.toString(), i + 1, 0, true);
          }


        }


      }

    }

    // this.imageZoom("myimage", "myresult");
  }
  onSubmit() {

    this.loginModel.email = this.emaill;
    this.loginModel.password = this.passwordd;
    this.loginService.authenticateLogin(this.loginModel).subscribe(
      data => {
        if (data.status == 200) {
          //this.cookieService.set('Login', data.data);
          this.cookieService.set('Login', data.data.token);
          this.cookieService.set('CustomerID', data.data.customerID);
          this.cookieService.set('CustomerEmail', data.data.email);
          this.cookieService.set('CustomerName', data.data.name);
          this.toastr.success('Login successfully.', 'Success');
          this.modalRef.hide();
          //this code is getting all counter cart and wishlist when user login

          this.cartService.UpdateBulkCart();

          this.profileService.getProfile().subscribe(
            userdata => {
              this.productService.GetCounters(userdata.customerID);
            });
          this.AddToWishList(this.product.productID);

        }
        else {
          this.toastr.error(data.message, 'Error');
        }
      });
  }


  selectImage(imageUrl: any, event: any) {

    if (this.alreadyChecked != "") {
      this.alreadyChecked.target.setAttribute("class", event.target.classList.value);
    }
    
    var src = event.target.src;
    if (typeof src == 'undefined') {
      var exactimageUrl = imageUrl.replace(/thmb/g, "img");
      this.product.productDefaultImage = exactimageUrl;
      var images = document.getElementsByTagName('img');
      for (var i = 0; i < images.length - 1; i++) {
        if (images[i].src == imageUrl) {

          this.firstImageChecked = images[i];
          this.firstImageChecked.setAttribute("class", "selected " + event.target.classList.value);
        }
      }

      setTimeout(() => {
        this.imageZoom("myimage", "myresult");
      }, 800);
    }
    else {
      //this code is for default image select and selected class applied in slider
      var exactimageUrl = src.replace(/thmb/g, "img");
      this.product.productDefaultImage = exactimageUrl;
      setTimeout(() => {
        this.imageZoom("myimage", "myresult");
      }, 800);
      if (this.firstImageChecked != "") {
        this.firstImageChecked.setAttribute("class", event.target.classList.value);

      }
      event.target.setAttribute("class", "selected " + event.target.classList.value); //style.border = "1px solid Red !important;";
      this.alreadyChecked = event;
    }


  }
  minvalue() {


    this.quantity = parseInt(((document.getElementById("quanty") as HTMLInputElement).value));
    if (this.quantity <= 0) {
      this.quantity = 1;
      (<HTMLInputElement>document.getElementById("quanty")).value = "1";
    }
  }
  increment(check: boolean) {
    if (check) {
      if (this.quantity < 1) {
        this.quantity = 1;
      }
      else {
        this.quantity = this.quantity + 1;
      }

    }
    else {
      if (this.quantity <= 1) {
        this.quantity = 1;
      }
      else {
        this.quantity = this.quantity - 1;
      }
    }
  }
  keyPress(event: any) {
    if (this.quantity < 1) {
      this.quantity = 1;
    }
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
  GetProductBreadcrumbs(id: number) {
    this.productService.GetProductBreadcrumbs(id).subscribe(d => {
      
      this.breadcrumbs = d;
    });
  }
  GetIndex(i) {
    return (i + 1);
  }


  imageZoom(imgID, resultID) {

    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    lens.setAttribute("id", "lensId");

    img.parentElement.insertBefore(lens, img);

    cx = 2.5;//result.offsetWidth / 100;
    cy = 2; //result.offsetHeight / 100;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lens:*/
      x = pos.x - (100 / 2);
      y = pos.y - (100 / 2);
      /*prevent the lens from being positioned outside the image:*/

      if (x > img.width - 100) { x = img.width - 100; }
      if (x < 0) { x = 0; }
      if (y > img.height - 100) { y = img.height - 100; }
      if (y < 0) { y = 0; }
      /*set the position of the lens:*/
      lens.style.left = x + "px";
      lens.style.top = y + "px";
      /*display what the lens "sees":*/

      result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }

  ngAfterViewInit() {
    this.imageZoom("myimage", "myresult");
  }
  FirstImageSelected() {
    if (this.imagesUrl.length > 1) {
      this.product.productDefaultImage = this.imagesUrl[1].replace(/thmb/g, "img");
      var images = document.getElementsByTagName('img');
      for (var i = 0; i < images.length - 1; i++) {
        if (images[i].src == this.imagesUrl[1]) {
          this.firstImageChecked = images[i];
          this.firstImageChecked.setAttribute("class", "selected " + "1 ng-star-inserted");
        }
      }
    }
  }
  decodeHtml(html: string) {
    var titleInnerTest;
    var txt = document.getElementById('shortdesId');
    txt.innerHTML = html;
    titleInnerTest = txt.innerText;
    txt.innerHTML = (txt.innerHTML).substring(0, 200);
    return titleInnerTest;
  }
  updateUrl(event: any) {
    this.brandLogoNotExist = false;
  }
}

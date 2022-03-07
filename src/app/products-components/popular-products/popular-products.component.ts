import { Component, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { Product } from '../../models/products/product.model';
import { ProductService } from '../../services/product/product.service';
import { LoginService } from '../../services/login/login.service';
import { CartService } from '../../services/cart/cart.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
@Component({
    selector: 'app-popular-products',
    templateUrl: './popular-products.component.html',
    styleUrls: ['./popular-products.component.scss']
})
/** popular-products component*/
export class PopularProductsComponent {
    /** popular-products ctor */
  products: Product[];
  prodImage = "";
  prodThumb = "";
  modalRef: BsModalRef;
  config = {
    animated: true
  };
  carouselOptions: any = {
    nav: true,
    dots: false,
    loop: true,
    items: 5,
    itemslideSpeed: 2000,
    autoplay: true,
    responsiveRefreshRate: 200,
    navText: ["<i class='fa fa-angle-left' aria-hidden='true'></i>", "<i class='fa fa-angle-right' aria-hidden='true'></i>"],
    responsive: {
      0: {
        items: 1,
        nav: false,
        dots: true,
      },
      401: {
        items: 2,
        nav: false,
        dots: true,
      },
      460: {
        items: 3,
        nav: false,
        dots: true,
      },
      768: {
        items: 4,
        nav: false,
        dots: true,
      },
      1200: {
        items: 5,
        nav: false,
        dots: true,
      },
      1201: {
        items: 5,
        nav: true,
        dots: false,
      }
    }
  }

  constructor(private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly loginService: LoginService,
    vcr: ViewContainerRef,
    private modalService: BsModalService,
    private readonly router: Router,
    private readonly toastr: ToastsManager) {
    this.toastr.setRootViewContainerRef(vcr);
    this.GetProducts();
  }

  AddToCompareList(id: number) {
    if (this.cartService.AddToCompareList(id)) {
      this.toastr.success('Item added to compare list', 'success');
    }
    else {
      this.toastr.error('Item already added to compare list', 'Error');
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

  ProductDetail(url: string) {
    this.router.navigate(["/product/" + url]);
  }

  OpenModal(template: TemplateRef<any>, prodImage, prodThumb) {
    this.prodImage = prodImage;
    this.prodThumb = prodThumb;
    this.modalRef = this.modalService.show(template, this.config);
  }

  Decline() {
    this.prodImage = "";
    this.prodThumb = "";
    this.modalRef.hide();
  }
  GetProducts() {
    this.productService.GetProductList("Popular").subscribe(
      data => {
        this.products = data;
      });
  }
}

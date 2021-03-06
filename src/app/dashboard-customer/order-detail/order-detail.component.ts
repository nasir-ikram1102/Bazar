import { Component, TemplateRef} from '@angular/core'; 
import { OrderViewModel } from '../../models/order/order-view-model.model';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { Order } from '../../models/order/order.model';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/products/product.model';
import { BrandService } from '../../services/brand/brand.service';
import { Brand } from '../../models/brand/brand-model';
import { CustomerService } from '../../services/customer/customer.service';
import { Customer } from '../../models/customer/customer-model';
import { EnumDropDown } from '../../models/shared/enum-dropdown'
import { OrderDetail } from '../../models/order/order-detail.model'; 
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal'; 
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
/** order-detail component*/
export class OrderDetailComponent { 
  public DummyCounter: number = 0;
  public orderDetail: OrderViewModel;
  public productidDistinct: number[];
  public unVerfiedProducts: number[] = [];
  public ProductList: Product[]=[];
  public productDetail = new Product();
  public ProductToAdd: OrderDetail;
  public vendorProductList: Product[];
  public customerList: Customer[];
  public brandtList: Brand[]=[];
  public orderStatuses: EnumDropDown[];
  public purchasOrderStatuses: EnumDropDown[];
  public orderDetailStatuses: EnumDropDown[];
  public ProductType: string;
  public customer: Customer;
  public isProductToAddVisibile: boolean;
  modalRef: BsModalRef;
  config = {
    animated: true
  };

  /** order-detail ctor */

  constructor(private readonly orderService: OrderService,
    private _avRoute: ActivatedRoute, private _router: Router,
    private readonly ProductService: ProductService,
    private sharedService: SharedService,  
    private readonly BrandService: BrandService,
    private readonly CustomerService: CustomerService,
    private readonly toastr: ToastsManager,
    private modalService: BsModalService,
    ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.orderDetail = new OrderViewModel();
      this.orderDetail.order = new Order();
      this.orderDetail.customer = new Customer();
      this.ProductToAdd = new OrderDetail(); 
      this.GetOrderDetail(this._avRoute.snapshot.params["id"]);
      this.orderDetailStatuses = [];
      this.ProductType = "Recent"; 
      this.getProcessOrderStatuses();
      this.isProductToAddVisibile = false;
    } 
    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });
  }
  onListenerTirgger() {
    this.DummyCounter += 1;
  }

  GetOrderDetail(id: string) {
    this.orderService.GetOrderDetailByOrder(id).subscribe(
      data => {
        this.orderDetail = data;
        this.getBrands(); 
        this.getProdducts(this.ProductType);

      });
  }
  openProductModal(productTemplate: TemplateRef<any>, id) {
    this.ProductService.GetProductById(id).subscribe(
      data => {
        if (data) {
          this.productDetail = data;
          this.modalRef = this.modalService.show(productTemplate, this.config);
        }
      }
    )
  }
  ifProductExist(productID: number) {
    return (this.ProductList.find(i => i.productID == productID) == undefined);
  }

  getProdducts(type: string) {
    this.ProductType = type;
    this.ProductList = [];
    this.productidDistinct = [];
    for (var i = 0; i < this.orderDetail.orderDetails.length; i++) {
      if (this.productidDistinct.filter(d => d == this.orderDetail.orderDetails[i].productID).length == 0) {
        this.productidDistinct.push(this.orderDetail.orderDetails[i].productID);
      }
    }
    for (var i = 0; i < this.productidDistinct.length; i++) {
      this.ProductService.GetProductById(this.productidDistinct[i]).subscribe(
        data => {
          this.ProductList.push(data);
        });
    }
  }

  ifVendorExist(vendorID: number) {
    return (this.customerList.find(i => i.customerID == vendorID) == undefined);
  }
  ifBrandExist(brandID: number) {
    return (this.brandtList.find(i => i.brandID == brandID) == undefined);
  }


 
  hideAddPrductDiv() {
    this.isProductToAddVisibile = false;
    this.ProductToAdd = new OrderDetail();
  }

  getBrands() {
    this.BrandService.getBrand().subscribe(
      data => {
        this.brandtList = data;
      }
    )
  }  
  getProcessOrderStatuses() {
    this.orderService.GetPurchaseOrderStatuses().subscribe(
      data => {
        this.purchasOrderStatuses = data;
      }
    )
  }  

  isValidOrder(orderID: number) {
    return this.unVerfiedProducts.filter(i => i == orderID).length > 0;
  }


  //for print of div 
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Order Detail</title>
          <style> 
         .best-sellers-product .image-product-sellers-sidebar {
  width: 82px;
  height: 82px
}

.best-sellers-product .image-product-sellers-sidebar img {
  max-width: 100%;
  max-height: 100%
}

.best-sellers-product .info-product-sellers-sidebar {
  width: calc(100% - 82px);
  padding: 0 0 0 10px
}

.title-product-sellers-sidebar a {
  font-size: 14px;
  color: #6c6c6c;
  text-transform: uppercase;
  font-weight: 500
}

.best-sellers-product {
  margin: 10px 0
}

.title-product-sellers-sidebar {
  margin: 5px 0
}

.slide-on-sale-sidebar .product-category .image-product {
  width: 210px;
  height: 210px
}

.label-on-sale {
  top: 0;
  right: 1px;
  z-index: 5;
  background: #e3171b;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  text-transform: uppercase;
  text-align: center
}

.label-on-sale:before {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  left: -12px;
  top: 0;
  border-bottom: 38px solid #e3171b;
  border-left: 12px solid transparent
}

.button-add-cart-on-sale {
  display: block;
  text-align: center;
  margin: 0 auto;
  float: none;
  background: #e3171b;
  color: #fff;
  font-size: 16px;
  width: 150px;
  line-height: 40px
}

.btn-slide-on-sale button {
  width: 60px;
  line-height: 30px;
  background: none;
  border: 1px solid #dedede;
  font-size: 20px;
  margin: 0 5px;
  outline: none
}

.btn-slide-on-sale button:hover, .btn-slide-on-sale button:active {
  border: 1px solid #969696
}

.btn-slide-on-sale {
  margin: 20px 0 0 0;
  text-align: center
}

.name-ranking-product .price-product {
  margin: 0
}

.product-code {
  display: table
}

.intro-product-detail {
  padding-bottom: 20px !important
}

.title-tabs li {
  list-style: none;
  float: left;
  padding: 0;
  margin: 0 20px;
  line-height: 50px;
  font-size: 14px;
  color: #2b2b2b;
  cursor: pointer
}

.active-title-tabs {
  color: #b61f24 !important
}

.title-tabs li:first-child {
  margin: 0 20px 0 0
}

.title-tabs {
  margin: 0 0 -7px 0px;
  z-index: 9
}

.content-tabs-product-detail {
  display: none;
  opacity: 0;
  z-index: 8;
  font-size: 15px;
  line-height: 26px;
  color: #2b2b2b
}

.active-tabs-product-detail {
  display: block;
  opacity: 1
}

.name-product {
  font-size: 24px;
  color: #2b2b2b;
  letter-spacing: 0.25px
}

.product-code p:nth-of-type(1) {
  margin: 0 30px 0 0;
  padding: 0 30px 0 0
}

.product-code p:nth-of-type(1):before {
  width: 1px;
  height: 13px;
  background: #2b2b2b;
  content: "";
  position: absolute;
  top: 2px;
  right: 0
}

.option-product-1 p, .option-product-2 .option-product-son p {
  margin: 8px 15px 0 0;
  font-size: 15px
}

.option-product-2 .option-product-son input, .option-product-2 .option-product-son select {
  height: 28px;
  border: 1px solid #dedede;
  padding: 5px 10px;
  margin: 4px 0 0 0;
  outline: none;
  background: #f7f7f7
}

.option-product-2 .option-product-son input:focus, .option-product-2 .option-product-son select:focus {
  border: 1px solid #e3171b
}

.btn-print a {
  color: #2b2b2b;
  font-size: 15px
}

.btn-print a i {
  font-size: 19px
}

.button-slide-related .owl-prev:nth-of-type(2), .button-slide-related .owl-next:nth-of-type(3), .nav-prev-detail .owl-next, .nav-prev-detail .owl-prev:nth-of-type(1), .nav-next-detail .owl-prev, .nav-next-detail .owl-next:nth-of-type(4) {
  display: none
}

.button-slide-related {
  float: right;
  position: absolute;
  top: 0;
  right: 15px;
  z-index: 9;
  width: 120px
}

.button-slide-related button {
  background: #fff;
  border: 1px solid #dedede;
  width: 45px;
  line-height: 36px;
  margin: 0 0 0 15px;
  font-size: 22px;
  float: left;
  cursor: pointer;
  outline: none;
  transition: 0.5s ease;
  -o-transition: 0.5s ease;
  -moz-transition: 0.5s ease;
  -webkit-transition: 0.5s ease
}

.title-slide-product-bottom {
  font-size: 18px;
  margin: 7px 0 30px 0
}

.button-slide-related button:hover {
  border: 1px solid #333
}

#owl-thumbnail-slide .slick-prev:before, #owl-thumbnail-slide .slick-next:before {
  font-family: FontAwesome;
  font-style: normal;
  font-weight: normal;
  text-decoration: inherit;
  font-size: 20px;
  line-height: 1;
  color: #000;
  width: 35px;
  padding: 6.5px 0;
  display: block;
  border: 1px solid #b3b2b2;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale
}

#owl-thumbnail-slide .slick-list {
  margin: 0 50px
}

#owl-thumbnail-slide .slick-prev:before {
  content: "\f104"
}

#owl-thumbnail-slide .slick-next {
  right: 15px
}

#owl-thumbnail-slide .slick-next:before {
  content: "\f105"
}

.top-product-detail {
  margin: 0 0 60px 0
}

.slide-related-product {
  margin-bottom: 60px
}

.singleproduct .listicons {
  padding: 0;
  margin: 0;
  list-style: none
}

.singleproduct .listicons li {
  display: inline-block;
  margin-right: 5px;
}

.singleproduct .listicons li a {
  border: solid 1px #acacac;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 17px;
  text-align: center;
  display: block;
  color: #39393b;
  background: #fff
}

.singleproduct .listicons li a:hover {
  border: solid 1px #b61f24;
  color: #fff;
  background: #b61f24
}

.singleproduct .shareicons {
  padding: 0;
  margin: 0;
  list-style: none
}

.singleproduct .shareicons li {
  display: inline-block;
  margin-right: 5px
}

.singleproduct .shareicons li a {
  border-radius: 3px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  font-size: 15px;
  text-align: center;
  display: block;
  color: #fff;
  background: #fff
}

.singleproduct .shareicons li a:hover {
  opacity: 0.8
}

.singleproduct .shareicons li a.facebook {
  background: #3e5990
}

.singleproduct .shareicons li a.twitter {
  background: #4788c0
}

.singleproduct .shareicons li a.google {
  background: #d73727
}

.info-box {
  margin: 0 20px 10px 2px;
  padding: 5px 0;
  float: left
}

.info-box .product-colors {
  margin-left: 17px
}

.info-box .sizelabel {
  line-height: 25px;
  float: left
}

.product .info-box:last-child {
  margin-bottom: 0;
  padding-bottom: 0
}

.product .info-box > span {
  display: table-cell;
  vertical-align: middle;
  text-align: left
}

.product .info-box > span:first-child {
  width: 35%
}

.product .info-box strong {
  display: block;
  font-weight: 500
}

.product .product-colors {
  display: block
}

.color-btn {
  cursor: pointer;
  display: block;
  float: left;
  position: relative;
  width: 25px;
  height: 25px;
  background-color: #fff;
  border: 1px solid #a6a6a6;
  margin-right: 10px;
  text-align: center;
  font-size: 14px;
  line-height: 23px;
  color: #a6a6a6;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px
}

.color-btn.checked {
  border-color: #b61f24;
  background-color: #b61f24;
  color: #fff
}
/*.quantitybox{margin-top:9px}*/
.button-product-list ul li a.full {
  background: #ffbc00;
  width: auto;
  padding: 0 25px
}

.info-box .product-colors2 {
  margin-left: 0
}

.color-btn2 {
  cursor: pointer;
  display: block;
  float: left;
  position: relative;
  width: 25px;
  height: 25px;
  background-color: #fff;
  border: 1px solid #a6a6a6;
  margin-right: 10px;
  text-align: center;
  font-size: 12px;
  line-height: 22px;
  color: #a6a6a6;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px
}

.color-btn3 {
  cursor: pointer;
  display: block;
  float: left;
  position: relative;
  min-width: 77px;
  padding: 0 10px;
  height: 25px;
  background-color: #fff;
  border: 1px solid #a6a6a6;
  margin-right: 10px;
  text-align: center;
  font-size: 12px;
  line-height: 22px;
  color: #a6a6a6;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  margin-bottom: 5px
}
/*.img-zoom{top:0;left:0;margin:0;display:block;width:100%;height:100%;position:relative;overflow:hidden}
.img-zoom img{-webkit-transform:scale(1.04);-ms-transform:scale(1.04);transform:scale(1.04);transition:all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)}
.img-zoom img:hover{-webkit-transform:scale(1.21);-ms-transform:scale(1.21);transform: scale(1.21)}*/
.zoom {
  background-position: 50% 50%;
  background-size: 150%;
  background-repeat: no-repeat;
  position: relative;
  width: auto;
  overflow: hidden;
  cursor: zoom-in;
}

.zoom img:hover {
  opacity: 0;
}

.zoom img {
  transition: opacity .5s;
  display: block;
  width: 100%;
}

.compare-product-section .heading-block {
  position: relative;
  padding: 0 90px 0 0;
  margin: 0 0 6px;
  overflow: hidden;
}

.compare-product-section .btn {
  position: absolute;
  top: 7px;
  right: 0;
  padding: 12px 27px;
  font-size: 16px;
  line-height: 20px;
}

.compare-product-section .table-wrapper {
  margin: 0 0 120px;
}

.compare-product-table {
  width: 100%;
  border: 1px solid #d6d6d6;
}

.compare-product-table tr td {
  width: 25%;
  padding: 20px 35px;
  border: solid #d6d6d6;
  border-width: 0 0 1px 1px;
  font-size: 14px;
  line-height: 24px;
  color: #424242;
}

.compare-product-table tr td:first-child {
  border-left: none;
}

.compare-product-table tbody tr:first-child td:first-child {
  border-bottom: none;
}

.compare-product-table .product-image-holder {
  padding: 20px 0 18px;
}

.compare-product-table .product-attribute {
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
  color: #424242;
}

.compare-product-table .product-name {
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
  color: #333;
}

.cart-products-section {
  margin: 0 0 45px;
}

.cart-products-section .cart-steps-holder {
  font-size: 16px;
  line-height: 20px;
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;
}

.cart-products-section .table-wrapper {
  padding: 0 0 20px;
  border-bottom: 1px solid #ebebeb;
}

.cart-products-table {
  width: 100%;
}

.cart-products-table th, .cart-products-table td {
  width: 16.67%;
  padding: 15px 0;
}

.cart-products-table thead tr th:first-child, .cart-products-table tbody tr td:first-child {
  width: 50%;
}

.cart-products-table thead {
  border-bottom: 1px solid #ebebeb;
}

.cart-products-table tbody tr td {
  padding: 20px 0;
}

.cart-products-table th {
  padding: 14px 10px;
  font-size: 16px;
  line-height: 20px;
  color: #282828;
}

.cart-products-table .product-detail-holder, .cart-products-table .product-text-holder {
  overflow: hidden;
}

.cart-products-table .product-image-holder {
  margin: 0 25px 0 0;
  border: 1px solid #ebebeb;
}

.cart-products-table .product-title {
  font-size: 14px;
  line-height: 18px;
  color: #282828;
  display: block;
}

.cart-products-table .product-text-holder {
  padding: 0 15px 0 0;
}

.cart-products-table .product-text-holder, .cart-products-table .product-size {
  font-size: 14px;
  line-height: 24px;
  color: #a6a6a6;
}

.cart-products-table .product-size {
  font-weight: 400;
}

.cart-products-table .product-size .size-value {
  color: #282828;
  display: inline-block;
  vertical-align: top;
  padding: 0 0 0 2px;
}

.cart-products-table .total-price-holder {
  position: relative;
}

.cart-products-table .product-price, .cart-products-table .total-price {
  font-size: 14px;
  line-height: 18px;
  color: #282828;
}

.cart-products-table .btn-delete {
  position: absolute;
  top: 0;
  right: 15px;
  font-size: 14px;
  color: #a6a6a6;
}

.input-number-group .input-number {
  appearance: textfield;
  -o-appearance: textfield;
  -ms-appearance: textfield;
  -moz-appearance: textfield;
  -webkit-appearance: textfield;
}

.input-number-group, .input-number-group .input-number, .input-number-group .input-group-button {
  display: inline-block;
  vertical-align: top;
}

.input-number-group {
  border: 1px solid #a6a6a6;
  padding: 5px 15px;
}

.input-number-group .input-number {
  font-size: 14px;
  line-height: 18px;
  border: none;
  width: 40px;
  height: auto;
  padding: 5px 0;
  text-align: center;
}

.input-number-group .input-group-button span {
  font-size: 14px;
  line-height: 18px;
  background: none;
  border: none;
  width: auto;
  height: auto;
  display: inline-block;
  vertical-align: top;
  cursor: pointer;
  padding: 5px;
}

.shopping-cart-form {
  padding: 0 0 110px;
}

.shopping-cart-form .form-group {
  margin: 0 0 20px;
}

.shopping-cart-form .shipping-block h4 {
  margin: 0 0 30px;
  text-transform: uppercase;
}

.shopping-cart-form .input-holder {
  border: 1px solid #ebebeb;
  overflow: hidden;
}

.shopping-cart-form .input-holder.select-holder {
  position: relative;
}

.shopping-cart-form .input-holder.select-holder:after {
  width: 30px;
  height: 30px;
  font-size: 14px;
  line-height: 17px;
  color: #a6a6a6;
  font-family: FontAwesome;
  content: "\f107";
  position: absolute;
  top: 4px;
  right: -5px;
}

.shopping-cart-form select, .shopping-cart-form input[type="text"] {
  width: 100%;
  height: 28px;
  padding: 0 10px;
  font-size: 13px;
  line-height: 17px;
  color: #a6a6a6;
  border: none;
  background: none;
  outline: none;
  box-shadow: none;
  float: left;
  appearance: none;
  -o-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  -wekit-appearance: none;
  position: relative;
  z-index: 1;
}

.shopping-cart-form select option {
  padding: 2px 10px;
}

.shopping-cart-form .btn-check {
  display: inline-block;
  vertical-align: top;
  border: 1px solid #ebebeb;
  font-size: 14px;
  line-height: 18px;
  color: #282828;
  padding: 5px 30px;
}

.shopping-cart-form .btn-check:hover {
  background: #ebebeb;
}

.shopping-cart-form ::-webkit-input-placeholder {
  color: #a6a6a6;
}

.shopping-cart-form :-moz-placeholder {
  color: #a6a6a6;
  opacity: 1;
}

.shopping-cart-form ::-moz-placeholder {
  color: #a6a6a6;
  opacity: 1;
}

.shopping-cart-form :-ms-input-placeholder {
  color: #a6a6a6;
}

.shopping-cart-form ::-ms-input-placeholder {
  color: #a6a6a6;
}

.shopping-cart-form ::placeholder {
  color: #a6a6a6;
}

.shopping-cart-form input[type="submit"] {
  padding: 9px 40px;
}

.cart-total-section .table-wrapper {
  margin: 0 0 25px;
}

.cart-total-section .table-wrapper {
  border: 1px solid #ebebeb;
  padding: 0 40px;
}

.cart-total-table {
  width: 100%;
}

.cart-total-table tr {
  border-bottom: 1px solid #ebebeb;
}

.cart-total-table tr td {
  width: 30%;
  padding: 20px 0;
  font-size: 14px;
  line-height: 18px;
  color: #282828;
  font-weight: 700;
  text-align: right;
}

.cart-total-table tr td:first-child {
  width: 70%;
  font-weight: 400;
  text-align: left;
}

.cart-total-table tbody tr:last-child td:last-child {
  color: #b61f24;
}

.cart-total-table tbody tr:last-child td {
  border: none;
  font-weight: 700;
}

.rating-section {
  margin: 0 0 90px;
}

.product-rating-block {
  position: relative;
}

.product-rating-block:after {
  content: "";
  clear: both;
  display: block;
}

.product-rating-block:before {
  width: 2px;
  content: "";
  background: #d7d7d7;
  position: absolute;
  top: 0;
  right: -20px;
  bottom: 0;
}

.product-rating-block .rating-counter-block {
  width: 33%;
  float: left;
}

.product-rating-block .rating-details-block {
  width: 66.67%;
  float: left;
}

.product-rating-block .rating-title {
  display: block;
  font-size: 14px;
  line-height: 18px;
  color: #333333;
  margin: 0 0 12px;
}

.product-rating-block .rating-result {
  font-size: 28px;
  line-height: 32px;
  font-weight: bold;
  color: #333333;
  display: block;
  margin: 0 0 15px;
}

.product-rating-block .rating-result .max-rating {
  font-size: 20px;
  line-height: 24px;
  color: #cccccc;
}

.product-rating-block .five-star-rating {
  font-size: 25px;
  line-height: 29px;
  color: #ffbc00;
}

.product-rating-block .rating-text {
  font-size: 12px;
  line-height: 14px;
  color: #333333;
}

.rating-details-block .rating-prgress {
  font-size: 0;
  letter-spacing: 0;
}

.rating-details-block span {
  display: inline-block;
  vertical-align: top;
  line-height: 1px;
}

.rating-details-block .rating-text {
  width: 12%;
  font-size: 14px;
  line-height: 18px;
  color: #333333;
}

.rating-details-block .rating-progress {
  width: 60%;
  padding: 5px 10px 0 0;
}

.rating-details-block .rating-progress-outer {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  background: #cccccc;
}

.rating-details-block .rating-progress-inner {
  width: 50%;
  height: 100%;
  background: #b61f24;
}

.rating-details-block .rating-value {
  width: 16.67%;
  font-size: 14px;
  line-height: 18px;
  color: #a1a1a1;
}

.write-review-block {
  font-size: 14px;
  line-height: 18px;
  color: #333333;
}

.write-review-block .stars-rating {
  font-size: 25px;
  line-height: 29px;
  color: #cccccc;
  margin: 0 0 15px;
}

.write-review-block .stars-rating {
  overflow: hidden;
}

.write-review-block .btn-write-review {
  display: inline-block;
  vertical-align: top;
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  padding: 12px 25px;
  background: #b61f24;
}

.write-review-block .btn-write-review:hover {
  color: #ffbc00;
}

.all-reviews-section {
  margin: 0 0 45px;
}

.all-reviews-section h4 {
  margin: 0 0 13px;
}

.all-reviews-section .stars-time-holder {
  overflow: hidden;
}

.all-reviews-section .posted-time {
  font-size: 13px;
  line-height: 16px;
  color: #d1d1d1;
}

.all-reviews-section .rated-stars {
  font-size: 15px;
  line-height: 19px;
  color: #ffbc00;
}

.all-reviews-section .all-reviews {
  border-bottom: 1px solid #d7d7d7;
}

.all-reviews-section .all-reviews li {
  position: relative;
  padding: 10px 0 0;
  margin: 0 0 10px;
  border-top: 1px solid #d7d7d7;
}

.all-reviews-section .all-reviews, .all-reviews-section .by, .all-reviews-section .family {
  font-size: 14px;
  line-height: 18px;
  color: #838383;
}

.all-reviews-section .all-reviews p {
  margin: 0;
}

.all-reviews-section .famimly, .all-reviews-section .number-of-likes {
  display: block;
}

.all-reviews-section .number-of-likes {
  font-size: 20px;
  line-height: 23px;
  color: #838383;
  padding: 2px 0 0;
}

.all-reviews-section .number-of-likes .like-counter {
  font-size: 14px;
  line-height: 17px;
  font-weight: 700;
  margin: 0 0 0 3px;
}

.all-reviews-section .ellipsis-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  color: #d1d1d1;
  font-size: 20px;
}

.reviews-pagination {
  margin: 0 0 90px;
}

.reviews-pagination .paginaton-text {
  display: inline-block;
  vertical-align: top;
  padding: 10px 10px 0 0;
  font-size: 14px;
  line-height: 18px;
  color: #282828;
}

.reviews-pagination .pagging {
  margin: 0;
  display: inline-block;
  vertical-align: top;
}

.signInModal .modal-body {
  overflow: hidden;
  padding: 40px 30px;
  display: table;
  width: 100%;
}

.signInModal .modal-body .modal-col {
  width: 50%;
  position: relative;
  display: table-cell;
  vertical-align: middle;
}

.signInModal .modal-body .modal-col:first-child {
  padding: 0 50px 0 0;
}

.signInModal .modal-body .modal-col:last-child {
  padding: 0 0 0 25px;
}

.signInModal .modal-body .modal-col:first-child:after {
  width: 1px;
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: #d1d1d1;
}

.signInModal .modal-heading {
  display: block;
  font-size: 24px;
  line-height: 28px;
  color: #333333;
  margin: 0 0 25px;
}

.signInModal .form-group {
  margin: 0 0 20px;
  position: relative;
}

.signInModal .form-group:after {
  content: "";
  clear: both;
  display: block;
}

.signInModal .form-group.no-margin {
  margin: 0;
}

.signin-form label {
  display: block;
}

.signin-form input[type="text"], .signin-form input[type="email"], .signin-form input[type="password"] {
  width: 100%;
  height: 47px;
  outline: none;
  box-shadow: none;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  font-size: 14px;
  line-height: 18px;
  color: #c0c0c0;
  padding: 12px 19px 10px;
}

.signin-form label span {
  color: #c0c0c0;
  font-size: 14px;
  line-height: 18px;
  position: absolute;
  top: -10px;
  left: 16px;
  opacity: 0;
  background: #fff;
  padding: 0 5px 0 0;
  z-index: 1;
}

.signin-form input[type="text"]:focus,
.signin-form input[type="text"].populated,
.signin-form input[type="email"]:focus,
.signin-form input[type="email"].populated,
.signin-form input[type="password"]:focus,
.signin-form input[type="password"].populated {
  padding-top: 12px;
  padding-bottom: 9px;
}

.signin-form input[type="text"]:focus::-moz-placeholder,
.signin-form input[type="text"].populated::-moz-placeholder,
.signin-form input[type="email"]:focus::-moz-placeholder,
.signin-form input[type="email"].populated::-moz-placeholder,
.signin-form input[type="password"]:focus::-moz-placeholder,
.signin-form input[type="password"].populated::-moz-placeholder {
  color: transparent;
}

.signin-form input[type="text"]:focus + span,
.signin-form input[type="text"].populated + span,
.signin-form input[type="email"]:focus + span,
.signin-form input[type="email"].populated + span,
.signin-form input[type="password"]:focus + span,
.signin-form input[type="password"].populated + span {
  opacity: 1;
  top: -10px;
}

.signin-form .close-icon {
  position: absolute;
  top: 25%;
  right: 10px;
  color: #b61f24;
}

.signin-form .form-label {
  font-size: 14px;
  line-height: 18px;
  float: left;
  position: relative;
}

.signin-form .form-label:after {
  width: 12px;
  height: 12px;
  content: "";
  border: 1px solid #d1d1d1;
  border-radius: 2px;
  position: absolute;
  top: 5px;
  right: -20px;
}

.signin-form input[type="checkbox"] {
  float: left;
  appearance: none;
  -o-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  -wekbit-appearance: none;
}

.signin-form input:checked + label:after {
  content: "\f00c";
  font-family: FontAwesome;
}

.signin-form input[type="submit"] {
  width: 100%;
  padding: 12px 15px;
  background: #b61f24;
  text-align: center;
  font-size: 18px;
  line-height: 22px;
  font-weight: bold;
  color: #fff;
  border: none;
  outline: none;
  box-shadow: none;
  border-radius: 4px;
  transition: all ease-in-out 0.2s;
  -o-transition: all ease-in-out 0.2s;
  -ms-transition: all ease-in-out 0.2s;
  -moz-transition: all ease-in-out 0.2s;
  -webkit-transition: all ease-in-out 0.2s;
  margin: 0 0 10px;
}

.signin-form input[type="submit"]:hover {
  color: #ffbc00;
}

.signInModal .links-holder {
  font-size: 14px;
  line-height: 18px;
  overflow: hidden;
}

.signInModal .links-holder a {
  color: #b61f24;
}

.signInModal .links-holder .sign-up-link {
  margin: 0 0 0 10px;
}

.cart-steps-holder .nav-tabs {
  border-color: #b61f24;
  border: none;
}

.cart-steps-holder .nav-tabs li {
  margin-bottom: 0;
}

.cart-steps-holder .nav-tabs li a {
  color: #aaa;
  background: #f1f1f1;
  margin-right: 5px;
}

.cart-steps-holder .nav-tabs li.active a, .cart-steps-holder .nav-tabs li.step-cleared a, .cart-steps-holder .nav-tabs li:hover a {
  color: #fff;
  background: #b61f24;
  border-color: #b61f24;
}

.cart-steps-holder .tab-content {
  padding: 20px 15px;
  background: #f9f9f9;
  border: 1px solid #e6e6e6;
}

.cart-steps-holder .tab-content h4 {
  margin: 0 0 25px;
}

.cart-steps-holder h5 {
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
  margin: 0 0 10px;
}

.cart-steps-holder .summary-bottom-links .btn, .cart-steps-holder .order-payment-holder .btn {
  padding: 10px 35px;
}

.tsb-form .form-group {
  margin: 0 0 15px;
  position: relative;
}

.tsb-form .form-group:after, .cart-register-form:after {
  content: "";
  clear: both;
  display: block;
}

.tsb-form input[type="text"], .tsb-form input[type="email"], .tsb-form input[type="password"], .tsb-form input[type="tel"] {
  width: 100%;
  height: 47px;
  font-size: 14px;
  line-height: 18px;
  border: 1px solid #d1d1d1;
  border-radius: 3px;
  padding: 10px 15px;
  color: #c0c0c0;
  box-shadow: none;
}

.cart-steps-holder .tsb-form input[type="text"], .cart-steps-holder .tsb-form input[type="tel"], .cart-steps-holder .tsb-form input[type="email"], .cart-steps-holder .tsb-form input[type="password"] {
  background: #f9f9f9;
}

.cart-steps-holder .easy-paisa-form input[type="text"] {
  background: #fff;
}

.tsb-form ::-webkit-input-placeholder {
  color: #c0c0c0;
}

.tsb-form :-moz-placeholder {
  color: #c0c0c0;
  opacity: 1;
}

.tsb-form ::-moz-placeholder {
  color: #c0c0c0;
  opacity: 1;
}

.tsb-form :-ms-input-placeholder {
  color: #c0c0c0;
}

.tsb-form ::-ms-input-placeholder {
  color: #c0c0c0;
}

.tsb-form ::placeholder {
  color: #c0c0c0;
}

.tsb-form.cart-register-form ::-webkit-input-placeholder {
  color: #c0c0c0;
}

.tsb-form.cart-register-form :-moz-placeholder {
  color: #c0c0c0;
  opacity: 1;
}

.tsb-form.cart-register-form ::-moz-placeholder {
  color: #c0c0c0;
  opacity: 1;
}

.tsb-form.cart-register-form :-ms-input-placeholder {
  color: #c0c0c0;
}

.tsb-form.cart-register-form ::-ms-input-placeholder {
  color: #c0c0c0;
}

.tsb-form.cart-register-form ::placeholder {
  color: #c0c0c0;
}

.tsb-form input[type="submit"] {
  min-width: 180px;
  padding: 15px;
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
  color: #fff;
  background: #b61f24;
  border-radius: 0;
  box-shadow: none;
  border: none;
}

.tsb-form input[type="submit"]:hover {
  color: #f7cc0d;
}

.tsb-form label {
  display: block;
}

.tsb-form label span {
  color: #c0c0c0;
  font-size: 13px;
  line-height: 17px;
  position: absolute;
  top: -10px;
  left: 16px;
  opacity: 0;
  background: #fff;
  padding: 0 5px 0 0;
  z-index: 1;
}

.cart-steps-holder .tsb-form label span {
  background: #f9f9f9;
}

.cart-steps-holder .easy-paisa-form label span {
  background: #fff;
}

.tsb-form input[type="text"]:focus,
.tsb-form input[type="text"].populated,
.tsb-form input[type="email"]:focus,
.tsb-form input[type="email"].populated,
.tsb-form input[type="password"]:focus,
.tsb-form input[type="password"].populated,
.tsb-form input[type="tel"]:focus,
.tsb-form input[type="tel"].populated {
  padding-top: 12px;
  padding-bottom: 9px;
}

.tsb-form input[type="text"]:focus::-moz-placeholder,
.tsb-form input[type="text"].populated::-moz-placeholder,
.tsb-form input[type="email"]:focus::-moz-placeholder,
.tsb-form input[type="email"].populated::-moz-placeholder,
.tsb-form input[type="password"]:focus::-moz-placeholder,
.tsb-form input[type="password"].populated::-moz-placeholder,
.tsb-form input[type="tel"]:focus::-moz-placeholder,
.tsb-form input[type="tel"].populated::-moz-placeholder {
  color: transparent;
}

.tsb-form input[type="text"]:focus + span,
.tsb-form input[type="text"].populated + span,
.tsb-form input[type="email"]:focus + span,
.tsb-form input[type="email"].populated + span,
.tsb-form input[type="password"]:focus + span,
.tsb-form input[type="password"].populated + span,
.tsb-form input[type="tel"]:focus + span,
.tsb-form input[type="tel"]:focus + span {
  opacity: 1;
  top: -8px;
  left: 17px;
}

.tsb-form.edit-account-form input[type="text"], .tsb-form.edit-account-form input[type="email"], .tsb-form.edit-account-form input[type="password"], {
  background: #f9f9f9;
  box-shadow: none;
}

.tsb-form.edit-account-form label span, .tsb-form.newsletter-subsc-form label span {
  background: #f9f9f9;
}

.tsb-form .checkbox-label, .tsb-form .radio-label {
  padding: 0 0 0 22px;
  display: inline-block;
  vertical-align: top;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  position: relative;
  font-size: 13px;
  line-height: 17px;
  color: #848282;
}

.tsb-form .radio-label {
  color: #000;
}

.tsb-form .checkbox-label input, .tsb-form .radio-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  visibility: hidden;
}

.checkbox-label .custom-checkbox, .radio-label .custom-radio {
  position: absolute;
  top: 3px;
  left: 0;
  height: 15px;
  width: 15px;
  border: 1px solid #d1d1d1;
  border-radius: 2px;
  opacity: 1;
}

.checkbox-label .custom-checkbox:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-label input:checked ~ .custom-checkbox:after {
  display: block;
}

.checkbox-label .custom-checkbox:after {
  left: 4px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid #797979;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.radio-label .custom-radio {
  position: absolute;
  top: 3px;
  left: 0;
  height: 13px;
  width: 13px;
  border: 1px solid #797979;
  border-radius: 100%;
  opacity: 1;
}

.radio-label .custom-radio:after {
  content: "";
  position: absolute;
  display: none;
}

.radio-label input:checked ~ .custom-radio:after {
  display: block;
}

.radio-label input:checked ~ .custom-radio {
  border-color: #b61f24;
}

.radio-label .custom-radio:after {
  left: 2px;
  top: 2px;
  width: 7px;
  height: 7px;
  border-radius: 100%;
  background: #b61f24;
}

.tsb-form .shipment-message {
  position: absolute;
  left: 25px;
  bottom: -12px;
  font-size: 12px;
  line-height: 15px;
  color: #aaa;
  display: none;
}

.tsb-form .form-group.has-message .shipment-message {
  display: block;
}

.tsb-form .form-text-links {
  font-size: 18px;
  line-height: 22px;
  color: #000;
}

.tsb-form .form-text-links a {
  color: #000;
}

.tsb-form .form-text-links a:hover {
  color: #b61f24;
}

.tsb-form.edit-account-form .form-text-links {
  padding: 10px 0 0;
}

.checkbox-label .custom-checkbox {
  position: absolute;
  top: 3px;
  left: 0;
  height: 15px;
  width: 15px;
  border: 1px solid #d1d1d1;
  border-radius: 2px;
  opacity: 1;
}

.tsb-form.edit-account-form .form-text-links {
  padding: 10px 0 0;
}

.cart-steps-holder .links-holder {
  overflow: hidden;
}

.links-holder a {
  color: #b61f24;
}

.cart-steps-holder .note-text {
  display: block;
}

.cart-steps-holder .note-text {
  font-size: 16px;
  line-height: 20px;
  color: #848282;
  display: block;
  padding: 10px 0;
}

.order-summary-table {
  width: 100%;
  border: 1px solid #ccc;
}

.order-summary-table td {
  padding: 10px;
}

.order-summary-table tbody tr td:first-child {
  width: 80%;
}

.order-summary-table tbody tr td:last-child {
  width: 20%;
  text-align: right;
  border-left: 1px solid #ccc;
}

.order-summary-table tfoot {
  border-top: 1px solid #ccc;
  font-weight: 700;
  text-align: right;
}

.payment-methods-form {
  padding: 15px 0 0;
}

.payment-method-message {
  width: 100%;
  min-height: 148px;
  border: 1px solid #eee;
  background: #fafafa;
  padding: 15px;
}

.payment-tabs-list {
  width: 25%;
  float: left;
  text-align: left;
}

.payment-tabs-list li {
  padding: 20px 15px;
  position: relative;
  cursor: pointer;
  border: solid transparent;
  border-width: 1px 0 1px 1px;
}

.payment-tabs-list li:hover {
  background: #b61f24;
  color: #ffbc00;
}

.payment-tabs-list li.active {
  border: solid #b61f24;
  border-width: 1px 0 1px 1px;
}

.payment-tabs-list li:after {
  width: 1px;
  content: "";
  position: absolute;
  top: -1px;
  right: -1px;
  bottom: -1px;
  background: #f9f9f9;
  display: none;
  border: solid #b61f24;
  border-width: 1px 0;
}

.payment-tabs-list li.active:after {
  display: block;
}

.payment-content-tab {
  width: 75%;
  float: left;
  display: none;
  background: #f9f9f9;
  border: 1px solid #b61f24;
  padding: 15px;
}

.payment-content-tab .payment-content-holder {
  min-height: 248px;
  padding: 15px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 3px rgba(0,0,0,0.15);
}

.payment-content-tab.active {
  display: block;
}

.cart-steps-holder .order-payment-holder .btns-holder {
  overflow: hidden;
  padding: 20px 0 0;
}

.order-summary-holder {
  margin: 0 0 20px;
  background: #fff;
  padding: 30px 15px 30px;
  box-shadow: 0 0 5px rgba(0,0,0,0.25);
  border-radius: 4px;
  overflow: hidden;
}

.order-summary-holder .header-section {
  overflow: hidden;
  margin: 0 0 30px;
}

.order-summary-holder .header-section-col, .address-block .address-block-col {
  width: 50%;
  float: left;
}

.order-summary-holder h4 {
  font-size: 22px;
  line-height: 26px;
  margin: 0 0 10px;
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;
}

.order-summary-holder .customer-name {
  display: block;
  font-size: 18px;
  line-height: 22px;
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;
  text-transform: uppercase;
}

.order-summary-holder .order-short-details {
  font-size: 14px;
  line-height: 18px;
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;
  margin: 0;
}

.order-summary-holder .address-block {
  padding: 15px;
  background: #efefef;
  overflow: hidden;
  margin: 0 0 30px;
}

.order-summary-holder .address-col-heading {
  font-size: 18px;
  line-height: 22px;
  display: block;
  margin: 0 0 10px;
}

.order-summary-holder .address-block-col ul {
  padding: 0 0 0 10px;
  margin: 0;
}

.summary-table {
  width: 100%;
  border: 1px solid #b61f24;
  border-radius: 5px;
  margin: 0 0 15px;
}

.summary-table .item-holder {
  width: 53%;
}

.summary-table .item-holder strong {
  display: block;
  margin: 0 0 5px;
  color: #b61f24;
  font-size: 16px;
  line-height: 19px;
}

.summary-table .quantity-holder {
  width: 15%;
}

.summary-table .price-holder {
  width: 17%;
}

.summary-table .total-holder {
  width: 15%;
}

.summary-table thead {
  background: #b61f24;
  color: #fff;
}

.summary-table tbody tr:nth-child(even) {
  background: #f9f9f9;
}

.summary-table tbody tr:nth-child(odd) {
  background: #efefef;
}

.summary-table th, .summary-table td {
  padding: 10px;
}

.summary-table tbody p {
  margin: 0 0 5px;
  font-size: 13px;
  line-height: 16px;
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;
}

.summary-table thead {
  text-transform: uppercase;
  font-weight: bold;
}

.summary-table tfoot {
  border-top: 1px solid #b61f24;
  background: #efefef;
}

.summary-table tfoot td {
  padding: 0;
}

.summary-table tfoot tr:first-child td {
  padding-top: 35px;
}

.summary-table tfoot tr:last-child {
  font-weight: bold;
}

.summary-table tfoot tr td:first-child {
  text-align: right;
  padding-right: 15px;
}

.summary-table tfoot tr:last-child td {
  padding-bottom: 35px;
}

.cart-steps-holder .summary-bottom-links {
  overflow: hidden;
}

.cart-steps-holder .thankyou-holder {
  height: 400px;
}

.thankyou-holder .thankyou-outer, .thankyou-holder .thankyou-inner {
  width: 100%;
  height: 100%;
}

.thankyou-holder .thankyou-outer {
  display: table;
}

.thankyou-holder .thankyou-inner {
  display: table-cell;
  vertical-align: middle;
}

.thankyou-holder .thankyou-heading {
  display: block;
  font-size: 55px;
  line-height: 60px;
  font-weight: 700;
}

.thankyou-holder .checkmark-icon {
  font-size: 60px;
  line-height: 65px;
  color: #b61f24;
  margin: 0 0 15px;
}

.thankyou-holder .order-breif-detail {
  font-size: 14px;
  line-height: 18px;
  margin: 0 0 15px;
}

.thankyou-holder .order-breif-detail p {
  margin: 0 0 5px;
}

.thankyou-holder .order-breif-detail a {
  color: #b61f24;
}

.thankyou-holder .btn-holder .btn {
  margin: 0 15px;
  padding: 10px 35px;
}

@media only screen and ( max-width: 1199px ) {
  .default-modal .social-login-buttons li {
    margin: 0 5px 10px;
  }

  .cart-steps-holder .social-login-buttons li {
    display: block;
    margin: 0 0 5px;
  }

  .cart-steps-holder .social-login-buttons li a {
    display: block;
    height: 100%;
  }
}

@media only screen and ( max-width: 1024px ) {
  .compare-product-section .heading-block {
    padding: 0 80px 0 0;
  }

  .compare-product-section .btn {
    padding: 12px 22px;
    top: 12px;
  }

  .cart-products-table {
    width: 940px;
  }

  .table-wrapper {
    overflow-x: scroll;
  }

  .compare-product-table {
    margin: 0 0 15px;
  }

  .compare-product-table tr td {
    padding: 10px;
  }

  .compare-product-table .product-attribute {
    font-size: 16px;
    line-height: 20px;
  }

  .compare-product-table .product-name {
    font-size: 18px;
    line-height: 22px;
  }

  .compare-product-section .table-wrapper {
    margin: 0 0 80px;
  }

  .shopping-cart-form {
    padding: 0 0 80px;
  }

  .cart-total-section .table-wrapper {
    padding: 0 25px;
  }

  .product-rating-block {
    margin: 0 0 30px;
  }

  .rating-details-block .rating-progress {
    width: 70%;
  }

  .rating-section, .reviews-pagination {
    margin: 0 0 30px;
  }
}

@media only screen and ( max-width: 991px ) {
  .signInModal .links-holder span {
    display: block;
    width: 100%;
    float: none;
    margin: 0 0 5px;
  }

  .signInModal .social-login-heading {
    font-size: 20px;
    line-height: 24px;
  }

  .signInModal .social-login-block {
    font-size: 16px;
    line-height: 20px;
  }

  .signInModal .social-login-buttons li {
    width: 200px;
  }

  .signInModal .social-login-buttons li a {
    display: block;
  }

  .cart-user-login-block {
    margin: 0 0 25px;
  }
}

@media only screen and ( max-width: 767px ) {
  .compare-product-section .table-wrapper {
    margin: 0 0 30px;
  }

  .shopping-cart-form .form-group {
    margin: 0;
  }

  .shopping-cart-form .input-holder {
    margin: 0 0 15px;
  }

  .shipping-block .shipping-section {
    margin: 0 0 15px;
  }

  .shopping-cart-form .shipping-block h4 {
    margin: 0 0 15px;
  }

  .shopping-cart-form {
    padding: 0 0 30px;
  }

  .cart-total-section .table-wrapper {
    padding: 0 15px;
  }

  .signInModal .modal-dialog {
    width: 96%;
    margin: 15px 2%;
  }

  .signInModal .modal-body, .signInModal .modal-body .modal-col {
    width: 100%;
    display: block;
    padding: 0;
  }

  .signInModal .modal-body .modal-col:first-child, .signInModal .modal-body .modal-col:last-child {
    padding: 20px 15px;
  }

  .signInModal .social-login-heading {
    font-size: 18px;
    line-height: 22px;
  }

  .signInModal .social-login-block {
    font-size: 14px;
    line-height: 18px;
  }

  .cart-steps-holder {
    min-width: 720px;
    overflow-x: scroll;
  }

  .order-summary-holder {
    min-width: 688px;
    overflow-x: scroll;
  }

  .summary-table th, .summary-table td {
    padding: 10px 5px;
  }

  .payment-tabs-list, .payment-content-tab {
    width: 100%;
    float: none;
  }

  .payment-tabs-list li {
    padding: 10px 10px;
  }

  .payment-tabs-list li, .payment-tabs-list li.active {
    border-width: 1px;
  }

  .payment-tabs-list li.active:after {
    display: none;
  }
}

@media only screen and ( max-width: 599px ) {
  .product-rating-block {
    margin: 0;
  }

  .product-rating-block .rating-counter-block, .product-rating-block .rating-details-block {
    width: 100%;
    float: none;
    margin: 0 0 20px;
  }

  .signInModal .modal-header {
    padding: 15px 15px 13px;
  }

  .signInModal h5 {
    font-size: 22px;
    line-height: 26px;
  }

  .signInModal .modal-heading {
    font-size: 18px;
    line-height: 22px;
  }

  .title-tabs li {
    margin: 0 5px;
  }

  .title-tabs li:first-child {
    margin: 0 10px 0 0;
  }

  .signInModal .modal-body .modal-col:first-child, .signInModal .modal-body .modal-col:last-child {
    padding: 10px 15px;
  }

  .cart-steps-holder input[type="submit"] {
    display: block;
    width: 100%;
  }

  .cart-steps-holder .nav-tabs li {
    display: block;
    float: none;
    border-bottom: 1px solid #e6e6e6;
  }

  .cart-steps-holder .nav-tabs li:hover, .cart-steps-holder .nav-tabs li.active {
    border-color: #b61f24;
  }

  .cart-steps-holder .nav-tabs li:last-child {
    border: none;
  }

  .cart-steps-holder .nav-tabs > li > a {
    border-radius: 0;
    margin: 0;
  }

  .order-summary-table tbody tr td:first-child {
    width: 70%;
  }

  .order-summary-table tbody tr td:last-child {
    width: 30%;
  }

  .thankyou-holder .thankyou-heading {
    font-size: 36px;
    line-height: 40px;
  }

  .payment-methods-form {
    padding: 0;
  }
}

@media only screen and ( max-width: 479px ) {
  .compare-product-section .table-wrapper {
    margin: 0 0 15px;
  }

  .shopping-cart-form {
    padding: 0 0 15px;
  }

  .rating-details-block .rating-prgress {
    margin: 0 0 5px;
  }

  .rating-details-block .rating-text, .rating-details-block .rating-progress, .rating-details-block .rating-value {
    display: block;
    width: 100%;
  }

  .rating-details-block .rating-progress {
    padding: 0;
  }

  .order-summary-table tbody tr td:first-child {
    width: 55%
  }

  .order-summary-table tbody tr td:last-child {
    width: 45%;
  }

  .thankyou-holder .btn-holder .btn {
    display: block;
    margin: 0 0 5px;
  }
} 
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}

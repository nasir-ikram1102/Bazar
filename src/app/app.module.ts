import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Router, UrlSegment } from '@angular/router';
import { SliderModule } from 'angular-image-slider';
import { NgxEditorModule } from 'ngx-editor';
import { CKEditorModule } from 'ng2-ckeditor';
import { ngfModule, ngf } from "angular-file";
import { Ng5SliderModule } from 'ng5-slider';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TreeviewModule } from 'ngx-treeview';
import { NgModule, Component } from '@angular/core';
import { TimeAgoPipe } from 'time-ago-pipe';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { PagerService } from './services/shared/pager.service';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutService } from './services/checkout/checkout.service';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { SystemSettingService } from './services/system-settings/system-setting.service';
import { ApplicationSettingsService } from './services/system-settings/application-setting';
import { HttpClientModule } from '@angular/common/http';
import { ParentCategoryListComponent } from './category-components/parent-category/parent-category-list/parent-category-list.component';
import { CategoryService } from './services/category/category.service';
import { TruncatePipe } from './custom-pipes/truncate.pipe';
import { CalculateUnitTotalPipe } from './custom-pipes/calculate-unit-total.pipe';
import { CalculateTotalPipe } from './custom-pipes/calculate-total.pipe';
import { DeleteProductComponent } from './products-components/delete-product/delete-product.component';
import { ProductListComponent } from './products-components/product-list/product-list.component';
import { ProductDetailComponent } from './products-components/product-detail/product-detail.component';
import { ProductService } from './services/product/product.service';
import { DataTableModule } from "angular-6-datatable";
import { ModalModule, CarouselModule, PaginationModule, BsDatepickerModule, TabsModule, CollapseModule } from 'ngx-bootstrap';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CartComponent } from './cart/cart.component';
import { HeaderSearchComponent } from './header-search/header-search.component';
import { CategoryMenuItemsComponent } from './category-menu-items/category-menu-items.component';
import { CookieService } from 'ngx-cookie-service';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { OwlModule } from 'ngx-owl-carousel';
import { CategoryListComponent } from './category-components/category/category-list/category-list.component';
//UI Master Page Components
import { TopBannerComponent } from './masterui-components/top-banner/top-banner.component';
import { TopNavBarComponent } from './masterui-components/top-nav-bar/top-nav-bar.component';
import { SliderComponent } from './masterui-components/slider/slider.component';
import { PopularProductsComponent } from './products-components/popular-products/popular-products.component';
import { SearchListComponent } from './products-components/search-list/search-list.component';
import { BrandsContainerComponent } from './products-components/brands-container/brands-container.component';
import { JustForYouComponent } from './products-components/just-for-you/just-for-you.component';
import { FooterSupportComponent } from './masterui-components/footer-support/footer-support.component';
import { FooterShippingPrivacyPolicyComponent } from './masterui-components/footer-shipping-privacy-policy/footer-shipping-privacy-policy.component';
import { FooterComponent } from './masterui-components/footer/footer.component';
//public pages components
import { AboutUsComponent } from './public-pages-components/about-us/about-us.component';
import { PrivacyPolicyComponent } from './public-pages-components/privacy-policy/privacy-policy.component'
import { ReturnPolicyComponent } from './public-pages-components/return-policy/return-policy.component';
import { TermsAndConditionsComponent } from './public-pages-components/terms-and-conditions/terms-and-conditions.component';
import { ContactUsComponent } from './public-pages-components/contact-us/contact-us.component';

import { CreateStoreComponent } from './store-components/create-store/create-store.component';
import { EditStoreComponent } from './store-components/edit-store/edit-store.component';
import { StoreListComponent } from './store-components/store-list/store-list.component';
import { StoreService } from './services/store/store.service';

import { LoginComponent } from './account-components/login/login.component';
import { RegisterVendorComponent } from './account-components/register-vendor/register-vendor.component';
import { RegisterCustomerComponent } from './account-components/register-customer/register-customer.component';
import { LoginService } from './services/login/login.service';
import { AppService } from './services/app/app.service';
import { AccountService } from './services/account/account.service';
import { UserService } from './services/user/user.service';
import { UtilitiesService } from './services/shared/utilities.service'
import { ProfileUpdateComponent } from './profile-components/profile-update/profile-update.component';
import { ProfileService } from './services/profile/profile.service';
import { CustomerService } from './services/customer/customer.service';
import { RoleService } from './services/role/role.service';
import { SharedService } from './services/shared/shared.service';
import { CartService } from './services/cart/cart.service';
import { VendorCatagorySalesComponent } from './vendor-category-sale/vendor-catagory-sales/vendor-catagory-sales.component';
import { VendorCategorySaleListComponent } from './vendor-category-sale/vendor-category-sale-list/vendor-category-sale-list.component';
import { EditVendorCategorySaleComponent } from './vendor-category-sale/edit-vendor-category-sale/edit-vendor-category-sale.component';
import { DashBoardComponent } from './dashboard-customer/dashboard-customer.component';
import { DashBoardLeftMenuComponent } from './dashboard-customer/dashboard-customer-left-menu/dashboard-customer-left-menu.component';
import { MyorderCustomerComponent } from './dashboard-customer/myorder-customer/myorder-customer.component';
import { ProductRatingService } from './services/product/product-rating.service';
import { MyWishListCustomerComponent } from './dashboard-customer/my-wish-list-customer/my-wish-list-customer.component';
import { OrderService } from './services/order/order.service';
import { MyReviewsCustomerComponent } from './dashboard-customer/my-reviews/myreviews-customer.component';
import { OrderDetailComponent } from './dashboard-customer/order-detail/order-detail.component';
import { PaymentMethodsCustomerComponent } from './dashboard-customer/payment-methods/payment-methods.component';
import { RecomendedProductsCustomerComponent } from './dashboard-customer/recomended-products/recomended-products.component';

import { PaymentService } from './services/payment/payment.service';
import { SubscriberService } from './services/subscribe/subscriber.service';
import { SubcategoryListComponent } from './category-components/subcategory/subcategory-list/subcategory-list.component'
import { WishListService } from './services/wishlist/wishList.service';
import { SupplierTicketService } from './services/SupplierTicket/SupplierTicket.service';
import { BrandService } from './services/brand/brand.service';
import { EditProductComponent } from './products-management-vendor/edit-product/edit-product.component';
import { ProductsListingVendor } from './products-management-vendor/listing/products-listing-vendor.component';
import { CreateProductComponent } from './products-management-vendor/create-product/create-product.component'
import { EditSimpleProductComponent } from './products-management-vendor/edit-simple-product/edit-simple-product.component';

import { CategoryMobileMenuComponent } from './category-mobile-menu/category-mobile-menu.component';

import { DashboardVendorComponent } from './dashboard-vendor/dashboard-vendor.component';
import { MenuVendorComponent } from './dashboard-vendor/dashboard-vendor-menu/menu-vendor.component';
import { ProductImportComponent } from './products-management-vendor/product-import/product-import.component';

import { EditVariableProductComponent } from './products-management-vendor/edit-variable-product/edit-variable-product.component';

import { AccountSettingVendorComponent } from './account-setting-vendor/account-setting-vendor.component';

import { VendorpromotionsComponent } from './vendor-promotions/vendor-promotions.component';
import { VendorPromotionsService } from './services/vendor-promotions/vendor-promotions.service';
import { VendorpromotionsProductsComponent } from './vendor-promotions-products/vendor-promotions-products.component';
import { VendorCategorypromotionsProductsComponent } from './vendor-promotion-categoryProducts/vendor-promotions-categoryproducts.component';
import { WithDrawalsVendorComponent } from './withdrawals-vendor/withdrawals-vendor.component';
import { WithDrawalService } from './services/WithDrawal/withDrawal.service';
import { SafeHtmlPipe } from './custom-pipes/safe-html.pipe';
import { PopularCategoryComponent } from './products-components/popular-category/popular-category.component';
import { BrandsComponent } from './products-components/brands/brands.component';
import { StoreVendorComponent } from './store-vendor/store-vendor.component';
import { CalculateDiscountPipe } from './custom-pipes/calculate-discount.pipe';
import { BannerComponent } from './products-components/banner/banner.component';
import { FooterService } from './services/footer/footer.service';
import { ForgotPasswordComponent } from './account-components/forgotPassword/ForgotPassword.component';

import { ResetPasswordComponent } from './account-components/resetPassword/resetPassword.component';
import { CurrencyConversionPipe } from './custom-pipes/currency-conversion.pipe';
import { QRCodeModule } from 'angularx-qrcode';
import { SmsService } from './services/sms/sms.service';
import { ShortUrlService, ShortUrlModule } from 'angular-shorturl';
import { UrlRedirectionService } from './services/url-redirection/url-redirection.service';
import { AssociativeProductsComponent } from './products-components/associative-products/associative-products.component';


//URL Model
import { UrlRedirection } from './models/shared/url-redirection.model';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, LinkedinLoginProvider, } from "angular-6-social-login";
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { ThankYouComponent } from './checkout/thank-you/thank-you.component';

export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("2205788559434146")
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("192398812727-taqibu4edtqhcu8cahttlovm0vfodg6v.apps.googleusercontent.com")
      },
      {
        id: LinkedinLoginProvider.PROVIDER_ID,
        provider: new LinkedinLoginProvider("1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com")
      },
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    ProductImportComponent,
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    DashboardVendorComponent,
    CheckoutComponent,
    EditSimpleProductComponent,
    EditVariableProductComponent,
    FetchDataComponent,
    CartComponent,
    TimeAgoPipe,
    CategoryMobileMenuComponent,
    StoreVendorComponent,
    ResetPasswordComponent,
    AccountSettingVendorComponent,
    HeaderSearchComponent,
    CategoryMenuItemsComponent,
    WithDrawalsVendorComponent,
    ProductsListingVendor,
    TopBannerComponent,
    TopNavBarComponent,
    SliderComponent,
    ForgotPasswordComponent,
    MenuVendorComponent,
    PopularProductsComponent,
    ParentCategoryListComponent,
    CategoryListComponent,
    CreateProductComponent,
    EditProductComponent,
    RecomendedProductsCustomerComponent,
    DeleteProductComponent,
    ProductListComponent,
    BrandsContainerComponent,
    ProductDetailComponent,
    JustForYouComponent,
    FooterSupportComponent,
    FooterShippingPrivacyPolicyComponent,
    FooterComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    ReturnPolicyComponent,
    TermsAndConditionsComponent,
    ContactUsComponent,
    CreateStoreComponent,
    EditStoreComponent,
    StoreListComponent,
    LoginComponent,
    RegisterCustomerComponent,
    RegisterVendorComponent,
    ProfileUpdateComponent,
    VendorCatagorySalesComponent,
    VendorCategorySaleListComponent,
    EditVendorCategorySaleComponent,
    DashBoardComponent,
    DashBoardLeftMenuComponent,
    MyorderCustomerComponent,
    MyWishListCustomerComponent,
    MyReviewsCustomerComponent,
    OrderDetailComponent,
    PaymentMethodsCustomerComponent,
    SubcategoryListComponent,
    SubcategoryListComponent,
    VendorpromotionsComponent,
    VendorpromotionsProductsComponent,
    SafeHtmlPipe,
    PopularCategoryComponent,
    VendorCategorypromotionsProductsComponent,
    BrandsComponent,
    CalculateDiscountPipe,
    CalculateUnitTotalPipe,
    CalculateTotalPipe,
    BannerComponent,
    CurrencyConversionPipe,
    TruncatePipe,
    CurrencyConversionPipe,
    SearchListComponent,
    AssociativeProductsComponent,
    ThankYouComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    CommonModule,
    HttpModule,
    OwlModule,
    FormsModule,
    BrowserAnimationsModule,
    Ng5SliderModule,
    ImageCropperModule,
    ngfModule,
    HttpClientModule,
    DataTableModule,
    CKEditorModule,
    ReactiveFormsModule,
    QRCodeModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxEditorModule,
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxImageZoomModule.forRoot(),
    TreeviewModule.forRoot(),
    CarouselModule.forRoot(),
    ToastModule.forRoot(),
    RatingModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TypeaheadModule.forRoot(),
    SliderModule,
    SocialLoginModule,
    ShortUrlModule,
    DeferLoadModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'nav-menu', component: NavMenuComponent },
      { path: 'cart', component: CartComponent, pathMatch: 'full' },
      //public page routes
      { path: 'about-us', component: AboutUsComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'return-policy', component: ReturnPolicyComponent },
      { path: 'terms-conditions', component: TermsAndConditionsComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'create-store', component: CreateStoreComponent },
      { path: 'edit-store/:id', component: EditStoreComponent },
      { path: 'store-list', component: StoreListComponent },
      { path: 'Parent-Category-List', component: ParentCategoryListComponent },
      { path: 'delete-product', component: DeleteProductComponent },
      { path: 'flash-sale/:id', component: ProductListComponent, pathMatch: 'full'},
      { path: 'products/:type', component: ProductListComponent },
      { path: 'product/:url', component: ProductDetailComponent },
      { path: 'Category-List', component: CategoryListComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register-customer', component: RegisterCustomerComponent },
      { path: 'register-vendor', component: RegisterVendorComponent },
      { path: 'profile-update', component: ProfileUpdateComponent },
      { path: 'vendor-catagory-sales/:id', component: VendorCatagorySalesComponent },
      { path: 'vedor-category-sale-list', component: VendorCategorySaleListComponent },
      { path: 'edit-vendor-category-sale/:id', component: EditVendorCategorySaleComponent },
      { path: 'customer', component: DashBoardComponent },
      { path: 'my-reviews', component: MyReviewsCustomerComponent },
      { path: 'order-detail/:id', component: OrderDetailComponent },
      { path: 'product-import', component: ProductImportComponent },
      { path: 'payment-methods', component: PaymentMethodsCustomerComponent },
      { path: 'my-orders', component: MyorderCustomerComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'wish-List', component: MyWishListCustomerComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'products-vendor', component: ProductsListingVendor },
      { path: 'create-product', component: CreateProductComponent },
      { path: 'edit-simple-product-vendor/:id', component: EditSimpleProductComponent },
      { path: 'edit-single-veriable-product/:master/:id', component: EditProductComponent },
      { path: 'edit-variable-product-vendor/:id', component: EditVariableProductComponent },
      { path: 'withdarawl-vendor', component: WithDrawalsVendorComponent },
      { path: 'vendor', component: DashboardVendorComponent },
      { path: 'edit-variable-product-vendor/:id', component: EditVariableProductComponent },
      { path: 'account-setting-vendor', component: AccountSettingVendorComponent },
      { path: 'vendor-promotions', component: VendorpromotionsComponent },
      { path: 'vendor-promotions-products/:id', component: VendorpromotionsProductsComponent },
      { path: 'vendor-promotions-categoryproducts/:id', component: VendorCategorypromotionsProductsComponent },
      { path: 'withdarawls-vendor', component: WithDrawalsVendorComponent },
      { path: 'store/:name', component: StoreVendorComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent },
      { path: 'search-list', component: SearchListComponent },
      { path: 'recomended-product', component: RecomendedProductsCustomerComponent }, 
      { path: 'thank-you', component: ThankYouComponent },
      { path: ':url', component: ProductListComponent },    
    ], { onSameUrlNavigation: "reload" })
],
  providers: [
    SharedService,
    SystemSettingService,
    WishListService,
    ApplicationSettingsService,
    CategoryService,
    PaymentService,
    WithDrawalService,
    ProductService,
    CookieService,
    RoleService,
    StoreService,
    PagerService,
    SubscriberService,  
    LoginService,
    UtilitiesService,
    BrandService,
    AppService,
    AccountService,
    UserService,
    ProfileService,
    CustomerService,
    CartService,
    ProductRatingService,
    CheckoutService,
    OrderService,
    SupplierTicketService,
    VendorPromotionsService,
    FooterService,
    SmsService,
    ShortUrlService,
    UrlRedirectionService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    } 
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  applyGrayClass: boolean = true;
  urlredirections: UrlRedirection[];
  constructor(private readonly router: Router, productService: ProductService, private shortUrlService: ShortUrlService, private urlRedirectionService: UrlRedirectionService) {
  }
  manageUrlRedirection() {
    this.urlRedirectionService.GetUrlRedirections().subscribe(
      data => {
        this.urlredirections = data;
        this.assignUrlRedirections();
      });
  }
  assignUrlRedirections() {
    if (this.urlredirections[0].oldUrl != undefined) {
      for (var counter = 0; counter < this.urlredirections.length; counter++) {
        if (this.urlredirections[counter].oldUrl != undefined) {
          this.shortUrlService.load(this.urlredirections[counter].oldUrl).then((returnUrl) => {
            console.log(returnUrl);
            window.open(this.urlredirections[counter].newUrl, '_self');
          });
        }
      }
    }
  }
}

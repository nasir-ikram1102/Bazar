import { Component, ViewContainerRef} from '@angular/core';
import { WishList } from './../../models/WishList/wishList-model';
import { WishListService } from './../../services/wishlist/wishList.service';
import { CartService } from './../../services/cart/cart.service'; 
import { ToastsManager } from 'ng2-toastr/ng2-toastr'; 
import { SharedService } from '../../services/shared/shared.service'; 

@Component({
  selector: 'mywishlist-customer',
  templateUrl: './my-wish-list-customer.component.html',
  styleUrls: ['./my-wish-list-customer.component.scss']
})

export class MyWishListCustomerComponent {
  public wishList: WishList[];
  currencySymbol = "";
  public DummyCounter: number = 0; 
  constructor(private readonly wishListService: WishListService,
    private readonly toastr: ToastsManager,  
    private sharedService: SharedService,
    vcr: ViewContainerRef,
    private readonly cartService: CartService) {
    this.toastr.setRootViewContainerRef(vcr);
    this.GetWishList();
    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });
  }

  onListenerTirgger() {
    this.DummyCounter += 1;
  }

  GetWishList() {
    this.wishListService.getWishListByCustomer().subscribe(
      data => {
        this.wishList = data;
        
        if (this.wishList != null && this.wishList.length > 0)
          this.currencySymbol = this.wishList[0].currencySettings.currencySymbol;
      }
    )
  }

  RemoveItem(WishListId, index) {
    var ans = confirm("Are you sure to remove this item form wish list");
    if (ans) {
      this.wishList.splice(index, 1);
      this.wishListService.removeItem(WishListId);
      this.toastr.success("Process successfully ", 'Success');
    }
  }

  UpdateWishList() {
    var ans = confirm("Are you sure to commit your changes");
    if (ans) {
      debugger
      this.wishListService.UpdateWishList(this.wishList).subscribe(
        data => {
          if (data) { 
            this.toastr.success('Wish List has been updated', '');
            setTimeout(() => {
              this.GetWishList();
            }, 500);
          }
          else { 
            this.toastr.error('Error occurred. Please try again', 'Error');
          }
        }
      )
    }
  }

  //AddToCart(Product: any, quantity: any) {

  //  this.cartService.AddToCookieCart(Product, quantity);
  //  this.loginService.IsUserLoggedIn().subscribe(x => {
  //    if (x) {
  //      this.cartService.AddToCart(Product.productID, null).subscribe();
  //    }
  //  });

  //}

  AddToCart(Product: any, quantity: any) {
    this.cartService.AddToCookieCart(Product, quantity);
  }

}

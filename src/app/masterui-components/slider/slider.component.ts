import { Component } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/products/product.model';
import { Observable, Subscription } from 'rxjs/Rx';
import { SharedService } from '../../services/shared/shared.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
/** slider component*/
export class SliderComponent {
  bannerSliderImages: any;
  products: Product[];
  saleEndDate: Date;
  public DummyCounter: number = 0;
  private futureDate: Date;
  private counter: Observable<number>;
  private subscription: Subscription;
  public days: string;
  public hours: string;
  public mints: string;
  public sec: string;
  /** slider ctor */
  carouselOptions: any = {
    loop: true,
    nav: true,
    dots: false,
    navText: ["<i class='fa fa-angle-left' aria-hidden='true'></i>", "<i class='fa fa-angle-right' aria-hidden='true'></i>"],
    autoplay: true,
    itemslideSpeed: 5000,
    autoplayHoverPause: true,
    items: 1,
  }
  constructor(private readonly productService: ProductService,
    private readonly sharedService: SharedService) {
    this.GetDealOfMonth();
    this.sharedService.listenCurrencyChanged().subscribe((m: any) => {
      this.onListenerTirgger();
    });
  }
  onListenerTirgger() {
    this.DummyCounter += 1;
  }
  Getdhms(t) {
    var days, hours, minutes, seconds;
    days = Math.floor(t / 86400);
    t -= days * 86400;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;
    this.days = days + "d";
    this.hours = hours + "h";
    this.mints = minutes + "m";
    this.sec = seconds + "s";

  }

  GetDealOfMonth() {
    this.productService.GetDealOfMonth().subscribe(
      data => {
        debugger
        this.products = data;
        if (this.products[0] != null && this.products[0].saleEndDate != null) {
          this.saleEndDate = this.products[0].saleEndDate;
          //time count down
          this.futureDate = new Date(this.saleEndDate);
          this.counter = Observable.interval(1000).map((x) => {
            return Math.floor((this.futureDate.getTime() - new Date().getTime()) / 1000);
          });
          this.subscription = this.counter.subscribe((x) => this.Getdhms(x));
        }
      });
  }
}

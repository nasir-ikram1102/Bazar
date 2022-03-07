import { Component, OnInit, Input } from '@angular/core';
import { DisplayCategory } from '../../models/category/DisplayCategory.model';
import { ImageProcessing } from '../../models/system-setting/ImageProcessing.model';
import { SystemSettingService } from '../../services/system-settings/system-setting.service';

@Component({
    selector: 'app-popular-category',
    templateUrl: './popular-category.component.html',
    styleUrls: ['./popular-category.component.css']
})
/** popular-category component*/
export class PopularCategoryComponent implements OnInit{
  popularCategoryList: DisplayCategory[];
  parentPopularCategoryList: DisplayCategory[] = [];
  imageProcessing: ImageProcessing;
  public imageServerPath: string;
  public strDHtml: string = "";
  public deferLoadShow: boolean;
  @Input() id: string;
  carouselOptions: any = {
    nav: true,
    dots: false,
    loop: true,
    items: 4,
    itemslideSpeed: 2000,
    autoplay: true,
    responsiveRefreshRate: 200,
    autoplayHoverPause: true,
    navText: ["<i class='fa fa-angle-left' aria-hidden='true'></i>", "<i class='fa fa-angle-right' aria-hidden='true'></i>"],
    responsive: {
      0: {
        items: 1,
        nav: false,
        dots: true,
      },
      320: {
        items: 3,
        nav: false,
        dots: true,
      },
      401: {
        items: 3,
        nav: false,
        dots: true,
      },
      460: {
        items: 3,
        nav: false,
        dots: true,
      },
      768: {
        items: 3,
        nav: false,
        dots: true,
      },
      1200: {
        items: 4,
        nav: false,
        dots: true,
      },
      1201: {
        items: 4,
        nav: true,
        dots: false,
      }
    }
  }
    /** popular-category ctor */
  constructor(private readonly SystemSettingService: SystemSettingService) {}
  ngOnInit() {
    this.deferLoadShow = false;
    this.GetPopularCategoryListByPageWidgetId(this.id);
  }

  GetPopularCategoryListByPageWidgetId(pageWidgetId: string) {

  }

}

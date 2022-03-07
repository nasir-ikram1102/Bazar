import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.css']
})
/** banner component*/
export class BannerComponent implements OnInit{

  public strDHtmlBody: string = "";
  public deferLoadShow: boolean;
  @Input() id: string;
    /** banner ctor */
  constructor() {
  }
  ngOnInit() {
    this.deferLoadShow = false;
    this.GetBannerWidgetByPageWidgetId(this.id);
  }
  GetBannerWidgetByPageWidgetId(pageWidgetId: string) {
    
  }
}

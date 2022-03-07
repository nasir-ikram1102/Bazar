import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-brands',
    templateUrl: './brands.component.html',
    styleUrls: ['./brands.component.css']
})
/** Brands component*/
export class BrandsComponent implements OnInit{
   
  public strDHtmlBody: string = "";
  public deferLoadShow: boolean;
  @Input() id: string;
   /** Brands ctor */
  constructor() {
  }
  ngOnInit() {
    this.deferLoadShow = false;
    this.GetBrandsWidgetByPageWidgetId(this.id);
  }
  GetBrandsWidgetByPageWidgetId(pageWidgetId: string) {
    
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  public homePage: number = 1;

  constructor()
  {
    this.GetPageWidgetsByPageID(this.homePage);
  }
  GetPageWidgetsByPageID(pageID: number) {    
  }
}

import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: any;
  public parent: WeatherForecast[];
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<WeatherForecast[]>(baseUrl + 'api/SampleData/DisplayCategories').subscribe(result => {
      this.forecasts = result;
      this.parent = result.filter(i => i.parentCategoryID === 0);
      this.parent.forEach(element => {
        element.subCategory = result.filter(i => i.parentCategoryID === element.categoryID);
        element.subCategory.forEach(child => {
          child.subCategory = result.filter(i => i.parentCategoryID === child.categoryID);
        });
      });
    }, error => console.error(error));

  }
}



class WeatherForecast {
  categoryID: number;
  categoryName: string;
  isParent: boolean;
  parentCategoryID: number;
  productCount: number;
  subCategory: WeatherForecast[];
}

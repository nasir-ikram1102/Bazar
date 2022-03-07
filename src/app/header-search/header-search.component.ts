import { Component } from '@angular/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Product, CustomerProfilling } from '../models/products/product.model';
import { ProductService } from '../services/product/product.service';
import { CategoryService } from '../services/category/category.service';
import { CategoryDisplay } from '../models/category/categorydisplay.model';
import { CookieService } from 'ngx-cookie-service';
import { Router, DefaultUrlSerializer } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { serializePath } from '@angular/router/src/url_tree';

@Component({
    selector: 'app-header-search',
    templateUrl: './header-search.component.html',
    styleUrls: ['./header-search.component.css']
})
/** Header-Search component*/
export class HeaderSearchComponent {
  public search: string;
  customerProfilling: CustomerProfilling;
  //typeaheadLoading: boolean;
    /** Header-Search ctor */

  constructor(private readonly productService: ProductService, private http: HttpClient, private cookieService: CookieService, private readonly categoryService: CategoryService, private readonly router: Router) {
    this.customerProfilling = new CustomerProfilling();
    this.search = "";
  }
 


  typeaheadOnSelect(): void {
    // here we set CustomerProfilling
       localStorage.setItem("seachText", this.search)
    document.location.href = '/search-list';

  }




  
}

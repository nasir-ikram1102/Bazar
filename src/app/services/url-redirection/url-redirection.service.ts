import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { UrlRedirection } from '../../models/shared/url-redirection.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UrlRedirectionService {
  private service = "api/UrlRedirection"; //Controller Name
  constructor(private http: Http, private readonly router: Router) { }

  AddUrlRedirection(urlRedirection: UrlRedirection) {
    return this.http
      .post(`${this.service}`, urlRedirection, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetUrlRedirections() {
    return this.http.get(`${this.service}/GetUrlRedirections`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  GetUrlRedirection(url : string) {
    return this.http.get(`${this.service}/GetUrlRedirection?url=` + url)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetRedirectionTypes() {
    return this.http.get(`${this.service}/GetRedirectionTypes`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  GetUrlRedirectionById(id: string) {
    return this.http.get(`${this.service}/GetUrlRedirection?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }

  DeleteUrlRedirection(id: string) {
    return this.http.delete(`${this.service}/` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }

}

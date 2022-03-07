import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoginModel, SocialMediaModel } from '../../models/user/login-model';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {
  private serviceName = 'api/authentication';

  constructor(private http: Http, public toastr: ToastsManager,
    private cookieService: CookieService) {

  }

  authenticateLogin(login: LoginModel) {
    return this.http
      .post(`${this.serviceName}/Login`, login, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  IsUserLoggedIn() {
    return this.http
      .get(`${this.serviceName}/IsUserLoggedIn?token=` + this.cookieService.get('Login'), {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  //getUsers() {
  //  return this.http.get(`${this.serviceName}`)
  //    .map((response: Response) => response.json())
  //    .catch(this.errorHandler);
  //}

  //addUser(userModel: User) {

  //  return this.http
  //    .post(`${this.serviceName}/InsertUser`, userModel, {})
  //    .map((response: Response) => response.json())
  //    .catch(this.errorHandler);
  //}
  authenticateSocialMedia(social: SocialMediaModel) {
    return this.http.post(`${this.serviceName}/SocialMediaLogin`, social, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

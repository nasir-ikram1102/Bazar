import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from '../../models/user/user-model';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {
  private serviceName = 'api/user';
  constructor(private http: Http, public toastr: ToastsManager) {
  }

  getUsers() {
    return this.http.get(`${this.serviceName}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  addUser(userModel: User) {

    return this.http
      .post(`${this.serviceName}/InsertUser`, userModel, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  updateUser(userModel: User) {
    return this.http.post(`${this.serviceName}/UpdateUser`, userModel, {})
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  deleteUser(id: string) {
    return this.http.get(`${this.serviceName}/DeleteUser?id=` + id)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  getUser(userId: string) {
    return this.http.get(`${this.serviceName}/GetUserById?id=` + userId)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  isUniqueEmail(email: string) {
    return this.http
      .get(`${this.serviceName}/IsUniqueEmail?email=` + email)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }

  isUniqueShopName(shopName: string) {
    return this.http
      .get(`${this.serviceName}/IsUniqueShopName?shopName=` + shopName)
      .map((response: Response) => response.json())
      .catch(this.errorHandler);
  }
  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

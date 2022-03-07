import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from "@angular/router";
import { Role } from '../../models/shared/role.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class RoleService {
  private service = "api/RoleManagement"; //Controller Name
  public roleList: Role[];

  constructor(private http: Http, private readonly router: Router) { }

  GetRoles() {
    return this.http.get(`${this.service}`)
      .map((response: Response) => response.json())
      .catch(this.errorHandler)
  }
  
  GetRoleById(id: string) {
    return this.http.get(`${this.service}/` + id)
      .map((response: Response) => <Role>response.json())
      .catch(this.errorHandler)
  }

  errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}

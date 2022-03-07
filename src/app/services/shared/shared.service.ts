import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {

  private _listners = new Subject<any>();
  private _currencyListners = new Subject<any>();
  constructor() {

  }
  listen(): Observable<any> {
    return this._listners.asObservable();
  }

  filter(filterBy: string) {
    this._listners.next(filterBy);
  }
  // 
  listenCurrencyChanged(): Observable<any> {
    return this._currencyListners.asObservable();
  }
  //detect the change of currency and send the message to application where listener called
  setCurrencyChangeMessage(filterBy: string) {
    this._currencyListners.next(filterBy);
  }


  loginCredentialFilter(filterBy: string) { 
    this._listners.next(filterBy);
  }

  loginCredentialListner(): Observable<any> { 
    return this._listners.asObservable();
  }
  sameUrlCredentialFilter(filterBy: string) {
    this._listners.next(filterBy);
  }
  sameUrlCredentialListner(): Observable<any> {
    return this._listners.asObservable();
  }
  sameUrlProductFilter(filterBy: string) {
    this._listners.next(filterBy);
  }
  sameUrlProductListner(): Observable<any> {
    return this._listners.asObservable();
  }
  sameUrlCategoryFilter(filterBy: string) {
    this._listners.next(filterBy);
  }
  sameUrlCategoryListner(): Observable<any> {
    return this._listners.asObservable();
  }
}

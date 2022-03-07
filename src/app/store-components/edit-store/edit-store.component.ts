import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '../../models/store/store.model';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.component.html',
  styleUrls: ['./edit-store.component.css']
})
/** edit-store component*/
export class EditStoreComponent {
  store = new Store();
  fileToUpload: File;
  fd = new FormData();
  selectedProfileImage: string;
  selectedBannerImage: string;
  showPayPalEmail = false;
  showBankDetail = false;
  /** edit-store ctor */
  constructor(private _avRoute: ActivatedRoute,
    private storeService: StoreService, private _router: Router) {
    if (this._avRoute.snapshot.params["id"]) {
      this.getStoreById(this._avRoute.snapshot.params["id"]);
    }
  }

  getStoreById(id: string) {
    this.storeService.GetStoreById(id).subscribe(
      data => {
        this.store = data;
        this.CheckValue(this.store.preferedMethod);
      }
    )
  }
  uploadProfileImage(file: FileList) {
    this.fileToUpload = file.item(0);
    this.fd.append("ProfileImage", this.fileToUpload);
    ////Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.selectedProfileImage = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }
  uploadBannerImage(file: FileList) {
    this.fileToUpload = file.item(0);
    this.fd.append("BannerImage", this.fileToUpload);
    ////Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.selectedBannerImage = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }
  onPaymentChange(e) {
    this.CheckValue(e.target.value);
  }

  CheckValue(inputVal: string) {
    if (inputVal == "PayPal") {
      this.showPayPalEmail = true;
      this.showBankDetail = false;
    } else if (inputVal == "Others") {
      this.showPayPalEmail = false;
      this.showBankDetail = true;
    } else {
      this.showPayPalEmail = false;
      this.showBankDetail = false;
    }
  }
  onSubmit() {
    this.storeService.UpdateStore(this.store);

    this.fd.append("StoreID", this.store.storeID.toString());
    this.storeService.AddStoreImages(this.fd);
  }
}

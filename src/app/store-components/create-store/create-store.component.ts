import { Component } from '@angular/core';
import { Store } from '../../models/store/store.model';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.css']
})
/** create-store component*/
export class CreateStoreComponent {
  public store = new Store();
  fileToUpload: File;
  fd = new FormData();
  selectedProfileImage: string;
  selectedBannerImage: string;
  showPayPalEmail = false;
  showBankDetail = false;
  /** create-store ctor */
  constructor(private readonly storeService: StoreService) {
    this.store.isActive = true;
    this.store.preferedMethod = "";
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
    if (e.target.value == "PayPal") {
      this.showPayPalEmail = true;
      this.showBankDetail = false;
    } else if (e.target.value == "Others") {
      this.showPayPalEmail = false;
      this.showBankDetail = true;
    } else {
      this.showPayPalEmail = false;
      this.showBankDetail = false;
    }
  }

  onSubmit() {
    this.storeService.AddStore(this.store).subscribe(result => {
      console.log(result);
      this.fd.append("StoreID", result.toString());
      this.storeService.AddStoreImages(this.fd);
    });
  }
}

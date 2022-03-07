import { Component, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { CustomerService } from '../../services/customer/customer.service';
import { BrandService } from '../../services/brand/brand.service';
import { BsModalService } from 'ngx-bootstrap/modal';
 

@Component({
  selector: 'app-product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.scss']
})
/** product-import component*/
export class ProductImportComponent {
  /** product-import ctor */

  public remainingPicCount: "0";
  public progress: number;
  public message: string;
  public excelColumns: string[];
  public productColumns: string[];
  public isFileUploaded: boolean;
  public FormDataFile: FormData;
  public dict = [];
  public timerSyncCount: any;
  public msg = {
    detail: "",
    exception: "",
    data: []
  };
  @ViewChild('file') btnFile: ElementRef;
  @ViewChild('btnImport') btnImport: ElementRef;
  @ViewChild('btnSync') btnSync: ElementRef;

  @ViewChild('alertSuccess') alertSuccess: ElementRef;
  @ViewChild('alertPartialFailed') alertPartialFailed: ElementRef;
  @ViewChild('alertFailed') alertFailed: ElementRef;


  constructor(private readonly brandsService: BrandService,
    private modalService: BsModalService,
    private readonly customerService: CustomerService,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private http: HttpClient,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly router: Router)
  { 
    this.SyncPicturesRemCount();
    this.isFileUploaded = false;
    this.FormDataFile = new FormData();
    this.excelColumns = [];
    this.productColumns = [];
    this.populateProductColumns();
    this.timerSyncCount = setInterval(() => this.SyncPicturesRemCount(), 3000); 

  }
  

  genrateColumns(files) {
    this.alertFailed.nativeElement.hidden = true;
    this.alertSuccess.nativeElement.hidden = true;
    this.alertPartialFailed.nativeElement.hidden = true;

    if (files.length === 0)
      return;

    const formData = new FormData();

    for (let file of files)
      formData.append(file.name, file);
    this.FormDataFile = formData;
    this.productService.toggleButtonAnimation(this.btnImport)
    this.productService.GetColumnsUploadFile(formData).subscribe(data => {
      this.excelColumns = data;
      if (this.excelColumns.length > 0) {
        this.isFileUploaded = true;
      }
      else {
        this.isFileUploaded = false;
      }
      this.productService.toggleButtonAnimation(this.btnImport)
    });
  }

  ImportFile() { 
    if (this.dict.length != this.excelColumns.length) {
      this.toastr.warning('All columns has not been mapped', 'Note');
    }
    else {

     // this.toastr.success('All columns has been mapped', 'Note'); 
      this.FormDataFile.append('dictionary', JSON.stringify(this.dict));

      this.productService.toggleButtonAnimation(this.btnImport)

      this.alertFailed.nativeElement.hidden = true;
      this.alertSuccess.nativeElement.hidden = true;
      this.alertPartialFailed.nativeElement.hidden = true;


      this.productService.ReadCompleteFile(this.FormDataFile).subscribe(d => {
        this.productService.toggleButtonAnimation(this.btnImport)
        this.btnFile.nativeElement.value = ""; 
        this.excelColumns = [];
        this.isFileUploaded = false;
        this.msg.exception = d.exception;
        this.msg.detail = d.detail;
        this.msg.data = d.data;
        if (d.success) {
          if (d.data.length > 0) {
            //bind table here 
            this.alertPartialFailed.nativeElement.hidden = false;
          }
          else {
            this.alertSuccess.nativeElement.hidden = false;
            // all success
          }
        }
        else {
          this.alertFailed.nativeElement.hidden = false;
        }
        //for (var i = 0; i < data.length; i++) {
        //  this.toastr.warning(data[i], "Note");
        //}
        //this.router.navigate(["/product-list"]);
      });
    }
  }
  ifNotSelected(valuestring: string) {
    return this.dict.indexOf(i => i.key == valuestring) >= 0;
  }
  populateProductColumns() {
    return this.productService.getProductColumns().subscribe(data => {
      this.productColumns = data;
      this.dict = [];
      for (var i = 0; i < data.length; i++) {
        this.updateitemInDictinoray(data[i], data[i]);
      }
    });
  }
  updateitemInDictinoray(keyItem: any, valueItem: any) {
    var previousItem = this.dict.findIndex(i => i.key == keyItem);
    //adding new item
    if (previousItem == -1) {
      this.dict.push({
        key: keyItem,
        value: valueItem
      });
    }
    if (previousItem => 0) {
      this.dict.splice(previousItem, 1);
      this.dict.push({
        key: keyItem,
        value: valueItem
      });
    }
  }
  SyncPictures() {
    this.productService.toggleButtonAnimation(this.btnSync)
    this.productService.SyncPictures().subscribe(data => { 
      this.toastr.warning(data._body, "Note");
    });
  }

  SyncPicturesRemCount() {
    this.productService.SyncPicturesRemCount().subscribe(data => {
      this.remainingPicCount = data;
    });
  }
}

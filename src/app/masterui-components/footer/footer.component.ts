
import { Component, ViewContainerRef, TemplateRef } from '@angular/core';
import { FooterService } from '../../services/footer/footer.service';
import { Payment } from '../../models/footer/footer-model';
import { ManuManagement } from '../../models/footer/footer-model';
import { SystemSetting } from '../../models/footer/footer-model';
import { ApplicationSetting } from '../../models/footer/footer-model';
import { SubscriberService } from '../../services/subscribe/subscriber.service';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
/** footer component*/
export class FooterComponent {
  /** footer ctor */
  public paymentList: Payment[] = [];
  public newsLetterSubscribeEmail: any;
  public isSubmitted: boolean = true;
  public systemSetting = new SystemSetting();
  public applicationSettings: ApplicationSetting[] = [];
  public applicationSetting = new ApplicationSetting();
  public menuList: ManuManagement[];
  applicationSettingId: string;
  public deferLoadShow: boolean;
  /** footer ctor */
  constructor(private readonly footerService: FooterService,
    private readonly subscriberService: SubscriberService,
    private readonly toastr: ToastsManager) {
    this.GetAllPaymentLogo();
    this.paymentList = [];
    this.deferLoadShow = false;
  }

  SubscribeNewsLetter() {
    this.subscriberService.AddSubscriber(this.newsLetterSubscribeEmail).subscribe(
      result => {
        if (result != null) {
          if (result.status == 0) {
            this.toastr.info(result.message, 'Info');
          }

          else {
            this.toastr.success(result.message, 'Success');
            this.newsLetterSubscribeEmail = "";
            this.isSubmitted = false;
          }
        }
        else {
          this.toastr.error('Error occurred. Please try again', 'Error');

        }

      });
  }


  GetAllPaymentLogo() {
    this.footerService.getAllPaymentMethods().subscribe(
      data => {
        if (data)
          this.paymentList = data;
        this.GetAllFooterMenu();
      }
    )
  }
  GetAllFooterMenu() {
    this.footerService.getAllFooterMenu().subscribe(
      data => {
        if (data)
          this.menuList = data;
        this.GetSystemSetting();
      }
    )
  }
  GetSystemSetting() {
    this.footerService.getSystemSetting().subscribe(
      data => {
        if (data)
          this.systemSetting = data;
        this.getApplicationSettingFirstOrDefault();
      }
    )
  }
  getApplicationSettingFirstOrDefault() {
    this.footerService.getApplicationSettingFirstOrDefault().subscribe(
      data => {
        if (data) {
          this.applicationSetting = data;
        }

      }
    )
  }
  //GetApplicationSetting() {
  //  this.footerService.getApplicationSetting().subscribe(
  //    data => {
  //      if (data)
  //        this.applicationSettings = data;
  //      for (var i = 0; i < this.applicationSettings.length; i++) {
  //        this.applicationSettingId = this.applicationSettings[i].id;
  //      }
  //      this.getApplicationSetting(this.applicationSettingId);
  //    }
  //  )
  //}
  //getApplicationSetting(id: string) {
  //  this.footerService.GetSystemSettingsById(id).subscribe(
  //    data => {
  //      if (data)
  //        this.applicationSetting = data;
  //        console.log(this.applicationSetting);
  //    }
  //  )
  //}

}

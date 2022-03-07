import { Component } from '@angular/core';
import { ApplicationSetting } from '../../models/footer/footer-model';
import { FooterService } from '../../services/footer/footer.service';
@Component({
    selector: 'app-footer-shipping-privacy-policy',
    templateUrl: './footer-shipping-privacy-policy.component.html',
    styleUrls: ['./footer-shipping-privacy-policy.component.scss'],
})
/** footer-shipping-privacy-policy component*/
export class FooterShippingPrivacyPolicyComponent {
  public applicationSetting = new ApplicationSetting();
  public deferLoadShow: boolean;
  constructor(private readonly footerService: FooterService) {
    this.deferLoadShow = false;
  }
  getApplicationSettingFirstOrDefault() {
    this.footerService.getApplicationSettingFirstOrDefault().subscribe(
      data => {
        if (data)
          this.applicationSetting = data;
      }
    )
  }
  IsShow(obj) {
    obj.isShow = !obj.isShow;
  }

}

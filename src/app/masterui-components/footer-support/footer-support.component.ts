import { Component } from '@angular/core';
import { ApplicationSetting } from '../../models/footer/footer-model';
import { FooterService } from '../../services/footer/footer.service';

@Component({
    selector: 'app-footer-support',
    templateUrl: './footer-support.component.html',
    styleUrls: ['./footer-support.component.scss']
})
/** footer-support component*/
export class FooterSupportComponent {
    /** footer-support ctor */
  public applicationSetting = new ApplicationSetting();
  public deferLoadShow: boolean;
  constructor(private readonly footerService: FooterService) {
    this.getApplicationSettingFirstOrDefault();
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
}

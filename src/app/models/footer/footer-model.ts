export class Payment {
  public id: string;
  public paymentID: number;
  public paymentLogo: string;
  public title: string;
  public description: string;
  public createdDate: Date;
  public updatedDate: Date;
  public isActive: boolean;
}
export class ManuManagement {
  public id: string;
  public manuManagementId: number;
  public name: string;
  public url: string;
  public target: string;
  public manuType: string;
  public sortOrder: number;
  public isActive: boolean;
  public createdDate: Date;
  public updatedDate: Date;
}
export class SystemSetting {
  public id: string;
  public settingID: number;
  public siteLogo: string;
  public siteFavIcon: string;
  public siteCopyright: string;
  public siteName: string;
}
export class ApplicationSetting {
  public id: string;
  public facebookLink: string;
  public facebookActive: boolean;

  public youTubeLink: string;
  public youTubeActive: boolean;

  public instagramLink: string;
  public instagramActive: boolean;

  public twitterLink: string;
  public twitterActive: boolean;

  public redditLink: string;
  public redditActive: boolean;

  public pinterestLink: string;
  public pinterestActive: boolean;

  public flickrLink: string;
  public flickrActive: boolean;

  public tumblrLink: string;
  public tumblrActive: boolean;

  public googleLink: string;
  public googleActive: boolean;

  public pricacyPolicyText: string;
  public shippingPolicyText: string;
  public homePageContent: string;

  public googleAppLink: string;
  public googleAppLinkIsActive: boolean;

  public appleAppLink: string;
  public appleAppLinkIsActive: boolean;

  public whatsAppLink: string;
  public whatsAppActive: boolean;

  public contentOneHeading: string;
  public contentOneDetail: string;
  public contentOneIcon: string;

  public contentTwoHeading: string;
  public contentTwoDetail: string;
  public contentTwoIcon: string;

  public contentThreeHeading: string;
  public contentThreeDetail: string;
  public contentThreeIcon: string;

  public contentFourHeading: string;
  public contentFourDetail: string;
  public contentFourIcon: string;

}

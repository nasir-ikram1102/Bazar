import { Brand } from "../brand/brand-model";
import { Sales } from "../sales/sales.model";
export class Product {
  public id: string;
  public createdDate: Date;
  public updatedDate: Date;
  public saleEndDate: Date;
  public isSaleStarted: boolean;
  public createdBy: number;
  public createdBy_id: string;
  public productStatusId: number;
  public productStatus: string;
  public updatedBy: number;
  public updatedBy_id: string;
  public inStock: boolean;
  public isActive: boolean;
  public enableStock: boolean;
  public isFeature: boolean;
  public reviewsEnable: boolean;
  public isExcluded: boolean;
  public productID: number;
  public brandID: number;
  public vendorID: number;
  public parentCategoryID: number;
  public categoryID: number;
  public subCategoryID: number;
  public url: string;
  public name: string;
  public detail: string;
  public isCheck: boolean;
  public specification: string;
  public shortDetail: string;
  public sortOrder: number;
  public stockQuantity: number;
  public totalStockQuantity: number;
  public sku: string;
  public vendorSKU: string;
  public salePrice: number;
  public regularPrice: number;
  public commissionPrices: number;
  public commissionType: number;
  public appliedDiscoutType: number;
  public appliedDiscoutedAmount: number;
  public masterProduct: number;
  public fields: any;
  public accessories: ProductAccessory[];
  public categories: ProductInCategoies[];
  public variants: ProductVariants[];
  public Variants: ProductVariants[];
  public productVarients: ProductVariants[];
  public productVariations: Product[];
  public brand: Brand;
  public files: string[];
  public productType: number;

  public weight: number;
  public length: number;
  public width: number;
  public height: number;
  public isOnCash: boolean;
  public warentyType: number;
  public returnPolicy: number;
  public metaTitle: string;
  public metaKeyWords: string;
  public metaDiscription: string;
  public productDefaultThumbnail: string;
  public productDefaultImage: string;
  public counter: number;
  public totalRecords: number;
  public currencySettings: CurrencySettings;

  public averageRating: number;
  public wholeSalePrice: number;
  public retailPrice: number;
  public tax: number;
  public totalPrice: number;
  public stautsID: number;
  public quantity: number;
  public languageID: number;

  public appliedDiscountedAmount: number;
  public Fields: any;
  // these properties are added to remove build error
  public brandLogoImage: string = "";

  public warranty: string;
  public venderName: string;

  public ratingModel: string;
  public brandName: string;

  public returnPolicyName: string;
  public standardDelivery: string;
  public shopeName: string;
  public isFavourite: boolean;
  public isProducPending: boolean;
  public returnPolicyDescription: string;
  public warrantyDescription: string; 
  public commissionAmount: number;
  public isQuantityExist: boolean;
  public productImages: any[] = [];
}



export class ProductResponseModel {
  public brands: any[];
  public categories: any[];
  public brandSlider: any[];
  public maxPrice: number;
  public minPrice: number;
  public categoryBannerImage: string;
  public products: Product[];
  public categoryFilters: CategoryFilters[];
  public filtersValues: CategoryFilterValues[];
  public sale: Sales;
  public imageServerPath: string;
}


export class CurrencySettings {
  public currencyCode: "";
  public currencySymbol: "";
}
export class ActiveSlugModel {
  public attribute: number;
  public slug: number;
}
export class CategoryFilters {
  public categoryID: number;
  public enableFilter: boolean;
  public fieldID: number;
  public fieldName: string;
  public id: string;
  public totalRecords: boolean;
}

export class CategoryFilterValues {
  public categoryID: number;
  public enableFilter: boolean;
  public fieldID: number;
  public fieldName: string;
  public id: string;
  public productID: number;
  public totalRecords: number;
  public value: string;
  public active: boolean = false;
}

export class ProductVariants {
  public productID: number;
  public slug: string;
  public attributeID: number;
  public name: string;
  public ids: string;
}

export class Variants {
  public slug: string;
  public attributeID: number;
  public id: string;
  public name: string;
}
export class Attributes {
  public attributeID: number;
  public name: string;
  public id: string;
}
export class ProductsListImages {
  public file: File;
  public index: number;
}


export class Warranty {
  public warrantyID: number;
  public description: string;
  public name: string;
}

export class ReturnPolicy {
  public returnPolicyID: number;
  public description: string;
  public name: string;
}
export class ProductInCategoies {
  public productID: number;
  public categoryID: number;
  public categoryName: string;
}
export class ProductAccessory {
  public productID: number;
  public accessoryID: number;
  public name: string;
}
export class TreeviewItem {
  public text: string;
  public value: string;
  public children: TreeviewItem[];
}

export class CustomerProfilling {
  public customerID: number;
  public visitorID: string;
  public type: number;
  public value: string;
}




export class Category {
  public id: string;
  public categoryID: number;
  public isParent: boolean;
  public isActive: string;
  public categoryName: string;
  public parentCategoryID: number;
  public detail: string;
  public url: string;
  public tinyImage: string;
  public smallImage: string;
  public largeImage: string;
  public sortOrder: number;
  public createdBy: number;
  public createdBy_id: string;
  public createdDate: Date;
  public updatedBy: number;
  public updatedBy_id: string;
  public updatedDate: Date;
  public ChildCategories: Category[];
  public metaTitle: string;
  public metaTag: string;
  public metaDescription: string;
  public justForU: boolean; 
}

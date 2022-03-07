
export class CategoryDisplay {
  categoryID: number;
  categoryName: string;
  isParent: boolean;
  parentCategoryID: number;
  productCount: number;
  iconClass: string;
  subCategory: CategoryDisplay[];
}


export class DisplayCategory {
  categoryID: number;
  categoryName: string;
  isParent: boolean;
  parentCategoryID: number;
  productCount: number;
  imagePath: string;
  subCategory: DisplayCategory[];
  url: string;
}


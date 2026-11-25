export class UpdateProductDto {
  name?: string;
  category?: string;
  categoryId?: string;
  price?: number;
  originalPrice?: number | null;
  weight?: string;
  stock?: number;
  rating?: number;
  soldCount?: number;
  image?: string;
  description?: string;
  ingredients?: string[];
  storage?: string | null;
  isFeatured?: boolean;
}

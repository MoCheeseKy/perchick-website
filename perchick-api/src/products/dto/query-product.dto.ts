export type ProductSortOption =
  | 'default'
  | 'popular'
  | 'rating'
  | 'price-asc'
  | 'price-desc'
  | 'newest';

export class QueryProductDto {
  category?: string;
  search?: string;
  q?: string;
  sort?: ProductSortOption;
  sortBy?: ProductSortOption;
  featured?: string;
}

import { ProductInterface, CategoryInterface } from "@/components/_shared/ProductCard/_types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface FetchProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
}

export async function fetchProducts(
  params?: FetchProductsParams
): Promise<ProductInterface[]> {
  const searchParams = new URLSearchParams();

  if (params?.category && params.category !== "all") {
    searchParams.set("category", params.category);
  }
  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }
  if (params?.sort && params.sort !== "default") {
    searchParams.set("sort", params.sort);
  }
  if (params?.featured !== undefined) {
    searchParams.set("featured", String(params.featured));
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `${API_BASE_URL}/products?${queryString}`
    : `${API_BASE_URL}/products`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }
  return res.json();
}

export async function fetchProductById(
  id: string
): Promise<ProductInterface | null> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch product (${res.status})`);
  }
  return res.json();
}

export async function fetchCategories(): Promise<CategoryInterface[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch categories (${res.status})`);
  }
  return res.json();
}

export async function createProduct(
  newProduct: Omit<ProductInterface, "id">
): Promise<ProductInterface> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });
  if (!res.ok) {
    throw new Error(`Failed to create product (${res.status})`);
  }
  return res.json();
}

export async function updateProduct(
  id: string,
  updatedData: Partial<ProductInterface>
): Promise<ProductInterface> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) {
    throw new Error(`Failed to update product (${res.status})`);
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete product (${res.status})`);
  }
  return true;
}

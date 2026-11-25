import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductSortOption, QueryProductDto } from './dto/query-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

const productInclude = {
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  private formatProduct(product: ProductWithCategory) {
    const { category, categoryId, ...rest } = product;
    return {
      ...rest,
      category: category?.id ?? categoryId,
      categoryName: category?.name ?? categoryId,
    };
  }

  private buildOrderBy(
    sort?: ProductSortOption,
  ): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case 'price-asc':
        return [{ price: 'asc' }];
      case 'price-desc':
        return [{ price: 'desc' }];
      case 'rating':
        return [{ rating: 'desc' }, { soldCount: 'desc' }];
      case 'popular':
        return [{ soldCount: 'desc' }, { rating: 'desc' }];
      case 'newest':
        return [{ createdAt: 'desc' }];
      default:
        return [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    }
  }

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const exists = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!exists) {
      throw new BadRequestException(
        `Category "${categoryId}" does not exist`,
      );
    }
  }

  async findAll(query: QueryProductDto = {}) {
    const searchTerm = (query.search ?? query.q)?.trim();
    const categoryFilter = query.category?.trim();
    const sortOption = query.sort ?? query.sortBy;

    const where: Prisma.ProductWhereInput = {};

    if (categoryFilter && categoryFilter !== 'all') {
      where.categoryId = categoryFilter;
    }

    if (query.featured === 'true') {
      where.isFeatured = true;
    } else if (query.featured === 'false') {
      where.isFeatured = false;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
      ];
    }

    const products = await this.prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: this.buildOrderBy(sortOption),
    });

    return products.map((product) => this.formatProduct(product));
  }

  async findFeatured() {
    return this.findAll({ featured: 'true', sort: 'popular' });
  }

  async findByCategory(categoryId: string, query: QueryProductDto = {}) {
    return this.findAll({ ...query, category: categoryId });
  }

  async search(keyword: string, query: QueryProductDto = {}) {
    return this.findAll({ ...query, search: keyword });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    return this.formatProduct(product);
  }

  async create(dto: CreateProductDto) {
    const categoryId = (dto.categoryId ?? dto.category)?.trim();
    if (!dto.name?.trim() || !categoryId || dto.price === undefined) {
      throw new BadRequestException(
        'Product name, category, and price are required',
      );
    }

    await this.ensureCategoryExists(categoryId);

    try {
      const product = await this.prisma.product.create({
        data: {
          ...(dto.id?.trim() ? { id: dto.id.trim() } : {}),
          name: dto.name.trim(),
          categoryId,
          price: Number(dto.price),
          originalPrice:
            dto.originalPrice !== undefined && dto.originalPrice !== null
              ? Number(dto.originalPrice)
              : null,
          weight: dto.weight?.trim() ?? '',
          stock: dto.stock !== undefined ? Number(dto.stock) : 0,
          rating: dto.rating !== undefined ? Number(dto.rating) : 5.0,
          soldCount: dto.soldCount !== undefined ? Number(dto.soldCount) : 0,
          image: dto.image?.trim() ?? '',
          description: dto.description?.trim() ?? '',
          ingredients: Array.isArray(dto.ingredients) ? dto.ingredients : [],
          storage: dto.storage?.trim() || null,
          isFeatured: Boolean(dto.isFeatured ?? false),
        },
        include: productInclude,
      });

      return this.formatProduct(product);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Product with id "${dto.id}" already exists`,
        );
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    const categoryId = (dto.categoryId ?? dto.category)?.trim();
    if (categoryId) {
      await this.ensureCategoryExists(categoryId);
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(dto.price !== undefined ? { price: Number(dto.price) } : {}),
        ...(dto.originalPrice !== undefined
          ? {
            originalPrice:
              dto.originalPrice !== null ? Number(dto.originalPrice) : null,
          }
          : {}),
        ...(dto.weight !== undefined ? { weight: dto.weight.trim() } : {}),
        ...(dto.stock !== undefined ? { stock: Number(dto.stock) } : {}),
        ...(dto.rating !== undefined ? { rating: Number(dto.rating) } : {}),
        ...(dto.soldCount !== undefined
          ? { soldCount: Number(dto.soldCount) }
          : {}),
        ...(dto.image !== undefined ? { image: dto.image.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() }
          : {}),
        ...(dto.ingredients !== undefined
          ? { ingredients: dto.ingredients }
          : {}),
        ...(dto.storage !== undefined
          ? { storage: dto.storage?.trim() || null }
          : {}),
        ...(dto.isFeatured !== undefined
          ? { isFeatured: Boolean(dto.isFeatured) }
          : {}),
      },
      include: productInclude,
    });

    return this.formatProduct(updated);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return { deleted: true, id };
  }
}

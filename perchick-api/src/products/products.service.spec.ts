import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ProductsService } from './products.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaMock: {
    product: {
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
    category: {
      findUnique: ReturnType<typeof vi.fn>;
    };
  };

  const sampleDbProduct = {
    id: '1',
    name: 'Perchick Nugget',
    categoryId: 'nugget-karaage',
    category: { id: 'nugget-karaage', name: 'Nugget & Karaage' },
    price: 42000,
    originalPrice: null,
    weight: '500 gr',
    stock: 45,
    rating: 4.9,
    soldCount: 1240,
    image: 'https://example.com/nugget.jpg',
    description: 'Nugget ayam renyah',
    ingredients: ['Ayam'],
    storage: 'Freezer',
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    prismaMock = {
      product: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      category: {
        findUnique: vi.fn(),
      },
    };
    service = new ProductsService(prismaMock as unknown as PrismaService);
  });

  it('should filter by category, search, and sort by price-asc', async () => {
    prismaMock.product.findMany.mockResolvedValue([sampleDbProduct]);

    const result = await service.findAll({
      category: 'nugget-karaage',
      search: 'nugget',
      sort: 'price-asc',
    });

    expect(prismaMock.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          categoryId: 'nugget-karaage',
          OR: expect.any(Array),
        }),
        orderBy: [{ price: 'asc' }],
      }),
    );
    expect(result[0].category).toBe('nugget-karaage');
    expect(result[0].categoryName).toBe('Nugget & Karaage');
  });

  it('should throw NotFoundException when product does not exist', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when creating with invalid category', async () => {
    prismaMock.category.findUnique.mockResolvedValue(null);
    await expect(
      service.create({
        name: 'Test',
        category: 'invalid-cat',
        price: 10000,
        weight: '100 gr',
        image: 'img.jpg',
        description: 'desc',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create and format a product', async () => {
    prismaMock.category.findUnique.mockResolvedValue({ id: 'nugget-karaage' });
    prismaMock.product.create.mockResolvedValue(sampleDbProduct);

    const created = await service.create({
      name: 'Perchick Nugget',
      category: 'nugget-karaage',
      price: 42000,
      weight: '500 gr',
      image: 'https://example.com/nugget.jpg',
      description: 'Nugget ayam renyah',
    });

    expect(created.id).toBe('1');
    expect(created.categoryName).toBe('Nugget & Karaage');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { TagService } from './tag.service';

describe('TagService', () => {
  let service: TagService;

  const mockPrismaService = {
    tag: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tag', () => {
      const createTagInput: CreateTagInput = { exampleField: 'Test Tag' };
      const result = service.create(createTagInput);
      expect(result).toBe('This action adds a new tag');
    });
  });

  describe('findAll', () => {
    it('should return all tags', () => {
      const result = service.findAll();
      expect(result).toBe('This action returns all tag');
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', () => {
      const id = '1';
      const result = service.findOne(id);
      expect(result).toBe('This action returns a #1 tag');
    });
  });

  describe('update', () => {
    it('should update a tag', () => {
      const id = '1';
      const updateTagInput: UpdateTagInput = {
        id: '1',
        exampleField: 'Updated Tag',
      };
      const result = service.update(id, updateTagInput);
      expect(result).toBe('This action updates a #1 tag');
    });
  });

  describe('remove', () => {
    it('should remove a tag', () => {
      const id = '1';
      const result = service.remove(id);
      expect(result).toBe('This action removes a #1 tag');
    });
  });
});

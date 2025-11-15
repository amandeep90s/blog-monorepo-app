import { Test, TestingModule } from '@nestjs/testing';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

describe('TagResolver', () => {
  let resolver: TagResolver;
  let tagService: TagService;

  const mockTagService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagResolver,
        { provide: TagService, useValue: mockTagService },
      ],
    }).compile();

    resolver = module.get<TagResolver>(TagResolver);
    tagService = module.get<TagService>(TagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTag', () => {
    it('should create a tag', async () => {
      const createTagInput: CreateTagInput = { exampleField: 'Test Tag' };
      const result = 'This action adds a new tag';

      mockTagService.create.mockReturnValue(result);

      expect(await resolver.createTag(createTagInput)).toBe(result);
      expect(tagService.create).toHaveBeenCalledWith(createTagInput);
    });
  });

  describe('findAll', () => {
    it('should return all tags', async () => {
      const result = 'This action returns all tag';
      mockTagService.findAll.mockReturnValue(result);

      expect(await resolver.findAll()).toBe(result);
      expect(tagService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      const id = '1';
      const result = 'This action returns a #1 tag';
      mockTagService.findOne.mockReturnValue(result);

      expect(await resolver.findOne(id)).toBe(result);
      expect(tagService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('updateTag', () => {
    it('should update a tag', async () => {
      const updateTagInput: UpdateTagInput = {
        id: '1',
        exampleField: 'Updated Tag',
      };
      const result = 'This action updates a #1 tag';
      mockTagService.update.mockReturnValue(result);

      expect(await resolver.updateTag(updateTagInput)).toBe(result);
      expect(tagService.update).toHaveBeenCalledWith(
        updateTagInput.id,
        updateTagInput,
      );
    });
  });

  describe('removeTag', () => {
    it('should remove a tag', async () => {
      const id = '1';
      const result = 'This action removes a #1 tag';
      mockTagService.remove.mockReturnValue(result);

      expect(await resolver.removeTag(id)).toBe(result);
      expect(tagService.remove).toHaveBeenCalledWith(id);
    });
  });
});

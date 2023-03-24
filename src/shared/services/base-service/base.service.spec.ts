import { BaseRepository } from '@/shared/repo/base.repo/base.repo';
import { BaseService } from './base.service';
import { EntityId } from 'typeorm/repository/EntityId';
import { In } from 'typeorm';

describe('BaseService', () => {
  let service: BaseService<any>;
  let repository: BaseRepository<any>;

  beforeEach(() => {
    repository = new BaseRepository<any>({} as any, {} as any);
    service = new BaseService<any>(repository);
  });

  describe('findByIds', () => {
    it('should return a list of entities with pagination information', async () => {
      // Arrange
      const ids: EntityId[] = [1, 2, 3];
      const limit = 2;
      const skip = 0;
      const options = {
        where: {
          id: In(ids) as any,
        },
        take: limit,
        skip,
      };
      const expectedResponse = {
        message: 'get List Sucess',
        data: {
          docs: [{ id: 1 }, { id: 2 }],
          paging: {
            total: 3,
            limit,
            skip: skip + limit,
          },
        },
        error: false,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'find')
        .mockResolvedValueOnce(expectedResponse.data.docs);
      jest
        .spyOn(repository, 'count')
        .mockResolvedValueOnce(expectedResponse.data.paging.total);

      // Act
      const response = await service.findByIds(ids, { limit, skip });

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.find).toHaveBeenCalledWith({ ...options });
      expect(repository.count).toHaveBeenCalledWith(options);
    });

    it('should return an empty list if no entities are found', async () => {
      // Arrange
      const ids: EntityId[] = [1, 2, 3];
      const limit = 2;
      const skip = 0;
      const options = {
        where: {
          id: In(ids) as any,
        },
        take: limit,
        skip,
      };
      const expectedResponse = {
        message: 'get List Sucess',
        data: {
          docs: [],
          paging: {
            total: 0,
            limit,
            skip: skip + limit,
          },
        },
        error: false,
      };
      // Mock the repository
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      jest.spyOn(repository, 'count').mockResolvedValueOnce(0);

      // Act
      const response = await service.findByIds(ids, { limit, skip });

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.find).toHaveBeenCalledWith(options);
      expect(repository.count).toHaveBeenCalledWith(options);
    });
  });

  describe('find', () => {
    it('should return a list of entities with pagination information', async () => {
      // Arrange
      const ids: EntityId[] = [1, 2, 3];
      const limit = 2;
      const skip = 0;
      const options = {
        where: {
          id: In(ids) as any,
        },
        take: limit,
        skip,
      };
      const expectedResponse = {
        message: 'Get List Success',
        data: {
          docs: [{ id: 1 }, { id: 2 }],
          paging: {
            total: 3,
            limit,
            skip: skip + limit,
          },
        },
        error: false,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'find')
        .mockResolvedValueOnce(expectedResponse.data.docs);
      jest
        .spyOn(repository, 'count')
        .mockResolvedValueOnce(expectedResponse.data.paging.total);

      // Act
      const response = await service.find(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.find).toHaveBeenCalledWith(options);
      expect(repository.count).toHaveBeenCalledWith({ where: options.where });
    });

    it('should return an empty list if no entities are found', async () => {
      // Arrange
      const limit = 2;
      const skip = 0;
      const options = {
        where: {},
        take: limit,
        skip,
      };
      const expectedResponse = {
        message: 'Get List Success',
        data: {
          docs: [1, 2],
          paging: {
            total: 3,
            limit,
            skip: skip + limit,
          },
        },
        error: false,
      };
      // Mock the repository
      jest
        .spyOn(repository, 'find')
        .mockResolvedValueOnce(expectedResponse.data.docs);
      jest.spyOn(repository, 'count').mockResolvedValueOnce(3);

      // Act
      const response = await service.find(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.find).toHaveBeenCalledWith(options);
      expect(repository.count).toHaveBeenCalledWith({ where: options.where });
    });

    it('should return an empty list if no connect to server problems', async () => {
      // Arrange
      const limit = 2;
      const skip = 0;
      const options = {
        where: {},
        take: limit,
        skip,
      };
      const expectedResponse = {
        message: 'get List Error connect to server',
        data: {
          docs: [],
          paging: {
            total: 0,
            limit,
            skip: skip,
          },
        },
        error: false,
      };
      // Mock the repository
      jest
        .spyOn(repository, 'find')
        .mockRejectedValueOnce(new Error(expectedResponse.message));
      jest
        .spyOn(repository, 'count')
        .mockResolvedValueOnce(expectedResponse.data.paging.total);

      // Act
      const response = await service.find(options);

      // Assert
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('find One', () => {
    it('should return record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };
      const expectedResponse = {
        message: 'Get Detail Success',
        data: {
          name: 'test',
        },
        error: false,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(expectedResponse.data);

      // Act
      const response = await service.findOne(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.findOne).toHaveBeenCalledWith(options);
    });
    it('should return null record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };
      const expectedResponse = {
        message: 'Not found data',
        data: null,
        error: false,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(expectedResponse.data);

      // Act
      const response = await service.findOne(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.findOne).toHaveBeenCalledWith(options);
    });

    it('should return null record of entities with server connect problem', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };
      const expectedResponse = {
        message: 'Server error',
        data: null,
        error: true,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValueOnce(new Error(expectedResponse.message));

      // Act
      const response = await service.findOne(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('find By ID', () => {
    it('should return record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id as any,
        },
      };
      const expectedResponse = {
        message: 'Get Detail Success',
        data: {
          name: 'test',
        },
        error: false,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(expectedResponse.data);

      // Act
      const response = await service.findById(id);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.findOne).toHaveBeenCalledWith(options);
    });

    it('should return null record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id as any,
        },
      };
      const expectedResponse = {
        message: 'Not found data',
        data: null,
        error: false,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(expectedResponse.data);

      // Act
      const response = await service.findById(id);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.findOne).toHaveBeenCalledWith(options);
    });

    it('should return null record of entities with server connect problem', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id as any,
        },
      };
      const expectedResponse = {
        message: 'Server error',
        data: null,
        error: true,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValueOnce(new Error(expectedResponse.message));

      // Act
      const response = await service.findById(id);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('create entity', () => {
    it('should return new record create from payload', async () => {
      // Arrange
      const payload = {
        name: 'test',
        address: 'test',
      };

      const expectedResponse = {
        message: 'Create Success My Entity',
        data: {
          id: expect.any(Number),
          ...payload,
          created: expect.any(Date),
          updated: expect.any(Date),
          createBy: expect.any(String),
          updateBy: expect.any(String),
        },
        error: false,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce(expectedResponse.data);

      // Act
      const response = await service.store(payload);
      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.save).toHaveBeenCalledWith(payload);
    });

    it('should return new connect server problems', async () => {
      // Arrange
      const payload = {
        name: 'test',
        address: 'test',
      };

      const expectedResponse = {
        message: 'Internal server error',
        data: null,
        error: true,
      };

      // Mock the repository
      jest
        .spyOn(repository, 'save')
        .mockRejectedValueOnce(new Error(expectedResponse.message));

      // Act
      const response = await service.store(payload);
      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repository.save).toHaveBeenCalledWith(payload);
    });
  });
});

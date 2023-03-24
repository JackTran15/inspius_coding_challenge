import { FootballTeam } from '@/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { FootballTeamService } from './football-team.service';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<FootballTeam>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
  }),
);

describe('FootballTeam Service Spec', () => {
  let service: FootballTeamService;
  let repositoryMock: MockType<Repository<FootballTeam>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FootballTeamService,
        // Provide your mock instead of the actual repository
        {
          provide: getRepositoryToken(FootballTeam),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<FootballTeamService>(FootballTeamService);
    repositoryMock = module.get(getRepositoryToken(FootballTeam));
  });

  it('should find a user', async () => {
    expect(service).toBeDefined();
    expect(repositoryMock).toBeDefined();
  });

  it('should find all FootballTeam', async () => {
    const paging = {
      skip: 0,
      limit: 10,
    };

    const docs = new Array(20).fill(0).map((_) => new FootballTeam());

    repositoryMock.find = jest
      .fn()
      .mockResolvedValueOnce(docs.slice(paging.skip, paging.limit));
    repositoryMock.count = jest.fn().mockResolvedValueOnce(docs.length);

    const signalFootballTeam = await service.find({
      skip: paging.skip,
      take: paging.limit,
    });

    const expected = {
      message: expect.any(String),
      data: {
        docs: docs.slice(paging.skip, paging.limit),
        paging: {
          total: docs.length,
          limit: paging.limit,
          skip: paging.skip + paging.limit,
        },
      },
      error: false,
    };

    expect(signalFootballTeam).toStrictEqual(expected);
  });

  describe('FootballTeam using function findByIds', () => {
    it('should return a list of entities with pagination information', async () => {
      // Arrange
      const paging = {
        skip: 0,
        limit: 10,
      };

      const ids: EntityId[] = [1, 2, 3];
      const options = {
        where: {
          id: In(ids) as any,
        },
        take: paging.limit,
        skip: paging.skip,
      };

      const docs = new Array(20).fill(0).map((_) => new FootballTeam());

      const expectedResponse = {
        message: 'get List Sucess',
        data: {
          docs: [docs[0], docs[1]],
          paging: {
            total: 2,
            limit: paging.limit,
            skip: paging.skip + paging.limit,
          },
        },
        error: false,
      };

      // Mock the repository
      repositoryMock.find = jest.fn().mockResolvedValueOnce([docs[0], docs[1]]);
      repositoryMock.count = jest
        .fn()
        .mockResolvedValueOnce(expectedResponse.data.paging.total);

      // Act
      const response = await service.findByIds(ids, {
        limit: paging.limit,
        skip: paging.skip,
      });

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.find).toHaveBeenCalledWith({ ...options });
      expect(repositoryMock.count).toHaveBeenCalledWith(options);
    });

    it('should return an empty list if no entities are found', async () => {
      // Arrange
      const paging = {
        skip: 0,
        limit: 10,
      };

      const ids: EntityId[] = [1, 2, 3];
      const options = {
        where: {
          id: In(ids) as any,
        },
        take: paging.limit,
        skip: paging.skip,
      };

      const docs = new Array(20).fill(0).map((_) => new FootballTeam());

      const expectedResponse = {
        message: 'get List Sucess',
        data: {
          docs: [],
          paging: {
            total: 2,
            limit: paging.limit,
            skip: paging.skip + paging.limit,
          },
        },
        error: false,
      };

      // Mock the repository
      repositoryMock.find = jest.fn().mockResolvedValueOnce([]);
      repositoryMock.count = jest
        .fn()
        .mockResolvedValueOnce(expectedResponse.data.paging.total);

      // Act
      const response = await service.findByIds(ids, {
        limit: paging.limit,
        skip: paging.skip,
      });

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.find).toHaveBeenCalledWith({ ...options });
      expect(repositoryMock.count).toHaveBeenCalledWith(options);
    });
  });

  describe('FootballTeam using function find', () => {
    it('should return a list of entities with pagination information', async () => {
      // Arrange
      const paging = {
        skip: 0,
        limit: 10,
      };
      const options = {
        where: {},
        take: paging.limit,
        skip: paging.skip,
      };

      const docs = new Array(20).fill(0).map((_) => new FootballTeam());

      const expectedResponse = {
        message: 'Get List Success',
        data: {
          docs: docs.slice(paging.skip, paging.limit),
          paging: {
            total: docs.length,
            limit: paging.limit,
            skip: paging.skip + paging.limit,
          },
        },
        error: false,
      };

      // Mock the repository
      repositoryMock.find = jest
        .fn()
        .mockResolvedValueOnce(docs.slice(paging.skip, paging.limit));
      repositoryMock.count = jest
        .fn()
        .mockResolvedValueOnce(expectedResponse.data.paging.total);

      // Act
      const response = await service.find(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.find).toHaveBeenCalledWith(options);
      expect(repositoryMock.count).toHaveBeenCalledWith({
        where: options.where,
      });
    });

    it('should return an empty list if no entities are found', async () => {
      // Arrange
      const paging = {
        skip: 0,
        limit: 10,
      };
      const options = {
        where: {},
        take: paging.limit,
        skip: paging.skip,
      };

      const expectedResponse = {
        message: 'Get List Success',
        data: {
          docs: [],
          paging: {
            total: 0,
            limit: paging.limit,
            skip: 0,
          },
        },
        error: false,
      };

      // Mock the repository
      repositoryMock.find = jest.fn().mockResolvedValueOnce([]);
      repositoryMock.count = jest
        .fn()
        .mockResolvedValueOnce(expectedResponse.data.paging.total);

      // Act
      const response = await service.find(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.find).toHaveBeenCalledWith(options);
      expect(repositoryMock.count).toHaveBeenCalledWith({
        where: options.where,
      });
    });

    it('should return an empty list if no connect to server problems', async () => {
      // Arrange
      const paging = {
        skip: 0,
        limit: 10,
      };
      const options = {
        where: {},
        take: paging.limit,
        skip: paging.skip,
      };

      const expectedResponse = {
        message: 'connect Server Problem',
        data: {
          docs: [],
          paging: {
            total: 0,
            limit: paging.limit,
            skip: 0,
          },
        },
        error: false,
      };

      // Mock the repository
      repositoryMock.find = jest
        .fn()
        .mockRejectedValueOnce(new Error('connect Server Problem'));
      repositoryMock.count = jest
        .fn()
        .mockResolvedValueOnce(expectedResponse.data.paging.total);

      // Act
      const response = await service.find(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.find).toHaveBeenCalledWith(options);
      expect(repositoryMock.count).not.toBeCalled();
    });
  });

  describe('FootballTeam using function findOne', () => {
    it('should return record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };

      const doc = new FootballTeam();

      const expectedResponse = {
        message: 'Get Detail Success',
        data: doc,
        error: false,
      };

      // Mock the repository
      repositoryMock.findOne = jest.fn().mockResolvedValueOnce(doc);

      // Act
      const response = await service.findOne(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.findOne).toHaveBeenCalledWith(options);
    });
    it('should return null record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };
      const doc = null;

      const expectedResponse = {
        message: 'Not found data',
        data: doc,
        error: false,
      };

      // Mock the repository
      repositoryMock.findOne = jest.fn().mockResolvedValueOnce(doc);

      // Act
      const response = await service.findOne(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.findOne).toHaveBeenCalledWith(options);
    });

    it('should return null record of entities with server connect problem', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };

      const doc = null;

      const expectedResponse = {
        message: 'Server error',
        data: doc,
        error: true,
      };

      // Mock the repository
      repositoryMock.findOne = jest
        .fn()
        .mockRejectedValueOnce(new Error('Server error'));

      // Act
      const response = await service.findOne(options);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('FootballTeam using function findById', () => {
    it('should return record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };

      const doc = new FootballTeam();

      const expectedResponse = {
        message: 'Get Detail Success',
        data: doc,
        error: false,
      };

      // Mock the repository
      repositoryMock.findOne = jest.fn().mockResolvedValueOnce(doc);

      // Act
      const response = await service.findById(id);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.findOne).toHaveBeenCalledWith(options);
    });
    it('should return null record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };
      const doc = null;

      const expectedResponse = {
        message: 'Not found data',
        data: doc,
        error: false,
      };

      // Mock the repository
      repositoryMock.findOne = jest.fn().mockResolvedValueOnce(doc);

      // Act
      const response = await service.findById(id);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.findOne).toHaveBeenCalledWith(options);
    });

    it('should return null record of entities with server connect problem', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };

      const doc = null;

      const expectedResponse = {
        message: 'Server error',
        data: doc,
        error: true,
      };

      // Mock the repository
      repositoryMock.findOne = jest
        .fn()
        .mockRejectedValueOnce(new Error('Server error'));

      // Act
      const response = await service.findById(id);

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('FootballTeam using function store', () => {
    it('should return new record create from payload', async () => {
      // Arrange
      const doc = new FootballTeam();

      const expectedResponse = {
        message: 'Create Success My Entity',
        data: doc,
        error: false,
      };

      // Mock the repository
      repositoryMock.save = jest.fn().mockResolvedValueOnce(doc);

      // Act
      const response = await service.store(doc);
      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.save).toHaveBeenCalledWith(doc);
    });

    it('should return new connect server problems', async () => {
      // Arrange
      const doc = new FootballTeam();

      const expectedResponse = {
        message: 'Internal server error',
        data: null,
        error: true,
      };

      // Mock the repository
      repositoryMock.save = jest
        .fn()
        .mockRejectedValueOnce(new Error(expectedResponse.message));

      // Act
      const response = await service.store(doc);
      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.save).toHaveBeenCalledWith(doc);
    });
  });
});

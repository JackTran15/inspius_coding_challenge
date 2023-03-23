import { FootballMatch } from '@/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { FootBallMatchService } from './football-match.service';
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    // ...
  }),
);
describe('FootballMatch Service Spec', () => {
  let service: FootBallMatchService;
  let repositoryMock: MockType<Repository<FootballMatch>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FootBallMatchService,
        // Provide your mock instead of the actual repository
        {
          provide: getRepositoryToken(FootballMatch),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<FootBallMatchService>(FootBallMatchService);
    repositoryMock = module.get(getRepositoryToken(FootballMatch));
  });

  it('should find a user', async () => {
    expect(service).toBeDefined();
    expect(repositoryMock).toBeDefined();
  });

  it('should find all FootballMatch', async () => {
    const paging = {
      skip: 0,
      limit: 10,
    };

    const docs = new Array(20).fill(0).map((_) => new FootballMatch());

    repositoryMock.find = jest
      .fn()
      .mockResolvedValueOnce(docs.slice(paging.skip, paging.limit));
    repositoryMock.count = jest.fn().mockResolvedValueOnce(docs.length);

    const signalFootballMatch = await service.find({
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

    expect(signalFootballMatch).toStrictEqual(expected);
  });

  describe('FootballMatch using function findByIds', () => {
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

      const docs = new Array(20).fill(0).map((_) => new FootballMatch());

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

      const docs = new Array(20).fill(0).map((_) => new FootballMatch());

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

  describe('FootballMatch using function find', () => {
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

      const docs = new Array(20).fill(0).map((_) => new FootballMatch());

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

  describe('FootballMatch using function findOne', () => {
    it('should return record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };

      const doc = new FootballMatch();

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

  describe('FootballMatch using function findById', () => {
    it('should return record of entities information', async () => {
      // Arrange
      const id = 1;
      const options = {
        where: {
          id: id,
        },
      };

      const doc = new FootballMatch();

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

  describe('FootballMatch using function store', () => {
    it('should return new record create from payload', async () => {
      // Arrange
      const doc = new FootballMatch();

      const expectedResponse = {
        message: 'create success',
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
      const doc = new FootballMatch();

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

  describe('FootballMatch using function findDistinctCalendar', () => {
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

      const docs = new Array(20).fill(0).map((_, index) => {
        return {
          day: index + 1,
          month: 3,
          year: 2023,
        };
      });

      const expectedResponse = {
        message: 'Get list Distint Calendar Success',
        data: {
          docs,
          paging: {
            total: docs.length,
            limit: null,
            skip: null,
          },
        },
        error: false,
      };

      const mokcQueryBullder: any = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnValueOnce(docs),
      }));

      // Mock the repository
      repositoryMock.createQueryBuilder = jest
        .fn()
        .mockImplementationOnce(mokcQueryBullder);

      // Act
      const response = await service.findDistinctCalendar({
        where: options.where,
      });

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('FBM');
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

      const docs = [];

      const expectedResponse = {
        message: 'Get list Distint Calendar Success',
        data: {
          docs,
          paging: {
            total: docs.length,
            limit: null,
            skip: null,
          },
        },
        error: false,
      };

      const mokcQueryBullder: any = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockReturnValueOnce(docs),
      }));

      // Mock the repository
      repositoryMock.createQueryBuilder = jest
        .fn()
        .mockImplementationOnce(mokcQueryBullder);

      // Act
      const response = await service.findDistinctCalendar({
        where: options.where,
      });

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('FBM');
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

      const docs = [];

      const expectedResponse = {
        message: 'Conect Server Problem',
        data: {
          docs,
          paging: {
            total: docs.length,
            limit: null,
            skip: null,
          },
        },
        error: false,
      };

      const mokcQueryBullder: any = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockRejectedValueOnce(new Error('Conect Server Problem')),
      }));

      // Mock the repository
      repositoryMock.createQueryBuilder = jest
        .fn()
        .mockImplementationOnce(mokcQueryBullder);

      // Act
      const response = await service.findDistinctCalendar({
        where: options.where,
      });

      // Assert
      expect(response).toEqual(expectedResponse);
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith('FBM');
    });
  });
});

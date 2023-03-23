import { EntityId } from 'typeorm/repository/EntityId';
import { In } from 'typeorm';
import { FootballTeamService } from './football-team.service';
import { Test, TestingModule } from '@nestjs/testing';
import { FootBallTeamRepository } from '@/repositories';
import { EFootballTeamStatus, FootballTeam } from '@/entities';

describe('FootBall Team Service',  () => {
  let service: FootballTeamService;
  let repository: FootBallTeamRepository
  const mockFuncService = () => ({})
    
  beforeEach(async () => {
    const FootballTeamServiceProvider = {
      provide: FootballTeamService,
      useFactory: mockFuncService,
    };

    const FootballTeamRepositoryProvider = {
      provide: FootBallTeamRepository,
      useFactory: mockFuncService,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [FootballTeamService, FootballTeamServiceProvider,FootBallTeamRepository,
        FootballTeamRepositoryProvider],
    }).compile();

    service = module.get<FootballTeamService>(FootballTeamService);
    repository = module.get<FootBallTeamRepository>(FootBallTeamRepository);
  });

  describe('findByIds', () => {
    it('should return a list of entities with pagination information', async () => {
      // Arrange
      const ids: EntityId[] = [1, 2, 3];
      const limit = 2;
      const skip = 0;
      
      const doc=new FootballTeam()
        doc.id= expect.any(String),
        doc.name= expect.any(String),
        doc.logoName=expect.any(String),
        doc.logoSrc= expect.any(String),
        doc.created= expect.any(Date),
        doc.createdBy= expect.any(String),
        doc.updated= expect.any(Date),
        doc.updatedBy= expect.any(String),
        doc.status= EFootballTeamStatus.ACTIVE

      const docs=[doc,doc]
      const expectedResponse = {
        message: 'get List Sucess',
        data: {
          docs,
          paging: {
            total: docs.length,
            limit,
            skip: skip + limit,
          },
        },
        error: false,
      };

      // Mock FindByIds Service
      service.findByIds= jest.fn().mockResolvedValueOnce(expectedResponse)

      // Act
      const response = await service.findByIds(ids, { limit, skip });

      // Assert
      expect(response).toEqual(expectedResponse);
    });

    it('should return a list of entities with pagination information', async () => {
      // Arrange
      const ids: EntityId[] = [1, 2, 3];
      const limit = 2;
      const skip = 0;
      
      const doc=new FootballTeam()
        doc.id= expect.any(String),
        doc.name= expect.any(String),
        doc.logoName=expect.any(String),
        doc.logoSrc= expect.any(String),
        doc.created= expect.any(Date),
        doc.createdBy= expect.any(String),
        doc.updated= expect.any(Date),
        doc.updatedBy= expect.any(String),
        doc.status= EFootballTeamStatus.ACTIVE

      const docs=[]
      const expectedResponse = {
        message: 'get List Sucess',
        data: {
          docs,
          paging: {
            total: docs.length,
            limit,
            skip: skip + limit,
          },
        },
        error: false,
      };

      // Mock FindByIds Service
      service.findByIds= jest.fn().mockResolvedValueOnce(expectedResponse)

      // Act
      const response = await service.findByIds(ids, { limit, skip });

      // Assert
      expect(response).toEqual(expectedResponse);
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
      const doc=new FootballTeam()
        doc.id= expect.any(String),
        doc.name= expect.any(String),
        doc.logoName=expect.any(String),
        doc.logoSrc= expect.any(String),
        doc.created= expect.any(Date),
        doc.createdBy= expect.any(String),
        doc.updated= expect.any(Date),
        doc.updatedBy= expect.any(String),
        doc.status= EFootballTeamStatus.ACTIVE

      const docs=[]
      const expectedResponse = {
        message: 'get List Sucess',
        data: {
          docs,
          paging: {
            total: docs.length,
            limit,
            skip: skip + limit,
          },
        },
        error: false,
      };


      service.find= jest.fn().mockResolvedValueOnce(expectedResponse)
      // Act
      const response = await service.find(options);

      // Assert
      expect(response).toEqual(expectedResponse);
    });

    it('should return an empty list if no entities are found', async () => {
      // Arrange
      const limit = 2;
      const skip = 0;
      const options = {
        where: {
          
        },
        take: limit,
        skip,
      };
      const doc=new FootballTeam()
        doc.id= expect.any(String),
        doc.name= expect.any(String),
        doc.logoName=expect.any(String),
        doc.logoSrc= expect.any(String),
        doc.created= expect.any(Date),
        doc.createdBy= expect.any(String),
        doc.updated= expect.any(Date),
        doc.updatedBy= expect.any(String),
        doc.status= EFootballTeamStatus.ACTIVE

      const docs=[]
      const expectedResponse = {
        message: 'get List Sucess',
        data: {
          docs,
          paging: {
            total: docs.length,
            limit,
            skip: skip + limit,
          },
        },
        error: false,
      };


      service.find= jest.fn().mockResolvedValueOnce(expectedResponse)
      // Act
      const response = await service.find(options);

      // Assert
      expect(response).toEqual(expectedResponse);

      
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
            total: [].length,
            limit,
            skip: skip+limit,
          },
        },
        error: false,
      };
    
      service.find= jest.fn().mockResolvedValueOnce(expectedResponse)

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

      
      const doc=new FootballTeam()
      doc.id= expect.any(String),
      doc.name= expect.any(String),
      doc.logoName=expect.any(String),
      doc.logoSrc= expect.any(String),
      doc.created= expect.any(Date),
      doc.createdBy= expect.any(String),
      doc.updated= expect.any(Date),
      doc.updatedBy= expect.any(String),
      doc.status= EFootballTeamStatus.ACTIVE

      const expectedResponse = {
        message: 'Get Detail Success',
        data: doc,
        error: false,
      };

      // Mock the repository
      service.findOne= jest.fn().mockResolvedValueOnce(expectedResponse)

      // Act
      const response = await service.findOne(options);

      // Assert
      expect(response).toEqual(expectedResponse);
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
      service.findOne= jest.fn().mockResolvedValueOnce(expectedResponse)

      // Act
      const response = await service.findOne(options);

      // Assert
      expect(response).toEqual(expectedResponse);
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
      service.findOne= jest.fn().mockResolvedValueOnce(expectedResponse)

      // Act
      const response = await service.findOne(options);

      // Assert
      expect(response).toEqual(expectedResponse);
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
      const doc=new FootballTeam()
      doc.id= expect.any(String),
      doc.name= expect.any(String),
      doc.logoName=expect.any(String),
      doc.logoSrc= expect.any(String),
      doc.created= expect.any(Date),
      doc.createdBy= expect.any(String),
      doc.updated= expect.any(Date),
      doc.updatedBy= expect.any(String),
      doc.status= EFootballTeamStatus.ACTIVE


      const expectedResponse = {
        message: 'Get Detail Success',
        data: doc,
        error: false,
      };

      // Mock the repository
      service.findById= jest.fn().mockResolvedValueOnce(expectedResponse)


      // Act
      const response = await service.findById(id);

      // Assert
      expect(response).toEqual(expectedResponse);
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
      service.findById= jest.fn().mockResolvedValueOnce(expectedResponse)


      // Act
      const response = await service.findById(id);

      // Assert
      expect(response).toEqual(expectedResponse);
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
      service.findById= jest.fn().mockResolvedValueOnce(expectedResponse)

      // Act
      const response = await service.findById(id);

      // Assert
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('create entity', () => {
    it('should return new record create from payload', async () => {
      // Arrange

      const doc=new FootballTeam()
      doc.id= expect.any(String),
      doc.name= expect.any(String),
      doc.logoName=expect.any(String),
      doc.logoSrc= expect.any(String),
      doc.created= expect.any(Date),
      doc.createdBy= expect.any(String),
      doc.updated= expect.any(Date),
      doc.updatedBy= expect.any(String),
      doc.status= EFootballTeamStatus.ACTIVE

      const payload = {
        name: expect.any(String),
        logoName: expect.any(String),
        logoSrc: expect.any(String),
      };

      const expectedResponse = {
        message: 'create success',
        data:doc,
        error: false,
      };

      // Mock the repository
      service.store= jest.fn().mockResolvedValueOnce(expectedResponse)

      // Act
      const response = await service.store(payload);
      // Assert
      expect(response).toEqual(expectedResponse);
    });

    it('should return new connect server problems', async () => {
      // Arrange
      const payload = {
        name: expect.any(String),
        logoName: expect.any(String),
        logoSrc: expect.any(String),
      };


      const expectedResponse = {
        message: 'Internal server error',
        data: null,
        error: true,
      };

      // Mock the repository
      service.store= jest.fn().mockResolvedValueOnce(expectedResponse)

      // Act
      const response = await service.store(payload);
      // Assert
      expect(response).toEqual(expectedResponse);
    });
  });
});

import { EFootballTeamStatus, FootballMatch, FootballTeam } from '@/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FootBallTeamCreateDto } from '../dtos/football-team-create.dto';
import { FootballTeamService } from '../services/football-team.service';
import { FootBallTeamController } from './football-team.controller';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({}),
);

describe('FootBallTeamController', () => {
  let controller: FootBallTeamController;
  let footBallTeamService: FootballTeamService;
  let footBallTeamRepository: MockType<Repository<FootballTeam>>;

  const paging = {
    limit: 10,
    skip: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [FootBallTeamController],
      providers: [
        FootballTeamService, // Provide your mock instead of the actual repository
        {
          provide: getRepositoryToken(FootballTeam),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<FootBallTeamController>(FootBallTeamController);
    footBallTeamService = module.get<FootballTeamService>(FootballTeamService);
    footBallTeamRepository = module.get(getRepositoryToken(FootballTeam));
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
    expect(footBallTeamService).toBeDefined();
    expect(footBallTeamRepository).toBeDefined();
  });

  describe('Controller Get', () => {
    it('should get all football team return list empty', async () => {
      const condition = {
        status: EFootballTeamStatus.ACTIVE,
      };

      const paging = {
        skip: 0,
        limit: 16,
      };

      const queryCriteria = {
        where: condition,
        take: paging.limit,
        skip: paging.skip,
      };

      const size = 20;

      const docs = new Array(size).fill(0).map((_) => new FootballTeam());

      const listFootballTeam = {
        message: 'Get List Success',
        data: {
          docs: docs.slice(0, 0),
          paging: { total: 0, skip: 0, limit: paging.limit },
        },
        error: false,
      };
      // override mock function repository
      footBallTeamRepository.find = jest
        .fn()
        .mockResolvedValue(docs.slice(0, 0));
      footBallTeamRepository.count = jest.fn().mockResolvedValue(0);

      const result = await controller.getList(paging, paging);
      expect(result).toEqual(listFootballTeam);
      expect(footBallTeamRepository.find).toBeCalledWith(queryCriteria);
      expect(footBallTeamRepository.count).toBeCalledWith({ where: condition });
      expect(result.data.docs).toEqual([]);
      expect(result.error).toEqual(false);
    });

    it('should get all football team return list', async () => {
      const condition = {
        status: EFootballTeamStatus.ACTIVE,
      };

      const paging = {
        skip: 0,
        limit: 16,
      };

      const queryCriteria = {
        where: condition,
        take: paging.limit,
        skip: paging.skip,
      };

      const size = 20;

      const docs = new Array(size).fill(0).map((_) => new FootballTeam());
      const pagingDocs = docs.slice(0, paging.limit);

      const listFootballTeam = {
        message: 'Get List Success',
        data: {
          docs: pagingDocs,
          paging: { total: size, skip: paging.limit, limit: paging.limit },
        },
        error: false,
      };
      // override mock function repository
      footBallTeamRepository.find = jest.fn().mockResolvedValue(pagingDocs);
      footBallTeamRepository.count = jest.fn().mockResolvedValue(size);

      const result = await controller.getList(paging, paging);

      //expect
      expect(result).toEqual(listFootballTeam);
      expect(footBallTeamRepository.find).toBeCalledWith(queryCriteria);
      expect(footBallTeamRepository.count).toBeCalledWith({ where: condition });
      expect(result.data.docs).toEqual(pagingDocs);
      expect(result.error).toEqual(false);
    });
  });

  describe('Controller Get', () => {
    it('should create football team return success', async () => {
      const payload = new FootBallTeamCreateDto({
        name: 'jacknathan',
        logo: {
          name: 'jacknathan team',
          alt: 'jacknathan team',
          src: 'src',
        },
      });

      const doc = new FootballTeam();
      doc.name = payload.name;
      doc.logoName = payload.logo.name;
      doc.logoSrc = payload.logo.src;

      const footBallTeam = {
        message: 'Create Success My Entity',
        data: doc,
        error: false,
      };
      // override mock function repository
      footBallTeamRepository.save = jest.fn().mockResolvedValue(doc);

      const result = await controller.createAsync(payload);
      expect(result).toEqual(footBallTeam);
      expect(result.data).toEqual(doc);
      expect(result.error).toEqual(false);
      expect(footBallTeamRepository.save).toBeCalledWith(doc);
    });

    it('should create football team return footTeam error', async () => {
      const payload = new FootBallTeamCreateDto({
        name: 'jacknathan',
        logo: {
          name: 'jacknathan team',
          alt: 'jacknathan team',
          src: 'src',
        },
      });

      const doc = new FootballTeam();
      doc.name = payload.name;
      doc.logoName = payload.logo.name;
      doc.logoSrc = payload.logo.src;

      const footBallTeam = {
        data: null,
        error: true,
        message: 'Connect Server Problem',
      };

      // override mock function
      footBallTeamRepository.save = jest
        .fn()
        .mockRejectedValueOnce(new Error('Connect Server Problem'));

      const result = await controller.createAsync(payload);
      expect(result).toEqual(footBallTeam);
      expect(result.data).toEqual(null);
      expect(result.error).toEqual(true);
    });
  });
});

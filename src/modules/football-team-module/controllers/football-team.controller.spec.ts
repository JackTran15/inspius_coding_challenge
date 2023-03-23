import { Test, TestingModule } from '@nestjs/testing';
import { FootBallTeamCreateDto } from '../dtos/football-team-create.dto';
import { FootballTeamService } from '../services/football-team.service';
import { FootBallTeamController } from './football-team.controller';
import { EntityManager } from 'typeorm';

describe('FootBallTeamController', () => {
  let controller: FootBallTeamController;
  let footBallTeamService: FootballTeamService;
  const paging = {
    limit: 10,
    skip: 0,
  };

  const mockFootballTeamService = () => ({
    find: jest.fn((options) => {
      return {
        message: 'success',
        data: [],
        error: false,
      };
    }),
    store: jest.fn((payload) => {
      return {
        message: 'success',
        data: {
          id: expect.any(Number),
          ...payload,
          created: expect.any(Date),
          updated: expect.any(Date),
          createBy: 'admin',
          updateBy: 'admin',
        },
        error: false,
      };
    }),
  });

  beforeEach(async () => {
    const FootballTeamProvider = {
      provide: FootballTeamService,
      useFactory: mockFootballTeamService,
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [FootBallTeamController],
      providers: [FootballTeamService, FootballTeamProvider],
    }).compile();

    controller = module.get<FootBallTeamController>(FootBallTeamController);
    footBallTeamService = module.get<FootballTeamService>(FootballTeamService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all football team return list empty', async () => {
    const options = {};
    const resFootBallData = {
      message: 'get List Sucess',
      data: { docs: [], paging: { total: 0 } },
      error: false,
    };
    // override mock function
    footBallTeamService.find = jest.fn().mockResolvedValue(resFootBallData);

    const signalFootBallTeam = await footBallTeamService.find(options);

    const result = await controller.getList(paging, paging);
    expect(result).toEqual(signalFootBallTeam);
    expect(result.data.docs).toEqual([]);
    expect(result.error).toEqual(false);
  });

  it('should get all football team return list not empty', async () => {
    const options = {};
    const resFootBallData = {
      message: 'get List Sucess',
      data: {
        docs: [
          {
            id: 70,
            created: '2023-03-14T02:05:49.000Z',
            createdBy: 'Admin',
            updated: '2023-03-14T02:05:49.000Z',
            updatedBy: 'Admin',
            name: 'MU',
            logoId: 70,
            status: 'active',
            logo: {
              id: 70,
              created: '2023-03-14T02:05:49.000Z',
              createdBy: 'Admin',
              updated: '2023-03-14T02:05:49.000Z',
              updatedBy: 'Admin',
              name: 'MU',
              src: 'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
              alt: 'MU',
            },
          },
        ],
        paging: { total: 1, limit: 10, skip: 0 },
      },
      error: false,
    };
    // override mock function
    footBallTeamService.find = jest.fn().mockResolvedValue(resFootBallData);

    const signalFootBallTeam = await footBallTeamService.find(options);

    const result = await controller.getList(paging, paging);
    expect(result).toEqual(signalFootBallTeam);
    expect(result.data.docs).not.toEqual([]);
    expect(result.data.docs.length).toBeGreaterThan(0);
    expect(result.error).toEqual(false);
  });

  it('should create football team return success', async () => {
    const payload = new FootBallTeamCreateDto({
      name: 'MU 4',
      logo: {
        name: 'Logo Man City 2',
        src: 'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        alt: 'Logo Man City 2',
      },
    });

    const signalFootBallTeam = await footBallTeamService.store({
      name: payload.name,
      logoName: payload.logo.name,
      logoSrc: payload.logo.src,
    });

    expect(signalFootBallTeam.error).toEqual(false);
    expect(signalFootBallTeam.data).not.toEqual(null);
  });

  it('should create football team return image error', async () => {
    const payload = new FootBallTeamCreateDto({
      name: 'MU 4',
      logo: {
        name: 'Logo Man City 2',
        src: 'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        alt: 'Logo Man City 2',
      },
    });
  });

  it('should create football team return footTeam error', async () => {
    const payload = new FootBallTeamCreateDto({
      name: 'MU 4',
      logo: {
        name: 'Logo Man City 2',
        src: 'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        alt: 'Logo Man City 2',
      },
    });

    // override mock function
    footBallTeamService.store = jest.fn().mockResolvedValue({
      message: 'Insert server error',
      data: null,
      error: false,
    });

    const signalFootBallTeam = await footBallTeamService.store({
      name: payload.name,
      logoName: payload.logo.name,
      logoSrc: payload.logo.src,
    });

    expect(signalFootBallTeam.error).toEqual(false);
    expect(signalFootBallTeam.data).toEqual(null);
  });
});

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';

export class TournamentPagingDto {
  total!: number;
  skip!: number;
  limit!: number;
}

export class TournamentDataRes {
  docs!: Array<any>;

  @ApiProperty({
    description: 'The paging of the response',
    type: TournamentPagingDto,
    example: {
      total: 1,
      skip: 0,
      limit: 10,
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => TournamentPagingDto)
  paging!: TournamentPagingDto;
}

export class TournamentGetListResDto {
  @ApiProperty({
    description: 'The message of the response',
    type: String,
    example: 'Get List Football Match',
  })
  @IsNotEmpty()
  @IsString()
  message!: string;

  @ApiProperty({
    description: 'The data of the response',
    type: TournamentDataRes,
    example: {
      docs: [
        {
          id: 3,
          created: '2023-03-14T02:05:49.000Z',
          createdBy: 'Admin',
          updated: '2023-03-14T02:05:49.000Z',
          updatedBy: 'Admin',
          name: 'Champions League',
          start: '2023-03-13T10:22:03.000Z',
          teams: [
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
        },
      ],
      paging: {
        total: 1,
        skip: 0,
        limit: 10,
      },
    },
  })
  data!: TournamentDataRes;

  @ApiProperty({
    description:
      'The error of the response (true/false) *true = error, false = success',
    type: String,
    example: false,
  })
  @IsBoolean()
  error!: boolean;
}

// {
//   "message": "Get List Football Match",
//   "data": {
//       "docs": [
//           {
//               "id": 3,
//               "created": "2023-03-14T02:05:49.000Z",
//               "createdBy": "Admin",
//               "updated": "2023-03-14T02:05:49.000Z",
//               "updatedBy": "Admin",
//               "name": "Champions League",
//               "start": "2023-03-13T10:22:03.000Z",
//               "teams": [
//                   {
//                       "id": 70,
//                       "created": "2023-03-14T02:05:49.000Z",
//                       "createdBy": "Admin",
//                       "updated": "2023-03-14T02:05:49.000Z",
//                       "updatedBy": "Admin",
//                       "name": "MU",
//                       "logoId": 70,
//                       "status": "active",
//                       "logo": {
//                           "id": 70,
//                           "created": "2023-03-14T02:05:49.000Z",
//                           "createdBy": "Admin",
//                           "updated": "2023-03-14T02:05:49.000Z",
//                           "updatedBy": "Admin",
//                           "name": "MU",
//                           "src": "https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
//                           "alt": "MU"
//                       }
//                   },

//               ]
//           }
//       ],
//       "paging": {
//           "total": 4,
//           "skip": "01",
//           "limit": "1"
//       }
//   },
//   "error": false
// }

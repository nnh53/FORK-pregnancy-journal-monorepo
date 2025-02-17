import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class StandardService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createStandardDto: CreateStandardDto) {
    return this.databaseService.Standard.create({
      data: {
        week: createStandardDto.week,
        upperbound: createStandardDto.upperBound,
        lowerbound: createStandardDto.lowerBound,
        who_standard_value: createStandardDto.whoStandardValue,
        metric: {
          connect: {
            id: createStandardDto.metricId,
          },
        },
      },
    });
  }

  findAll() {
    return this.databaseService.Standard.findMany();
  }

  findOne(id: string) {
    return this.databaseService.Standard.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(updateStandardDto: UpdateStandardDto) {
    const cur = this.findOne(updateStandardDto.id);
    if (!cur) {
      throw new NotFoundException('Standard not found');
    }

    return this.databaseService.Standard.update({
      where: {
        id: updateStandardDto.id,
      },
      data: updateStandardDto,
    });
  }

  remove(id: string) {
    const cur = this.findOne(id);
    if (!cur) {
      throw new NotFoundException('Standard not found');
    }
    return this.databaseService.Standard.delete({
      where: {
        id: id,
      },
    });
  }
}

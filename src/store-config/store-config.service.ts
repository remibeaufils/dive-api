import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  StoreConfig,
  StoreConfigDocument,
} from './schemas/store-config.schema';

@Injectable()
export class StoreConfigService {
  constructor(
    @InjectModel(StoreConfig.name)
    private storeModel: Model<StoreConfigDocument>,
  ) {}

  async findOne(id: string): Promise<StoreConfigDocument> {
    return this.storeModel.findOne({ id }).exec();
  }

  async findOneByUser(email: string): Promise<StoreConfigDocument> {
    return this.storeModel.findOne({ user: email }).exec();
  }

  async updateOne(store: StoreConfig): Promise<StoreConfigDocument> {
    return this.storeModel.updateOne({ id: store.id }, store).exec();
  }
}

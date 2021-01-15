import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name)
    private storeModel: Model<StoreDocument>,
  ) {}

  async findOne(id: string): Promise<StoreDocument> {
    return this.storeModel.findOne({ id }).exec();
  }

  async findOneByUser(email: string): Promise<StoreDocument> {
    return this.storeModel.findOne({ user: email }).exec();
  }

  async updateOne(store: Store): Promise<StoreDocument> {
    return this.storeModel.updateOne({ id: store.id }, store).exec();
  }
}

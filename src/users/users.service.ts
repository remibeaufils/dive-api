import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<UserDocument | undefined> {
    // const user = await this.userModel.findOne({ email }).exec();
    // return this.userModel
    //   .findOne({ email })
    //   .exec()
    //   .then((user) => {
    //     console.log(user);
    //     return user;
    //   });

    // console.log(user instanceof Model);
    // console.log(user instanceof User);

    // return user;
    return await this.userModel.findOne({ email }).exec();
  }
}

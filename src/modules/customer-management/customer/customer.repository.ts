import { Model, Types } from 'mongoose';

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BillRepository } from '../../order-management/bill/bill.repository';
import { Customer } from './customer.schema';

import { CreateCustomerDto } from './dtos/create.dto';

import { UpdateCustomerDto } from './dtos/update.dto';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name)
    private CustomerModule: Model<Customer>,
    private billRepository: BillRepository,
  ) {}

  async create(restaurantId: Types.ObjectId, createCustomerDto: CreateCustomerDto) {
    const { name, mobile } = createCustomerDto;

    const data = new this.CustomerModule({
      restaurant: restaurantId,
      name,
      mobile,
    });

    return data.save();
  }

  async get(restaurantId: Types.ObjectId) {
    const data = await this.CustomerModule.find({ restaurant: restaurantId }).exec();
    return data;
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    const data = await this.CustomerModule.findOne({ restaurant: restaurantId, _id: id });
    return data;
  }

  async findByMobileNumber(mobile: number) {
    const data = await this.CustomerModule.findOne({ mobile });
    return data;
  }

  async update(restaurantId: Types.ObjectId, id: string, updateDto: UpdateCustomerDto) {
    const data = await this.CustomerModule.findOneAndUpdate({ restaurant: restaurantId, _id: id }, updateDto, {
      new: true,
    });
    return data;
  }

  async deleteCustomerByRestaurantId(resId: string) {
    const data = await this.CustomerModule.deleteMany({ restaurant: resId });
    if (data.deletedCount === 0) {
      throw new HttpException('no access found with this restaurantId', 404);
    }
    return data;
  }

  async delete(restaurantId: Types.ObjectId, id: string) {
    const findUser = await this.CustomerModule.findOne({ _id: id });

    const mobileNumber = findUser.mobile;

    this.billRepository.deleteCustomerFromBill(mobileNumber);

    const data = await this.CustomerModule.findOneAndDelete({ restaurant: restaurantId, _id: id });
    return data;
  }
}

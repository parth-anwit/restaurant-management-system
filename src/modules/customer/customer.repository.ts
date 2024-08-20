import mongoose, { Model, Types } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { Customer } from './customer.schema';

import { CreateCustomerDto } from './dtos/create.dto';

import { UpdateCustomerDto } from './dtos/update.dto';

// import { BillRepository } from 'src/bill/bill.repository';

// import { OrderRepository } from 'src/order/order.repository';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name)
    private CustomerModule: Model<Customer>,
    // private billRepo: BillRepository,
    // private orderRepo: OrderRepository,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, restaurantId: mongoose.Types.ObjectId) {
    const { name, mobile } = createCustomerDto;

    const data = await new this.CustomerModule({
      restaurant: restaurantId,
      name,
      mobile,
    });

    return data.save();
  }

  async get() {
    const data = await this.CustomerModule.find().exec();
    return data;
  }

  async getSpecific(id: Types.ObjectId) {
    const data = await this.CustomerModule.findById(id);
    return data;
  }

  async findByMobileNumber(mobile: number) {
    const data = await this.CustomerModule.findOne({ mobile });
    return data;
  }

  async update(id: Types.ObjectId, updateDto: UpdateCustomerDto) {
    const data = await this.CustomerModule.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    return data;
  }

  async deleteCustomerByRestaurantId(resId: string) {
    const data = await this.CustomerModule.deleteMany({ restaurant: resId });
    return data;
  }

  async delete(id: Types.ObjectId) {
    // this.billRepo.deleteBillByCustomerId(id);
    // this.orderRepo.deleteOrderByCustomerId(id);
    const data = await this.CustomerModule.findByIdAndDelete(id);
    return data;
  }
}

import mongoose, { Model } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';

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

  async create(restaurantId: string, createCustomerDto: CreateCustomerDto) {
    const { name, mobile } = createCustomerDto;

    const data = new this.CustomerModule({
      restaurant: new mongoose.Types.ObjectId(restaurantId),
      name,
      mobile,
    });

    return data.save();
  }

  async get(restaurantId: string) {
    const customerData = await this.CustomerModule.find({ restaurant: restaurantId }).exec();
    return customerData;
  }

  async getList(restaurantId: string, page: number, pageSizeNum: number) {
    const customer = await this.CustomerModule.aggregate([
      {
        $match: {
          restaurant: new mongoose.Types.ObjectId(restaurantId),
        },
      },

      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant_info',
        },
      },
      {
        $unwind: {
          path: '$restaurant_info',
        },
      },
      {
        $project: {
          restaurant: 0,
          __v: 0,
        },
      },

      {
        $facet: {
          metaData: [{ $count: 'totalCount' }],
          data: [{ $skip: (page - 1) * pageSizeNum }, { $limit: pageSizeNum }],
        },
      },
    ]);

    return {
      totalCount: customer[0].metaData[0]?.totalCount || 0,
      data: customer[0].data,
    };
  }

  async getSpecific(restaurantId: string, customerId: string) {
    const data = await this.CustomerModule.findOne({ restaurant: restaurantId, _id: customerId });
    return data;
  }

  async findByMobileNumber(mobile: number) {
    const data = await this.CustomerModule.findOne({ mobile });
    return data;
  }

  async update(restaurantId: string, customerId: string, updateDto: UpdateCustomerDto) {
    const data = await this.CustomerModule.findOneAndUpdate({ restaurant: restaurantId, _id: customerId }, updateDto, {
      new: true,
    });
    return data;
  }

  async deleteCustomerByRestaurantId(resId: string) {
    const data = await this.CustomerModule.deleteMany({ restaurant: resId });
    if (data.deletedCount === 0) {
      throw new NotFoundException('no access found with this restaurantId');
    }
    return data;
  }

  async delete(restaurantId: string, id: string) {
    const findUser = await this.CustomerModule.findOne({ _id: id });

    const mobileNumber = findUser.mobile;

    this.billRepository.deleteCustomerFromBill(mobileNumber);

    const data = await this.CustomerModule.findOneAndDelete({ restaurant: restaurantId, _id: id });
    return data;
  }
}

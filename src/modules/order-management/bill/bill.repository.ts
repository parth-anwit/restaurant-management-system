import { ConflictException, HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Bill } from './bill.schema';
import { Meal } from '../../meal-management/meal/meal.schema';
import { MealService } from '../../meal-management/meal/meal.service';
import { OrderRepository } from '../order/order.repository';
import { UpdateBillDto } from './dtos/update.dto';
import { UserDocument } from '../../user/user.schema';

@Injectable()
export class BillRepository {
  private readonly logger = new Logger(BillRepository.name);

  constructor(
    @InjectModel(Bill.name) private BillModule: Model<Bill>,
    private orderRepository: OrderRepository,
    private mealService: MealService,
  ) {}

  async create(restaurantId: string, currentUser: UserDocument, customerId: string) {
    const newBill = new this.BillModule({
      restaurant: new mongoose.Types.ObjectId(restaurantId),
      user: currentUser.id,
      customer: new mongoose.Types.ObjectId(customerId),
      startTime: new Date(),
    });
    return newBill.save();
  }

  async endBillSession(restaurantId: string, currentUser: UserDocument, customerId: string, billId: string) {
    const data = await this.BillModule.findOne({
      restaurant: restaurantId,
      _id: billId,
      isBillGenerated: false,
    });

    if (!data) {
      throw new HttpException('Session is not starting yet', 404);
    }

    const endSession = await this.BillModule.findOneAndUpdate(
      { restaurant: restaurantId, _id: billId },
      {
        $set: {
          restaurant: new mongoose.Types.ObjectId(restaurantId),
          user: currentUser._id,
          customer: new mongoose.Types.ObjectId(customerId),
          endTime: new Date(),
          isBillGenerated: true,
          discount: 10,
        },
      },
      { new: true },
    );

    if (!endSession) {
      throw new ConflictException('No bills were updated. Check the bill_id.');
    }

    return endSession;
  }

  async generateBill(restaurantId: string, currentUser: UserDocument, customerId: string, billId: string) {
    const bill = await this.BillModule.findOne({
      restaurant: new mongoose.Types.ObjectId(restaurantId),
      _id: new mongoose.Types.ObjectId(billId),
      isBillGenerated: true,
    }).lean();

    this.logger.debug({ data: bill }, 'data');

    if (bill) {
      const orders = await this.orderRepository.findOrderByBillId(restaurantId, billId);

      let billTitle = '';
      let total = 0;
      const { discount } = bill;

      orders.forEach((item) => {
        const meal = item.meal as Meal;
        billTitle += `${meal.name} (${item.quantity})\n`;
        total += meal.money * item.quantity;
      });

      const finalTotal = total - (total * discount) / 100;
      const updateBill = await this.BillModule.findOneAndUpdate(
        { restaurant: restaurantId, _id: billId },
        {
          $set: {
            title: billTitle.trim(),
            total: finalTotal,
            customer: new mongoose.Types.ObjectId(customerId),
          },
        },
        { new: true },
      );
      return updateBill;
    }
    throw new HttpException('session is not end yet', 404);
  }

  async validationForAddBill(userId: string) {
    const data = await this.BillModule.findOne({ user: userId });
    return data;
  }

  async getActiveBillOfSpecificCustomerFromBill(customerId: string) {
    const data = await this.BillModule.findOne({ customer: customerId, isBillGenerated: false });
    return data;
  }

  async getSpecific(restaurantId: string, billId: string) {
    const data = await this.BillModule.findOne({ restaurant: restaurantId, _id: billId });
    return data;
  }

  async getBillList(restaurantId: string, page: number, pageSize: number) {
    const bill = await this.BillModule.aggregate([
      {
        $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) },
      },

      {
        $facet: {
          metaData: [{ $count: 'totalCount' }],
          data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ]);

    return {
      totalCount: bill[0].metaData[0]?.totalCount || 0,
      billDataList: bill[0].data,
    };
  }

  async getBills(restaurantId: string) {
    const bill = await this.BillModule.aggregate([
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
    ]);

    return bill;
  }

  async update(restaurantId: string, billId: string, updateDto: UpdateBillDto) {
    const data = await this.BillModule.findOneAndUpdate({ restaurant: restaurantId, _id: billId }, updateDto, {
      new: true,
    });
    return data;
  }

  async deleteBillByRestaurantId(resId: string) {
    const data = await this.BillModule.deleteMany({ restaurant: resId });
    if (data.deletedCount === 0) {
      throw new HttpException('no bill found with this restaurantId', 404);
    }
    return data;
  }

  async deleteBillByCustomerId(customerId: string) {
    const data = await this.BillModule.deleteMany({ customer: customerId });
    return data;
  }

  async delete(restaurantId: string, billId: string) {
    const data = await this.BillModule.findOneAndDelete({ restaurant: restaurantId, _id: billId });
    return data;
  }

  async getActiveBills(restaurantId: string) {
    const activeBills = await this.BillModule.find({ restaurant: restaurantId, isBillGenerated: false });

    return activeBills;
  }

  async getNotActiveBills(restaurantId: string) {
    const notActiveBills = await this.BillModule.find({
      restaurant: restaurantId,
      isBillGenerated: true,
    });
    return notActiveBills;
  }

  async getBillsOfSpecificCustomer(restaurantId: string, customer_id: string) {
    const specificCustomerBill = await this.BillModule.findOne({ restaurant: restaurantId, customer: customer_id });

    return specificCustomerBill;
  }

  async getActiveBillOfSpecificCustomer(restaurantId: string, customer_id: string) {
    const data = await this.BillModule.findOne({
      restaurant: restaurantId,
      customer: customer_id,
      isBillGenerated: false,
    });
    return data;
  }

  async getNotActiveBillOfSpecificCustomer(restaurantId: string, customer_id: string) {
    const data = await this.BillModule.findOne({
      restaurant: restaurantId,
      customer: customer_id,
      isBillGenerated: true,
    });
    return data;
  }

  async deleteCustomerFromBill(mobile: number) {
    const data = await this.BillModule.findOne({ 'customer.mobile': mobile }).exec();

    if (!data) {
      throw new HttpException('no customer found in bill', 404);
    }

    const result = await this.BillModule.updateOne(
      { 'customer.mobile': mobile },
      {
        $set: {
          customer: 'customer delete',
        },
      },
    );
    return result;
  }

  async updateSpecificBillOfSpecificCustomer(restaurantId: string, customerId: string, billId: string, update: UpdateBillDto) {
    const data = await this.BillModule.findOneAndUpdate(
      {
        restaurant: restaurantId,
        _id: billId,
        customer: customerId,
      },
      {
        $set: {
          title: update.title,
          discount: update.discount,
        },
      },
    );
    return data;
  }

  async deleteSpecificBillOfSpecificCustomer(restaurantId: string, customerId: string, billId: string) {
    const data = await this.BillModule.findOneAndDelete({
      restaurant: restaurantId,
      customer: customerId,
      _id: billId,
    });

    return data;
  }

  async findPopularMeal(monthNum: number) {
    const data = await this.BillModule.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: '$endTime' }, monthNum],
          },
        },
      },

      {
        $group: {
          _id: '$title',
        },
      },

      {
        $project: {
          _id: 0,
          titles: {
            $split: ['$_id', '\n'],
          },
        },
      },

      {
        $unwind: '$titles',
      },

      {
        $group: {
          _id: '$titles',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },

      {
        $group: {
          _id: null,
          repeatedItem: {
            $push: { meal: '$_id', orderCount: '$count' },
          },
        },
      },
      {
        $project: {
          _id: 0,
          repeatedItem: 1,
          totalCount: 1,
        },
      },
    ]);
    return data;
  }

  async avgSpendCustomerOnBill(restaurantId: string) {
    const customer = await this.BillModule.aggregate([
      {
        $match: {
          restaurant: new mongoose.Types.ObjectId(restaurantId),
        },
      },
      {
        $group: {
          _id: '$customer',
          totalSpend: { $sum: '$total' },
        },
      },
      {
        $group: {
          _id: null,
          averageSpend: { $avg: '$totalSpend' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    return customer;
  }

  async customerSpendMoreTime(restaurantId: string) {
    const customer = await this.BillModule.aggregate([
      {
        $match: {
          restaurant: new mongoose.Types.ObjectId(restaurantId),
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer_info',
        },
      },
      {
        $unwind: '$customer_info',
      },
      {
        $group: {
          _id: '$customer_info.name',
          timeSpend: { $sum: { $subtract: ['$endTime', '$startTime'] } },
          count: { $sum: 1 },
          totalSpend: { $sum: '$total' },
        },
      },
      {
        $sort: {
          timeSpend: -1,
        },
      },
      {
        $group: {
          _id: null,
          Time_Spend: { $push: { customerId: '$_id', timeSpend: '$timeSpend', numberOfTimes: '$count', totalSpend: '$totalSpend' } },
        },
      },

      {
        $project: {
          _id: 0,
          numberOfTimes: '$count',
          totalSpend: '$totalSpend',
          Time_Spend: {
            $map: {
              input: '$Time_Spend',
              as: 'item',
              in: {
                customerId: '$$item.customerId',
                numberOfTimes: '$$item.numberOfTimes',
                totalSpend: '$$item.totalSpend',
                timeSpend: '$$item.timeSpend',
                hours: { $floor: { $divide: ['$$item.timeSpend', 3600000] } },
                minutes: { $floor: { $divide: [{ $mod: ['$$item.timeSpend', 3600000] }, 60000] } },
                seconds: { $floor: { $divide: [{ $mod: ['$$item.timeSpend', 60000] }, 1000] } },
              },
            },
          },
        },
      },
    ]);

    return customer;
  }
}

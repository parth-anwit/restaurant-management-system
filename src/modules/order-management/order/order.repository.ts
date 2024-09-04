import mongoose, { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

import { HttpException, Injectable } from '@nestjs/common';

import { CreateOrderDto } from './dtos/create.dto';

import { UpdateOrderDto } from './dtos/update.dto';

import { Order } from './order.schema';

@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order.name) private OrderModule: Model<Order>) {}

  async create(restaurantId: string, customerId: string, billId: string, createDto: CreateOrderDto) {
    const { quantity, notes } = createDto;

    const data = new this.OrderModule({
      restaurant: new mongoose.Types.ObjectId(restaurantId),
      customer: new mongoose.Types.ObjectId(customerId),
      mealCategory: new mongoose.Types.ObjectId(createDto.mealCategory_id),
      meal: new mongoose.Types.ObjectId(createDto.meal_id),
      bill: new mongoose.Types.ObjectId(billId),
      quantity,
      notes,
      orderPlacedTime: new Date(),
    });

    return data.save();
  }

  async getOrderList(restaurantId: string, page: number, pageSize: number) {
    const order = await this.OrderModule.aggregate([
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
      totalCount: order[0].metaData[0]?.totalCount || 0,
      orderDataList: order[0].data,
    };
  }

  async getSpecific(restaurantId: string, orderId: string) {
    const data = await this.OrderModule.findOne({ restaurant: restaurantId, _id: orderId });
    return data;
  }

  async update(restaurantId: string, orderId: string, update: UpdateOrderDto) {
    const data = await this.OrderModule.findOneAndUpdate({ restaurant: restaurantId, _id: orderId }, update, { new: true });
    return data;
  }

  async delete(restaurantId: string, orderId: string) {
    const data = await this.OrderModule.findOneAndDelete({ restaurant: restaurantId, _id: orderId });
    return data;
  }

  async deleteOrderByBillId(billId: string) {
    const data = await this.OrderModule.deleteMany({ bill: billId });
    return data;
  }

  async deleteOrderByRestaurantId(resId: string) {
    const data = await this.OrderModule.deleteMany({ restaurant: resId });
    if (data.deletedCount === 0) {
      throw new HttpException('no order found with this restaurantId', 404);
    }
    return data;
  }

  async findOrderByBillId(restaurantId: string, billId: string) {
    const data = await this.OrderModule.find({ restaurant: restaurantId, bill: billId }).populate('meal');
    return data;
  }

  async getOrderOfSpecificCustomer(restaurantId: string, customerId: string) {
    const data = await this.OrderModule.findOne({ restaurant: restaurantId, customer: customerId });
    return data;
  }

  async updateSpecificOrderOfSpecificCustomer(restaurantId: string, customerId: string, orderId: string, updateDto: UpdateOrderDto) {
    const data = await this.OrderModule.findOneAndUpdate(
      {
        restaurant: restaurantId,
        customer: customerId,
        _id: orderId,
      },
      {
        $set: {
          notes: updateDto.notes,
          quantity: updateDto.quantity,
        },
      },
    );

    return data;
  }

  async deleteSpecificOrderOfSpecificCustomer(restaurantId: string, customerId: string, orderId: string) {
    const data = await this.OrderModule.findOneAndDelete({
      restaurant: restaurantId,
      _id: orderId,
      customer: customerId,
    });
    return data;
  }

  async findPopular_Meal_MealCategory(month: number, timeZone: string) {
    const data = await this.OrderModule.aggregate([
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: { $substr: ['$orderPlacedTime', 0, 19] },
              timezone: timeZone,
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $eq: [{ $month: '$orderPlacedTime' }, month],
          },
        },
      },

      {
        $group: {
          _id: {
            meal: '$meal',
            mealCategory: '$mealCategory',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $lookup: {
          from: 'meals',
          localField: '_id.meal',
          foreignField: '_id',
          as: 'meal_info',
        },
      },
      {
        $unwind: {
          path: '$meal_info',
        },
      },
      {
        $lookup: {
          from: 'mealcategories',
          localField: '_id.mealCategory',
          foreignField: '_id',
          as: 'mealCategory_info',
        },
      },
      {
        $unwind: {
          path: '$mealCategory_info',
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          meal: '$meal_info.name',
          mealCategory: '$mealCategory_info.name',
          count: 1,
        },
      },
    ]);
    return data;
  }
}

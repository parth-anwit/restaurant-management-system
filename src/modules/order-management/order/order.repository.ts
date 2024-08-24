import mongoose, { Model, Types } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';

import { Injectable } from '@nestjs/common';

import { CreateOrderDto } from './dtos/create.dto';

import { UpdateOrderDto } from './dtos/update.dto';

import { Order } from './order.schema';

@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order.name) private OrderModule: Model<Order>) {}

  async create(createDto: CreateOrderDto, restaurantId: Types.ObjectId, customer_id: string, bill_id: string) {
    const { quantity, notes } = createDto;

    const data = new this.OrderModule({
      restaurant: restaurantId,
      customer: new mongoose.Types.ObjectId(customer_id),
      mealCategory: new mongoose.Types.ObjectId(createDto.mealCategory_id),
      meal: new mongoose.Types.ObjectId(createDto.meal_id),
      bill: new mongoose.Types.ObjectId(bill_id),
      quantity,
      notes,
    });

    return data.save();
  }

  async checkParticularBillSession(restaurantId, id: string) {
    const data = await this.OrderModule.findOne({ bill: id, restaurant: restaurantId });

    return data;
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    const data = await this.OrderModule.findOne({ restaurant: restaurantId, _id: id });
    return data;
  }

  async update(restaurantId: Types.ObjectId, id: string, update: UpdateOrderDto) {
    const data = await this.OrderModule.findOneAndUpdate({ restaurant: restaurantId, _id: id }, update, { new: true });
    return data;
  }

  async delete(restaurantId: Types.ObjectId, id: string) {
    const data = await this.OrderModule.findOneAndDelete({ restaurant: restaurantId, _id: id });
    return data;
  }

  async deleteOrderByBillId(billId: string) {
    const data = await this.OrderModule.deleteMany({ bill: billId });
    return data;
  }

  async deleteOrderByRestaurantId(resId: string) {
    const data = await this.OrderModule.deleteMany({ restaurant: resId });
    return data;
  }

  async findOrderByBillId(restaurantId: Types.ObjectId, id: string) {
    const data = await this.OrderModule.find({ restaurant: restaurantId, bill: id }).populate('meal');
    return data;
  }

  async getOrderOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string) {
    const data = await this.OrderModule.findOne({ restaurant: restaurantId, customer: customer_id });
    return data;
  }

  async updateSpecificOrderOfSpecificCustomer(
    restaurantId: Types.ObjectId,
    customer_id: string,
    order_id: string,
    updateDto: UpdateOrderDto,
  ) {
    const data = await this.OrderModule.findOneAndUpdate(
      {
        restaurant: restaurantId,
        customer: customer_id,
        _id: order_id,
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

  async deleteSpecificOrderOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string, order_id: string) {
    const data = await this.OrderModule.findOneAndDelete({
      restaurant: restaurantId,
      _id: order_id,
      customer: customer_id,
    });
    return data;
  }
}

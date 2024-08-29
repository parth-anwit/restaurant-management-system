import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

import { Bill } from './bill.schema';
import { Meal } from '../../meal-management/meal/meal.schema';
import { MealService } from '../../meal-management/meal/meal.service';
import { OrderRepository } from '../order/order.repository';
import { UpdateBillDto } from './dtos/update.dto';

@Injectable()
export class BillRepository {
  private readonly logger = new Logger(BillRepository.name);

  constructor(
    @InjectModel(Bill.name) private BillModule: Model<Bill>,
    private orderRepository: OrderRepository,
    private mealService: MealService,
  ) {}

  async create(restaurant_id: Types.ObjectId, userId: string, customer_id: string) {
    const newBill = new this.BillModule({
      restaurant: restaurant_id,
      user: userId,
      customer: new mongoose.Types.ObjectId(customer_id),
      startTime: new Date(),
    });
    return newBill.save();
  }

  async endBillSession(restaurant_id: Types.ObjectId, userId: string, customer_id: string, bill_id: string) {
    try {
      const data = await this.BillModule.find({
        restaurant: restaurant_id,
        _id: bill_id,
        isBillGenerated: false,
      });
      if (!data) {
        throw new HttpException('Session is not starting yet', 404);
      }

      const endSession = await this.BillModule.findOneAndUpdate(
        { restaurant: restaurant_id, _id: bill_id },
        {
          $set: {
            restaurant: restaurant_id,
            user: userId,
            customer: new mongoose.Types.ObjectId(customer_id),
            endTime: new Date(),
            isBillGenerated: true,
            discount: 10,
          },
        },
      );

      if (!endSession) {
        throw new HttpException('No bills were updated. Check the bill_id.', 404);
      }

      return endSession;
    } catch (error) {
      throw new HttpException('An error occurred while ending the session', 500);
    }
  }

  async generateBill(restaurant_id: Types.ObjectId, user: string, customer_id: string, bill_id: string) {
    const bill = await this.BillModule.findOne({
      restaurant: restaurant_id,
      _id: bill_id,
      isBillGenerated: true,
    }).lean();

    this.logger.debug({ data: bill }, 'data');

    if (bill) {
      const orders = await this.orderRepository.findOrderByBillId(restaurant_id, bill_id);

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
        { restaurant: restaurant_id, _id: bill_id },
        {
          $set: {
            title: billTitle.trim(),
            total: finalTotal,
            customer: new mongoose.Types.ObjectId(customer_id),
          },
        },
      );
      return updateBill;
    }
    throw new HttpException('session is not end yet', 404);
  }

  async validationForAddBill(userId: string) {
    const data = await this.BillModule.findOne({ user: userId });
    return data;
  }

  async getActiveBillOfSpecificCustomerFromBill(id: string) {
    const data = await this.BillModule.findOne({ customer: id });
    return data;
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    const data = await this.BillModule.findOne({ restaurant: restaurantId, _id: id });
    return data;
  }

  async getBills(restaurantId: Types.ObjectId) {
    const data = await this.BillModule.find({ restaurant: restaurantId })
      .populate('restaurant', '-_id -__v')
      .populate('customer', '-_id -__v -restaurant');
    return data;
  }

  async update(restaurantId: Types.ObjectId, id: string, updateDto: UpdateBillDto) {
    const data = await this.BillModule.findOneAndUpdate({ restaurant: restaurantId, _id: id }, updateDto, {
      new: true,
    });
    return data;
  }

  async deleteBillByRestaurantId(resId: string) {
    const data = await this.BillModule.deleteMany({ restaurant: resId });
    return data;
  }

  async deleteBillByCustomerId(customerId: string) {
    const data = await this.BillModule.deleteMany({ customer: customerId });
    return data;
  }

  async delete(restaurantId: Types.ObjectId, id: string) {
    const data = await this.BillModule.findOneAndDelete({ restaurant: restaurantId, _id: id });
    return data;
  }

  async getActiveBills(restaurantId: Types.ObjectId) {
    const activeBills = await this.BillModule.find({ restaurant: restaurantId, isBillGenerated: false });

    return activeBills;
  }

  async getNotActiveBills(restaurantId: Types.ObjectId) {
    const notActiveBills = await this.BillModule.find({
      restaurant: restaurantId,
      isBillGenerated: true,
    });
    return notActiveBills;
  }

  // pending

  async getBillsOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string) {
    const specificCustomerBill = await this.BillModule.findOne({ restaurant: restaurantId, customer: customer_id });

    return specificCustomerBill;
  }

  // pending

  async getActiveBillOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string) {
    const data = await this.BillModule.findOne({
      restaurant: restaurantId,
      customer: customer_id,
      isBillGenerated: false,
    });
    return data;
  }

  // pending

  async getNotActiveBillOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string) {
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

  // pending

  async updateSpecificBillOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string, bill_id: string, update: UpdateBillDto) {
    const data = await this.BillModule.findOneAndUpdate(
      {
        restaurant: restaurantId,
        _id: bill_id,
        customer: customer_id,
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

  // pending

  async deleteSpecificBillOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string, bill_id: string) {
    const data = await this.BillModule.findOneAndDelete({
      restaurant: restaurantId,
      customer: customer_id,
      _id: bill_id,
    });

    return data;
  }
}

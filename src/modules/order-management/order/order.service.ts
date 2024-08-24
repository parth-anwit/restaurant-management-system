import mongoose, { Types } from 'mongoose';

import { HttpException, Injectable } from '@nestjs/common';

import { CreateOrderDto } from './dtos/create.dto';

import { UpdateOrderDto } from './dtos/update.dto';

import { BillRepository } from '../bill/bill.repository';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private billRepository: BillRepository,
  ) {}

  async create(createDto: CreateOrderDto, restaurantId: Types.ObjectId, customer_id: string, bill_id: string) {
    try {
      const validate = await this.orderRepository.checkParticularBillSession(restaurantId, bill_id);

      if (validate) {
        throw new HttpException('order is already present', 404);
      }

      const data = await this.orderRepository.create(createDto, restaurantId, customer_id, bill_id);

      if (!data) {
        throw new HttpException('something is wrong while create order', 404);
      }

      return {
        message: 'Order created successfully',
        data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }

      const order = await this.orderRepository.getSpecific(restaurantId, id);

      if (!order) {
        throw new HttpException('order not found', 404);
      }
      return { order };
    } catch (error) {
      throw Error(error);
    }
  }

  async update(restaurantId: Types.ObjectId, id: string, update: UpdateOrderDto) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }
      const findOrder = await this.orderRepository.getSpecific(restaurantId, id);

      if (!findOrder) {
        throw new HttpException('order not found', 404);
      }

      const updateOrder = await this.orderRepository.update(restaurantId, id, update);

      if (!updateOrder) {
        throw new HttpException('something is wrong while update order', 404);
      }
      return {
        message: 'order update successfully',
        updateOrder,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(restaurantId: Types.ObjectId, id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }

      const findOrder = await this.orderRepository.getSpecific(restaurantId, id);

      if (!findOrder) {
        throw new HttpException('order not found', 404);
      }

      const deleteOrder = await this.orderRepository.delete(restaurantId, id);

      if (!deleteOrder) {
        throw new HttpException('something is wrong while delete order', 404);
      }
      return {
        message: 'order delete successfully',
        deleteOrder,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteOrderByBillId(billId: string) {
    try {
      const data = await this.orderRepository.deleteOrderByBillId(billId);

      if (!data) {
        throw new HttpException('no order delete by billId', 404);
      }

      return { message: 'order delete by billId', data };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteOrderByRestaurantId(resId: string) {
    try {
      const data = await this.orderRepository.deleteOrderByRestaurantId(resId);
      if (!data) {
        throw new HttpException('no order delete by restaurantId', 404);
      }
      return { message: 'order delete by restaurantId', data };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOrderByBillId(restaurantId: Types.ObjectId, id: string) {
    try {
      const data = await this.orderRepository.findOrderByBillId(restaurantId, id);
      if (!data) {
        throw new HttpException('no order found based on billId', 404);
      }
      return { data };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOrderOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string) {
    try {
      const data = await this.orderRepository.getOrderOfSpecificCustomer(restaurantId, customer_id);

      if (!data) {
        throw new HttpException('this customer have no orders', 404);
      }

      return { data };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateSpecificOrderOfSpecificCustomer(
    restaurantId: Types.ObjectId,
    customer_id: string,
    order_id: string,
    updateDto: UpdateOrderDto,
  ) {
    try {
      const data = await this.orderRepository.updateSpecificOrderOfSpecificCustomer(restaurantId, customer_id, order_id, updateDto);

      if (!data) {
        throw new HttpException('something is wrong while update specific customer order', 404);
      }

      return {
        message: 'order updated successfully',
        data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteSpecificOrderOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string, order_id: string) {
    try {
      const data = await this.orderRepository.deleteSpecificOrderOfSpecificCustomer(restaurantId, customer_id, order_id);

      if (!data) {
        throw new HttpException('something is wrong while delete specific customer order', 404);
      }

      return {
        message: 'order delete successfully',
        data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

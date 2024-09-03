import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { idChecker } from '../../invalidIDChecker';

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

  async create(restaurantId: string, customerId: string, billId: string, createDto: CreateOrderDto) {
    const data = await this.orderRepository.create(restaurantId, customerId, billId, createDto);

    if (!data) {
      throw new ConflictException('something is wrong while create order');
    }

    return {
      message: 'Order created successfully',
      data,
    };
  }

  async getOrderList(restaurantId: string, pageNum: number, pageSizeNum: number) {
    const order = await this.orderRepository.getOrderList(restaurantId, pageNum, pageSizeNum);
    if (!order) {
      throw new NotFoundException('order not found');
    }
    return {
      success: true,
      bill: {
        metaData: {
          totalCount: order.totalCount,
          page: pageNum,
          pageSize: pageSizeNum,
        },
        data: order.orderDataList,
      },
    };
  }

  async getSpecific(restaurantId: string, orderId: string) {
    idChecker(orderId);

    const order = await this.orderRepository.getSpecific(restaurantId, orderId);

    if (!order) {
      throw new NotFoundException('order not found');
    }
    return order;
  }

  async update(restaurantId: string, orderId: string, update: UpdateOrderDto) {
    idChecker(orderId);

    const updateOrder = await this.orderRepository.update(restaurantId, orderId, update);

    if (!updateOrder) {
      throw new NotFoundException('something is wrong while update order');
    }
    return {
      message: 'order update successfully',
      updateOrder,
    };
  }

  async delete(restaurantId: string, orderId: string) {
    idChecker(orderId);

    const deleteOrder = await this.orderRepository.delete(restaurantId, orderId);

    if (!deleteOrder) {
      throw new NotFoundException('something is wrong while delete order');
    }
    return {
      message: 'order delete successfully',
      deleteOrder,
    };
  }

  async deleteOrderByBillId(billId: string) {
    const data = await this.orderRepository.deleteOrderByBillId(billId);

    if (!data) {
      throw new NotFoundException('no order delete by billId');
    }

    return { message: 'order delete by billId', data };
  }

  async deleteOrderByRestaurantId(resId: string) {
    const data = await this.orderRepository.deleteOrderByRestaurantId(resId);
    if (!data) {
      throw new NotFoundException('no order delete by restaurantId');
    }
    return { message: 'order delete by restaurantId', data };
  }

  async findOrderByBillId(restaurantId: string, orderId: string) {
    const data = await this.orderRepository.findOrderByBillId(restaurantId, orderId);
    if (!data) {
      throw new NotFoundException('no order found based on billId');
    }
    return data;
  }

  async getOrderOfSpecificCustomer(restaurantId: string, customerId: string) {
    const data = await this.orderRepository.getOrderOfSpecificCustomer(restaurantId, customerId);

    if (!data) {
      throw new NotFoundException('this customer have no orders');
    }

    return data;
  }

  async updateSpecificOrderOfSpecificCustomer(restaurantId: string, customerId: string, orderId: string, updateDto: UpdateOrderDto) {
    const data = await this.orderRepository.updateSpecificOrderOfSpecificCustomer(restaurantId, customerId, orderId, updateDto);

    if (!data) {
      throw new NotFoundException('something is wrong while update specific customer order');
    }

    return {
      message: 'order updated successfully',
      data,
    };
  }

  async deleteSpecificOrderOfSpecificCustomer(restaurantId: string, customerId: string, orderId: string) {
    const data = await this.orderRepository.deleteSpecificOrderOfSpecificCustomer(restaurantId, customerId, orderId);

    if (!data) {
      throw new NotFoundException('something is wrong while delete specific customer order');
    }

    return {
      message: 'order delete successfully',
      data,
    };
  }

  async findPopular_Meal_MealCategory(monthNum: number) {
    const data = await this.orderRepository.findPopular_Meal_MealCategory(monthNum);

    return {
      data,
    };
  }
}

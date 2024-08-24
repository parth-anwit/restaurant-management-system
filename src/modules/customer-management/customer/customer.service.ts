import { HttpException, Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

import { CreateCustomerDto } from './dtos/create.dto';

import { UpdateCustomerDto } from './dtos/update.dto';

import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private customerRepo: CustomerRepository) {}

  async create(restaurantId: Types.ObjectId, createCustomerDto: CreateCustomerDto) {
    try {
      const findCustomer = await this.customerRepo.findByMobileNumber(createCustomerDto.mobile);

      if (findCustomer) {
        throw new HttpException('customer is already present', 404);
      }

      const data = await this.customerRepo.create(restaurantId, createCustomerDto);
      return {
        message: 'customer create successfully',
        customer: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async get(restaurantId: Types.ObjectId) {
    try {
      const data = await this.customerRepo.get(restaurantId);

      if (data.length === 0) {
        throw new HttpException('no customer found', 404);
      }

      return {
        customer: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('invalid id', 404);
      }

      const customer = await this.customerRepo.getSpecific(restaurantId, id);

      if (!customer) {
        throw new HttpException('customer not found', 404);
      }

      return {
        customer,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(restaurantId: Types.ObjectId, id: string, updateDto: UpdateCustomerDto) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something is wrong', 404);
      }

      const customer = await this.customerRepo.getSpecific(restaurantId, id);

      if (!customer) {
        throw new HttpException('customer not found', 404);
      }

      const updateCustomer = await this.customerRepo.update(restaurantId, id, updateDto);

      if (!updateCustomer) {
        throw new HttpException('error occur while update customer details', 404);
      }

      return {
        message: 'customer details updated successfully',
        updatedCustomer: updateCustomer,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  //   async deleteCustomerByRestaurantId(resId: string) {
  //     const data = await this.customerRepo.deleteCustomerByRestaurantId(resId);

  //     return {
  //       message: 'customer delete by restaurantId',
  //       data: data,
  //     };
  //   }

  async delete(restaurantId: Types.ObjectId, id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('invalid id', 404);
      }
      const customer = await this.customerRepo.getSpecific(restaurantId, id);

      if (!customer) {
        throw new HttpException('customer not found', 404);
      }

      const deleteCustomer = await this.customerRepo.delete(restaurantId, id);

      if (!deleteCustomer) {
        throw new HttpException('error occur while delete customer', 404);
      }

      return {
        message: 'customer delete successfully',
        deleteCustomer,
      };
    } catch (error) {
      throw new Error(error);
    }
    // this.billService.deleteBillByCustomerId(id); (fix subDeleteTask)
    // this.orderService.deleteOrderByCustomerId(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';

import { idChecker } from '../../invalidIDChecker';

import { CreateCustomerDto } from './dtos/create.dto';

import { UpdateCustomerDto } from './dtos/update.dto';

import { CustomerRepository } from './customer.repository';

@Injectable()
export class CustomerService {
  constructor(private customerRepo: CustomerRepository) {}

  async create(restaurantId: string, createCustomerDto: CreateCustomerDto) {
    const findCustomer = await this.customerRepo.findByMobileNumber(createCustomerDto.mobile);

    if (findCustomer) {
      throw new NotFoundException('customer is already present');
    }

    const data = await this.customerRepo.create(restaurantId, createCustomerDto);
    return {
      message: 'customer create successfully',
      customer: data,
    };
  }

  async get(restaurantId: string) {
    const customer = await this.customerRepo.get(restaurantId);
    return customer;
  }

  async getList(restaurantId: string, pageNum: number, pageSizeNum: number) {
    const customer = await this.customerRepo.getList(restaurantId, pageNum, pageSizeNum);

    if (!customer) {
      throw new NotFoundException('no customer found');
    }

    return {
      success: true,
      customer: {
        metaData: {
          totalCount: customer.totalCount,
          page: pageNum,
          pageSize: pageSizeNum,
        },
        data: customer.data,
      },
    };
  }

  async getSpecific(restaurantId: string, customerId: string) {
    idChecker(customerId);
    const customer = await this.customerRepo.getSpecific(restaurantId, customerId);

    if (!customer) {
      throw new NotFoundException('customer not found');
    }

    return {
      customer,
    };
  }

  async update(restaurantId: string, customerId: string, updateDto: UpdateCustomerDto) {
    idChecker(customerId);

    const updateCustomer = await this.customerRepo.update(restaurantId, customerId, updateDto);

    if (!updateCustomer) {
      throw new NotFoundException('error occur while update customer details');
    }

    return {
      message: 'customer details updated successfully',
      updatedCustomer: updateCustomer,
    };
  }

  async delete(restaurantId: string, customerId: string) {
    idChecker(customerId);
    const deleteCustomer = await this.customerRepo.delete(restaurantId, customerId);

    if (!deleteCustomer) {
      throw new NotFoundException('error occur while delete customer');
    }

    return {
      message: 'customer delete successfully',
      deleteCustomer,
    };
  }
}

import mongoose, { Types } from 'mongoose';

import { HttpException, Injectable } from '@nestjs/common';

import { UpdateBillDto } from './dtos/update.dto';

import { BillRepository } from './bill.repository';

import { CustomerService } from '../../customer-management/customer/customer.service';

@Injectable()
export class BillService {
  constructor(
    private billRepo: BillRepository,
    private customerService: CustomerService,
  ) {}

  async create(restaurant_id: Types.ObjectId, user: string, customer_id: string) {
    try {
      const validate = await this.getActiveBillOfSpecificCustomerFromBill(customer_id);

      if (validate) {
        throw new HttpException('for this customer session is already started', 404);
      }

      const newBill = await this.billRepo.create(restaurant_id, user, customer_id);

      if (!newBill) {
        throw new HttpException('something is wrong while create bill', 404);
      }

      return {
        message: 'session start successfully',
        Bill: newBill,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async endBillSession(restaurant_id: Types.ObjectId, user: string, customer_id: string, bill_id: string) {
    try {
      const data = await this.billRepo.endBillSession(restaurant_id, user, customer_id, bill_id);
      if (!data) {
        throw new HttpException('no end-bill-session found', 404);
      }

      return {
        message: 'session end successfully',
        bill: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async generateBill(restaurant_id: Types.ObjectId, user: string, customer_id: string, bill_id: string) {
    try {
      const data = await this.billRepo.generateBill(restaurant_id, user, customer_id, bill_id);

      if (!data) {
        throw new HttpException('something is wrong while generate bill', 404);
      }

      return {
        message: 'Bill generated successfully',
        bill: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSpecific(restaurantId: Types.ObjectId, id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new HttpException('something  is wrong', 404);
      }

      const bill = await this.billRepo.getSpecific(restaurantId, id);

      if (!bill) {
        throw new HttpException('bill  not found', 404);
      }
      return {
        bill,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBills(restaurantId: Types.ObjectId) {
    try {
      const data = await this.billRepo.getBills(restaurantId);
      if (!data) {
        throw new HttpException('no bill found', 404);
      }
      return { data };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(restaurantId: Types.ObjectId, id: string, updateDto: UpdateBillDto) {
    try {
      const findBill = await this.billRepo.getSpecific(restaurantId, id);

      if (!findBill) {
        throw new HttpException('no bill  found', 404);
      }

      const data = await this.billRepo.update(restaurantId, id, updateDto);

      if (!data) {
        throw new HttpException('something went wrong while update bill', 404);
      }

      return {
        message: 'bill update successfully',
        deleteBill: data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteBillByCustomerId(restaurantId: Types.ObjectId, customerId: string) {
    try {
      const findCustomer = await this.customerService.getSpecific(restaurantId, customerId);

      if (!findCustomer) {
        throw new HttpException('no customer found!', 404);
      }

      const data = await this.billRepo.deleteBillByCustomerId(customerId);
      if (!data) {
        throw new HttpException('something is wrong while delete bill', 404);
      }

      return { message: 'bill delete successfully by customerId', data };
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

      const findBill = await this.billRepo.getSpecific(restaurantId, id);

      if (!findBill) {
        throw new HttpException('no bill found ', 404);
      }

      const deleteBill = await this.billRepo.delete(restaurantId, id);

      if (!deleteBill) {
        throw new HttpException('bill is not delete successfully', 404);
      }

      return {
        message: 'bill delete successfully',
        deleteBill,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async validationForAddBill(user: string) {
    const data = await this.billRepo.validationForAddBill(user);
    return data;
  }

  async getActiveBills(restaurantId: Types.ObjectId) {
    try {
      const activeBills = await this.billRepo.getActiveBills(restaurantId);
      if (!activeBills) {
        throw new HttpException('no active bill found', 404);
      }
      return {
        message: 'Total active bills',
        activeBills,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNotActiveBills(restaurantId: Types.ObjectId) {
    try {
      const notActiveBills = await this.billRepo.getNotActiveBills(restaurantId);

      if (!notActiveBills) {
        throw new HttpException('not-active bills not found', 404);
      }
      return {
        message: 'Total not active bills',
        notActiveBills,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBillsOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string) {
    try {
      const findCustomer = await this.customerService.getSpecific(restaurantId, customer_id);
      if (!findCustomer) {
        throw new HttpException('no customer found', 404);
      }
      const specificBill = await this.billRepo.getBillsOfSpecificCustomer(restaurantId, customer_id);
      if (!specificBill) {
        throw new HttpException('no bill  found', 404);
      }
      return {
        message: `Bill of ${findCustomer.customer.name}`,
        customerBill: specificBill,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getActiveBillOfSpecificCustomerFromBill(customer_id: string) {
    const data = await this.billRepo.getActiveBillOfSpecificCustomerFromBill(customer_id);
    return data;
  }

  async getActiveBillsOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string) {
    try {
      const findCustomer = await this.customerService.getSpecific(restaurantId, customer_id);
      if (!findCustomer) {
        throw new HttpException('no customer found', 404);
      }
      const data = await this.billRepo.getActiveBillOfSpecificCustomer(restaurantId, customer_id);
      if (!data) {
        throw new HttpException('no bill  found', 404);
      }
      return {
        message: `Active bill of ${findCustomer.customer.name}`,
        data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getNotActiveBillsOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string) {
    try {
      const findCustomer = await this.customerService.getSpecific(restaurantId, customer_id);
      if (!findCustomer) {
        throw new HttpException('no customer found', 404);
      }
      const data = await this.billRepo.getNotActiveBillOfSpecificCustomer(restaurantId, customer_id);
      if (!data) {
        throw new HttpException('no bill  found', 404);
      }
      return {
        message: `Not active bill of ${findCustomer.customer.name}`,
        data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateSpecificBillOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string, bill_id: string, update: UpdateBillDto) {
    try {
      const findCustomer = await this.customerService.getSpecific(restaurantId, customer_id);
      if (!findCustomer) {
        throw new HttpException('no customer  found', 404);
      }
      const data = await this.billRepo.updateSpecificBillOfSpecificCustomer(restaurantId, customer_id, bill_id, update);
      if (!data) {
        throw new HttpException('something is wrong while update bill', 404);
      }
      return {
        message: `Update bill of ${findCustomer.customer.name}`,
        data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteSpecificBillOfSpecificCustomer(restaurantId: Types.ObjectId, customer_id: string, bill_id: string) {
    try {
      const findCustomer = this.customerService.getSpecific(restaurantId, customer_id);
      if (!findCustomer) {
        throw new HttpException('no customer found', 404);
      }
      const data = await this.billRepo.deleteSpecificBillOfSpecificCustomer(restaurantId, customer_id, bill_id);
      if (!data) {
        throw new HttpException('something is wrong while delete bill', 404);
      }
      return {
        message: `Delete bill of ${(await findCustomer).customer.name}`,
        data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

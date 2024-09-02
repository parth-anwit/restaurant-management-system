import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { idChecker } from '../../invalidIDChecker';

import { UpdateBillDto } from './dtos/update.dto';

import { BillRepository } from './bill.repository';

import { CustomerService } from '../../customer-management/customer/customer.service';
import { UserDocument } from '../../user/user.schema';

@Injectable()
export class BillService {
  constructor(
    private billRepo: BillRepository,
    private customerService: CustomerService,
  ) {}

  async create(restaurantId: string, currentUser: UserDocument, customerId: string) {
    const validate = await this.getActiveBillOfSpecificCustomerFromBill(customerId);

    if (validate) {
      throw new NotFoundException('for this customer session is already started');
    }

    const newBill = await this.billRepo.create(restaurantId, currentUser, customerId);

    if (!newBill) {
      throw new ConflictException('Something is wrong while create bill');
    }

    return {
      message: 'session start successfully',
      Bill: newBill,
    };
  }

  async endBillSession(restaurantId: string, currentUser: UserDocument, customerId: string, billId: string) {
    const data = await this.billRepo.endBillSession(restaurantId, currentUser, customerId, billId);
    if (!data) {
      throw new NotFoundException('no end-bill-session found');
    }

    return {
      message: 'session end successfully',
      bill: data,
    };
  }

  async generateBill(restaurantId: string, currentUser: UserDocument, customerId: string, billId: string) {
    const data = await this.billRepo.generateBill(restaurantId, currentUser, customerId, billId);

    if (!data) {
      throw new NotFoundException('something is wrong while generate bill');
    }

    return {
      message: 'Bill generated successfully',
      bill: data,
    };
  }

  async getSpecific(restaurantId: string, billId: string) {
    const bill = await this.billRepo.getSpecific(restaurantId, billId);

    if (!bill) {
      throw new NotFoundException('bill  not found');
    }
    return {
      bill,
    };
  }

  async getBillList(restaurantId: string, pageNum: number, pageSizeNum: number) {
    const bill = await this.billRepo.getBillList(restaurantId, pageNum, pageSizeNum);
    if (!bill) {
      throw new NotFoundException('bill not found');
    }

    return {
      success: true,
      bill: {
        metaData: {
          totalCount: bill.totalCount,
          page: pageNum,
          pageSize: pageSizeNum,
        },
        data: bill.billDataList,
      },
    };
  }

  async getBills(restaurantId: string) {
    const data = await this.billRepo.getBills(restaurantId);
    if (!data) {
      throw new NotFoundException('no bill found');
    }
    return data;
  }

  async update(restaurantId: string, billId: string, updateDto: UpdateBillDto) {
    const data = await this.billRepo.update(restaurantId, billId, updateDto);

    if (!data) {
      throw new BadRequestException('something went wrong while update bill');
    }

    return {
      message: 'bill update successfully',
      deleteBill: data,
    };
  }

  async deleteBillByCustomerId(restaurantId: string, customerId: string) {
    const data = await this.billRepo.deleteBillByCustomerId(customerId);
    if (!data) {
      throw new NotFoundException('something is wrong while delete bill');
    }

    return { message: 'bill delete successfully by customerId', data };
  }

  async delete(restaurantId: string, billId: string) {
    idChecker(billId);
    const deleteBill = await this.billRepo.delete(restaurantId, billId);

    if (!deleteBill) {
      throw new NotFoundException('bill is not delete successfully');
    }

    return {
      message: 'bill delete successfully',
      deleteBill,
    };
  }

  async validationForAddBill(userId: string) {
    const data = await this.billRepo.validationForAddBill(userId);
    return data;
  }

  async getActiveBills(restaurantId: string) {
    const activeBills = await this.billRepo.getActiveBills(restaurantId);
    if (!activeBills) {
      throw new NotFoundException('no active bill found');
    }
    return {
      message: 'Total active bills',
      activeBills,
    };
  }

  async getNotActiveBills(restaurantId: string) {
    const notActiveBills = await this.billRepo.getNotActiveBills(restaurantId);

    if (!notActiveBills) {
      throw new NotFoundException('not-active bills not found');
    }
    return {
      message: 'Total not active bills',
      notActiveBills,
    };
  }

  async getBillsOfSpecificCustomer(restaurantId: string, customerId: string) {
    const findCustomer = await this.customerService.getSpecific(restaurantId, customerId);
    if (!findCustomer) {
      throw new NotFoundException('no customer found');
    }
    const specificBill = await this.billRepo.getBillsOfSpecificCustomer(restaurantId, customerId);
    if (!specificBill) {
      throw new NotFoundException('no bill  found');
    }
    return {
      message: `Bill of ${findCustomer.customer.name}`,
      customerBill: specificBill,
    };
  }

  async getActiveBillOfSpecificCustomerFromBill(customerId: string) {
    const data = await this.billRepo.getActiveBillOfSpecificCustomerFromBill(customerId);
    return data;
  }

  async getActiveBillsOfSpecificCustomer(restaurantId: string, customerId: string) {
    const findCustomer = await this.customerService.getSpecific(restaurantId, customerId);
    if (!findCustomer) {
      throw new NotFoundException('no customer found');
    }
    const data = await this.billRepo.getActiveBillOfSpecificCustomer(restaurantId, customerId);
    if (!data) {
      throw new NotFoundException('no bill  found');
    }
    return {
      message: `Active bill of ${findCustomer.customer.name}`,
      data,
    };
  }

  async getNotActiveBillsOfSpecificCustomer(restaurantId: string, customerId: string) {
    const findCustomer = await this.customerService.getSpecific(restaurantId, customerId);
    if (!findCustomer) {
      throw new NotFoundException('no customer found');
    }
    const data = await this.billRepo.getNotActiveBillOfSpecificCustomer(restaurantId, customerId);
    if (!data) {
      throw new NotFoundException('no bill  found');
    }
    return {
      message: `Not active bill of ${findCustomer.customer.name}`,
      data,
    };
  }

  async updateSpecificBillOfSpecificCustomer(restaurantId: string, customerId: string, billId: string, update: UpdateBillDto) {
    const findCustomer = await this.customerService.getSpecific(restaurantId, customerId);
    if (!findCustomer) {
      throw new NotFoundException('no customer  found');
    }
    const data = await this.billRepo.updateSpecificBillOfSpecificCustomer(restaurantId, customerId, billId, update);
    if (!data) {
      throw new NotFoundException('something is wrong while update bill');
    }
    return {
      message: `Update bill of ${findCustomer.customer.name}`,
      data,
    };
  }

  async deleteSpecificBillOfSpecificCustomer(restaurantId: string, customer_id: string, bill_id: string) {
    const findCustomer = this.customerService.getSpecific(restaurantId, customer_id);
    if (!findCustomer) {
      throw new NotFoundException('no customer found');
    }
    const data = await this.billRepo.deleteSpecificBillOfSpecificCustomer(restaurantId, customer_id, bill_id);
    if (!data) {
      throw new NotFoundException('something is wrong while delete bill');
    }
    return {
      message: `Delete bill of ${(await findCustomer).customer.name}`,
      data,
    };
  }
}

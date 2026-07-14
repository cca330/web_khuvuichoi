import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Promotion, PromotionStatus } from './entities/promotion.entity';
import { PromotionGateTicket } from './entities/promotion-gate-ticket.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApplyPromotionDto } from './dto/apply-promotion.dto';

@Injectable()
export class PromotionsService {
  private readonly ticketServiceUrl: string;

  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(PromotionGateTicket)
    private readonly promotionGateTicketRepository: Repository<PromotionGateTicket>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ticketServiceUrl = this.configService.get<string>('TICKET_SERVICE_URL') as string;
  }

  // Lấy tất cả promotions
  async findAll() {
    return this.promotionRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.gateTickets', 'pgt')
      .orderBy('p.id', 'DESC')
      .getMany();
  }

  async findById(id: number) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['gateTickets'],
    });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    return promotion;
  }

  async findByCode(code: string) {
    return this.promotionRepository.findOne({
      where: {
        code: code.toUpperCase(),
        status: PromotionStatus.ACTIVE,
      },
      relations: ['gateTickets'],
    });
  }

  async create(dto: CreatePromotionDto) {
    const queryRunner = this.promotionRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const promotion = queryRunner.manager.create(Promotion, {
        code: dto.code.toUpperCase(),
        discount: dto.discount,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: PromotionStatus.ACTIVE,
      });

      const savedPromotion = await queryRunner.manager.save(Promotion, promotion);

      if (dto.gateTicketIds && dto.gateTicketIds.length > 0) {
        for (const gateTicketId of dto.gateTicketIds) {
          const pgt = queryRunner.manager.create(PromotionGateTicket, {
            promotionId: savedPromotion.id,
            gateTicketId,
          });
          await queryRunner.manager.save(PromotionGateTicket, pgt);
        }
      }

      await queryRunner.commitTransaction();
      return this.findById(savedPromotion.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: UpdatePromotionDto) {
    const queryRunner = this.promotionRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const promotion = await queryRunner.manager.findOne(Promotion, { where: { id } });
      if (!promotion) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('Promotion not found');
      }

      promotion.code = dto.code.toUpperCase();
      promotion.discount = dto.discount;
      promotion.startDate = new Date(dto.startDate);
      promotion.endDate = new Date(dto.endDate);
      promotion.status = dto.status;

      await queryRunner.manager.save(Promotion, promotion);
      await queryRunner.manager.delete(PromotionGateTicket, { promotionId: id });

      if (dto.gateTicketIds && dto.gateTicketIds.length > 0) {
        for (const gateTicketId of dto.gateTicketIds) {
          const pgt = queryRunner.manager.create(PromotionGateTicket, {
            promotionId: id,
            gateTicketId,
          });
          await queryRunner.manager.save(PromotionGateTicket, pgt);
        }
      }

      await queryRunner.commitTransaction();
      return this.findById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async disable(id: number) {
    const promotion = await this.promotionRepository.findOne({ where: { id } });
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    promotion.status = PromotionStatus.EXPIRED;
    return this.promotionRepository.save(promotion);
  }

  // Áp dụng promotion cho order — giờ gọi HTTP sang ticket-service thay vì SQL trực tiếp
  async apply(dto: ApplyPromotionDto) {
    const promotion = await this.findByCode(dto.code);
    if (!promotion) {
      return { success: false, message: 'Mã giảm giá không hợp lệ' };
    }

    const today = new Date().toISOString().split('T')[0];

const toDateString = (value: Date | string): string => {
  return value instanceof Date ? value.toISOString().split('T')[0] : String(value);
};

const startDate = toDateString(promotion.startDate);
const endDate = toDateString(promotion.endDate);

    if (today < startDate || today > endDate) {
      return { success: false, message: 'Mã giảm giá đã hết hạn hoặc chưa có hiệu lực' };
    }

    // Gọi sang ticket-service để tính base total (thay vì tự query order_items)
    const { total: baseTotal } = await this.callTicketService(
      'post',
      '/tickets/internal/calculate-base-total',
      { orderId: dto.orderId, promotionId: promotion.id },
    );

    if (baseTotal <= 0) {
      return { success: false, message: 'Không có sản phẩm phù hợp để áp mã' };
    }

    const discount = (baseTotal * promotion.discount) / 100;

    // Gọi sang ticket-service để ghi promotion_order + cập nhật total_price (thay vì tự UPDATE)
    await this.callTicketService('post', '/tickets/internal/apply-promotion-order', {
      promotionId: promotion.id,
      orderId: dto.orderId,
      discountAmount: discount,
    });

    return { success: true, discount };
  }

  // Lấy danh sách gate tickets — gọi HTTP sang ticket-service
  async getAllGateTickets() {
    return this.callTicketService('get', '/tickets/internal/gate-tickets');
  }

  async getTotalUsed(promotionId: number) {
  const { total } = await this.callTicketService(
    'get',
    `/tickets/internal/promotion/${promotionId}/total-used`,
  );
  return total;
}

async getTotalDiscount(promotionId: number) {
  const { total } = await this.callTicketService(
    'get',
    `/tickets/internal/promotion/${promotionId}/total-discount`,
  );
  return total;
}

  // Hàm dùng chung để gọi HTTP sang ticket-service
  private async callTicketService(method: 'get' | 'post', path: string, body?: any) {
    try {
      const url = `${this.ticketServiceUrl}${path}`;
      const response =
        method === 'get'
          ? await firstValueFrom(this.httpService.get(url))
          : await firstValueFrom(this.httpService.post(url, body));
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        `Không gọi được ticket-service: ${error.message}`,
      );
    }
  }
}
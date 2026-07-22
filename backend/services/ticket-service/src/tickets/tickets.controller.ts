import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { GenerateTicketsDto } from './dto/generate-tickets.dto';
import { FilterRevenueDto } from './dto/filter-revenue.dto';
import { CalculateBaseTotalDto } from './dto/calculate-base-total.dto';
import { ApplyPromotionOrderDto } from './dto/apply-promotion-order.dto';

import { IsNotEmpty, IsNumber, IsIn } from 'class-validator';

class AddGateDto {
  @IsNotEmpty()
  @IsNumber()
  gateTicketId: number;
}

class UpdateQtyDto {
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @IsNotEmpty()
  @IsIn(['plus', 'minus'])
  action: 'plus' | 'minus';
}

class CheckoutDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // ==================== Cart/Order APIs ====================

  // Lấy danh sách vé cổng
  @Get('gate-tickets')
  getGateTickets() {
    return this.ticketsService.getGateTickets();
  }

  // Lấy thông tin giỏ hàng
  @Get('cart')
  getCart(@Query('userId') userId: string) {
    return this.ticketsService.getCart(parseInt(userId));
  }

  // Thêm vé cổng vào giỏ hàng
  @Post('cart/add')
  @HttpCode(HttpStatus.OK)
  addGateToCart(@Body() dto: AddGateDto, @Query('userId') userId: string) {
    return this.ticketsService.addGateToCart(
      parseInt(userId),
      dto.gateTicketId,
    );
  }

  // Cập nhật số lượng
  @Post('cart/update-qty')
  @HttpCode(HttpStatus.OK)
  updateCartItemQuantity(@Body() dto: UpdateQtyDto) {
    return this.ticketsService.updateCartItemQuantity(dto.itemId, dto.action);
  }

  // Xóa item khỏi giỏ hàng
  @Post('cart/delete-item')
  @HttpCode(HttpStatus.OK)
  deleteCartItem(@Body('itemId') itemId: number) {
    return this.ticketsService.deleteCartItem(itemId);
  }

  // Lịch sử đơn hàng
  @Get('orders/history')
  getOrderHistory(@Query('userId') userId: string) {
    return this.ticketsService.getOrderHistory(parseInt(userId));
  }

  // Chi tiết đơn hàng
  @Get('orders/:orderId')
  getOrderDetail(
    @Param('orderId') orderId: string,
    @Query('userId') userId: string,
  ) {
    return this.ticketsService.getOrderDetail(
      parseInt(orderId),
      parseInt(userId),
    );
  }

  // Thanh toán
  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  checkout(@Body() dto: CheckoutDto, @Query('userId') userId: string) {
    return this.ticketsService.checkout(dto.orderId, parseInt(userId));
  }

  // ==================== Internal APIs ====================

  @Get('internal/promotion/:promotionId/total-used')
  getPromotionTotalUsed(@Param('promotionId') promotionId: string) {
    return this.ticketsService.getPromotionTotalUsed(parseInt(promotionId));
  }

  @Get('internal/promotion/:promotionId/total-discount')
  getPromotionTotalDiscount(@Param('promotionId') promotionId: string) {
    return this.ticketsService.getPromotionTotalDiscount(parseInt(promotionId));
  }

  @Get('internal/gate-tickets')
  getActiveGateTickets() {
    return this.ticketsService.getActiveGateTickets();
  }

  @Post('internal/calculate-base-total')
  @HttpCode(HttpStatus.OK)
  calculateBaseTotal(@Body() dto: CalculateBaseTotalDto) {
    return this.ticketsService.calculateBaseTotal(dto);
  }

  @Post('internal/apply-promotion-order')
  @HttpCode(HttpStatus.OK)
  applyPromotionOrder(@Body() dto: ApplyPromotionOrderDto) {
    return this.ticketsService.applyPromotionToOrder(dto);
  }

  // ==================== Admin APIs ====================

  @Get()
  findAll(@Query() filter: FilterTicketsDto) {
    return this.ticketsService.findAll(filter);
  }

  @Get('stats')
  getStats() {
    return this.ticketsService.getStats();
  }

  @Get('order/:orderId')
  getTicketsByOrder(@Param('orderId') orderId: string) {
    return this.ticketsService.getTicketsByOrder(parseInt(orderId));
  }

  @Post('scan')
  @HttpCode(HttpStatus.OK)
  scanTicket(@Body() dto: ScanTicketDto) {
    return this.ticketsService.scanTicket(dto);
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  generateTickets(@Body() dto: GenerateTicketsDto) {
    return this.ticketsService.generateByOrder(dto.orderId);
  }

  // ===== API nội bộ, chỉ dành cho revenue-service gọi sang =====
  @Get('internal/revenue/years')
  getRevenueYears() {
    return this.ticketsService.getAvailableYears();
  }

  @Get('internal/revenue/monthly')
  getRevenueMonthly(@Query() filter: FilterRevenueDto) {
    return this.ticketsService.getMonthlyRevenue(filter);
  }

  @Get('internal/revenue/gate-details')
  getRevenueGateDetails() {
    return this.ticketsService.getGateTicketDetails();
  }

  @Get('internal/revenue/overview')
  getRevenueOverview() {
    return this.ticketsService.getOverview();
  }
}

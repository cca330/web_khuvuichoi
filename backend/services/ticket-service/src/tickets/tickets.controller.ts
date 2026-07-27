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
  ParseIntPipe,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { ScanTicketDto } from './dto/scan-ticket.dto';
import { GenerateTicketsDto } from './dto/generate-tickets.dto';
import { FilterRevenueDto } from './dto/filter-revenue.dto';
import { CalculateBaseTotalDto } from './dto/calculate-base-total.dto';
import { ApplyPromotionOrderDto } from './dto/apply-promotion-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { IsNotEmpty, IsNumber, IsIn, Min, Max } from 'class-validator';

class AddGateDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  gateTicketId: number;
}

class UpdateQtyDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  itemId: number;

  @IsNotEmpty()
  @IsIn(['plus', 'minus'])
  action: 'plus' | 'minus';
}

class CheckoutDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  orderId: number;
}

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // ==================== Cart/Order APIs ====================

  // Lấy danh sách vé cổng - Public
  @Get('gate-tickets')
  getGateTickets() {
    return this.ticketsService.getGateTickets();
  }

  // Lấy thông tin giỏ hàng - Protected
  @Get('cart')
  @UseGuards(JwtAuthGuard)
  getCart(@Request() req) {
    return this.ticketsService.getCart(req.user.id);
  }

  // Thêm vé cổng vào giỏ hàng - Protected
  @Post('cart/add')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  addGateToCart(@Body() dto: AddGateDto, @Request() req) {
    return this.ticketsService.addGateToCart(req.user.id, dto.gateTicketId);
  }

  // Cập nhật số lượng - Protected
  @Post('cart/update-qty')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateCartItemQuantity(@Body() dto: UpdateQtyDto) {
    return this.ticketsService.updateCartItemQuantity(dto.itemId, dto.action);
  }

  // Xóa item khỏi giỏ hàng - Protected
  @Post('cart/delete-item')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteCartItem(@Body('itemId') itemId: number) {
    return this.ticketsService.deleteCartItem(itemId);
  }

  // Lịch sử đơn hàng - Protected
  @Get('orders/history')
  @UseGuards(JwtAuthGuard)
  getOrderHistory(@Request() req) {
    return this.ticketsService.getOrderHistory(req.user.id);
  }

  // Chi tiết đơn hàng - Protected
  @Get('orders/:orderId')
  @UseGuards(JwtAuthGuard)
  getOrderDetail(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Request() req,
  ) {
    return this.ticketsService.getOrderDetail(orderId, req.user.id);
  }

  // Thanh toán - Protected
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  checkout(@Body() dto: CheckoutDto, @Request() req) {
    return this.ticketsService.checkout(dto.orderId, req.user.id);
  }

  // ==================== Internal APIs ====================

  @Get('internal/promotion/:promotionId/total-used')
  getPromotionTotalUsed(@Param('promotionId', ParseIntPipe) promotionId: number) {
    return this.ticketsService.getPromotionTotalUsed(promotionId);
  }

  @Get('internal/promotion/:promotionId/total-discount')
  getPromotionTotalDiscount(@Param('promotionId', ParseIntPipe) promotionId: number) {
    return this.ticketsService.getPromotionTotalDiscount(promotionId);
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
  @UseGuards(JwtAuthGuard)
  findAll(@Query() filter: FilterTicketsDto) {
    return this.ticketsService.findAll(filter);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.ticketsService.getStats();
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  getTicketsByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.ticketsService.getTicketsByOrder(orderId);
  }

  @Post('scan')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  scanTicket(@Body() dto: ScanTicketDto) {
    return this.ticketsService.scanTicket(dto);
  }

  @Post('generate')
  @UseGuards(JwtAuthGuard)
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

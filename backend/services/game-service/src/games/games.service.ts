import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Game, GameStatus, AllowedTicket } from './entities/game.entity';
import { GameImage } from './entities/game-image.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { In } from 'typeorm';
import { isBase64Image, saveBase64Images } from './image-helper'; 

@Injectable()
export class GamesService {
  private readonly userServiceUrl: string;

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameImage)
    private readonly gameImageRepository: Repository<GameImage>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL') as string;
  }

  // Lấy tất cả games
  async findAll() {
    return this.gameRepository.find({
      relations: ['images'],
      order: { id: 'ASC' },
    });
  }

  // Lấy games theo status
  async getByStatus(status: GameStatus) {
    return this.gameRepository.find({
      where: { status },
      relations: ['images'],
      order: { id: 'ASC' },
    });
  }

  // Lấy game theo id
  async findById(id: number) {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  

async getByGate(gateType: AllowedTicket) {
  return this.gameRepository.find({
    where: {
      status: GameStatus.OPEN,
      allowedTicket: In([AllowedTicket.ALL, gateType]), // ✅ ĐÚNG — dùng In() cho danh sách nhiều giá trị
    },
    relations: ['images'],
    order: { id: 'ASC' },
  });
}

  // Tìm kiếm game theo tên
  async search(keyword: string) {
    return this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.images', 'images')
      .where('game.name LIKE :keyword', { keyword: `%${keyword}%` })
      .orderBy('game.id', 'ASC')
      .getMany();
  }

  // Tạo game mới
  async create(dto: CreateGameDto) {
    const queryRunner = this.gameRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const game = queryRunner.manager.create(Game, {
        name: dto.name,
        description: dto.description,
        recommendedAge: dto.recommendedAge,
        allowedTicket: dto.allowedTicket,
        status: dto.status,
      });

      const savedGame = await queryRunner.manager.save(Game, game);

      // Add images if provided - process base64 to files
      if (dto.images && dto.images.length > 0) {
        // Filter and save base64 images
        const savedImages = saveBase64Images(dto.images, 'game');

        for (let i = 0; i < savedImages.length; i++) {
          const gameImage = queryRunner.manager.create(GameImage, {
            gameId: savedGame.id,
            image: savedImages[i],
            sortOrder: i + 1,
          });
          await queryRunner.manager.save(GameImage, gameImage);
        }
      }

      await queryRunner.commitTransaction();
      return this.findById(savedGame.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Cập nhật game
  async update(id: number, dto: UpdateGameDto) {
    const queryRunner = this.gameRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const game = await queryRunner.manager.findOne(Game, {
        where: { id },
      });
      if (!game) {
        await queryRunner.rollbackTransaction();
        throw new NotFoundException('Game not found');
      }

      game.name = dto.name;
      if (dto.description !== undefined) game.description = dto.description;
      if (dto.recommendedAge !== undefined) game.recommendedAge = dto.recommendedAge;
      game.allowedTicket = dto.allowedTicket;
      game.status = dto.status;

      await queryRunner.manager.save(Game, game);

      // Replace images if provided
      if (dto.images && dto.images.length > 0) {
        // Get old images to return (for file deletion)
        const oldImages = await queryRunner.manager.find(GameImage, {
          where: { gameId: id },
        });

        // Delete old images
        await queryRunner.manager.delete(GameImage, { gameId: id });

        // Process and save new images
        const savedImages = saveBase64Images(dto.images, 'game');

        // Add new images
        for (let i = 0; i < savedImages.length; i++) {
          const gameImage = queryRunner.manager.create(GameImage, {
            gameId: id,
            image: savedImages[i],
            sortOrder: i + 1,
          });
          await queryRunner.manager.save(GameImage, gameImage);
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

  // Xóa game
  async delete(id: number) {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    // Get image filenames for deletion
    const imageFiles = game.images.map((img) => img.image);

    await this.gameRepository.delete(id);

    return { deleted: true, imageFiles };
  }

  // Đóng game
  async close(id: number) {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    game.status = GameStatus.CLOSE;
    return this.gameRepository.save(game);
  }

  // Mở lại game
  async open(id: number) {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    game.status = GameStatus.OPEN;
    return this.gameRepository.save(game);
  }

  // Thống kê feedback của game
  async getStats(gameId: number) {
    const result = await this.gameRepository.manager.query(
      `
      SELECT 
        COUNT(f.id) AS total_feedbacks,
        ROUND(AVG(f.rating), 1) AS avg_rating
      FROM feedbacks f
      WHERE f.game_id = ?
      `,
      [gameId],
    );
    return {
      totalFeedbacks: parseInt(result[0]?.total_feedbacks || '0'),
      avgRating: parseFloat(result[0]?.avg_rating || '0'),
    };
  }

  // Lấy danh sách feedback của game — gọi sang user-service lấy username, không JOIN SQL nữa
  async getFeedbacks(gameId: number) {
    const feedbacks = await this.gameRepository.manager.query(
      `
      SELECT f.id, f.user_id, f.content, f.rating, f.created_at
      FROM feedbacks f
      WHERE f.game_id = ?
      ORDER BY f.created_at DESC
      `,
      [gameId],
    );

    if (feedbacks.length === 0) return [];

    const userIds = [...new Set(feedbacks.map((f: any) => f.user_id))];

    let users: any[] = [];
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/users/internal/by-ids`, {
          params: { ids: userIds.join(',') },
        }),
      );
      users = data;
    } catch (error) {
      users = []; // nếu user-service lỗi, vẫn trả feedback nhưng thiếu username
    }

    const userMap = new Map(users.map((u) => [u.id, u.username]));

    return feedbacks.map((f: any) => ({
      id: f.id,
      content: f.content,
      rating: f.rating,
      createdAt: f.created_at,
      username: userMap.get(f.user_id) || 'Unknown',
    }));
  }

}

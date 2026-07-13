import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatus, AllowedTicket } from './entities/game.entity';
import { GameImage } from './entities/game-image.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(GameImage)
    private readonly gameImageRepository: Repository<GameImage>,
  ) {}

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

  // Lấy games theo loại vé cổng
  async getByGate(gateType: AllowedTicket) {
    return this.gameRepository.find({
      where: {
        status: GameStatus.OPEN,
        allowedTicket: [AllowedTicket.ALL, gateType] as any,
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

      // Add images if provided
      if (dto.images && dto.images.length > 0) {
        for (let i = 0; i < dto.images.length; i++) {
          const gameImage = queryRunner.manager.create(GameImage, {
            gameId: savedGame.id,
            image: dto.images[i],
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

        // Add new images
        for (let i = 0; i < dto.images.length; i++) {
          const gameImage = queryRunner.manager.create(GameImage, {
            gameId: id,
            image: dto.images[i],
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

  // Lấy danh sách feedback của game
  async getFeedbacks(gameId: number) {
    const result = await this.gameRepository.manager.query(
      `
      SELECT f.id, f.content, f.rating, f.created_at, u.username
      FROM feedbacks f
      JOIN users u ON f.user_id = u.id
      WHERE f.game_id = ?
      ORDER BY f.created_at DESC
      `,
      [gameId],
    );
    return result.map((row: any) => ({
      id: row.id,
      content: row.content,
      rating: row.rating,
      createdAt: row.created_at,
      username: row.username,
    }));
  }
}

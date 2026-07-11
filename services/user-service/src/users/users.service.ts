import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Tương ứng getAllUsers() trong PHP — chỉ lấy role=USER, không lấy password
  async findAll(status?: UserStatus) {
    const where: any = { role: UserRole.USER };
    if (status) where.status = status; // hỗ trợ filter theo trạng thái như nút lọc trên giao diện

    return this.userRepository.find({
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        created_at: true,
      },
      where,
      order: { created_at: 'DESC' },
    });
  }

  // Tương ứng getById() trong PHP
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy user id=${id}`);
    }
    return user;
  }

  // Tương ứng existsUsername() trong PHP — dùng nội bộ, ví dụ khi auth-service cần check
  async existsUsername(username: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { username } });
    return count > 0;
  }

  // Tương ứng updateStatus() — PHP cũ gọi hàm này nhưng chưa thấy code, viết bổ sung
  async updateStatus(id: number, status: UserStatus) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy user id=${id}`);
    }

    user.status = status;
    await this.userRepository.save(user);

    return { message: 'Cập nhật trạng thái thành công', id, status };
  }

  // Thêm các method này vào trong class UsersService, cùng các method cũ

  // Dùng cho LOGIN — cần lấy cả password để so sánh (findAll/findOne trước đó cố tình ẩn password)
  async findByUsernameWithPassword(username: string) {
    return this.userRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        email: true,
        role: true,
        status: true,
      },
    });
  }

  // Dùng cho FORGOT PASSWORD — khớp username + email
  async findByUsernameAndEmail(username: string, email: string) {
    return this.userRepository.findOne({
      where: { username, email },
    });
  }

  // Dùng cho REGISTER — kiểm tra email đã tồn tại chưa (PHP cũ có check riêng email)
  async existsEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
    return count > 0;
  }

  // Dùng cho REGISTER — tạo user mới
  async createUser(username: string, hashedPassword: string, email: string) {
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    });
    return this.userRepository.save(user);
  }

  // Dùng cho RESET PASSWORD
  async updatePassword(username: string, hashedPassword: string) {
    await this.userRepository.update(
      { username },
      { password: hashedPassword },
    );
    return { message: 'Đổi mật khẩu thành công' };
  }
}

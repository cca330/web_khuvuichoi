import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { randomBytes } from 'crypto';
import { fromBuffer } from 'file-type';
import { Throttle } from '@nestjs/throttler';
import { UploadAuthGuard } from './upload-auth.guard';

// Allowed image extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

@Controller('upload')
export class UploadController {
  @Post()
  @UseGuards(UploadAuthGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB/ảnh
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const mimeType = file.mimetype;

        // Check extension
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          cb(new BadRequestException(`Chỉ chấp nhận file ảnh: ${ALLOWED_EXTENSIONS.join(', ')}`), false);
          return;
        }

        // Check MIME type
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
          cb(new BadRequestException('File không đúng định dạng ảnh'), false);
          return;
        }

        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Không có file nào được gửi lên');

    const detected = await fromBuffer(file.buffer);
    if (!detected || !ALLOWED_MIME_TYPES.includes(detected.mime)) {
      throw new BadRequestException('Nội dung file không phải ảnh hợp lệ');
    }

    const uploadDirectory = join(process.cwd(), 'uploads');
    await mkdir(uploadDirectory, { recursive: true });

    const uniqueName = `${Date.now()}-${randomBytes(16).toString('hex')}${extname(`file.${detected.ext}`)}`;
    await writeFile(join(uploadDirectory, uniqueName), file.buffer, {
      flag: 'wx',
    });

    return { filename: uniqueName };
  }
}

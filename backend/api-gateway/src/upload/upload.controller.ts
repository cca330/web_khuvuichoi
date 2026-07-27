import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Allowed image extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Generate unique filename to prevent overwrites
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
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
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Không có file nào được gửi lên');
    return { filename: file.filename };
  }
}

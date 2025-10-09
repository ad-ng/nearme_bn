/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ImagesService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );
  }

  async uploadSingleImage(file: Express.Multer.File, fileName: string) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const bucketName = 'nearme';

    // Upload file buffer to Supabase
    const { error } = await this.supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new BadRequestException(`Supabase upload failed: ${error.message}`);
    }
  }

  async deleteImage(fileName: string) {
    if (!fileName) {
      throw new BadRequestException('File name is required');
    }

    const bucketName = 'nearme';

    const { error } = await this.supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      throw new BadRequestException(`Supabase delete failed: ${error.message}`);
    }

    return {
      message: 'File deleted successfully',
      fileName,
    };
  }

  async deleteManyImage(fileName: string[]) {
    if (!fileName) {
      throw new BadRequestException('File name is required');
    }

    const bucketName = 'nearme';

    const { error } = await this.supabase.storage
      .from(bucketName)
      .remove(fileName);

    if (error) {
      throw new BadRequestException(`Supabase delete failed: ${error.message}`);
    }

    return {
      message: 'File deleted successfully',
      fileName,
    };
  }
}

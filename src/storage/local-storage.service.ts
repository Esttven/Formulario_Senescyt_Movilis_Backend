import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { join, normalize, relative } from 'path';
import type { StoredFile, StorageService } from './storage.service';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly root: string;
  private readonly publicBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    this.root = config.get<string>('STORAGE_ROOT', 'storage');
    this.publicBaseUrl = config.get<string>('PUBLIC_BASE_URL', 'http://localhost:3008');
  }

  async store(file: Express.Multer.File, folder: string): Promise<StoredFile> {
    const extension = file.originalname.includes('.')
      ? file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase()
      : '';
    const key = `uploads/${folder}/${randomUUID()}${extension}`;
    const absolutePath = this.safePath(key);
    await mkdir(join(this.root, 'uploads', folder), { recursive: true });
    await writeFile(absolutePath, file.buffer);

    return {
      key,
      url: `${this.publicBaseUrl}/${key}`,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    };
  }

  async remove(keyOrUrl: string): Promise<void> {
    const key = this.keyFromUrl(keyOrUrl);
    if (!key) return;
    try {
      await unlink(this.safePath(key));
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') throw error;
    }
  }

  isManagedUrl(url: string): boolean {
    return this.keyFromUrl(url) !== null;
  }

  private keyFromUrl(keyOrUrl: string): string | null {
    let key = keyOrUrl;
    try {
      if (/^https?:\/\//i.test(keyOrUrl)) {
        const parsed = new URL(keyOrUrl);
        key = parsed.pathname.replace(/^\//, '');
      }
    } catch {
      return null;
    }
    if (!key.startsWith('uploads/')) return null;
    try {
      this.safePath(key);
      return key;
    } catch {
      return null;
    }
  }

  private safePath(key: string): string {
    const root = normalize(join(this.root));
    const target = normalize(join(root, key));
    const relativePath = relative(root, target);
    if (relativePath.startsWith('..') || relativePath.includes(':')) {
      throw new BadRequestException('Ruta de almacenamiento inválida');
    }
    return target;
  }
}

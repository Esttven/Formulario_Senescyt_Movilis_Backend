import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { StoredFile, StorageService } from './storage.service';

/** Adapter seam for S3/MinIO. Configure an SDK-backed implementation when STORAGE_DRIVER=s3. */
@Injectable()
export class S3StorageService implements StorageService {
  store(file: Express.Multer.File, folder: string): Promise<StoredFile> {
    void file;
    void folder;
    throw new ServiceUnavailableException('El almacenamiento S3/MinIO aún no está configurado');
  }

  remove(keyOrUrl: string): Promise<void> {
    void keyOrUrl;
    throw new ServiceUnavailableException('El almacenamiento S3/MinIO aún no está configurado');
  }

  isManagedUrl(url: string): boolean {
    void url;
    return false;
  }
}

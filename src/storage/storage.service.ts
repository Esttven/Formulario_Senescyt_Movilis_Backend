export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export interface StoredFile {
  url: string;
  key: string;
  mimeType: string;
  sizeBytes: number;
}

export interface StorageService {
  store(file: Express.Multer.File, folder: string): Promise<StoredFile>;
  remove(keyOrUrl: string): Promise<void>;
  isManagedUrl(url: string): boolean;
}

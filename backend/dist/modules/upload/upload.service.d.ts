import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    constructor(configService: ConfigService);
    validateFile(file: Express.Multer.File): boolean;
    uploadFile(file: Express.Multer.File, folder: string): Promise<{
        url: string;
        key: string;
    }>;
    private uploadToS3;
}

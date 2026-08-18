import { OnModuleInit } from '@nestjs/common';
export declare class UploadController implements OnModuleInit {
    private uploadDir;
    private modelDir;
    private markerDir;
    onModuleInit(): void;
    uploadModel(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadMarker(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    getModel(filename: string, res: any): any;
    getMarker(filename: string, res: any): any;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = require("fs");
const path = require("path");
let UploadService = class UploadService {
    constructor(configService) {
        this.configService = configService;
    }
    validateFile(file) {
        if (file.size > 10 * 1024 * 1024) {
            return false;
        }
        const allowedMimeTypes = [
            'model/gltf-binary',
            'model/gltf+json',
            'image/jpeg',
            'image/png',
            'image/webp',
        ];
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.glb', '.gltf', '.jpg', '.jpeg', '.png', '.webp'];
        return allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext);
    }
    async uploadFile(file, folder) {
        const useS3 = this.configService.get('USE_S3') === 'true';
        if (useS3) {
            return this.uploadToS3(file, folder);
        }
        const uploadDir = path.join(process.cwd(), 'uploads', folder);
        console.log('Upload directory:', uploadDir);
        console.log('File path:', file.path);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('Created upload directory');
        }
        const filename = path.basename(file.path);
        const destPath = path.join(uploadDir, filename);
        try {
            fs.renameSync(file.path, destPath);
            console.log('File moved to:', destPath);
        }
        catch (err) {
            console.error('Failed to move file:', err);
            fs.copyFileSync(file.path, destPath);
            fs.unlinkSync(file.path);
            console.log('File copied to:', destPath);
        }
        const appUrl = this.configService.get('APP_URL') || 'http://localhost:3001';
        const url = `${appUrl}/api/uploads/${folder}/${filename}`;
        return { url, key: `${folder}/${filename}` };
    }
    async uploadToS3(file, folder) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        const key = `${folder}/${filename}`;
        const cdnUrl = this.configService.get('CDN_URL') || 'https://your-cdn.com';
        const url = `${cdnUrl}/${key}`;
        return { url, key };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map
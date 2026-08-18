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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const fs_1 = require("fs");
const path_2 = require("path");
let UploadController = class UploadController {
    constructor() {
        this.uploadDir = (0, path_2.join)(process.cwd(), 'uploads');
        this.modelDir = (0, path_2.join)(this.uploadDir, 'models');
        this.markerDir = (0, path_2.join)(this.uploadDir, 'markers');
    }
    onModuleInit() {
        if (!(0, fs_1.existsSync)(this.uploadDir)) {
            (0, fs_1.mkdirSync)(this.uploadDir, { recursive: true });
        }
        if (!(0, fs_1.existsSync)(this.modelDir)) {
            (0, fs_1.mkdirSync)(this.modelDir, { recursive: true });
        }
        if (!(0, fs_1.existsSync)(this.markerDir)) {
            (0, fs_1.mkdirSync)(this.markerDir, { recursive: true });
        }
    }
    async uploadModel(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        return {
            url: `http://localhost:3001/api/uploads/models/${file.filename}`,
            filename: file.filename,
        };
    }
    async uploadMarker(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        return {
            url: `http://localhost:3001/api/uploads/markers/${file.filename}`,
            filename: file.filename,
        };
    }
    getModel(filename, res) {
        const filePath = (0, path_2.join)(this.uploadDir, 'models', filename);
        if ((0, fs_1.existsSync)(filePath)) {
            return res.sendFile(filePath);
        }
        throw new common_1.BadRequestException('File not found');
    }
    getMarker(filename, res) {
        const filePath = (0, path_2.join)(this.uploadDir, 'markers', filename);
        if ((0, fs_1.existsSync)(filePath)) {
            return res.sendFile(filePath);
        }
        throw new common_1.BadRequestException('File not found');
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('model'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const modelDir = (0, path_2.join)(process.cwd(), 'uploads', 'models');
                cb(null, modelDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `model-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const ext = (0, path_1.extname)(file.originalname).toLowerCase();
            if (['.glb', '.gltf'].includes(ext)) {
                cb(null, true);
            }
            else {
                cb(new Error('Only .glb and .gltf files are allowed'), false);
            }
        },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload 3D model file (.glb, .gltf)' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadModel", null);
__decorate([
    (0, common_1.Post)('marker'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const markerDir = (0, path_2.join)(process.cwd(), 'uploads', 'markers');
                cb(null, markerDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `marker-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const ext = (0, path_1.extname)(file.originalname).toLowerCase();
            if (['.mind', '.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                cb(null, true);
            }
            else {
                cb(new Error('Only .mind target files and marker preview images are allowed'), false);
            }
        },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload MindAR target (.mind) or marker preview image' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadMarker", null);
__decorate([
    (0, common_1.Get)('models/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "getModel", null);
__decorate([
    (0, common_1.Get)('markers/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "getMarker", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload'),
    (0, common_1.Controller)('upload')
], UploadController);
//# sourceMappingURL=upload.controller.js.map
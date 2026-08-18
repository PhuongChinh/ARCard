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
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const QRCode = require("qrcode");
const config_1 = require("@nestjs/config");
let CardsService = class CardsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async create(createCardDto, userId) {
        const appUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
        const arUrl = `${appUrl}/ar?id=`;
        const card = await this.prisma.card.create({
            data: createCardDto,
        });
        const qrCodeDataUrl = await QRCode.toDataURL(`${arUrl}${card.id}`, {
            width: 300,
            margin: 2,
        });
        return this.prisma.card.update({
            where: { id: card.id },
            data: { qrCode: qrCodeDataUrl },
        });
    }
    async findAll() {
        return this.prisma.card.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const card = await this.prisma.card.findUnique({
            where: { id },
        });
        if (!card) {
            throw new common_1.NotFoundException(`Card with ID ${id} not found`);
        }
        return card;
    }
    async update(id, updateCardDto) {
        await this.findOne(id);
        return this.prisma.card.update({
            where: { id },
            data: updateCardDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.card.delete({
            where: { id },
        });
    }
    async incrementScanCount(id) {
        await this.findOne(id);
        return this.prisma.card.update({
            where: { id },
            data: { scanCount: { increment: 1 } },
        });
    }
    async generateQrCode(id) {
        const card = await this.findOne(id);
        const appUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
        const qrCodeDataUrl = await QRCode.toDataURL(`${appUrl}/ar?id=${id}`, {
            width: 300,
            margin: 2,
        });
        return { qrCode: qrCodeDataUrl, url: `${appUrl}/ar?id=${id}` };
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], CardsService);
//# sourceMappingURL=cards.service.js.map
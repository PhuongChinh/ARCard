import { PrismaService } from '../../prisma/prisma.service';
import { CreateCardDto, UpdateCardDto } from './dto/card.dto';
import { ConfigService } from '@nestjs/config';
export declare class CardsService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    create(createCardDto: CreateCardDto, userId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        markerImage: string;
        targetModel: string;
        modelScale: number;
        zoomLimit: number;
        isActive: boolean;
        qrCode: string | null;
        scanCount: number;
    }>;
    findAll(): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        markerImage: string;
        targetModel: string;
        modelScale: number;
        zoomLimit: number;
        isActive: boolean;
        qrCode: string | null;
        scanCount: number;
    }[]>;
    findOne(id: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        markerImage: string;
        targetModel: string;
        modelScale: number;
        zoomLimit: number;
        isActive: boolean;
        qrCode: string | null;
        scanCount: number;
    }>;
    update(id: string, updateCardDto: UpdateCardDto): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        markerImage: string;
        targetModel: string;
        modelScale: number;
        zoomLimit: number;
        isActive: boolean;
        qrCode: string | null;
        scanCount: number;
    }>;
    remove(id: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        markerImage: string;
        targetModel: string;
        modelScale: number;
        zoomLimit: number;
        isActive: boolean;
        qrCode: string | null;
        scanCount: number;
    }>;
    incrementScanCount(id: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        markerImage: string;
        targetModel: string;
        modelScale: number;
        zoomLimit: number;
        isActive: boolean;
        qrCode: string | null;
        scanCount: number;
    }>;
    generateQrCode(id: string): Promise<{
        qrCode: string;
        url: string;
    }>;
}

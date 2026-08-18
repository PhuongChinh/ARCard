export declare class CreateCardDto {
    title: string;
    description?: string;
    markerImage: string;
    targetModel: string;
    modelScale?: number;
    zoomLimit?: number;
    isActive?: boolean;
}
export declare class UpdateCardDto {
    title?: string;
    description?: string;
    markerImage?: string;
    targetModel?: string;
    modelScale?: number;
    zoomLimit?: number;
    isActive?: boolean;
}

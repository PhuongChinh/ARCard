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
exports.UpdateCardDto = exports.CreateCardDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCardDto {
}
exports.CreateCardDto = CreateCardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My AR Card' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'A beautiful AR card description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://localhost:3001/api/uploads/markers/image.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_tld: false }),
    __metadata("design:type", String)
], CreateCardDto.prototype, "markerImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://localhost:3001/api/uploads/models/model.glb' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_tld: false }),
    __metadata("design:type", String)
], CreateCardDto.prototype, "targetModel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1.0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0.1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateCardDto.prototype, "modelScale", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2.0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0.5),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateCardDto.prototype, "zoomLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCardDto.prototype, "isActive", void 0);
class UpdateCardDto {
}
exports.UpdateCardDto = UpdateCardDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'My AR Card' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCardDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'A beautiful AR card description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCardDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'http://localhost:3001/api/uploads/markers/image.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_tld: false }),
    __metadata("design:type", String)
], UpdateCardDto.prototype, "markerImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'http://localhost:3001/api/uploads/models/model.glb' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_tld: false }),
    __metadata("design:type", String)
], UpdateCardDto.prototype, "targetModel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1.0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0.1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateCardDto.prototype, "modelScale", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2.0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0.5),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], UpdateCardDto.prototype, "zoomLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCardDto.prototype, "isActive", void 0);
//# sourceMappingURL=card.dto.js.map
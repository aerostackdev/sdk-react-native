"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
class StorageService {
    constructor(apiKey, baseUrl) {
        this.apiClient = axios_1.default.create({
            baseURL: baseUrl,
            headers: {
                'X-Aerostack-Key': apiKey
            }
        });
    }
    upload(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            formData.append('file', data.file);
            formData.append('key', data.key);
            if (data.contentType) {
                formData.append('contentType', data.contentType);
            }
            const response = yield this.apiClient.post('/storage/upload', formData, {
                headers: Object.assign({}, formData.getHeaders())
            });
            return response.data;
        });
    }
}
exports.StorageService = StorageService;

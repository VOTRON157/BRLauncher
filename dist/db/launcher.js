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
const index_1 = require("./index");
const os_1 = __importDefault(require("os"));
const appdata_path_1 = __importDefault(require("appdata-path"));
const shelljs_1 = __importDefault(require("shelljs"));
const javaPath = shelljs_1.default.exec("where java");
class Launcher {
    update(path, min, max, width, height) {
        return __awaiter(this, void 0, void 0, function* () {
            const newData = yield index_1.prisma.launcher.update({
                where: {
                    id: 1
                },
                data: {
                    path,
                    min,
                    max,
                    width,
                    height
                }
            });
            return newData;
        });
    }
    resetConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.config()) {
                yield index_1.prisma.launcher.update({
                    where: {
                        id: 1
                    },
                    data: {
                        path: (0, appdata_path_1.default)('.minecraft'),
                        min: 1024,
                        max: Math.round(((os_1.default.totalmem() / (1024 ** 2))) / 2),
                        width: 1000,
                        height: 600,
                        javaPath: javaPath
                    }
                });
            }
            else {
                yield index_1.prisma.launcher.create({
                    data: {
                        path: (0, appdata_path_1.default)('.minecraft'),
                        min: 1024,
                        max: Math.round(((os_1.default.totalmem() / (1024 ** 2))) / 2),
                        width: 1000,
                        height: 600,
                        javaPath: javaPath
                    }
                });
            }
        });
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield index_1.prisma.launcher.findUnique({
                where: {
                    id: 1
                }
            });
            return data;
        });
    }
}
exports.default = new Launcher();

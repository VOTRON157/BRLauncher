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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
class Account {
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield index_1.prisma.account.update({
                where: {
                    id: id
                },
                data,
            });
            return account;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAccount = yield index_1.prisma.account.create({
                data: {
                    access_token: data.access_token,
                    client_token: data.client_token,
                    uuid: data.uuid,
                    user_properties: JSON.stringify(data.user_properties),
                    meta: JSON.stringify(data.meta),
                    name: data.name,
                    selected: false
                }
            });
            return createdAccount;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedAccount = yield index_1.prisma.account.delete({
                where: {
                    id: id
                }
            });
            return deletedAccount;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield index_1.prisma.account.findUnique({
                where: {
                    id: id,
                }
            });
            return account;
        });
    }
    getAtual() {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield index_1.prisma.account.findFirst({
                where: {
                    selected: true
                }
            });
            return account;
        });
    }
    accounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield index_1.prisma.account.findMany({});
            return accounts;
        });
    }
}
exports.default = new Account();

import { prisma } from "./index"
import { AccountCreate } from "../interfaces/launcher"

class Account {

    async update(id: number, data: object){
        const account = await prisma.account.update({
          where: {
            id: id
          },
          data,
        })
        return account
    }

    async create(data: AccountCreate) {
        const createdAccount = await prisma.account.create({
            data: {
                access_token: data.access_token,
                client_token: data.client_token,
                uuid: data.uuid,
                user_properties: JSON.stringify(data.user_properties),
                meta: JSON.stringify(data.meta),
                name: data.name,
                selected: false
            }
        })
        return createdAccount
    }

    async delete(id: number){
        const deletedAccount = await prisma.account.delete({
            where: {
                id: id
            }
        })
        return deletedAccount
    }

    async getById(id: number){
        const account = await prisma.account.findUnique({
            where: {
                id: id,
            }
        })
        return account
    }

    async getAtual(){
        const account = await prisma.account.findFirst({
            where: {
                selected: true
            }
        })
        return account
    }
    async accounts(){
        const accounts = prisma.account.findMany({})
        return accounts
    }
}

export default new Account()
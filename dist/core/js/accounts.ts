import { PageBase } from "../base.js";
import { Mojang } from "minecraft-java-core";
import { AccountCreate } from "../../interfaces/launcher.js";
import Account from "../../db/account.js";

class AccountsPage extends PageBase {
    constructor() {
        super({
            pageName: 'accounts'
        })
        console.log("[CLIENT SIDE] GERENCIADOR DE CONTAS CARREGADO")
    }

    async init() {
        await this.listAccounts()
        this.openNewaccMenu()
        this.closeNewaccMenu()
        this.createAccount()
    }


    async selectAccount(id: number) {
        const atual = await Account.getAtual()

        await Account.update(atual?.id as number, {
            selected: false
        })

        const upacc = await Account.update(id, {
            selected: true
        })

        const sideUsername = document.getElementById('side-username') as HTMLElement
        sideUsername.innerHTML = upacc.name
    }

    async deleteAccount(id: number, div: HTMLDivElement, removeBtn?: HTMLButtonElement) {
        try {
            const acc = await Account.getById(id)
            if(acc?.selected) return this.notification('Você não pode remover a conta que você está usando')
            const lengthacc = await Account.accounts()
            if(!lengthacc) {
                const sideUsername = document.getElementById('side-username') as HTMLElement
                sideUsername.innerHTML = 'Não logado'
            }
            const list = document.getElementById('acc-list') as HTMLElement
            if(list.contains(div)) list.removeChild(div)
            else {
                const div2 = document.getElementById(`${id}_div`)
                div2?.remove()
            }
            await Account.delete(id)   
        } catch (e){
            this.notification('Algo deu errado ' + e)
        }
        
    }

    async updateList(name: string, id: number) {
        const list = document.getElementById('acc-list') as HTMLElement
        const div = this.returnAccountCard(name, id)
        list.insertBefore(div, list.lastChild)
        const selecBtn = document.getElementById(`${id}_add`) as HTMLButtonElement;
        selecBtn.addEventListener("click", async () => await this.selectAccount(id));
        const removeBtn = document.getElementById(`${id}_remove`) as HTMLButtonElement;
        removeBtn.addEventListener("click", async () => await this.deleteAccount(id, div, removeBtn));
    }
    async listAccounts() {

        const oldList = document.getElementById('acc-list') as HTMLElement
        const accounts = await Account.accounts()
        if (!accounts.length) oldList.innerHTML += '<p>Ops você não tem nenhuma conta adicionada 😭</p>'
        for (let account of accounts) {
            const list = document.getElementById('acc-list') as HTMLElement
            const card = this.returnAccountCard(account.name, account.id)
            list.appendChild(card)
            const checkExist = setInterval(() => {
                const selecBtn = document.getElementById(`${account.id}_add`) as HTMLButtonElement;
                const removeBtn = document.getElementById(`${account.id}_remove`) as HTMLButtonElement;
                if (selecBtn && removeBtn) {
                    selecBtn.addEventListener("click", async () => await this.selectAccount(account.id));
                    removeBtn.addEventListener("click", async () => await this.deleteAccount(account.id, card));
                    clearInterval(checkExist);
                } else console.log('Prourando conta')
            }, 100);

        }
        oldList.innerHTML += `<div>
        <button id="add-acc" class="play-btn"><span class="material-icons mr-1">create_new_folder</span> Adicionar conta</button>
    </div>`
    }

    private returnAccountCard(name: string, id: number) {
        const div = document.createElement('div')
        div.classList.add('flex', 'flex-col', 'bg-zinc-900', 'shadow-sm', 'p-2', 'w-96', 'gap-y-3', 'rounded', 'hover:scale-105', 'duration-200')
        div.id = `${id}_div`
        const content = `
        <div class="flex gap-x-3">
            <img src="../core/imgs/vanilla.png" width="50">
            <div class="flex flex-col">
                <p id="acc-username">${name}</p>
                <p class="text-xs mb-2">Conta local</p>
            </div>
        </div>
        <div class="flex gap-2">
            <button class="text-xs bg-green-500 py-0.5 px-1 flex items-center" id="${id}_add"><span class="material-icons mr-1">done</span> Escolher conta</button>
            <button class="text-xs bg-red-500 py-0.5 px-1 flex items-center" id="${id}_remove"><span class="material-icons mr-1" >remove_circle</span> Remover conta</button>
        </div>
        `
        div.innerHTML += content
        return div
    }

    openNewaccMenu() {
        const activebtn = document.getElementById('add-acc') as HTMLButtonElement
        activebtn.addEventListener('click', () => {
            const menu = document.getElementById('acc-menu') as HTMLElement
            menu.classList.add('flex')
            menu.classList.remove('hidden')
        })
    }

    closeNewaccMenu() {
        const closebtn = document.getElementById('close-menu') as HTMLButtonElement
        closebtn.addEventListener('click', () => {
            const menu = document.getElementById('acc-menu') as HTMLElement
            menu.classList.add('hidden')
            menu.classList.remove('flex')
        })
    }

    async createAccount() {
        const createbtn = document.getElementById('create-btn') as HTMLButtonElement
        createbtn.addEventListener('click', async () => {
            const username = (document.getElementById('new-acc-username') as HTMLInputElement).value
            if (!username) return this.notification('Escreva algo!')
            const auth = await Mojang.login(username) as AccountCreate
            if (!auth) return;
            Account.create(auth)
                .then(async data => {
                    const atual = await Account.getAtual()
                    if (!atual) {
                        Account.update(data.id, {
                            selected: true
                        })
                        const sideUsername = document.getElementById('side-username') as HTMLElement
                        sideUsername.innerHTML = data.name
                    }
                    this.updateList(data.name, data.id)
                    this.notification('Conta criada!')
                })
                .catch(e => this.notification("Não foi possivel criar sua conta, tente novamente executando o BRLauncher como administrador."))
            const menu = document.getElementById('acc-menu') as HTMLElement
            menu.classList.add('hidden')
            menu.classList.remove('flex')
        })
    }

}

export {
    AccountsPage
}
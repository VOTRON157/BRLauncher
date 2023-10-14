// Arquivo necessario para criar o executavel (.exe) desse programa :)
// Esse arquivo não é necessario em nenhum outro arquivo e pode ser ignorado na compilação do typescript
// Para rodar esse arquivo use: npx ts-node src/build-installer

import { MSICreator } from "electron-wix-msi"
import config from "./config"
import path from "path"
import { exec } from "child_process"

console.log('Limpando banco de dados para produção... 🚯')
exec('npx prisma migrate reset --force', () => {
    console.log('Banco de dados limpo, iniciando a compilação. 💿')
    const APP_DIR = path.resolve(process.cwd(), './build/BRLauncher-win32-x64');
    const OUT_DIR = path.resolve(process.cwd(), './windows_installer');

    const msiCreator = new MSICreator({
        icon: './src/core/imgs/icons/icon.ico',
        arch: 'x64',
        language: 1046,
        appDirectory: APP_DIR,
        outputDirectory: OUT_DIR,
        description: config.app_des,
        exe: config.app_name,
        name: config.app_name,
        manufacturer: 'VOTRON157',
        version: '1.0.2',
        ui: {
            chooseDirectory: true
        },
    });

    msiCreator.create().then(() => msiCreator.compile());
})
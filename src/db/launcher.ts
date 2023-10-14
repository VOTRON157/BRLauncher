import { prisma } from "./index";
import os from 'os'
import getAppDataPath from "appdata-path";
import shell from "shelljs";

const javaPath = shell.exec("where java")

class Launcher {
    async update(path: string, min: number, max: number, width: number, height: number){
        const newData = await prisma.launcher.update({
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
        })
        return newData
    }

    async resetConfig() {
        if (await this.config()) {
            await prisma.launcher.update({
                where: {
                    id: 1
                },
                data: {
                    path: getAppDataPath('.minecraft'),
                    min: 1024,
                    max: Math.round(((os.totalmem() / (1024 ** 2))) / 2),
                    width: 1000,
                    height: 600,
                    javaPath: javaPath
                }
            })
        } else {
            await prisma.launcher.create({
                data: {
                    path: getAppDataPath('.minecraft'),
                    min: 1024,
                    max: Math.round(((os.totalmem() / (1024 ** 2))) / 2),
                    width: 1000,
                    height: 600,
                    javaPath: javaPath
                }
            })
        }
    }

    async config() {
        const data = await prisma.launcher.findUnique({
            where: {
                id: 1
            }
        })
        return data
    }
}

export default new Launcher()
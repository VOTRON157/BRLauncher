import { build } from "electron-builder"
import config from "./config"

build({
    config: {
        asar: true,
        productName: config.app_name,
        appId: config.app_name,
        copyright: 'Copyright © 2023 VOTRON157',
        directories: {
            output: 'build'
        },
        compression: 'maximum',
        artifactName: '${os}.${ext}',
        extraFiles: [],
        files: ['**/*'],
        win: {
            icon: 'core/imgs/icon.ico',
            target: {
                target: 'nsis',
                arch: ['x64']
            }
        },
        nsis: {
            oneClick: false,
            perMachine: true,
            allowToChangeInstallationDirectory: true,
            createDesktopShortcut: true,
            createStartMenuShortcut: true,
            runAfterFinish: true
        }
    }
})
.then(build => {
    console.log('buildado mermão')
})
.catch(e => {
    console.log(e)
})
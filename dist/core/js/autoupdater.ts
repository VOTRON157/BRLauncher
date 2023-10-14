import { createWriteStream } from "node:fs";
import { Events } from "../../interfaces/launcher";
import semver from "semver"
import EventEmitter from "events"
import TypedEmitter from "typed-emitter";
import decompress from "decompress";
import { exec } from "node:child_process";


class AutoUpdater extends (EventEmitter as new () => TypedEmitter<Events>) {
  constructor() {
    super()
    console.log("[CLIENT SIDE] O AUTOUPDATER FOI INICIALIZADO")
    this.checkForUpdates()
  }

  checkForUpdates() {
    console.log("Alou?")
    fetch("https://raw.githubusercontent.com/VOTRON157/BRLauncher/main/package.json")
      .then((res) => res.json())
      .then(async (json) => {
        if (semver.lt(process.env.npm_package_version as string, json.version)) this.emit("update-found")
        else this.emit("update-notavaliable")
      });
  }

  async downloadNewVersion() {

    this.emit("downloading-zip")
    const newVersion = "https://github.com/VOTRON157/BRLauncher/archive/refs/heads/main.zip";
    const data = await fetch(newVersion);
    const buffer = Buffer.from(await (await data.blob()).arrayBuffer());

    exec("mkdir updater", () => {
      this.emit("unpacking")

      const writeStream = createWriteStream("updater/brlauncher.zip")
      writeStream.write(buffer)
      writeStream.end()
      writeStream.on("finish", () => {
        decompress("updater/brlauncher.zip", "updater/brlauncher")
          .then(() => {
            this.emit("copy")

            exec("xcopy updater\\brlauncher\\BRLauncher-main\\* . /E /I /H /Y", 
            () => exec("rd /s /q updater",
            () => this.emit("finished")))
          })
      })
    })
  }
}


/* const testefoda = new AutoUpdater()

 testefoda.on("update-notavaliable", () => {
  console.log("Não tem nada pra baixar :(")
})

testefoda.on("update-found", async () => {
  console.log("Update encontrado deseja atualizar?")
  await testefoda.downloadNewVersion()
})

testefoda.on("downloading-zip", () => {
  console.log("Baixando .zip da atualização")
})

testefoda.on("unpacking", () => {
  console.log("Descompactando recursos")
})

testefoda.on("copy", () => {
  console.log("copiando recursos")
})

testefoda.on("finished", () => {
  console.log("Atualização concluida! reiniciando o launcher")
}) */

export {
  AutoUpdater
}

// sim eu fiz isso kkkk, eu não achei nenhum pacote que funcionase 
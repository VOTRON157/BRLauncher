import client from "discord-rich-presence";
import config from "./config";

const discord_client = client(config.discord_app_id);

export class DiscordStatusManager {
    initDate: number
    constructor(){
        this.initDate = Date.now()
    }
    setStatusPage(page: string) {
        discord_client.updatePresence({
            details: `Ainda não iniciou o Minecraft`,
            state: page,
            startTimestamp: this.initDate,
            largeImageKey: "brlauncher",
            instance: false,
        })
    }
    setPlaying(version: string) {
        console.log(version)
        discord_client.updatePresence({
            details: `Minecraft ${version.split(" ")[1]}`,
            state: `Jogando Minecraft ${version.split(" ")[0].replace('fabric', 'Fabric (Modded)').replace('forge', 'Forge (Modded)').replace('vanilla', "Vanilla")}`,
            startTimestamp: this.initDate,
            largeImageKey: "brlauncher",
            instance: false,
        })
    }
}
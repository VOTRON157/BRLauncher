"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordStatusManager = void 0;
const discord_rich_presence_1 = __importDefault(require("discord-rich-presence"));
const config_js_1 = __importDefault(require("../../config.js"));
const discord_client = (0, discord_rich_presence_1.default)(config_js_1.default.discord_app_id);
class DiscordStatusManager {
    constructor() {
        console.log("[CLIENT SIDE] STATUS DO DISCORD CARREGADO");
        this.initDate = Date.now();
    }
    setStatusPage(page) {
        discord_client.updatePresence({
            details: `Ainda não iniciou o Minecraft`,
            state: page,
            startTimestamp: this.initDate,
            largeImageKey: "brlauncher",
            instance: false,
        });
    }
    setPlaying(version) {
        console.log(version);
        discord_client.updatePresence({
            details: `Minecraft ${version.split(" ")[1]}`,
            state: `Jogando Minecraft ${version.split(" ")[0].replace('fabric', 'Fabric (Modded)').replace('forge', 'Forge (Modded)').replace('vanilla', "Vanilla")}`,
            startTimestamp: this.initDate,
            largeImageKey: "brlauncher",
            instance: false,
        });
    }
}
exports.DiscordStatusManager = DiscordStatusManager;

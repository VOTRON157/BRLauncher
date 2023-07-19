import { ipcRenderer } from "electron";

export default () => {
  window.addEventListener("DOMContentLoaded", async () => {
    const minimize = document.getElementById("minimize") as HTMLElement;
    const maxmize = document.getElementById("maxmize") as HTMLElement;
    const close = document.getElementById("close") as HTMLElement;
    const configButton = document.getElementById("config") as HTMLButtonElement;
    minimize.addEventListener("click", () => ipcRenderer.invoke("minimize"));
    close.addEventListener("click", () => window.close());
    maxmize.addEventListener("click", () => ipcRenderer.invoke("maxmize"));
    configButton.addEventListener("click", () => ipcRenderer.invoke("config"));
  });
};

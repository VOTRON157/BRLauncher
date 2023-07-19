import { join } from "path"

(async () => {
    const { default: core } = await import(join(__dirname, "core", "index").replace("views", "services"))
    const { default: launcher } = await import(join(__dirname, "launcher").replace("views", "services"))
    core()
    launcher()
})()
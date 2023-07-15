export interface Startlauncher {
    version: string,
    username: string,
    password?: string
    maxMemory: string
    minMemory: string
}

export interface MineAPI {
    lastet: {
        release: string
        snapshot: string
    }
    versions: version[]
}

type version = {
    id: string
    type: string
    url: string
    time: string
    releaseTime: string
    sha1: string
    compilanceLevel: number
}

export interface Cache {
    usernames: string[]
}
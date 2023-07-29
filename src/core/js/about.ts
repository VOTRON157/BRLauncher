import { PageBase } from "../base.js";

class AboutPage extends PageBase {
    constructor() {
        super({
            pageName: 'about'
        })
    }

    async init() {
        console.log('Bom, essa página não tem scripts :)')
    }
}

export {
    AboutPage
}
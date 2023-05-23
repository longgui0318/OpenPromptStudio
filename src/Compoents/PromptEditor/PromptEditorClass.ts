import { PromptWork } from "./Sub/PromptWork"

export const LOCAL_TRANSLATE_SERVER = process.env.LOCAL_TRANSLATE_HOST
    ? `${
          process.env.LOCAL_TRANSLATE_HOST.startsWith("http")
              ? process.env.LOCAL_TRANSLATE_HOST
              : "//" + process.env.LOCAL_TRANSLATE_HOST
      }/prompt-studio`
    : "http://localhost:39011/prompt-studio"



export class PromptEditorClass {
    data = {
        server: location.host.startsWith("moonvy.com")
            ? "https://indexfs.moonvy.com:19213/prompt-studio"
            : LOCAL_TRANSLATE_SERVER,
        enablePngExportFixed: false,
        enablePngExportCopy: false,
        enableAutoSave: true,
    }

    works: PromptWork[]
    addWorkspace() {
        this.works.push(new PromptWork())
        this.saveWorkspace()
    }
    saveWorkspace(force = true) {
        if (!force && !this.data.enableAutoSave) return
        //保存 this.works 到 localStorage

        if (this.works && this.works.length>0){
            let data = []
            for (let item of this.works){
                data.push({initText:item.exportPrompts(),parser:item.data.parser,name:item.data.name,id:item.data.id})
            }
            localStorage.setItem("prompt-editor-data", JSON.stringify(data))
        }
    }
    removeWorkspace(promptWork: PromptWork) {
        this.works = this.works.filter((item) => item !== promptWork)
    }

    constructor(options?: { initPrompts?: string[] }) {        
        if (options?.initPrompts) {
            this.works = options.initPrompts.map((initText) => new PromptWork({ initText }))
        } else {
            //通过localStorage获取数据
            let data = []
            try {
                let cache = localStorage.getItem("prompt-editor-data");
                if (cache)
                    data = JSON.parse(cache)
            } catch (e) {
                console.error(e)
            }
            this.works = []
            if (data.length) {
                for (let item of data){
                    this.works.push(new PromptWork({initText:item.initText,parser:item.parser,name:item.name && "工作区",id:item.id}))
                }
            } else{
                this.works = [
                    new PromptWork({
                        // initText: `symmetrical,(PureErosFace_V1:0.8), [:(highly detail face: 1.2):0.1],[to:when],[from::when], [[df]], (((twintails))), <lora:koreanDollLikeness_v10:0.5>`,
                        parser: "stable-diffusion-webui",
                    }),
                ]
            }
        }
    }
}

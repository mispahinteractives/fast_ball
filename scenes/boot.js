export default class Boot extends Phaser.Scene {

    width = null
    height = null
    handlerScene = null
    sceneStopped = false

    constructor() {
        super({ key: 'boot' })
    }

    init (){
    }

    preload() {
        // Images
        //this.load.image('Intro_Instuction', 'assets/Intro_Instuction.png');
       
    }

    create() {

       
       this.scene.stop('boot');
       this.scene.launch('preload');
    }
}

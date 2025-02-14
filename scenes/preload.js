export default class Preload extends Phaser.Scene {

    width = null
    height = null
    handlerScene = null
    sceneStopped = false

    constructor() {
        super({ key: 'preload' })
    }

    init() {

        //  Inject our CSS
        var element = document.createElement('style');

        document.head.appendChild(element);

        var sheet = element.sheet;

        var styles1 = '@font-face { font-family: "PepsiOwners_Regular"; src: url("fonts/PepsiOwners_Regular.ttf") format("truetype"); }\n';
        var styles2 = '@font-face { font-family: "PepsiOwners_Extended"; src: url("fonts/PepsiOwners_Extended.ttf") format("truetype"); }\n';
        var styles3 = '@font-face { font-family: "UberMoveMedium"; src: url("fonts/UberMoveMedium.otf") format("opentype"); }\n';

        sheet.insertRule(styles1, 0);
        sheet.insertRule(styles2, 0);
        sheet.insertRule(styles3, 0);

    }

    preload() {
        // Images
        this.load.image('bg', 'assets/bg.png');
        this.load.atlas('sheet', 'assets/sheet.png', 'assets/sheet.json');

        this.load.script('webfont', 'lib/webfont.js');
        this.load.plugin('rextagtextplugin', 'lib/rextagtextplugin.min.js', true);
        // this.load.audio('bgm','sounds/bgm.mp3');
        // this.load.audio('win','sounds/win.mp3');

        //---------------------------------------------------------------------->

        this.canvasWidth = this.sys.game.canvas.width
        this.canvasHeight = this.sys.game.canvas.height

        this.width = this.game.screenBaseSize.width
        this.height = this.game.screenBaseSize.height

        this.sceneStopped = false


        this.load.on('progress', (value) => {

        })

        this.load.on('complete', () => {

        })
    }

    create() {

        this.firstTime = false;
        let _this = this;
        WebFont.load({

            custom: {
                families: ['PepsiOwners_Regular', 'PepsiOwners_Extended', 'UberMoveMedium']

            },
            active: function() {

                _this.scene.stop('preload');
                _this.scene.launch('GameScene');
            }
        });
    }
}
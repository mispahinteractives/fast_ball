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

        var styles1 = '@font-face { font-family: "UberMoveMedium"; src: url("fonts/UberMoveMedium.otf") format("opentype"); }\n';

        sheet.insertRule(styles1, 0);

    }

    preload() {
        // Images
        this.load.image('bg', 'assets/bg.png');
        this.load.image('game_bg', 'assets/game_bg.png');
        this.load.image('bg1', 'assets/bg1.png');
        this.load.image('ball', 'assets/ball.png');
        this.load.image('square', 'assets/square.png');
        this.load.image('frame', 'assets/frame.png');
        this.load.atlas('sheet', 'assets/sheet.png', 'assets/sheet.json');

        this.load.script('webfont', 'lib/webfont.js');
        this.load.plugin('rextagtextplugin', 'lib/rextagtextplugin.min.js', true);
        this.load.audio('bgm_loop', 'sounds/bgm_loop.mp3');
        this.load.audio('bonus', 'sounds/bonus.mp3');
        this.load.audio('bounce', 'sounds/bounce.mp3');
        this.load.audio('fail', 'sounds/fail.mp3');
        this.load.audio('win', 'sounds/win.mp3');

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
                families: ['UberMoveMedium']

            },
            active: function() {

                _this.scene.stop('preload');
                _this.scene.launch('GameScene');
            }
        });
    }
}
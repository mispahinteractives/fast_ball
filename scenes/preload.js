export default class Preload extends Phaser.Scene {

    constructor() {
        super({ key: 'preload' });
    }

    init() {
        // Inject CSS
        var element = document.createElement('style');
        document.head.appendChild(element);
        var sheet = element.sheet;
        var styles1 = '@font-face { font-family: "UberMoveMedium"; src: url("fonts/UberMoveMedium.otf") format("opentype"); }\n';
        sheet.insertRule(styles1, 0);
    }

    preload() {
        this.sceneStopped = false;
        this.canvasWidth = this.sys.game.canvas.width;
        this.canvasHeight = this.sys.game.canvas.height;
        this.timeStart = Date.now();

        this.bg = this.add.sprite(this.canvasWidth / 2, this.canvasHeight / 2, 'bg');
        this.bg.setOrigin(0.5).setScale(1);

        let scaleX = this.canvasWidth / this.bg.width;
        let scaleY = this.canvasHeight / this.bg.height;
        let scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale);

        this.logo = this.add.sprite(this.canvasWidth / 2, this.canvasHeight / 2 - 100, "sheet", 'logo');
        this.logo.setOrigin(0.5).setScale(.8);

        this.bar = this.add.sprite(this.canvasWidth / 2, this.canvasHeight / 2 + 100, 'loading_bar_unfilled');
        this.bar.setOrigin(0.5).setScale(.7);

        this.loadingText = this.add.text(this.canvasWidth / 2, this.canvasHeight / 2 + 200, "Loading...", {
            fontFamily: "UberMoveMedium",
            fontSize: "32px",
            color: "#ffffff"
        });
        this.loadingText.setOrigin(0.5);

        this.fill = this.add.sprite(this.canvasWidth / 2, this.canvasHeight / 2 + 100, 'loading_bar_filled');
        this.fill.setOrigin(0.5).setScale(.7, .65);
        this.fill.orgWidth = this.fill.width;

        this.cropRect = new Phaser.Geom.Rectangle(0, 0, 0, this.fill.height);
        this.fill.setCrop(this.cropRect);

        this.load.on('progress', (value) => {
            console.log("mm");
            if (this.fill && this.fill.orgWidth) {
                let val = (value) * this.fill.orgWidth * 0.5;
                this.cropRect.width = val;
                this.fill.setCrop(this.cropRect);
            }
        });

        this.load.on('complete', () => {
            let difference = Date.now() - this.timeStart;
            difference = Math.max(0, 1000 - difference);

            this.tweens.add({
                targets: this.cropRect,
                width: this.fill.orgWidth,
                duration: difference,
                ease: "Power0",
                onUpdate: () => {
                    this.fill.setCrop(this.cropRect);
                },
                onComplete: () => {
                    this.fill.setCrop(this.cropRect);
                }
            });
        });
    }

    create() {
        this.firstTime = false;
        let _this = this;

        WebFont.load({
            custom: { families: ['UberMoveMedium'] },
            active: function() {
                _this.scene.stop('preload');
                _this.scene.launch('GameScene');
            }
        });
    }
}
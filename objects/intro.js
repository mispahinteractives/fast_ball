import { Tutorial1 } from "./tutorial1.js";

export class Intro extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene, dimensions) {
        super(scene);
        this.scene = scene;
        this.dimensions = dimensions;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.scene.add.existing(this);

        this.init();
    }

    init() {
        // this.graphicsGrp = this.scene.add.container(0, 0);
        // this.add(this.graphicsGrp);

        // this.graphics = this.scene.make.graphics().fillStyle(0x141414, .3).fillRect(this.dimensions.leftOffset, this.dimensions.topOffset, this.dimensions.actualWidth, this.dimensions.actualHeight);
        // this.graphicsGrp.add(this.graphics);

        this.frame = this.scene.add.sprite(-20, 0, "sheet", "frame");
        this.frame.setOrigin(0.5);
        this.frame.setScale(.55);
        this.add(this.frame);

        this.frameText = this.scene.add.text(70, -25, this.scene.text.texts[0].intro, {
            fontFamily: "UberMoveMedium",
            fontSize: 35,
            fill: "#733706",
            align: "center",
        });
        this.frameText.setOrigin(0.5);
        this.add(this.frameText);

        this.play = this.scene.add.text(70, 180, this.scene.text.texts[0].play, {
            fontFamily: "UberMoveMedium",
            fontSize: 45,
            fill: "#ffffff",
            align: "center",
        });
        this.play.setOrigin(0.5);
        this.add(this.play);

        // this.back = this.scene.add.sprite(230, -160, "sheet", "back");
        // this.back.setOrigin(0.5);
        // this.back.setScale(.2);
        // this.add(this.back);

        this.visible = false;
        this.frame.alpha = 0;
        this.frameText.alpha = 0;
        this.play.alpha = 0;
        this.show();
    }

    show() {
        if (this.visible) return;
        this.visible = true;
        this.scene.tweens.add({
            targets: this.frame,
            x: { from: this.frame.x - 300, to: this.frame.x },
            alpha: { from: 0, to: 1 },
            ease: "Cubic.In",
            duration: 250,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.frameText,
                    scale: { from: 0, to: this.frameText.scaleX },
                    alpha: { from: 0, to: 1 },
                    ease: "Linear",
                    duration: 250,
                });
                this.scene.tweens.add({
                    targets: this.play,
                    scale: { from: 0, to: this.play.scaleX },
                    alpha: { from: 0, to: 1 },
                    ease: "Linear",
                    duration: 250,
                });
            }
        });
    }

    hide() {
        if (!this.visible) return;
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.visible = false;
                this.alpha = 1;
            }
        });
    }

    adjust() {

        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.bottomOffset - 230;

        // if (this.graphics) this.graphics.destroy();
        // this.graphics = this.scene.make.graphics().fillStyle(0x141414, .7).fillRect(this.dimensions.leftOffset - this.x, this.dimensions.topOffset - this.y, this.dimensions.actualWidth, this.dimensions.actualHeight);
        // this.graphicsGrp.add(this.graphics);

    }
}
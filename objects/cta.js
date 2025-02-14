import config from "../config.js";

export class CTA extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene, dimensions) {

        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.dimensions = dimensions;
        this.scene.add.existing(this);
        this.init();
    }

    init() {

        this.countValue = 0;

        this.graphicsGrp = this.scene.add.container(0, 0);
        this.add(this.graphicsGrp);

        this.graphics = this.scene.make.graphics().fillStyle(0x000000, 1).fillRect(this.dimensions.leftOffset, this.dimensions.topOffset, this.dimensions.actualWidth, this.dimensions.actualHeight);
        this.graphicsGrp.add(this.graphics);

        this.frame = this.scene.add.graphics();
        this.frame.lineStyle(5, 0x03d9d9)
        this.frame.strokeRoundedRect(-200, -400, 400, 800, 50);
        this.add(this.frame);

        this.line = this.scene.add.graphics();
        this.line.fillStyle(0xda6b62, 1)
        this.line.fillRect(-100, 150, 200, 4)
        this.add(this.line);

        this.ctaText1 = this.scene.add.text(0, -275, this.scene.text.texts[0].ctaTxt1, {
            fontFamily: "UberMoveMedium",
            fontSize: 20,
            fill: "#ffffff",
            align: "center",
        });
        this.ctaText1.setOrigin(0.5);
        this.add(this.ctaText1);

        this.ctaText2 = this.scene.add.text(0, -200, this.scene.text.texts[0].ctaTxt2, {
            fontFamily: "UberMoveMedium",
            fontSize: 57,
            fill: "#03d9d9",
            align: "center",
        });
        this.ctaText2.setOrigin(0.5);
        this.add(this.ctaText2);

        this.ctaText3 = this.scene.add.text(0, 250, this.scene.text.texts[0].ctaTxt3, {
            fontFamily: "UberMoveMedium",
            fontSize: 40,
            fill: "#c2c2c2",
            align: "center",
        });
        this.ctaText3.setOrigin(0.5);
        this.add(this.ctaText3);

        this.count1 = this.scene.add.text(0, 75, this.countValue, {
            fontFamily: "UberMoveMedium",
            fontSize: 35,
            fill: "#ffffff",
            align: "center",
        });
        this.count1.setOrigin(0.5);
        this.add(this.count1);

        this.count2 = this.scene.add.text(0, 350, this.countValue, {
            fontFamily: "UberMoveMedium",
            fontSize: 35,
            fill: "#da6b62",
            align: "center",
        });
        this.count2.setOrigin(0.5);
        this.add(this.count2);

        // this.playBtn.setInteractive();
        // this.playBtn.on("pointerdown", () => {
        //     this.ctaClick(this.playBtn)
        // });

        this.visible = false;
        this.userWon = true
            // this.show()
    }

    ctaClick(sprite) {
        if (this.done) return;
        sprite.disableInteractive();
        onCTAClick();
        this.done = true;
        this.scene.time.addEvent({
            delay: 10000,
            callback: () => {
                this.done = false;
                sprite.setInteractive();
            }
        })
    }

    show() {
        if (this.visible) return;
        this.visible = true;
        // this.scene.hideUI();

        this.alpha = 0;
        this.ctaText2.alpha = 0;
        this.ctaText3.alpha = 0;
        this.count1.alpha = 0;
        this.count2.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.ctaText2,
                    alpha: { from: 0, to: 1 },
                    ease: "Linear",
                    duration: 200,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this.ctaText2,
                            scale: { from: this.ctaText2.scale, to: this.ctaText2.scale + 0.2 },
                            ease: "Linear",
                            duration: 700,
                            yoyo: true,
                            repeat: -1,
                        })
                        this.scene.tweens.add({
                            targets: this.count1,
                            alpha: { from: 0, to: 1 },
                            scale: { from: 0, to: this.count1.scale },
                            ease: "Linear",
                            duration: 200,
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: this.ctaText3,
                                    alpha: { from: 0, to: 1 },
                                    scaleX: { from: 0, to: this.ctaText3.scaleX },
                                    ease: "Linear",
                                    duration: 200,
                                    onComplete: () => {
                                        this.scene.tweens.add({
                                            targets: this.count2,
                                            alpha: { from: 0, to: 1 },
                                            scale: { from: 0, to: this.count2.scale },
                                            ease: "Linear",
                                            duration: 200,
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2;

        if (this.graphics) this.graphics.destroy();
        this.graphics = this.scene.make.graphics().fillStyle(0x000000, 1).fillRect(this.dimensions.leftOffset - this.x, this.dimensions.topOffset - this.y, this.dimensions.actualWidth, this.dimensions.actualHeight);
        this.graphicsGrp.add(this.graphics);
    }

    hide() {
        this.scene.tweens.add({
            targets: this,
            alpha: {
                from: 1,
                to: 0
            },
            ease: "Linear",
            duration: 100,
            onComplete: () => {
                this.alpha = 1;
                this.visible = false;
            }
        });
    }
}
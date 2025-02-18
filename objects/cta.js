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

        this.graphics = this.scene.make.graphics().fillStyle(0x141414, 1).fillRect(this.dimensions.leftOffset, this.dimensions.topOffset, this.dimensions.actualWidth, this.dimensions.actualHeight);
        this.graphicsGrp.add(this.graphics);

        this.bg = this.scene.add.sprite(0, 0, 'bg').setOrigin(0.5);
        this.add(this.bg);

        this.frame = this.scene.add.graphics();
        this.frame.lineStyle(5, 0x000000)
        this.frame.strokeRoundedRect(-225, -400, 450, 800, 50);
        this.add(this.frame);

        this.line = this.scene.add.graphics();
        this.line.fillStyle(0x000000, 1)
        this.line.fillRect(-100, 150, 200, 4)
        this.add(this.line);

        this.logo = this.scene.add.sprite(0, -175, "sheet", 'logo').setOrigin(0.5).setScale(0.5);
        this.add(this.logo);

        this.ctaText3 = this.scene.add.text(0, 250, this.scene.text.texts[0].ctaTxt3, {
            fontFamily: "UberMoveMedium",
            fontSize: 40,
            fill: "#000000",
            align: "center",
        });
        this.ctaText3.setOrigin(0.5);
        this.add(this.ctaText3);

        this.count1 = this.scene.add.text(0, 75, this.countValue, {
            fontFamily: "UberMoveMedium",
            fontSize: 35,
            fill: "#000000",
            align: "center",
        });
        this.count1.setOrigin(0.5);
        this.add(this.count1);

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
        // onCTAClick();
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
        if (this.scene.gamePlay.score <= 0) {
            this.scene.sound.play('fail', { volume: 1 })
        } else {
            this.scene.sound.play('win', { volume: 1 })
            this.count1.setText(this.scene.gamePlay.score)
        }

        this.alpha = 0;
        this.logo.alpha = 0;
        this.ctaText3.alpha = 0;
        this.count1.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.logo,
                    alpha: { from: 0, to: 1 },
                    ease: "Back.easeOut",
                    duration: 200,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this.logo,
                            scale: { from: this.logo.scale, to: this.logo.scale + 0.1 },
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

        this.bg.setScale(1);
        let scaleX = this.dimensions.actualWidth / this.bg.displayWidth;
        let scaleY = this.dimensions.actualHeight / this.bg.displayHeight;
        let scale = Math.max(scaleX, scaleY);
        this.bg.setScale(scale);

        this.bg.x = this.dimensions.gameWidth / 2 - this.x;
        this.bg.y = this.dimensions.gameHeight / 2 - this.y;

        if (this.graphics) this.graphics.destroy();
        this.graphics = this.scene.make.graphics().fillStyle(0x141414, 1).fillRect(this.dimensions.leftOffset - this.x, this.dimensions.topOffset - this.y, this.dimensions.actualWidth, this.dimensions.actualHeight);
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
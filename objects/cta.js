import config from "../config.js";

export class CTA extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene) {

        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.scene.add.existing(this);
        this.init();
    }

    init() {

        this.bg = this.scene.add.sprite(0, 0, 'bg2');
        this.bg.setOrigin(0.5);
        this.add(this.bg);

        this.logo = this.scene.add.sprite(0, -250, "sheet", 'title');
        this.logo.setOrigin(0.5);
        this.logo.setScale(1);
        this.add(this.logo);

        this.playBtn = this.scene.add.sprite(0, 35, "sheet", 'play');
        this.playBtn.setOrigin(0.5);
        this.playBtn.setScale(0.9);
        this.add(this.playBtn);

        this.line = this.scene.add.sprite(0, 165, "sheet", 'line');
        this.line.setOrigin(0.5);
        this.line.setScale(0.9);
        this.add(this.line);

        this.playBtn.setInteractive();
        this.playBtn.on("pointerdown", () => {
            this.ctaClick(this.playBtn)
        });

        this.visible = false;
        // this.userWon = true
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
        this.scene.hideUI();

        this.alpha = 0;
        this.logo.alpha = 0;
        this.line.alpha = 0;
        this.playBtn.alpha = 0;

        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.logo,
                    alpha: { from: 0, to: 1 },
                    y: { from: this.logo.y - 500, to: this.logo.y },
                    ease: "Back.easeOut",
                    duration: 200,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this.playBtn,
                            alpha: { from: 0, to: 1 },
                            scale: { from: 0, to: this.playBtn.scale },
                            ease: "Linear",
                            duration: 200,
                            onComplete: () => {
                                this.scene.tweens.add({
                                    targets: this.playBtn,
                                    scale: { from: this.playBtn.scale, to: this.playBtn.scale + 0.1 },
                                    ease: "Linear",
                                    duration: 700,
                                    yoyo: true,
                                    repeat: -1,
                                })
                                this.scene.tweens.add({
                                    targets: this.line,
                                    alpha: { from: 0, to: 1 },
                                    scale: { from: 0, to: this.line.scale },
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
import { Tut1 } from "./tut1.js";
import { Tut2 } from "./tut2.js";
import { Tut3 } from "./tut3.js";

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
        this.level = 0;
        this.left = this.scene.add.sprite(0, -250, "sheet", "tutorial/left").setOrigin(0.5)
        this.right = this.scene.add.sprite(0, -250, "sheet", "tutorial/right").setOrigin(0.5)
        this.playBtn = this.scene.add.sprite(0, 0, "sheet", "tutorial/play").setOrigin(0.5).setScale(1)
        this.closeBtn = this.scene.add.sprite(0, 0, "sheet", "tutorial/close").setOrigin(0.5)

        this.add([this.left, this.right, this.playBtn, this.closeBtn]);

        this.tut1 = new Tut1(this.scene, 0, 0, this);
        this.tut2 = new Tut2(this.scene, 0, 0, this);
        this.tut3 = new Tut3(this.scene, 0, 0, this);
        this.add([this.tut1, this.tut2, this.tut3]);

        this.tut2.setVisible(false);
        this.tut3.setVisible(false);

        this.playBtn.setInteractive().on("pointerdown", () => this.hide());
        this.closeBtn.setInteractive().on("pointerdown", () => this.hide());
        this.right.setInteractive().on("pointerdown", () => {
            if (this.right.alpha === 0.5) return;
            this.changeTutorial(1);
        });
        this.left.setInteractive().on("pointerdown", () => {
            if (this.left.alpha === 0.5) return;
            this.changeTutorial(-1);
        });

        this.bringToTop(this.closeBtn)
        this.bringToTop(this.playBtn)

        this.visible = false;
        setTimeout(() => {
            this.show();
        }, 100);
    }

    changeTutorial(direction) {
        let currentTutorial = this[`tut${this.level + 1}`];
        let nextLevel = (this.level + direction + 3) % 3;

        this.scene.tweens.add({
            targets: currentTutorial,
            x: direction > 0 ? -500 : 500,
            ease: "Cubic.easeOut",
            duration: 300,
            onComplete: () => {
                currentTutorial.gameOver = true;
                currentTutorial.destroy();
            }
        });

        let nextTutorial;
        switch (nextLevel) {
            case 0:
                nextTutorial = new Tut1(this.scene, 0, 0, this);
                break;
            case 1:
                nextTutorial = new Tut2(this.scene, 0, 0, this);
                break;
            case 2:
                nextTutorial = new Tut3(this.scene, 0, 0, this);
                break;
        }

        this.add(nextTutorial);

        this.bringToTop(this.closeBtn)
        this.bringToTop(this.playBtn)

        this[`tut${nextLevel + 1}`] = nextTutorial;

        nextTutorial.setPosition(
            this.dimensions.gameWidth / 2 - this.x,
            this.dimensions.gameHeight / 2 - this.y
        );
        nextTutorial.setVisible(true);
        nextTutorial.x = direction > 0 ? 500 : -500;

        this.scene.tweens.add({
            targets: nextTutorial,
            x: 0,
            ease: "Linear",
            duration: 300,
            onComplete: () => {
                // this.adjust();
                nextTutorial.startGame();
            }
        });

        this.level = nextLevel;
        this.left.setAlpha(this.level === 0 ? 0.5 : 1);
        this.right.setAlpha(this.level === 2 ? 0.5 : 1);
    }

    show() {
        if (this.visible) return;
        this.visible = true;
        this.tut1.startGame();
        this.tut1.setVisible(true);
        this.tut2.setVisible(false);
        this.tut3.setVisible(false);
        this.level = 0;
        this.left.setAlpha(0.5);
        this.right.setAlpha(1);
    }

    hide() {
        if (!this.visible) return;
        this.scene.introBg.visible = false;
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            ease: "Linear",
            duration: 200,
            onComplete: () => {
                this.visible = false;
                this.alpha = 1;
                this.scene.gamePlay.show();
            }
        });
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.bottomOffset - 270;

        this.left.setPosition(this.dimensions.leftOffset + 17 - this.x, this.dimensions.gameHeight / 2 - 50 - this.y);
        this.right.setPosition(this.dimensions.rightOffset - 17 - this.x, this.dimensions.gameHeight / 2 - 50 - this.y);
        this.closeBtn.setPosition(this.dimensions.leftOffset + 48 - this.x, this.dimensions.bottomOffset - 47 - this.y);
        this.playBtn.setPosition(this.dimensions.rightOffset - 210 - this.x, this.dimensions.bottomOffset - 47 - this.y);

        this.tut1.x = this.dimensions.gameWidth / 2 - this.x;
        this.tut1.y = this.dimensions.gameHeight / 2 - this.y;

        this.tut2.x = this.dimensions.gameWidth / 2 - this.x
        this.tut2.y = this.dimensions.gameHeight / 2 - this.y

        this.tut3.x = this.dimensions.gameWidth / 2 - this.x;
        this.tut3.y = this.dimensions.gameHeight / 2 - this.y;

    }
}
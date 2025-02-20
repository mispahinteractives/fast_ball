import config from "../config.js";

export class Tutorial1 extends Phaser.GameObjects.Container {
    constructor(scene, x, y, gameScene, dimensions) {
        super(scene);
        this.scene = scene;
        this.dimensions = dimensions;
        this.x = x;
        this.y = y;
        this.gameScene = gameScene;
        this.scene.add.existing(this);

        this.collisionCooldown = 0;
        this.init();
    }

    init() {
        this.rectWidth = 300;
        this.rectHeight = 500;
        this.speedMultiplier = 4;
        this.ballVelocityX = 0;
        this.ballVelocityY = 3 * this.speedMultiplier;
        this.minX = -this.rectWidth / 2;
        this.maxX = this.rectWidth / 2;
        this.minY = -this.rectHeight / 2;
        this.maxY = this.rectHeight / 2;
        this.lineInteracted = false;
        this.gameOver = false;
        this.score = 0;

        this.rectGraphics = this.scene.add.graphics();
        this.rectGraphics.lineStyle(7, 0x000000, 1);
        this.rectGraphics.strokeRoundedRect(-this.rectWidth / 2, -this.rectHeight / 2, this.rectWidth, this.rectHeight, 50);
        this.add(this.rectGraphics);

        this.ball = this.scene.add.sprite(0, 100, "sheet", 'brown');
        this.ball.setOrigin(0.5);
        this.ball.setScale(1);
        this.add(this.ball);

        this.line = this.scene.add.sprite(0, 150, "sheet", 'line');
        this.line.setOrigin(0.5);
        this.line.setScale(0.7);
        this.add(this.line);

        this.outline = this.scene.add.sprite(0, 200, "sheet", 'outline');
        this.outline.setOrigin(0.5);
        this.outline.setScale(0.63, 1);
        this.add(this.outline);

        this.line.setInteractive();
        this.scene.input.setDraggable(this.line);
        this.lineInteracted = false;

        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            this.scene.firstTouchEvent(this.scene);
            if (gameObject === this.line) {
                let clampedX = Phaser.Math.Clamp(dragX, this.minX + this.line.displayWidth / 2, this.maxX - this.line.displayWidth / 2);
                this.line.x = clampedX;

                this.lineInteracted = true;
            }
        });

        this.staticBall = this.scene.add.sprite(-50, -150, "sheet", 'white');
        this.staticBall.setOrigin(0.5);
        this.add(this.staticBall);

        this.staticBallWidth = this.staticBall.width;
        this.staticBallHeight = this.staticBall.height;

        this.visible = true;
    }

    showTween() {
        this.scene.tweens.add({
            targets: this.line,
            x: { from: this.line.scale, to: this.line.scale + 0.1 },
            ease: "Linear",
            duration: 700,
        })
    }

    startGame() {
        this.gameStarted = true;
        this.visible = true;
    }

}
import config from "../config.js";

export class GamePlay extends Phaser.GameObjects.Container {
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
        // this.bg = this.scene.add.sprite(0, 100, "sheet", 'panel');
        // this.bg.setOrigin(0.5);
        // this.bg.setScale(1);
        // this.add(this.bg);

        this.rectGraphics = this.scene.add.graphics();
        this.rectGraphics.lineStyle(5, 0x000000, 1);
        this.rectGraphics.strokeRect(-200, -300, 400, 600);
        this.add(this.rectGraphics);

        this.ball = this.scene.add.sprite(0, 100, "sheet", 'brown');
        this.ball.setOrigin(0.5);
        this.ball.setScale(2);
        this.add(this.ball);

        this.speedMultiplier = 2;
        this.ballVelocityX = 3 * this.speedMultiplier;
        this.ballVelocityY = 2 * this.speedMultiplier;

        this.minX = -150;
        this.maxX = 150;
        this.minY = -250;
        this.maxY = 250;
    }

    update() {
        // Move ball
        this.ball.x += this.ballVelocityX;
        this.ball.y += this.ballVelocityY;

        if (this.ball.x - this.ball.displayWidth / 2 <= this.minX ||
            this.ball.x + this.ball.displayWidth / 2 >= this.maxX) {
            this.ballVelocityX *= -1;
        }
        if (this.ball.y - this.ball.displayHeight / 2 <= this.minY ||
            this.ball.y + this.ball.displayHeight / 2 >= this.maxY) {
            this.ballVelocityY *= -1;
        }
    }
}
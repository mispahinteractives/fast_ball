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
        this.rectWidth = 400;
        this.rectHeight = 600;
        this.speedMultiplier = 3;
        this.ballVelocityX = 3 * this.speedMultiplier;
        this.ballVelocityY = 2 * this.speedMultiplier;
        this.minX = -this.rectWidth / 2;
        this.maxX = this.rectWidth / 2;
        this.minY = -this.rectHeight / 2;
        this.maxY = this.rectHeight / 2;

        this.rectGraphics = this.scene.add.graphics();
        this.rectGraphics.lineStyle(5, 0x000000, 1);
        this.rectGraphics.strokeRect(-this.rectWidth / 2, -this.rectHeight / 2, this.rectWidth, this.rectHeight);
        this.add(this.rectGraphics);

        this.ball = this.scene.add.sprite(0, 100, "sheet", 'brown');
        this.ball.setOrigin(0.5);
        this.ball.setScale(2);
        this.add(this.ball);

        this.staticBall = this.scene.add.sprite(0, -50, "sheet", 'white');
        this.staticBall.setOrigin(0.5);
        this.add(this.staticBall);

        this.staticBallWidth = this.staticBall.width;
        this.staticBallHeight = this.staticBall.height;
    }

    update() {
        // Move ball
        this.ball.x += this.ballVelocityX;
        this.ball.y += this.ballVelocityY;

        // Bounce off rectangle walls
        if (this.ball.x - this.ball.displayWidth / 2 <= this.minX || this.ball.x + this.ball.displayWidth / 2 >= this.maxX) {
            this.ballVelocityX *= -1;
        }
        if (this.ball.y - this.ball.displayHeight / 2 <= this.minY || this.ball.y + this.ball.displayHeight / 2 >= this.maxY) {
            this.ballVelocityY *= -1;
        }

        // Collision detection with static ball
        let dx = this.ball.x - this.staticBall.x;
        let dy = this.ball.y - this.staticBall.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.ball.displayWidth) {
            this.staticBall.destroy();

            let randomX = Phaser.Math.Between(this.minX + 50, this.maxX - 50);
            let randomY = Phaser.Math.Between(this.minY + 50, this.maxY - 50);

            this.staticBall = this.scene.add.sprite(randomX, randomY, "sheet", 'white');
            this.staticBall.setOrigin(0.5);
            this.add(this.staticBall);

            // Adjust static ball dimensions
            this.staticBallWidth = this.staticBall.displayWidth;
            this.staticBallHeight = this.staticBall.displayHeight;

            // Make the ball bounce off
            let angle = Math.atan2(dy, dx);
            let speed = Math.sqrt(this.ballVelocityX * this.ballVelocityX + this.ballVelocityY * this.ballVelocityY);

            this.ballVelocityX = Math.cos(angle) * speed;
            this.ballVelocityY = Math.sin(angle) * speed;
        }
    }
}
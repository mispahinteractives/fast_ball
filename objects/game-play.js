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
        this.rectGraphics = this.scene.add.graphics();
        this.rectGraphics.lineStyle(5, 0x00FFFF, 1);
        this.rectGraphics.strokeRect(-150, -250, 300, 500);
        this.add(this.rectGraphics);

        this.ball = this.scene.add.sprite(0, 100, "sheet", 'brown');
        this.ball.setOrigin(0.5);
        this.ball.setScale(2);
        this.add(this.ball);

        // Velocity variables
        this.ballVelocityX = 3; // Speed in X direction
        this.ballVelocityY = 2; // Speed in Y direction

        // Define rectangle boundaries
        this.minX = -150;
        this.maxX = 150;
        this.minY = -250;
        this.maxY = 250;
    }

    update() {
        // Move ball
        this.ball.x += this.ballVelocityX;
        this.ball.y += this.ballVelocityY;

        // Check for collisions and bounce
        if (this.ball.x - this.ball.displayWidth / 2 <= this.minX ||
            this.ball.x + this.ball.displayWidth / 2 >= this.maxX) {
            this.ballVelocityX *= -1; // Reverse X velocity
        }
        if (this.ball.y - this.ball.displayHeight / 2 <= this.minY ||
            this.ball.y + this.ball.displayHeight / 2 >= this.maxY) {
            this.ballVelocityY *= -1; // Reverse Y velocity
        }
    }
}
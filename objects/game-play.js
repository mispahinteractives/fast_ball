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
        this.rectWidth = 450;
        this.rectHeight = 800;
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

        this.ball = this.scene.add.sprite(0, 270, "sheet", 'brown');
        this.ball.setOrigin(0.5);
        this.ball.setScale(2);
        this.add(this.ball);

        this.line = this.scene.add.sprite(0, 300, "sheet", 'line');
        this.line.setOrigin(0.5);
        this.add(this.line);

        this.line.setInteractive();
        this.scene.input.setDraggable(this.line);

        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === this.line) {
                let clampedX = Phaser.Math.Clamp(dragX, this.minX + this.line.displayWidth / 2, this.maxX - this.line.displayWidth / 2);
                this.line.x = clampedX;
            }
        });

        this.emitterBallSpeed = 100;
        this.emitter = this.scene.add.particles(0, 0, "brown", {
            lifespan: 400,
            scale: { start: 1, end: .6 },
            alpha: { start: .9, end: 0 },
            quantity: 1,
            frequency: 100,
            maxParticles: 10
        });
        this.emitter.startFollow(this.ball);
        this.add(this.emitter);

        this.staticBall = this.scene.add.sprite(-150, -250, "sheet", 'white');
        this.staticBall.setOrigin(0.5);
        this.add(this.staticBall);

        this.staticBallWidth = this.staticBall.width;
        this.staticBallHeight = this.staticBall.height;

        this.gameOver = false;
    }

    update() {
        if (this.gameOver) return;
        this.ball.x += this.ballVelocityX;
        this.ball.y += this.ballVelocityY;

        if (this.ball.y - this.ball.displayHeight / 2 <= this.minY || this.ball.y + this.ball.displayHeight / 2 >= this.maxY) {
            this.ballVelocityY *= -1;
            // this.triggerHitEmitter(this.ball.x, this.ball.y);
        }

        if (this.ball.x - this.ball.displayWidth / 2 <= this.minX || this.ball.x + this.ball.displayWidth / 2 >= this.maxX) {
            this.ballVelocityX *= -1;
            // this.triggerHitEmitter(this.ball.x, this.ball.y);
        }

        if (this.ball.y + this.ball.displayHeight / 2 >= this.maxY) {
            this.showFail();
            return;
        }

        if (this.checkCollisionWithLine()) {
            this.handleLineCollision();
        }

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

            this.staticBallWidth = this.staticBall.displayWidth;
            this.staticBallHeight = this.staticBall.displayHeight;

            let angle = Math.atan2(dy, dx);
            let speed = Math.sqrt(this.ballVelocityX * this.ballVelocityX + this.ballVelocityY * this.ballVelocityY);

            this.ballVelocityX = Math.cos(angle) * speed;
            this.ballVelocityY = Math.sin(angle) * speed;
        }
    }

    checkCollisionWithLine() {
        let ballLeft = this.ball.x - this.ball.displayWidth / 2;
        let ballRight = this.ball.x + this.ball.displayWidth / 2;
        let ballTop = this.ball.y - this.ball.displayHeight / 2;
        let ballBottom = this.ball.y + this.ball.displayHeight / 2;

        let lineLeft = this.line.x - this.line.displayWidth / 2;
        let lineRight = this.line.x + this.line.displayWidth / 2;
        let lineTop = this.line.y - this.line.displayHeight / 2;
        let lineBottom = this.line.y + this.line.displayHeight / 2;

        return (
            ballRight > lineLeft &&
            ballLeft < lineRight &&
            ballBottom > lineTop &&
            ballTop < lineBottom
        );
    }

    handleLineCollision() {
        this.ballVelocityY *= -1;
    }

    showFail() {
        this.gameOver = true;
        console.log("FAIL! The ball has hit the bottom.");
        this.ballVelocityX = 0;
        this.ballVelocityY = 0;
    }

    triggerHitEmitter(x, y) {
        let hitEmitter = this.scene.add.particles(x, y, "square", {
            speed: 100,
            lifespan: 300,
            scale: { start: .2, end: 0 },
            alpha: { start: 1, end: 0 },
            quantity: 10,
            frequency: 0,
            maxParticles: 50,
            angle: { min: 0, max: 360 },
            gravityY: 100,
            collide: true,
            bounce: 0.8
        });

        this.add(hitEmitter);
    }
}
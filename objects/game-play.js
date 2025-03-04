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

        this.collisionCooldown = 0;
        this.init();
    }

    init() {
        this.rectWidth = this.dimensions.gameWidth;
        this.rectHeight = this.dimensions.gameHeight;
        this.speedMultiplier = 2.5;
        this.ballVelocityX = 0;
        this.ballVelocityY = 3 * this.speedMultiplier;
        this.minX = -(this.rectWidth / 2);
        this.maxX = this.rectWidth / 2;
        this.minY = -this.rectHeight / 2 - 48;
        this.maxY = this.rectHeight / 2;
        this.lineInteracted = false;
        this.gameOver = false;
        this.score = 0;

        this.rectGraphics = this.scene.add.graphics();
        this.rectGraphics.lineStyle(7, 0x000000, 0);
        this.rectGraphics.strokeRoundedRect(this.minX, this.minY, this.rectWidth, this.rectHeight, 0);
        this.add(this.rectGraphics);

        this.scoreText = this.scene.add.text(0, -100, this.score, {
            fontFamily: "UberMoveMedium",
            fontSize: 300,
            fill: "#458780",
            align: "center",
        });
        this.scoreText.setOrigin(0.5);
        this.add(this.scoreText);

        this.ball = this.scene.add.sprite(0, 200, "sheet", 'ball');
        this.ball.setOrigin(0.5);
        this.add(this.ball);

        this.line = this.scene.add.sprite(0, 300, "sheet", 'line');
        this.line.setOrigin(0.5);
        this.add(this.line);

        this.outline = this.scene.add.sprite(-5, 350, "sheet", 'outline');
        this.outline.setOrigin(0.5);
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
                this.startGame();
            }
        });

        this.emitterBallSpeed = 100;
        this.emitter = this.scene.add.particles(0, 0, "ball", {
            lifespan: 400,
            scale: { start: 1, end: .6 },
            alpha: { start: .8, end: 0 },
            quantity: 1,
            frequency: 100,
            maxParticles: 10
        });
        this.emitter.startFollow(this.ball);
        this.add(this.emitter);
        this.emitter.visible = true;

        this.staticBall = this.scene.add.sprite(-150, -250, "sheet", 'white');
        this.staticBall.setOrigin(0.5);
        this.add(this.staticBall);

        this.staticBallWidth = this.staticBall.width;
        this.staticBallHeight = this.staticBall.height;

        this.visible = false;

    }

    show() {
        this.visible = true;
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            ease: "Linear",
            duration: 250,
        });

        this.startGame();
    }

    startGame() {
        this.gameStarted = true;
    }

    update() {
        if (!this.gameStarted) return;
        if (this.gameOver) return;

        if (this.lineInteracted && this.ballVelocityX === 0) {
            this.ballVelocityX = 2 * this.speedMultiplier;
            this.ballVelocityY = 2 * this.speedMultiplier;
        }

        this.ball.x += this.ballVelocityX;
        this.ball.y += this.ballVelocityY;

        if (this.ball.y + this.ball.displayHeight / 2 >= this.outline.y + this.outline.displayHeight / 2) {
            this.showFail();
            return;
        }

        if (this.ball.y - this.ball.displayHeight / 2 <= this.minY || this.ball.y + this.ball.displayHeight / 2 >= this.maxY) {
            this.ballVelocityY *= -1;
            this.triggerHitEmitter(this.ball.x, this.ball.y);
        }

        if (this.ball.x - this.ball.displayWidth / 2 <= this.minX || this.ball.x + this.ball.displayWidth / 2 >= this.maxX) {
            this.ballVelocityX *= -1;
            this.triggerHitEmitter(this.ball.x, this.ball.y);
        }

        if (Math.abs(this.ballVelocityX) < 0.5) {
            this.ballVelocityX += (Math.random() - 0.5) * this.speedMultiplier;
        }

        if (Math.abs(this.ballVelocityY) < 0.5) {
            this.ballVelocityY += (Math.random() - 0.5) * this.speedMultiplier;
        }

        let currentTime = this.scene.time.now; // Get the current timestamp

        if (this.checkCollisionWithLine() && currentTime - this.collisionCooldown > 200) {
            this.handleLineCollision();
            this.collisionCooldown = currentTime; // Set the new cooldown time
        }

        let dx = this.ball.x - this.staticBall.x;
        let dy = this.ball.y - this.staticBall.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.ball.displayWidth) {
            this.staticBall.destroy();
            this.updateScore();

            let randomX = Phaser.Math.Between(this.minX + 50, this.maxX - 50);
            let randomY = Phaser.Math.Between(this.minY + 50, this.maxY - 350);

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

    handleLineCollision() {
        if (this.ballVelocityX === 0) {
            this.startLineMovement();
        }
        this.triggerHitEmitter(this.ball.x, this.ball.y);
        this.ballVelocityY *= -1;
    }

    checkCollisionWithOutline() {
        let ballLeft = this.ball.x - this.ball.displayWidth / 2;
        let ballRight = this.ball.x + this.ball.displayWidth / 2;
        let ballTop = this.ball.y - this.ball.displayHeight / 2;
        let ballBottom = this.ball.y + this.ball.displayHeight / 2;

        let outlineLeft = this.outline.x - this.outline.displayWidth / 2;
        let outlineRight = this.outline.x + this.outline.displayWidth / 2;
        let outlineTop = this.outline.y - this.outline.displayHeight / 2;
        let outlineBottom = this.outline.y + this.outline.displayHeight / 2;

        return (
            ballRight > outlineLeft &&
            ballLeft < outlineRight &&
            ballBottom > outlineTop &&
            ballTop < outlineBottom
        );
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

    startLineMovement() {
        if (!this.lineMoving) {
            this.lineMoving = true;
            console.log("line moving");
            setTimeout(() => {
                this.line.y -= 3;
                this.outline.y -= 3;
                this.lineMoving = false;
            }, 200);
        }
    }

    updateScore() {
        this.scene.sound.play('bonus', { volume: .4 })
        this.score += 1;
        this.scoreText.setText(this.score);
    }

    showFail() {
        this.triggerHitEmitter(this.ball.x, this.ball.y);
        this.gameOver = true;
        console.log("FAIL! The ball has hit the bottom.");
        this.ballVelocityX = 0;
        this.ballVelocityY = 0;
        if (this.emitter) {
            this.emitter.stop();
        }
        setTimeout(() => {
            this.scene.cta.show();
        }, 500);
    }

    triggerHitEmitter(x, y) {
        if (this.scene.firstTouchDetected) {
            // this.scene.sound.play('bounce', { volume: 1 })
        }
        let hitEmitter = this.scene.add.particles(x, y, "square", {
            speed: 80,
            lifespan: 600,
            scale: { start: .8, end: .3 },
            alpha: { start: 1, end: .5 },
            quantity: 6,
            frequency: 0,
            maxParticles: 6,
            angle: { min: 0, max: 360 },
            gravityY: 100,
            collide: true,
            bounce: 0.8
        });

        this.add(hitEmitter);
    }

    adjust() {
        this.x = this.dimensions.gameWidth / 2;
        this.y = this.dimensions.gameHeight / 2 + 50;

        this.rectWidth = this.dimensions.actualWidth;
        this.rectHeight = this.dimensions.actualHeight;
        this.minX = -(this.rectWidth / 2);
        this.maxX = this.rectWidth / 2;
        this.minY = -this.rectHeight / 2 - 48;
        this.maxY = this.rectHeight / 2;

        this.rectGraphics.clear();
        this.rectGraphics.lineStyle(7, 0x000000, 0);
        this.rectGraphics.strokeRoundedRect(this.minX, this.minY, this.rectWidth, this.rectHeight, 0);
    }
}
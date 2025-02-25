import config from "../config.js";

export class Tut3 extends Phaser.GameObjects.Container {
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
        this.frame = this.scene.add.sprite(0, -50, "frame");
        this.frame.setOrigin(0.5);
        this.add(this.frame);

        let xPos = [-17, 1.7, 21];
        let yPos = [0, 0.3, 0.5];

        for (let i = 0; i < xPos.length; i++) {
            let dot = this.scene.add.sprite(xPos[i], yPos[i] + 200, "sheet", "tutorial/white")
                .setOrigin(0.5)
            this.add(dot);

            if (i == 2) {
                dot.setFrame("tutorial/white")
            } else {
                dot.setFrame("tutorial/brown")
            }
        }

        this.rectWidth = this.frame.displayWidth - 50;
        this.rectHeight = this.frame.displayHeight - 40;
        this.speedMultiplier = 4;
        this.ballVelocityX = 0;
        this.ballVelocityY = 3 * this.speedMultiplier;
        this.minX = -this.rectWidth / 2;
        this.maxX = this.rectWidth / 2;
        this.minY = -this.rectHeight / 2 - 53;
        this.maxY = this.rectHeight / 2;
        this.lineInteracted = false;
        this.gameOver = false;

        this.rectGraphics = this.scene.add.graphics();
        this.rectGraphics.lineStyle(7, 0x000000, 0);
        this.rectGraphics.strokeRoundedRect(this.minX, this.minY, this.rectWidth, this.rectHeight, 20);
        this.add(this.rectGraphics);

        this.ball = this.scene.add.sprite(-10, -250, "sheet", 'ball');
        this.ball.setOrigin(0.5);
        this.add(this.ball);

        this.line = this.scene.add.sprite(0, 100, "sheet", 'line');
        this.line.setOrigin(0.5);
        this.line.setScale(0.7);
        this.add(this.line);

        this.outline = this.scene.add.sprite(0, 150, "sheet", 'outline');
        this.outline.setOrigin(0.5);
        this.outline.setScale(0.9);
        this.add(this.outline);

        // this.line.setInteractive();
        // this.scene.input.setDraggable(this.line);
        this.lineInteracted = false;

        // this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        //     this.scene.firstTouchEvent(this.scene);
        //     if (gameObject === this.line) {
        //         let clampedX = Phaser.Math.Clamp(dragX, this.minX + this.line.displayWidth / 2, this.maxX - this.line.displayWidth / 2);
        //         this.line.x = clampedX;
        //         // this.emitter.visible = true;
        //         this.lineInteracted = true;
        //         this.startGame();
        //     }
        // });

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
        this.emitter.visible = false;

        this.staticBall = this.scene.add.sprite(100, -100, "sheet", 'white');
        this.staticBall.setOrigin(0.5);
        this.add(this.staticBall);

        this.staticBallWidth = this.staticBall.width;
        this.staticBallHeight = this.staticBall.height;

        this.hand = this.scene.add.sprite(0, 180, "sheet", 'hand');
        this.hand.setOrigin(0.5);
        this.hand.setScale(0.6);
        this.hand.angle = 120;
        this.add(this.hand);
        this.hand.visible = false;

        this.tutorialText = this.scene.add.text(60, 310, this.scene.text.texts[0].intro3, {
            fontFamily: "UberMoveMedium",
            fontSize: 33,
            fill: "#ffffff",
            align: "center",
            // stroke: "#c00b00",
            // strokeThickness: 4,
        })
        this.tutorialText.setOrigin(0.5);
        this.add(this.tutorialText);
        this.tutorialText.visible = false;

        this.visible = false;
    }

    showHint() {
        this.hand.visible = true;
        this.tween1 = this.scene.tweens.add({
            targets: this.line,
            x: { from: 0, to: this.maxX - this.line.displayWidth / 2 },
            ease: "Linear",
            duration: 400,
            yoyo: true,
            repeat: -1,
            onUpdate: () => {
                this.hand.x = this.line.x + 30
            }
        });
    }

    startGame() {

        this.showHint()
        this.tutorialText.visible = true;
        this.scene.tweens.add({
            targets: this.tutorialText,
            scale: { from: 0, to: 1 },
            ease: "Linear",
            duration: 200,
        });
        setTimeout(() => {
            this.gameStarted = true;
            this.hand.visible = false;
            if (this.tween1) this.tween1.pause();
            this.lineInteracted = true;

        }, 400);
    }
    update() {
        if (!this.gameStarted) return;
        if (this.gameOver) return;

        if (this.lineInteracted && this.ballVelocityX === 0) {
            // this.ballVelocityX = 2 * this.speedMultiplier;
        }
        this.ball.x += this.ballVelocityX;
        this.ball.y += this.ballVelocityY;

        if (this.ball.y + this.ball.displayHeight / 2 >= this.outline.y + this.outline.displayHeight / 2) {
            this.showFail();
            return;
        }

        if (this.ball.y - this.ball.displayHeight / 2 <= this.minY || this.ball.y + this.ball.displayHeight / 2 >= this.maxY) {
            this.ballVelocityY *= -1;
        }

        if (this.ball.x - this.ball.displayWidth / 2 <= this.minX || this.ball.x + this.ball.displayWidth / 2 >= this.maxX) {
            this.ballVelocityX *= -1;
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

    showFail() {
        this.gameOver = true;
        this.ballVelocityX = 0;
        this.ballVelocityY = 0;
        if (this.emitter) {
            this.emitter.stop();
        }
    }
}
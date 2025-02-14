import Boot from './scenes/boot.js'
import Preload from './scenes/preload.js'
import GameScene from './scenes/GameScene.js'

const ratio = window.devicePixelRatio;

const config = {
    type: Phaser.CANVAS,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game',
        width: 540,
        height: 960,
        antialias: false,

    },
    backgroundColor: 0x000000,
    dom: {
        createContainer: true
    },
    scene: [Boot, Preload, GameScene],
    physics: {
        default: 'matter',
        matter: {
            debug: false,
        }
    },

}

const game = new Phaser.Game(config)

// Global
game.debugMode = true
game.embedded = false // game is embedded into a html iframe/object

game.screenBaseSize = {

    width: window.innerWidth * ratio,
    height: window.innerHeight * ratio
}


game.orientation = "portrait"
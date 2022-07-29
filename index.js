//For sizing the screen
const canvas = document.querySelector('canvas');

// Selecting canvas context(c), for 2D game
const c = canvas.getContext('2d');

//Sizing Canvas
canvas.width = 1024;
canvas.height = 576;

//Canvas background
c.fillRect(0, 0, 1024, 576);

//Blueprint for the object before we create it
class Sprite {
    constructor(position) {
        this.position = position
    }
    //drawing sprite
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, 150)
    }
}

//creating player and starting position
const player = new Sprite({
    x: 0,
    y: 0
})

player.draw()

const enemy = new Sprite({
    x: 400,
    y: 100
})

enemy.draw()

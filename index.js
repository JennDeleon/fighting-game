//For sizing the screen
const canvas = document.querySelector('canvas');

// Selecting canvas context(c), for 2D game
const c = canvas.getContext('2d');

//Sizing Canvas
canvas.width = 1024;
canvas.height = 576;

//Canvas background
c.fillRect(0, 0, 1024, 576);

const gravity = 0.2 //gravity speed

//Blueprint for the object before we create it
class Sprite {
    constructor({position, velocity}) { //wrapping arguments into an object to make code cleaner/easier as we add more properties onto the constructor
        this.position = position
        this.velocity = velocity
        this.height = 150;
    }
    //drawing sprite
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }
    update() {
        this.draw()
        this.velocity.y += gravity
        this.position.y += this.velocity.y   //equal to the velocity we are passing onto players
        if (this.position.y + this.height + this.velocity.y >= canvas.height) { //only allowing rectangle to hit height of canvas
            this.velocity.y = 0; //stop player from hitting below canvas
        }
    }
}



//creating player and starting position
const player = new Sprite({
    position:{
    x: 0,
    y: 0
},
    velocity: {
        x: 0,
        y: 10
    }
})

//creating enemy
const enemy = new Sprite({
    position:{
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }
})

enemy.draw()

//Creating animation loop
function animate() {
    window.requestAnimationFrame(animate) //calling animate, calls function, then calls animate....infinite loop
    c.fillStyle = 'black';  // black background & rectangles
    c.fillRect(0 ,0, canvas.width, canvas.height);  //gets rid of rect trail
    player.update(); //corrects rect back to red
    enemy.update(); //corrects rect back to red
}
animate();

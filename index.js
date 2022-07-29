//For sizing the screen
const canvas = document.querySelector('canvas');

// Selecting canvas context(c), for 2D game
const c = canvas.getContext('2d');

//Sizing Canvas
canvas.width = 1024;
canvas.height = 576;

//Canvas background
c.fillRect(0, 0, 1024, 576);

const gravity = 0.2; //gravity speed

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
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y   //equal to the velocity we are passing onto players
        if (this.position.y + this.height + this.velocity.y >= canvas.height) { //only allowing rectangle to hit height of canvas
            this.velocity.y = 0;
        } else this.velocity.y += gravity //stops player from moving below canvas
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
        y: 0
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

    if (keys.a.pressed) {  //making sure movement continues even if a different key is lifted up
        player.velocity.x = -1
    } else if (keys.d.pressed) {
        player.velocity.x = 1
    }
}

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
animate();

//adding events to key presses
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            player.velocity.x = 1  //when press 'd', player moves 1 px right along the x axis
            break;
        case 'a':               //when press 'd', player moves 1 px left along the x axis
            player.velocity.x = -1
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            player.velocity.x = 0 //stop players movement
            break
        case 'a':
            player.velocity.x = 0 //stop players movement
            break
    }
})
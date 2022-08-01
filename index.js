//For sizing the screen
const canvas = document.querySelector('canvas');

// Selecting canvas context(c), for 2D game
const c = canvas.getContext('2d');

//Sizing Canvas
canvas.width = 1024;
canvas.height = 576;

//Canvas background
c.fillRect(0, 0, 1024, 576);

const gravity = 0.7; //gravity speed

//implementing Sprite class, one argument & new properties
const background = new Sprite ({
    position: {
        x: 0,
        y: 0

    },
    imageSrc: './img/background.jpg'
})

//shop background
const shop = new Sprite ({
    position: {
        x: 350,
        y: 150
        //shop position
    },
    imageSrc: './img/shop.png',
    scale: 2,  //making shop size bigger without effecting background image size
    framesMax: 6    //cropping shop Img
})


//creating player and starting position
const player = new Fighter({
    position:{
    x: 0,
    y: 0
},
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x:0,
        y:0
    },
    imageSrc: 'img/fighter/Idle.png',
    framesMax: 8,  //Idle image has 8 frames
    scale: 2.5,   //making fighter bigger
    offset: {
        x: 125,
        y: 190
    },
    sprites: {
        idle: {
            imageSrc : 'img/fighter/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc : 'img/fighter/Run.png',
            framesMax: 8,
            image: new Image()
        },
        jump: {
            imageSrc : 'img/fighter/Jump.png',
            framesMax: 2,   //this image only has 2 frames
            image: new Image()
        },
        fall: {
            imageSrc : 'img/fighter/Fall.png',
            framesMax: 2,
            // image: new Image()
        },
        // attack: {
        //     imageSrc : 'img/fighter/Jump.png',
        //     framesMax: 8,
        //     image: new Image()
        // },
    }
})

//creating enemy
const enemy = new Fighter({
    position:{
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }, color: "blue",
    offset: {
        x: -50,
        y:0
    }
})

enemy.draw()

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()


//Creating animation loop
function animate() {
    window.requestAnimationFrame(animate) //calling animate, calls function, then calls animate....infinite loop
    c.fillStyle = 'black';  // black background & rectangles
    c.fillRect(0 ,0, canvas.width, canvas.height);  //gets rid of rect trail
    background.update(); //place before player & enemy bc we want this drawn first, not on top of characters
    shop.update();
    player.update(); //corrects rect back to starting frame
    // enemy.update(); //corrects rect back to starting frame

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {  //making sure movement continues even if a different key is lifted up
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')    //making sprite into running animation
    }  else {
        player.switchSprite('idle')
    }

    //jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {  //making sure movement continues even if a different key is lifted up
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey=== 'ArrowRight') {
        enemy.velocity.x = 5
    }
    //detect for collision
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ){
        player.isAttacking = false  //stops crazy multi attack, more accurate hits
        enemy.health -= 20  //subtracting from health bar
        document.querySelector('#enemyHealth').style.width = enemy.health + '%' //shrinking health bar with hits
    }
    // enemy hits
    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ){
        enemy.isAttacking = false  //stops crazy multi attack, more accurate hits
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%' //shrinking health bar with hits
    }
//    END GAME BASED ON HEALTH
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate();

//adding events to key presses
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true  //when press 'd', player moves 5px right along the x axis
            player.lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case 'w':
            keys.w.pressed = true
            player.velocity.y = -20  //controls height of players jump
            break
        case ' ':
            player.attack()
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = "ArrowRight"
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = "ArrowLeft"
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20  //controls height of players jump
            break;
        case "ArrowDown":
            enemy.isAttacking = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false //stop players movement
            break
        case 'a':
            keys.a.pressed = false
            break
    }

        //enemy keys
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})
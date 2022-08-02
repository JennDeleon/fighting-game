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
    //start of sprite properties
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
        },
        attack1: {
            imageSrc : 'img/fighter/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: 'img/fighter/TakeHitwhite.png',
            framesMax: 4
        },
        death: {
            imageSrc: 'img/fighter/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 150,
            y: 20
        },
        width: 160,
        height: 50
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
    },
    //start of sprite properties
    imageSrc: 'img/fighter/by_animations/idle2.png',
    framesMax: 5,  //Idle image has 5 frames
    scale: 1,   //making fighter bigger
    offset: {
        x: 125,
        y: 175
    },
    sprites: {
        idle: {
            imageSrc: 'img/fighter/by_animations/idle2.png',
            framesMax: 5,
        },
        run: {
            imageSrc: 'img/fighter/by_animations/fly.png',
            framesMax: 5,
            image: new Image()
        },
        jump: {
            imageSrc: 'img/fighter/by_animations/fly.png',
            framesMax: 5,
            image: new Image()
        },
        fall: {
            imageSrc: 'img/fighter/by_animations/fly.png',
            framesMax: 5,
        },
        attack1: {
            imageSrc: 'img/fighter/by_animations/attack2.png',
            framesMax: 11,
        },
        takeHit: {
            imageSrc: 'img/fighter/by_animations/hit.png',
            framesMax: 6
        },
        death: {
            imageSrc: 'img/fighter/by_animations/death2.png',
            framesMax: 8
        }
    },
    attackBox: {
        offset: {
            x: -250,
            y: 25
        },
        width: 135,
        height: 50
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
    c.fillStyle = 'rgba( 255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)       //adding opacity to background
    player.update(); //corrects rect back to idle frame
    enemy.update(); //corrects enemy back to idle frame

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
        enemy.switchSprite('run')

    } else if (keys.ArrowRight.pressed && enemy.lastKey=== 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect for collision
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4  //hit detection until animation sword hits enemy
    ){
        enemy.takeHit()
        player.isAttacking = false  //stops crazy multi attack, more accurate hits
        // enemy.health -= 20  //subtracting from health bar
        document.querySelector('#enemyHealth').style.width = enemy.health + '%' //shrinking health bar with hits
    }

    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // enemy hits
    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 7
    ){
        player.takeHit()
        enemy.isAttacking = false  //stops crazy multi attack, more accurate hits
        document.querySelector('#playerHealth').style.width = player.health + '%' //shrinking health bar with hits
    }

    //if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 7) {
        enemy.isAttacking = false
    }

//    END GAME BASED ON HEALTH
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate();

//adding events to key presses
window.addEventListener('keydown', (event) => {
    if (!player.dead) {

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
        }
    }
    if (!enemy.dead)
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = "ArrowRight"
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = "ArrowLeft"
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20  //controls height of pla yers jump
            break;
        case "ArrowDown":
            enemy.attack()
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
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

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
    rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
    rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
    rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner ({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = "flex"
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = "Tie"
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 wins'
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 wins'
    }
}

//CREATING COUNT DOWN TIMER
let timer = 61;
let timerId
function decreaseTimer (){
    if(timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer --
        document.querySelector('#timer').innerHTML = timer
    }
    //ONLY DISPLAYS IF A TIE OCCURS
    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}
decreaseTimer()


//Creating animation loop
function animate() {
    window.requestAnimationFrame(animate) //calling animate, calls function, then calls animate....infinite loop
    c.fillStyle = 'black';  // black background & rectangles
    c.fillRect(0 ,0, canvas.width, canvas.height);  //gets rid of rect trail
    player.update(); //corrects rect back to correct color
    enemy.update(); //corrects rect back to correct color

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {  //making sure movement continues even if a different key is lifted up
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey=== 'd') {
        player.velocity.x = 5
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
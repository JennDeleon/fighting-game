//Blueprint for the object before we create it
class Sprite {
    constructor({position}) {
        this.position = position
        this.width = 50
        this.height = 150;
    }

    //drawing sprite
    draw() {
    }

    update() {
        this.draw()

    }
}
    class Fighter {
    constructor({position, velocity, color = 'red', offset}) { //wrapping arguments into an object to make code cleaner/easier as we add more properties onto the constructor
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150;
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }
    //drawing sprite
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attack box
        if (this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
    }
    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y   //equal to the velocity we are passing onto players

        if (this.position.y + this.height + this.velocity.y >= canvas.height) { //only allowing rectangle to hit height of canvas
            this.velocity.y = 0;
        } else this.velocity.y += gravity //stops player from moving below canvas
    }

    attack(){
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100 )
    }
}

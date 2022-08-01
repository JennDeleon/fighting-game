//Blueprint for the object before we create it
class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1 }) {
        //scale = 1 is making shop size bigger without effecting background image size
        //frames max is to  make sure background image doesn't scale when cropping looped shop img
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image()  //native JS API object called Image()...creates a html image within a JS property
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0 //how many frames have we elapsed over, increases as game goes on
        this.framesHold = 10 //how many frames we should go though before  we change frames current
    }

    //drawing sprite
    draw() {
        //Canvas function, 1st argument is HTML image element. 2nd x cord & 3rd y cord. 4th width of Img. 5th height of Img
        c.drawImage(
            this.image,
            //cropping img to create a looping frame and animate
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax ,
            this.image.height ,
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }


    update() {
        this.draw()
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) { //take framesElapsed, divide it by framesHole & if remainder is 0, run next lines
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }
}
    class Fighter extends Sprite{
    constructor({position,         //wrapping arguments into an object to make code cleaner/easier as we add more properties onto the constructor

                    velocity,
                    color = 'red',
                    offset,
                    imageSrc, scale = 1,
                    framesMax = 1
    }) {
        super({  // super()calls the constructor of the parent
            position,
            imageSrc,
            scale,
            framesMax,

        })

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
        this.framesCurrent = 0
        this.framesElapsed = 0 //how many frames have we elapsed over, increases as game goes on
        this.framesHold = 10 //how many frames we should go though before  we change frames current
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y   //equal to the velocity we are passing onto players

        if (this.position.y + this.height + this.velocity.y >= canvas.height -55) { //only allowing rectangle to hit height of canvas
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



export default class Square{

    constructor( data, anchor, index){
        this.data = data
        this.anchor = {}
        this.anchor.x = anchor.x
        this.anchor.y = anchor.y
        this.index = index
        this.canDown = true
    }

    down(){
        this.anchor.y += 1
    }

    left(){
        this.anchor.x -= 1
    }

    right(){
        this.anchor.x += 1
    }

    change(){
        this.index = (this.index + 1) % 4
    }

}
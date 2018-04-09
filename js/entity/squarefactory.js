import Square from './square.js'

// 方块工厂实例 
let squareFactory
// 方块类型
let squareDatas = [
    [
        [
            [0,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,0,0,0],
        ],
        [
            [0,0,0,0],
            [1,1,1,0],
            [0,0,1,0],
            [0,0,0,0],
        ],
        [
            [0,1,0,0],
            [0,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
        ],
        [
            [1,0,0,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0],
        ],
    ],
    [
        [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
        ],
        [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0],
        ],
        [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
        ],
        [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0],
        ],
    ],
]


export default class SquareFactory{

    constructor(){
        if( squareFactory ){
            return squareFactory
        }
        squareFactory = this
    }

    product(){
        return this.randomSquare()
    }

    // 随机方块
    randomSquare(){
        let type = Math.ceil(Math.random() * squareDatas.length) - 1
        let x = Math.ceil(Math.random() * 7) - 1
        let index = Math.ceil(Math.random() *4) - 1
        let data = squareDatas[type];
        return new Square( data, { x:x, y:0}, index)
    }

}
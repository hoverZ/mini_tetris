import Background from './runtime/background'
import SquareFactory from './entity/squarefactory'
import DataBus from './runtime/databus'

let ctx = canvas.getContext('2d')
// 初始化方块生产者
let squareFactory = new SquareFactory()

export default class Main{

    constructor(){
        console.log("开始我的俄罗斯方块")
        this.databus = new DataBus()
        // 设置捕捉向下手势动作有效区域，touch.screenY 小于this.downArea 为捕捉区域
        // 方块向下
        this.downArea = Math.floor(canvas.height / 10) * 7
        // onTouchStart 事件 touch.screenY > this.downArea 
        // 方块向左，touch.screenX < this.leftArea
        // 方块向右，touch.screenX > this.rightArea
        // 修改方块方向，this.leftArea < touch.screenX < this.rightArea
        this.leftArea = Math.floor(canvas.width / 3)
        this.rightArea = canvas.width - this.leftArea
        // 游戏区二维数组
        this.gameData = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ];
        
        // 游戏开始
        this.start()
        this.touchMove = []
        // 定时清除手势触碰点
        this.intervalClearTouchMove = setInterval(() => {
            this.touchMove = []
        }, 500)
        wx.onTouchStart( (data) => {
            this.touchStartEvent(data.touches[0])
        })
        wx.onTouchMove( (data) => {
            this.touchMoveEvent( data.touches )
        })

    }

    /**
     * 手势（只捕捉了向下手势）
     * 当第一个触摸点与最后一个触摸点高度差为 100 时，触发向下操作
     * @param {事件捕捉的点} touches 
     */
    touchMoveEvent( touches ){
        this.touchMove = this.touchMove.concat(touches[0])
        let first = this.touchMove[0]
        let end = this.touchMove[this.touchMove.length - 1]
        if( end.screenY - first.screenY > 100){
            this.fall()
        }
    }

    /**
     * 触摸事件回调
     * @param {触摸点} touch 
     */
    touchStartEvent( touch ){
        
        if(!this.current.canDown){
            return;
        }
        if( touch.screenY < this.downArea){
            return;
        }
        if( touch.screenX < this.leftArea) {
            this.left()
        }else if( touch.screenX < this.rightArea){
            this.change()
        }else{
            this.right()
        }
    }

    /**
     * 开始
     */
    start(){
        // 初始化游戏数据
        this.databus.init()
        // 设置游戏结束初始状态
        this.isGameOver = false  
        // 设置主画板的底色      
        ctx.fillStyle = '#000000'
        ctx.fillRect( 0, 0, canvas.width ,canvas.height);
        // 初始化游戏背景
        this.bg = new Background(ctx)
        // 获取当前方块
        this.current = squareFactory.product()
        // 获取下一个方块
        this.next = squareFactory.product()
        this.clearGameData()
        // 渲染游戏界面
        let clearLine = this.bg.render(ctx, this.gameData)
        // 计算分数
        this.databus.clearLine += clearLine
        this.databus.score += this.calculateScore(clearLine)
        // 渲染头部界面
        this.bg.renderPre(ctx, this.next.data[this.next.index], this.databus)
        // 设置方块下落时间间隔，300 毫秒
        this.intervalNumber = setInterval(() => {
            this.databus.time += 500
            this.update()
        }, 500)
    }

    calculateScore( clearLine ){
        if(clearLine == 0 || clearLine === undefined){
            return 0
        }
        let score = 1;
        for (let index = 0; index < clearLine; index++) {
            score *= 2
        }
        return score
    }

    // 重置 GameData 数据
    resetGameData(){
        // 重置已经固定的数据
        let y = this.current.anchor.x
        let x = this.current.anchor.y
        let data = this.current.data[this.current.index]
        for(let xIndex = 0; xIndex < data.length; xIndex ++){
            for( let yIndex = 0; yIndex < data[0].length; yIndex ++){
                if( data[yIndex][xIndex] == 1){
                    this.gameData[x+yIndex][y+xIndex] = 0
                }
            }
        }
    }

    // 设置 GameData 数据
    repaintGameData(status){
        // 设置数据
        let y = this.current.anchor.x
        let x = this.current.anchor.y
        let data = this.current.data[this.current.index]
        for(let xIndex = 0; xIndex < data.length; xIndex ++){
            for( let yIndex = 0; yIndex < data[0].length; yIndex ++){
                if( data[yIndex][xIndex] == 1 ){
                    this.gameData[x+yIndex][y+xIndex] = status
                }
            }
        }
        ctx.fillStyle = '#000000'
        ctx.fillRect( 0, 0, canvas.width ,canvas.height);
        // 渲染游戏界面
        let clearLine = this.bg.render(ctx, this.gameData)
        // 计算分数
        this.databus.clearLine += clearLine
        this.databus.score += this.calculateScore(clearLine)
        
        // 渲染头部界面
        this.bg.renderPre(ctx, this.next.data[this.next.index], this.databus)
    }

    // 定时器任务
    update(){
        this.down()
        // 是否结束
        this.checkGameOver()
        let restart = this.restart
        if( this.isGameOver ){
            // 清除定时器
            clearInterval(this.intervalNumber)
            wx.showModal({
                title: "Tips",
                content: "Game Over !",
                confirmText: "restart",
                confirmColor: "#019858",
                showCancel: false,
                success:(data)=>{
                    if(data.confirm){
                        this.restart()
                    }else{

                    }
                },
                fail: function(err){
                    console.log(err)
                }
            })
        }
    }

    // 下坠
    fall(){
        while(this.current.canDown){
            this.down()
        }
    }

    /**
     * 判断是否可以移动
     * @param {string} type 方块变动类型：位置、形状
     */
    canMove(type){
        let y = this.current.anchor.x
        let x = this.current.anchor.y
        let index = this.current.index
        let data;
        switch(type){
            case 'down':
                x += 1
                break;
            case 'left':
                y -= 1
                break;
            case 'right':
                y += 1
                break;
            case 'change':
                index = (index + 1) % 4
                break;
        }
        data = this.current.data[index]
        // 是否可以向左
        for(let xIndex = 0; xIndex < data.length; xIndex ++){
            for( let yIndex = 0; yIndex < data[0].length; yIndex ++){
                if( data[yIndex][xIndex] == 1 && (x + yIndex >= 20 || y+xIndex >= 10 || y+xIndex < 0 || this.gameData[x+yIndex][y+xIndex] == 2)){
                    return false
                }
            }
        }
        return true
    }

    /**
     * 1 表示可移动，2表示已固定，0表示无
     */
    down(){
        // 当前方块无法向下时，替换为下一块方块
        if( !this.current.canDown ){
            this.current = this.next
            this.next = squareFactory.product()
            this.bg.renderPre(ctx, this.next.data[this.next.index], this.databus)
        }
        let canDown = this.canMove('down')
        // 重置 GameData 数据
        this.resetGameData()
        // 是否可以向下
        
        let status = canDown ? 1 : 2
        
        if(canDown){
            // 向下移动
            this.current.down()
        }else{
            this.current.canDown = false
        }
        // 设置 GameData 数据
        this.repaintGameData(status)
        this.bg.render(ctx, this.gameData)
    }

    /**
     * 向左移动
     */
    left(){
        if(!this.canMove('left')){
            return
        }
        this.resetGameData()
        this.current.left()
        this.repaintGameData(1)
    }

      /**
     * 向右移动
     */
    right(){
        if(!this.canMove('right')){
            return
        }
        this.resetGameData()
        this.current.right()
        this.repaintGameData(1)
    }

    /**
     * 变形
     */
    change(){
        if(!this.canMove('change')){
            return 
        }
        this.resetGameData()
        this.current.change() 
        this.repaintGameData(1)
    }

    /**
     * 结束机制
     * 判断最上面一行是否存在已经硬化的方块
     * 存在则结束，不存在则继续
     */
    checkGameOver(){
        for(let col = 0; col < this.gameData[0].length; col ++){
            if(this.gameData[0][col] == 2){
                this.isGameOver = true
                if( this.databus.maxScore < this.databus.score ) {
                    this.databus.setHighestScore( this.databus.score )
                } 

                return true
            }
        }
        return false
    }

    /**
     * 待开发
     */
    stop(){

    }

    /**
     * 清空 gameData 数组
     */
    clearGameData(){
        for(let row = 0; row < this.gameData.length; row ++){
            for(let col = 0; col < this.gameData[0].length; col ++){
                this.gameData[row][col] = 0
            }
        }
    }

    /**
     * 重新开始
     */
    restart(){
        this.clearGameData()
        this.start()
    }

    /**
     * 是否可以向下移动
     */
    // canDown(){
    //     let y = this.current.anchor.x
    //     let x = this.current.anchor.y
    //     const data = this.current.data[this.current.index]
    //     // 是否可以向下
    //     let canDown = true
    //     for(let xIndex = 0; xIndex < data.length; xIndex ++){
    //         for( let yIndex = 0; yIndex < data[0].length; yIndex ++){
    //             if( data[yIndex][xIndex] == 1 && ( x + yIndex + 1 >= 20 || this.gameData[x+yIndex+1][y+xIndex] == 2)){
    //                 return false
    //             }
    //         }
    //     }
    //     return true
    // }

     /**
     * 是否可以向左移动
     */
    // canLeft(){
    //     let y = this.current.anchor.x
    //     let x = this.current.anchor.y
    //     const data = this.current.data[this.current.index]
    //     // 是否可以向左
    //     for(let xIndex = 0; xIndex < data.length; xIndex ++){
    //         for( let yIndex = 0; yIndex < data[0].length; yIndex ++){
    //             if( data[yIndex][xIndex] == 1 && ( y+xIndex-1 < 0 || this.gameData[x+yIndex][y+xIndex-1] == 2)){
    //                 return false
    //             }
    //         }
    //     }
    //     return true
    // }

    /**
     * 是否可以变形
     */
    // canChange(){
    //     let y = this.current.anchor.x
    //     let x = this.current.anchor.y
    //     let index = (this.current.index + 1) % 4
    //     const data = this.current.data[index]
    //     // 是否可以向左
    //     for(let xIndex = 0; xIndex < data.length; xIndex ++){
    //         for( let yIndex = 0; yIndex < data[0].length; yIndex ++){
    //             if( data[yIndex][xIndex] == 1 && (x + yIndex >= 20 || y+xIndex >= 10 || y+xIndex < 0 || this.gameData[x+yIndex][y+xIndex] == 2)){
    //                 return false
    //             }
    //         }
    //     }
    //     return true
    // }
    
    /**
     * 是否可以向右移动
     */
    // canRight(){
    //     let y = this.current.anchor.x
    //     let x = this.current.anchor.y
    //     const data = this.current.data[this.current.index]
    //     // 是否可以向右
    //     let canDown = true
    //     for(let xIndex = 0; xIndex < data.length; xIndex ++){
    //         for( let yIndex = 0; yIndex < data[0].length; yIndex ++){
    //             if( data[yIndex][xIndex] == 1 && ( y+xIndex+1 >= 10 || this.gameData[x+yIndex][y+xIndex+1] == 2)){
    //                 return false
    //             }
    //         }
    //     }
    //     return true
    // }

}
const squareColor = [ "#000000", "#0080FF", "#01B468"]

let background
export default class Background {

    constructor(ctx){
        if(background){
            return background
        }
        background = this
        this.row = 20
        this.column = 10
        // 头部高度
        this.headerHeight = canvas.height / 6
        let height = canvas.height - this.headerHeight
        this.squareSide = Math.floor(height / this.row); 
        
        // 创建自带画板
        this.canvas = wx.createCanvas()
        this.height = this.row  * this.squareSide
        this.width = this.column * this.squareSide
        this.headerHeight = canvas.height - this.height - 1
        this.parentX = (canvas.width - this.width) / 2
        this.parentY = 0
        this.canvas.width = this.width + 1
        this.canvas.height = canvas.height
        this.bgCtx = this.canvas.getContext('2d')
        
        this.resetGameSquare(ctx)
        this.resetPreSquare(ctx)
    }

    drawToCtx(ctx){
        ctx.drawImage(this.canvas, this.parentX, this.parentY)
    }

    resetGameSquare(ctx){
        let startX = 1,startY = this.headerHeight  
        let bgCtx = this.bgCtx
        // ============================   游戏区   ===========================
        // 画背景
        bgCtx.fillStyle="#000000";
        bgCtx.fillRect( startX, startY, this.width ,this.height );
        // 线颜色
        bgCtx.strokeStyle = "#ffffff";
        bgCtx.lineWidth = 1;
        // 画横线
        bgCtx.beginPath();        
        for( let row = 0, sY = startY ; row <= this.row; row ++){
            bgCtx.moveTo(startX,sY);
            bgCtx.lineTo(startX + this.width,sY);
            sY += this.squareSide
        }
        // 画竖线
        for( let col = 0, sX = startX ; col <= this.column; col ++ ){
            bgCtx.moveTo(sX,startY);
            bgCtx.lineTo(sX,startY + this.height);
            sX += this.squareSide
        }
        bgCtx.closePath();
        bgCtx.stroke();
        // ==================================================================
        this.drawToCtx(ctx)
    }

    resetPreSquare(ctx){
        let bgCtx = this.bgCtx
        // ============================   预览区   ===========================
        // 画背景
        bgCtx.fillStyle="#272727";
        bgCtx.fillRect( 0, 0, this.width ,this.headerHeight );
        bgCtx.strokeStyle = "#B9B9FF";
        bgCtx.lineWidth = 1;
        bgCtx.beginPath();  
        bgCtx.moveTo(3 * this.squareSide, 0);
        bgCtx.lineTo(3 * this.squareSide, 4 * this.squareSide);
        bgCtx.moveTo(7 * this.squareSide, 0);
        bgCtx.lineTo(7 * this.squareSide, 4 * this.squareSide);
        bgCtx.moveTo(3 * this.squareSide, 4 * this.squareSide);
        bgCtx.lineTo(7 * this.squareSide, 4 * this.squareSide);
        bgCtx.closePath();
        bgCtx.stroke();
        // ==================================================================
        this.drawToCtx(ctx)
    }

    reset(ctx){
        let startX = 0,startY = this.headerHeight  
        let bgCtx = this.bgCtx
        // ============================   游戏区   ===========================
        
        // 线颜色
        bgCtx.strokeStyle = "#ffffff";
        bgCtx.lineWidth = 1;
        // 画横线
        bgCtx.beginPath();        
        for( let row = 0, sY = startY ; row <= this.row; row ++){
            bgCtx.moveTo(startX,sY);
            bgCtx.lineTo(startX + this.width,sY);
            sY += this.squareSide
        }
        // 画竖线
        for( let col = 0, sX = startX + 1 ; col <= this.column; col ++ ){
            bgCtx.moveTo(sX,startY);
            bgCtx.lineTo(sX,startY + this.height);
            sX += this.squareSide
        }
        bgCtx.closePath();
        bgCtx.stroke();
        // ==================================================================
        
        // ============================   预览区   ===========================
        // 画背景
        bgCtx.fillStyle="#272727";
        bgCtx.fillRect( 0, 0, this.width ,this.headerHeight );
        bgCtx.strokeStyle = "#B9B9FF";
        bgCtx.lineWidth = 1;
        bgCtx.beginPath();  
        bgCtx.moveTo(3 * this.squareSide, 0);
        bgCtx.lineTo(3 * this.squareSide, 4 * this.squareSide);
        bgCtx.moveTo(7 * this.squareSide, 0);
        bgCtx.lineTo(7 * this.squareSide, 4 * this.squareSide);
        bgCtx.moveTo(3 * this.squareSide, 4 * this.squareSide);
        bgCtx.lineTo(7 * this.squareSide, 4 * this.squareSide);
        bgCtx.closePath();
        bgCtx.stroke();
        // ==================================================================
        this.drawToCtx(ctx)
    }

    render(ctx, gameData){
        this.resetGameSquare(ctx)
        let startX = 1,startY = this.headerHeight  
        let bgCtx = this.bgCtx
        let rowIndex =  this.row - 1
        let clearLine = 0
        for (let row = this.row - 1; row >= 0; row--, rowIndex --) {
            let clear = true
            for(let col = this.column - 1; col >= 0; col --){
                if( gameData[row][col] != 2){
                    clear = false
                }
            }
            // 消行动作
            if(clear == true){
                // 消除的行数
                clearLine ++ 
                // 修改 GameData
                for(let setRow = row; setRow >= 0; setRow -- ){
                    let tmpRow = setRow - 1
                    for(let setCol = this.column - 1; setCol >=0; setCol --){
                        if(tmpRow < 0){
                            gameData[setRow][setCol] = 0
                        }else{
                            gameData[setRow][setCol] = gameData[tmpRow][setCol]
                        }
                    }
                }
                row ++
                continue
            }
            let x = startX;
            let y = startY;
            for(let col = this.column - 1; col >= 0; col -- ){
                bgCtx.fillStyle = squareColor[gameData[row][col]];
                y = startY + row * this.squareSide
                x = col * this.squareSide
                bgCtx.fillRect( x+1, y+1, this.squareSide - 2 ,this.squareSide - 2);
            }
        }
        this.drawToCtx(ctx)
        return clearLine
    }

    renderText(ctx, dataBus){
        let bgCtx = this.bgCtx
        let textStart = this.squareSide/2
        let startX = 3 * this.squareSide;
        let startY = 0
        let scoreText = [
            "Highest: ",
            dataBus.getHighestScore() == "" ? 0 : dataBus.getHighestScore(),
            "Score: ",
            dataBus.score,
        ]
        bgCtx.fillStyle = '#ffffff'
        bgCtx.font="10px Arial";
        for(let index = 0; index < scoreText.length; index ++){
            bgCtx.fillText( scoreText[index],0,textStart + this.squareSide * index)
        }
        let otherText = [ 
            "ClearLines: ",
            dataBus.clearLine,
            "Times: ",
            Math.floor(dataBus.time / 1000),
        ]
        startX = startX + 4 * this.squareSide + 2
        for(let index = 0; index < otherText.length; index ++){
            bgCtx.fillText( otherText[index], startX, textStart + this.squareSide * index)
        }
        this.drawToCtx(ctx)
    }

    renderPre(ctx, preData, dataBus){
        let startX = 3 * this.squareSide;
        let startY = 0
        let bgCtx = this.bgCtx
        let x,y;
        this.resetPreSquare(ctx)
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if(!preData[row][col]){
                    bgCtx.fillStyle = '#000000'
                }else{
                    bgCtx.fillStyle = '#FFD306'
                }
                
                y = startY + row * this.squareSide
                x = startX + col * this.squareSide
                bgCtx.fillRect( x+1, y+1, this.squareSide - 2 ,this.squareSide - 2);
            }
        }
        this.drawToCtx(ctx)
        this.renderText(ctx, dataBus)
    }

}
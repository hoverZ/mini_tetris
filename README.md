# 微信小游戏——俄罗斯方块(使用前需要删除 README.md)

## 文件目录
```
js
 |-base
    |_sprite.js （没有用到）
 |-entity
    |_square.js
    |_squarefactory.js
 |-libs
    |_symbol.js
    |_weapp-adapter.js
 |-runtime
    |_background.js
    |_databus.js
 |_main.js
game.js
game.json
project.config.json
```

## 开发流程
### 确定游戏开发流程
0、界面绘制
1、游戏开始（初始化数据）
2、获取方块
3、确定可以移动（左右移动方块，旋转方块、快速下落）的条件
4、确定下一个方块入场规则
5、确定方块消除规则
6、确定游戏结束规则
7、游戏推进规则
8、得分规则
### 界面绘制
1、头部
展示内容：下一方块形状，数据（最高得分、当前得分、耗时/s、消除行数）
2、游戏区
方块展示方块移动
### 游戏开始
数据初始化：
1、游戏结束状态 this.isGameOver = false
2、游戏数据 this.databus.init()
3、初始化游戏区二维数组 clearGameData
4、初始化游戏界面
### 获取方块
1、获取当前方块 squareFactory.product()
2、获取下一方块 squareFactory.product()
### 确定可移动条件
#### 判断规则：
获取移动后方块的位置和形状，并与当前的 gameData 就行比较,代码如下
```
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
```
#### 移动操作区域
将屏幕划分为 4 划分为有效区域:
- 坠落区域：touch.screenY 小于this.downArea 为捕捉区域
- 左移区域：touch.screenY > this.downArea && touch.screenX < this.leftArea
- 改变方向区域：touch.screenY > this.downArea && this.leftArea < touch.screenX < this.rightArea
- 右移区域：touch.screenY > this.downArea && touch.screenX > this.rightArea

#### 移动触发条件:
通过监听 wx.onTouchStart 和 wx.onTouchMove 两个事件

1、wx.onTouchStart: 用于方块 左右移动和改变方向
```
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
```
wx.onTouchMove, wx.onTouchEnd: 用于方块坠落（使用下滑手势触发）
规则：
    
    判断 this.touchMove 中第一个点和最后一个点的 y 坐标差
```
    wx.onTouchEnd( (data) => {
        if(this.touchMove.length < 2){
            return
        }
        let first = this.touchMove[0]
        let end = this.touchMove[this.touchMove.length - 1]
        if( end.screenY - first.screenY > 100){
            this.fall()
        }
        this.touchMove = []
    })
    wx.onTouchMove( (data) => {
        this.touchMove = this.touchMove.concat(data.touches[0])
    })
```
   
### 确定下一个方块入场规则
当方块无法下移的时候为下移方块入场
### 确定方块消除规则
当 gameData 数据存在行中的所有元素都为固定状态时消除
### 确定游戏结束规则
当 gameData 的第 0 行存在固定状态的元素
### 游戏推进规则
方块定时下移
### 得分规则



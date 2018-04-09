
let dataBusInstance

export default class DataBus{

    constructor(){
        if( dataBusInstance ){
            return dataBusInstance
        }
        dataBusInstance = this
        this.highestScoreKey = 'mini_tetris_highest_score' 
        
    }

    init(){
        this.score = 0
        this.clearLine = 0
        this.time = 0
        this.maxScore = wx.getStorageSync(this.highestScoreKey)
    }

    getHighestScore(){
        return this.maxScore
    }

    setHighestScore( highestScore ){
        wx.setStorageSync( this.highestScoreKey, highestScore)
    }

}
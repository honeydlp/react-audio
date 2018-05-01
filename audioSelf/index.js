//音乐播放器
import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import { sec_to_time } from 'src/utils/tools'
import './index.css'

/**
 * props
 * src              string:音乐播放器到src
 * preload          string:是否自动加载 none,auto
 * playerClass      object          
 */

class AudioSelf extends React.Component{
    constructor(props){
        super()
        this.audio = null
        this.state = {
            src :  '',
            preload : 'none',
            progressWidth: 1,
            durationT:'00:00',
            playedT:'00:00',
            playerBtn:0,           //0点击播放按钮 1点击暂停按钮 2loading 3出错
            loadedW:0
        }
    }
    componentWillReceiveProps(next,old){
        this.setState({
            src :  next.src,
            preload : next.preload,
        })
    }
    componentDidMount(){
        let audioNode = this.audio,
        timeline = this.timeline,
            that = this,
            duration,
            timelineWidth = timeline.offsetWidth;

        // 得到初始数据
        function loadedmetadata() {
            that.setState({
                playerBtn:2
            }) 
        }
        this.loadedmetadata = loadedmetadata;

        // 播放进度
        function timeUpdate() {
            var progressWidth = timelineWidth * (audioNode.currentTime / duration);
            that.setState({
                playedT: formatTime(audioNode.currentTime),
                progressWidth:progressWidth>1?progressWidth:1
            })
            if(audioNode.currentTime === 0){
                that.setState({
                    playerBtn:0
                }) 
            }
        }
        this.timeUpdate = timeUpdate;

        // 是否能够不停下来进行缓冲的情况下持续播放指定的音频/视频
        function canplaythrough() {
            that.setState({
                durationT:formatTime(audioNode.duration),
                playerBtn:1,
                loadedW:  timelineWidth              
            }) 
            duration = audioNode.duration;
        }
        this.canplaythrough = canplaythrough;

        // 结束事件
        function end(){
            audioNode.currentTime = 0;
            that.setState({
                progressWidth:1,
                playedT:'00:00'
            }) 
        }
        this.end = end;
         // 进度条点击
         function timelineClick(e) {
            if(that.state.playerBtn === 0){
                return;
            }
            // 更新坐标位置
            var newLeft = e.offsetX;
            audioNode.currentTime = duration * newLeft / timelineWidth;
        }
        this.timelineClick = timelineClick;

        // 监听事件
        audioNode.addEventListener("loadedmetadata", that.loadedmetadata);
        audioNode.addEventListener("timeupdate", that.timeUpdate);
        audioNode.addEventListener("canplaythrough", that.canplaythrough);
        audioNode.addEventListener("ended", that.end);
        timeline.addEventListener("click", that.timelineClick); 
    }
    play  = () => {
        this.audio.play()
        this.setState({
            playerBtn:1
        })
    }
    pause = () => {
        this.audio.pause()
        this.setState({
            playerBtn:0
        })
    }
    componentWillUnmount(){
        var 
        audioNode = this.audio,
        timeline = this.timeline;
        // 监听事件
        audioNode.removeEventListener("loadedmetadata", this.loadedmetadata);
        audioNode.removeEventListener("timeupdate", this.timeUpdate);
        audioNode.removeEventListener("canplaythrough", this.canplaythrough);
        audioNode.removeEventListener("ended", this.end);
        timeline.removeEventListener("click", this.timelineClick); 
    }
    render(){
        let 
        progressWidth = this.state.progressWidth,
        durationT = this.state.durationT,
        playedT = this.state.playedT,
        playerBtn = this.state.playerBtn,
        loadedW = this.state.loadedW,
        playerHtml = '';
        
        switch (playerBtn) {
            case 0:
                playerHtml = ( <p className="play" onClick = {this.play}></p> )
                break;
            case 1:
                playerHtml = ( <p className="pause" onClick = {this.pause}></p> )
                break;     
            case 2:
                playerHtml = ( <p className="loading"></p> )
                break;      
            default:
                playerHtml = ( <p className="error"></p> )
                break; 
        }
        
        return (
            <div className="audiojs" >
                <audio src={ this.props.src } preload={ this.props.preload } ref={(audio)=>{this.audio = audio}}></audio> 
                <div className="play-pause">             
                    { playerHtml }            
                </div>           
                <div className="scrubber" ref={(timeline)=>{this.timeline = timeline}}>             
                    <div className="progress" style={{width:progressWidth}}></div>             
                    <div className="loaded" style={{width:loadedW}}></div>           
                </div>           
                <div className="time">             
                    <em className="played">{ playedT }</em>/<strong className="duration">{ durationT }</strong>
                </div>           
                <div className="error-message"></div>
            </div>
        )
    }
} 

// 简单格式化时间，小于9的数字前面添加0
function formatTime(num) {
    var sectime = sec_to_time(num),
        len = sectime.split(':').length;
    if(len === 1){
        sectime = '00:'+sectime
    }
    return sectime;
}

export default AudioSelf
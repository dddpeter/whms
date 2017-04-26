/**
 * Created by admin on 2017/4/25.
 */
import React, {Component} from 'react';
import {Icon, Popover,} from 'antd';

class Pop extends Component{
    state = {
        visibleStatuspop: false,
        status:''
    }

    statuspopVisibleChange = (visibleStatuspop) => {

        this.setState({visibleStatuspop});
    }
    statusChange=(e)=>{
        this.setState({
            status:e.target.innerHTML
        })
    }
    stopPop=(e)=>{
        e.stopPropagation();
        e.preventDefault()
    }
    render(){
        return(
            <div className="edit-div" ><span>Status:{this.state.status}</span>
            <Popover
                content={<div><p><a onClick={this.statusChange} >Active</a></p>
                <p> <a onClick={this.statusChange}>Paused</a></p><p><a onClick={this.statusChange}>Close</a></p></div>
        }
                title="Title"
                trigger="click"
                visible={this.state.visibleStatuspop}
                onVisibleChange={this.statuspopVisibleChange}
            >
                <Icon type="edit" className="edit-icon" onClick={this.stopPop}></Icon>
            </Popover>
                </div>
        )
    }
}
export default Pop;
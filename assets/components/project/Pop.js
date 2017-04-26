/**
 * Created by admin on 2017/4/25.
 */
import React, {Component} from 'react';
import {Icon, Popover,} from 'antd';

class Pop extends Component{

    constructor(props){
        super(props);
        this.state = {
            visibleStatuspop: false,
            status:''
        }
    }
    componentDidMount(){
        this.setState({
            status:this.props.project.status
        });
    }
    statusPopVisibleChange = (visibleStatuspop) => {

        this.setState({visibleStatuspop});
    }
    statusChange=(e,status)=>{
        this.setState({
            status:status,
            visibleStatuspop: false
        });
    }
    stopPop=(e)=>{
        e.stopPropagation();
        e.preventDefault()
    }
    render(){

        return(
            <div className="edit-div" ><span>Status:{this.state.status}</span>
            <Popover
                content={
                <div>
                <p><a onClick={(e,v)=>this.statusChange(e,'ACTIVE')} >Active</a></p>
                <p> <a onClick={(e,v)=>this.statusChange(e,'PENDING')}>Pending</a></p>
                <p><a onClick={(e,v)=>this.statusChange(e,'CLOSE')}>Close</a></p>
                </div>
        }
                title="Title"
                trigger="click"
                visible={this.state.visibleStatuspop}
                onVisibleChange={this.statusPopVisibleChange}
            >
                <Icon type="edit" className="edit-icon" onClick={this.stopPop}></Icon>
            </Popover>
                </div>
        )
    }
}
export default Pop;
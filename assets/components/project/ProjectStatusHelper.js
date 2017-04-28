/**
 * Created by admin on 2017/4/25.
 */
import React, {Component} from 'react';
import {Icon, Popover,message} from 'antd';

message.config({
    top: 80,
    duration: 2,
});
class ProjectStatusHelper extends Component{

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
        var that =this;
        this.setState({
            visibleStatuspop: false
        });
        fetch(`/api/project/${this.props.project.pid}`,
            {
                method:'POST',
                credentials:'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({status:status})
            })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    return {data: []};
                }
            })
            .then(function (data) {
                if(data.result){
                    message.success('修改成功');
                    that.setState({
                        status:status,
                    });
                }
                else{
                    message.error('修改失败');
                }
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
                <p><a className="project-status-link" onClick={(e,v)=>this.statusChange(e,'ACTIVE')} >Active</a></p>
                <p> <a className="project-status-link"  onClick={(e,v)=>this.statusChange(e,'PENDING')}>Pending</a></p>
                <p><a className="project-status-link"  onClick={(e,v)=>this.statusChange(e,'CLOSE')}>Close</a></p>
                </div>
        }
                title="改变项目状态"
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
export default ProjectStatusHelper;
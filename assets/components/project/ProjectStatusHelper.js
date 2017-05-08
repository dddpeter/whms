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
            status:this.props.project.status
        }
    }
    componentDidMount(){
        this.setState({
            status:this.props.project.status
        });
    }
    statusPopVisibleChange = (visibleStatuspop) => {

        this.setState({visibleStatuspop});
    };
    statusChange=(e,status)=>{
        let that =this;
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
                    that.props.callbackChangeStatus(that.props.project,status);
                }
                else{
                    message.error('修改失败');
                }
            });
    };
    stopPop=(e)=>{
        e.stopPropagation();
        e.preventDefault()
    };
    render(){
        let icon =<span style={{ width:'37px',display:'inline-block'}}></span>;
        let user;
        if(window.localStorage['user']){
            user = JSON.parse(window.localStorage['user']);
        }
        if(user){
            if (this.state.status=='OPEN' && user.email.endsWith('unicc.com.cn')){
                icon = <Icon type="edit" className="edit-icon" onClick={this.stopPop}></Icon>;
            }
        }


        return(
            <div className="edit-div" ><span>Status:<span className="project-status">{this.state.status}</span></span>
            <Popover
                content={
                <div>
                <p className="project-status-link"><a onClick={(e,v)=>this.statusChange(e,'OPEN')} >Active</a></p>
                <p className="project-status-link"><a onClick={(e,v)=>this.statusChange(e,'CLOSE')}>Close</a></p>
                </div>
        }
                placement="topRight"
                title="改变项目状态"
                trigger="click"
                visible={this.state.visibleStatuspop}
                onVisibleChange={this.statusPopVisibleChange}
            >
                {icon}
            </Popover>
                </div>
        )
    }
}
export default ProjectStatusHelper;
/**
 * Created by admin on 2017/4/25.
 */
import {Modal, Button} from 'antd';
import React, {Component} from 'react';
import {Select,message, InputNumber} from 'antd';
const Option = Select.Option;
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';

class ProjectMemberHelper extends Component {

    constructor(props){
        super(props);
        this.state = {
            visibleMemberEdit: false,
            users:[],
            members:[],
            addError:true,
            modalVisible:false
        }
    }
    getUser(){
        let that = this;
        fetch(`/api/users/pid?pid=${this.props.pid}`,
            {credentials: 'same-origin'})
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    return {users: []};
                }
            })
            .then(function (data) {
                if (data.result) {
                    that.setState({
                        users:data.users
                    });
                }
                else{
                    message.error('获取用户列表失败，请刷新页面');
                }
            });

    }
    selectMember(v){
        if(v.length<1){
            this.setState({
                addError:true
            })
        }else{
            this.setState({
                members:v,
                addError:false
            });
        }


    }
    memberAdd=()=>{
        this.memberAddCancel();
    };
    memberAddCancel=()=>{
        this.setState({
            modalVisible: false,
        });

    };
    componentDidMount(){
        this.getUser()
    }
    render() {
        return (
            <Modal title="Add Project Member" visible={this.state.modalVisible}
                   maskClosable={true}
                   onCancel={this.memberAdd}
                   footer={null}>
                <div className="addContent">
                    <div className="addTeamMember">Team member:
                        <Select
                            mode="multiple"
                            onChange={(v) => this.selectMember(v)}
                            searchPlaceholder="标签模式">
                            {
                                this.state.users.map((user)=>{
                                    return(<Option key={user.uid} value={user.uid}>{user.uid}</Option>)
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="dialog-footer">
                    <Button key="add" className="dialog-footer-button" size="large"
                             disabled={this.state.addError}
                            onClick={this.memberAdd}>Add</Button>
                    <Button key="cancel" className="dialog-footer-button cancel" size="large"
                            onClick={this.memberAddCancel}>Cancel</Button>
                </div>
            </Modal>

        )
    }
}
export default ProjectMemberHelper;
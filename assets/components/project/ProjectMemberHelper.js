/**
 * Created by admin on 2017/4/25.
 */
import {Modal, Button} from 'antd';
import React, {Component} from 'react';
import {Select} from 'antd';
const Option = Select.Option;

class ProjectMemberHelper extends Component {

    constructor(props){
        super(props);
        this.state = {
            visibleMemberEdit: false,
            users:this.props.users,
            members:[],
            addError:true
        }
    }
    selectMember(v){
        this.setState({
            members:v,
        });
        if(v.length<1){
            this.setState({
                addError:true
            })
        }else{
            this.setState({
                addError:false
            });
        }
    }
    memberAdd=(e)=>{
        e.preventDefault();
        let members = this.state.members;
        this.props.callbackMemberEdit(members);
    };
    componentWillReceiveProps(props){
        this.setState({
            users:props.users
        });
    }
    render() {
        return (
            <Modal title="Add Project Member" visible={true}
                   maskClosable={true}
                   onCancel={this.props.callbackCancle}
                   footer={null}>
                <div className="addContent">
                    <div className="addTeamMember">Team member:
                        <Select
                            mode="multiple"
                            allowClear={true}
                            notFoundContent={'All user added'}
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
                    <Button key="add" className="dialog-footer-button button-style" size="large"
                             disabled={this.state.addError}
                            onClick={this.memberAdd}>Add</Button>
                    <Button key="cancel" className="cancel" size="large"
                            onClick={this.props.callbackCancle}>Cancel</Button>
                </div>
            </Modal>

        )
    }
}
export default ProjectMemberHelper;
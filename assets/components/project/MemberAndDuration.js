/**
 * Created by admin on 2017/4/25.
 */
import {InputNumber, Icon, Modal, Input,} from 'antd';
import React, { Component} from 'react';

class MemberAndDuration extends Component{
    state = {
        visibleMemberEdit:false
    }
    render(){
        return(
            
        
        <Modal title="Report Export" visible={this.props.modalVisible}
        onOk={this.props.modalOk} onCancel={this.props.closeModal}>
    <div className="addContent">
            <div className="addDuration">Duration:
                <Input placeholder="small size"  onChange={this.props.changeDuration1}/>weeks
                <Input placeholder="small size"   onChange={this.props.changeDuration2}/>days
                <Input placeholder="small size"  onChange={this.props.changeDuration3}/>hours

                </div>
        <div className="addTeamMember">Team member:<Input  onChange={this.props.changeMember}/></div>

        </div>
        </Modal>

        )
    }
}
export default MemberAndDuration;
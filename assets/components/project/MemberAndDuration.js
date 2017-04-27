/**
 * Created by admin on 2017/4/25.
 */
import {Modal, Input,} from 'antd';
import React, {Component} from 'react';
import {Select, InputNumber} from 'antd';
const Option = Select.Option;

class MemberAndDuration extends Component {
    state = {
        visibleMemberEdit: false
    }
    /* static contextTypes = {
     duration: React.PropTypes.integer.isRequired
     };*/
    render() {
        return (
            <Modal title="Change Duration And Member" visible={this.props.modalVisible}
                   onOk={this.props.modalOk} onCancel={this.props.closeModal}>
                <div className="addContent">
                    <div className="addDuration">Duration:
                        <InputNumber/>hours
                    </div>
                    <div className="addTeamMember">Team member:
                        <Select
                            mode="multiple"
                            searchPlaceholder="标签模式">

                        </Select>
                    </div>

                </div>
            </Modal>

        )
    }
}
export default MemberAndDuration;
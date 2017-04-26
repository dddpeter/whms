/**
 * Created by admin on 2017/4/25.
 */
import React, { Component} from 'react';
import CollapseTable from './CollapseTable.js';
import MemberAndDuration from './MemberAndDuration.js'
import {InputNumber, Icon, Row, Col, Modal, Input,} from 'antd';
import moment from 'moment'
class PanelRow1 extends Component{

    state = {
        teamMember: 'aaaaa',
        midTeamMember:'aaaaa',
        duration1: 1,
        duration2: 1,
        duration3: 1,
        midDuration1: 1,
        midDuration2: 1,
        midDuration3: 1,
        visible:false
    }

    changeDuration1=(event)=>{
        console.log(event.target.value)
        this.setState({
            midDuration1:event.target.value

        })
    }
    changeDuration2=(event)=>{
        this.setState({
            midDuration2:event.target.value
        })
    }
    changeDuration3=(event)=>{
        this.setState({
            midDuration3:event.target.value
        })
    }
    changeMember=(event)=>{
        this.setState({
            midTeamMember:event.target.value
        })
    }

    showMemberEdit = () => {

        this.setState({
            visible: true,
        });
    }
    closeModal =()=>{
        this.setState({
            visible: false,
        });
    }
    modalOk=()=>{
        this.setState({
            visible: false,
            duration1:this.state.midDuration1,
            duration2:this.state.midDuration2,
            duration3:this.state.midDuration3,
            teamMember:this.state.midTeamMember
        });
    }


    render(){
        return(
            <div>

                <Row>
                    <Col span={16}>
                        <Row>
                            <span className="brief">Brief:</span>
                        </Row>
                        <Row className="brief-content">
                            <span>{this.props.project.projectName}</span>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <div>
                            <Row>
                                <div>Create at:
                                    <text>{moment(this.props.project.createdAt).format('YYYY/MM/DD')}</text>
                                </div>
                            </Row>
                            <Row>
                                <div className="second-right">Last updates:
                                    <text>{moment(this.props.project.updatedAt).format('YYYY/MM/DD')}</text>
                                </div>
                            </Row>
                            <Row>
                                <div className="third-right">Duration:
                                    <text>{this.state.duration1}<span>weeks</span>{this.state.duration2}<span>days</span>{this.state.duration3}<span>hours</span></text>
                                </div>
                            </Row>
                            <Row>
                                <div>Team member:
                                    <text>{this.state.teamMember}</text>
                                    <Icon type="edit" onClick={this.showMemberEdit}></Icon>
                                    <MemberAndDuration modalOk={this.modalOk} closeModal={this.closeModal} modalVisible={this.state.visible} changeDuration1={this.changeDuration1} changeDuration2={this.changeDuration2}
                                                       changeDuration3={this.changeDuration3}     changeMember={this.changeMember}/>
                                </div>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className="update">Updated entries ：<select>
                        <option>This Week</option>
                    </select></div>
                </Row>
                <Row>
                    <div className="table-row">
                        <CollapseTable  />
                    </div>
                </Row>
            </div>
        )
    }
}

export default PanelRow1;
/**
 * Created by admin on 2017/4/25.
 */
import React, { Component} from 'react';
import ProjectMemberHelper from './ProjectMemberHelper.js'
import {Icon, Row, Col, Pagination,Table,message} from 'antd';
import moment from 'moment'
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';

const columns=[
    {
        title: 'Name',
        dataIndex: 'uid',
        key: 'uid'
    },
    {
        title: 'Date',
        dataIndex: 'issueDate',
        key: 'issueDate',
        sorter:(a,b)=>{
            let aa = moment(a.issueDate,'YYYY/MM/DD HH:mm:ss').toDate();
            let bb = moment(b.issueDate,'YYYY/MM/DD HH:mm:ss').toDate();
            return aa-bb;
        }
    },
    {
        title: 'Description',
        dataIndex: 'content',
        key: 'content'
    },
    {
        title: 'Duration(hrs)',
        dataIndex: 'spendTime',
        key: 'spendTime'
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type'
    }
];
class ProjectContent extends Component{

    constructor(props){
        super(props);
        this.state = {
            teamMember: [],
            visible:false,
            range:0,
            pageNum:0,
            pageSize:5,
            total:1,
            taskList:[],
            pid:this.props.project.pid,
            paginationHiden: {
                display: 'inline-block',
            }
        }
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
    addMembers=(m)=>{
        console.log(m);
        this.setState({
            visible: false,
            teamMember:m
        });
    }
    selectRange= (v)=>{
        this.setState({
            range:v
        });
    }
    getTasks= (pageNum=0)=>{
        let that = this;
        fetch(`/api/project/tasks/${this.state.pid}?range=${this.state.range}&pageNum=${pageNum}&pageSize=${this.state.pageSize}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        }).then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                message.info('获取后台数据失败');
            }
        }).then((data) => {
            console.log(data);
            if (data) {
                let list = [];
                data.tasks.map((task,i)=>{
                    let date = task.issueDate;
                    date =moment(date).format('YYYY/MM/DD HH:mm:ss');
                    task.issueDate =date;
                    list[i] = task;
                });
                that.setState({
                    total: Number(data.total),
                    pageNum:Number(data.current),
                    taskList:list
                });
                if (Number(data.total) === 0) {
                    this.setState({
                        paginationHiden: {
                            display: 'none',
                        }
                    });
                }
            } else {

                return {data: []};
            }
        });
    }
    componentDidMount(){
        this.getTasks();
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
                            <span>{this.props.project.brief}</span>
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
                                    <text>{this.state.duration3}<span>hours</span></text>
                                </div>
                            </Row>
                            <Row>
                                <div>Team member:

                                    <text>{new Array(this.state.teamMember).join(',')}</text>
                                    <Icon type="edit" onClick={this.showMemberEdit}></Icon>
                                    <ProjectMemberHelper project={this.props.project}
                                                         modalOk={(m)=>this.addMembers(m)}
                                                         closeModal={this.closeModal}
                                                         pid={this.state.pid}
                                                         modalVisible={this.state.visible}/>
                                </div>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className="update" >Updated entries ：
                        <select defaultValue={0} onSelect={(v) => this.selectRange(v)}>
                            <option value={0}>This Week</option>
                            <option value={1}>Last Week</option>
                            <option value={2}>Last Month</option>
                            <option value={3}>All</option>
                        </select>
                    </div>
                </Row>
                <Row>
                    <div className="table-row">
                        <Table columns={columns} bordered  rowKey="id" className='task-table'  dataSource={this.state.taskList}></Table>
                        <Pagination pageSize={this.state.pageSize}
                                    current={this.state.pageNum + 1}
                                    total={this.state.pageSize * this.state.total}
                                    showQuickJumper
                                    onChange={(pageNum)=>this.getTasks(pageNum-1)}
                                    className="pagination"
                        />
                    </div>
                </Row>
            </div>
        )
    }
}

export default ProjectContent;
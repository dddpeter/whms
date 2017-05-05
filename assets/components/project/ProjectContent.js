/**
 * Created by admin on 2017/4/25.
 */
import React, { Component} from 'react';
import ProjectMemberHelper from './ProjectMemberHelper.js'
import {Icon, Row, Col, Pagination,Table,message,Select} from 'antd';
import moment from 'moment'
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';
const typeList = {
    'DEVELOPMENT': '开发',
    'TEST': '测试',
    'REQUIREMENT': '需求',
    'MAINTAIN': '运维',
    'TEAM': '团队',
    'ADMIN': '管理'
};

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
            teamMember: ['None'],
            duration:0,
            range:0,
            pageNum:0,
            pageSize:10,
            total:1,
            taskList:[],
            pid:this.props.project.pid,
            addMemberLayer:<span></span>,
            paginationHiden: {
                display: 'inline-block',
            }
        }
    }

    showMemberEdit = () => {
        let that = this;
        fetch(`/api/users/pid?pid=${this.state.pid}`,
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

                that.setState({
                    addMemberLayer:<ProjectMemberHelper project={that.props.project}
                                                        users = {data.users}
                                                        callbackMemberEdit={that.callbackMemberEdit}
                                                        callbackCancle = { that.onAddMemberCancel }
                    />
                });
            });
    };
    getProjectProfile= ()=>{
        let that = this;
        fetch(`/api/users/duration/${this.state.pid}`, {
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
                return {};
            }
        }).then((data) => {
            if (data.result) {
                let m = [];
                data.users.map(u=>{
                    m.push(u.uid);
                });
                if(m.length<1){
                    m=['None'];
                }
                that.setState({
                    teamMember: m,
                    duration:Number(data.duration),
                });
            }
            else{
                message.info('获取后台数据失败');
            }
        });
    };
    getTasks= (pageNum=0,range=0)=>{
        let that = this;
        fetch(`/api/project/tasks/${this.state.pid}?range=${range}&pageNum=${pageNum}&pageSize=${this.state.pageSize}`, {
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
                return {}
            }
        }).then((data) => {
            if (data.result) {
                let list = [];
                data.tasks.map((task,i)=>{
                    let date = task.issueDate;
                    let typeRestart=typeList[task.type];
                    date =moment(date).format('YYYY/MM/DD HH:mm:ss');
                    task.issueDate =date;
                    task.type=typeRestart;
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
                message.info('获取后台数据失败');
            }
        });
    };
    selectRange= (v)=>{
        this.setState({
            range:v
        });
        this.getTasks(0,v);
    };
    //Pagination改变时
    onPageChange = (page) => {
        this.setState({
            pageNum: page - 1,
            current: page - 1
        });
        this.getTasks(page - 1,this.state.range);

    };
    onAddMemberCancel=()=>{
        this.setState({
            addMemberLayer:<span></span>
        });
    };
    //点击更新按钮
    callbackMemberEdit=(members,pid)=>{
            let that = this;
            fetch(`/api/project/member/${this.state.pid}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(members)
            }).then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return {data: []};
                }
            }).then((data) => {
                if (data.result) {
                    message.success('添加成功');
                    that.getProjectProfile();
                }
                else {
                    message.error('添加失败');
                }
            }).catch(err => {
                message.error('添加失败');
                console.error(err);
            });
        that.setState({
            addMemberLayer:<span></span>
        });
        };
    componentDidMount(){
        this.getTasks();
        this.getProjectProfile();
    }
    render(){
        return(
            <div>
                <Row>
                    <Col span={16}>
                        <Row>
                            <span className="brief">简介:</span>
                        </Row>
                        <Row className="brief-content">
                            <span>{this.props.project.brief}</span>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <div>
                            <Row>
                                <div className="right-info"><span className="info-label">Create at:</span>
                                    <text>{moment(this.props.project.createdAt).format('YYYY/MM/DD')}</text>
                                </div>
                            </Row>
                            <Row>
                                <div className="right-info second-right"><span className="info-label">Last updates:</span>
                                    <text>{moment(this.props.project.updatedAt).format('YYYY/MM/DD')}</text>
                                </div>
                            </Row>
                            <Row>
                                <div className="third-right right-info"><span className="info-label">Duration:</span>
                                    <text>{this.state.duration}<span> Hours</span></text>
                                </div>
                            </Row>
                            <Row>
                                <div className="right-info">
                                    <span className="info-label">Team member:</span>
                                   <text className="members">{new Array(this.state.teamMember).join(',')}</text>
                                    <Icon type="edit" onClick={this.showMemberEdit}></Icon>
                                    {this.state.addMemberLayer}
                                </div>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <div className="update" >Updated entries ：
                        <Select defaultValue={'0'} onSelect = {this.selectRange} style={{width:'90px'}}>
                            <Select.Option value={'0'}>This Week</Select.Option>
                            <Select.Option value={'1'}>Last Week</Select.Option>
                            <Select.Option value={'2'}>Last Month</Select.Option>
                            <Select.Option value={'3'}>All Tasks</Select.Option>
                        </Select>
                    </div>
                </Row>
                <Row>
                    <div className="table-row">
                        <Table columns={columns} bordered  rowKey="id" className='task-table'
                               dataSource={this.state.taskList}>

                        </Table>
                        <Pagination pageSize={this.state.pageSize}
                                    current={this.state.pageNum + 1}
                                    total={this.state.pageSize * this.state.total}
                                    showQuickJumper
                                    onChange={this.onPageChange}
                                    className="pagination"
                        />
                    </div>
                </Row>
            </div>
        )
    }
}

export default ProjectContent;
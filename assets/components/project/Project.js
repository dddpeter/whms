/**
 * Created by lin on 2017/4/19.
 */
import React, {Component} from 'react';
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';
import ProjectStatusHelper from './ProjectStatusHelper.js';
import ProjectHeader from './ProjectHeader.js'
import ProjectContent from'./ProjectContent.js'
import {
    Collapse,
    Card,
    Icon,
    Modal,
    Input,
    Select,
    DatePicker,
    Pagination
} from 'antd';
const Panel = Collapse.Panel;
import {browserHistory} from 'react-router';
import './project.scss';

const Option = Select.Option;


class Project extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props)
        this.state = {
            visibleDownload: false,
            visibleAdd: false,
            visibleEdit: false,
            status: '',
            visibleMemberEdit: false,
            projects: [{pid: 'ALL', projectName: '所有'}],
            projectList:[],
            pid: 'ALL',
            projectStatus: 'ALL',
            pageNum: 0,
            pageSize: 5,
            total: 1,
        }
    }

    projectsSelect = (value) => {
        let status = this.state.projectStatus;
        this.renderProjectList(0,status,value);
    }

    statusSelect = (value) => {
        let pid =this.state.pid;
        this.renderProjectList(0,value,pid);
    }


    showModalDownload = () => {
        this.setState({
            visibleDownload: true,
        });
    }
    handleOkDownload = (e) => {
        console.log(e);
        this.setState({
            visibleDownload: false,
        });
    }
    handleCancelDownload = (e) => {
        console.log(e);
        this.setState({
            visibleDownload: false,
        });
    }
    showModalAdd = () => {
        this.setState({
            visibleAdd: true,
        });
    }
    handleOkAdd = (e) => {
        console.log(e);
        this.setState({
            visibleAdd: false,
        });
    }
    handleCancelAdd = (e) => {
        console.log(e);
        this.setState({
            visibleAdd: false,
        });
    }
//判断是否是登陆状态
    checkLogin() {
        let that = this;
        var returnUrl = encodeURIComponent(browserHistory.getCurrentLocation().pathname);
        fetch('/api/check/login', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        }).then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
            else {
                return [];
            }
        }).then((data) => {
            if (!data.result) {
                that.context.router.push({pathname: `/login?returnUrl=${returnUrl}`});
            }
        }).catch((error) => {
            console.log('not logins', error)
        })
    }

    renderFirstPage() {
        let that = this;
        let projects = this.state.projects;
        fetch('/api/projects/all',
            {credentials: 'same-origin'})
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    return {data: []};
                }
            })
            .then(function (data) {
                if (data.result) {
                    let projectsAll = data.data;
                    projectsAll.map(p => {
                        projects.push(p);
                    });
                    that.setState({
                        projects: projects
                    });
                }
            });


    }
    renderProjectList(i=0,status='ALL',pid='ALL') {
        let that =this;
        if(i==undefined){
            i = this.state.pageNum;
        }
        let url =
        fetch(`/api/projects?pageSize=${this.state.pageSize}&pageNum=${i}&projectStatus=${status}&pid=${pid}`,
            {credentials: 'same-origin'})
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    return {data: []};
                }
            })
            .then(function (data) {

                if (data.result) {
                    that.setState({
                        projectStatus: status,
                        pid: pid,
                        projectList:data.projects,
                        total: Number(data.total),
                        pageNum:Number(data.current)
                    });
                    console.log(that.state);
                }
                else{
                    that.setState({
                        projectStatus: status,
                        pid: pid
                    });
                }
            });

    }

    componentWillMount() {
        this.checkLogin();
    }

    componentDidMount() {
        this.renderFirstPage();
        this.renderProjectList();
    }

    render() {
        return (
            <Card title={<span className="content-title-big">Projects</span>} className="projects-header"
                  extra={<div className="icon-container">
                      <Icon type="download" className='content-title-icon-big' onClick={this.showModalDownload}/>
                      <Icon type="plus-circle" className='content-title-icon-big' onClick={this.showModalAdd}/>
                      <div>
                          <Modal title="Report Export" visible={this.state.visibleDownload}
                                 onOk={this.handleOkDownload} onCancel={this.handleCancelDownload}>
                              <div>
                                  <div className="report-input1">Projects:<Input  /></div>
                                  <div className="report-input2">period:
                                      <Select defaultValue="Custom">
                                          <Option value="Custom">Custom</Option>
                                      </Select>
                                      From<DatePicker  />To<DatePicker />
                                  </div>
                              </div>
                          </Modal>
                          <Modal title="" visible={this.state.visibleAdd} onOk={this.handleOkAdd}
                                 onCancel={this.handleCancelAdd}>
                              <div className="addContent">
                                  <div className="add-input1">Status:
                                      <Select defaultValue="Active">
                                          <Option value="active">Active</Option>
                                          <Option value="paused">Paused</Option>
                                          <Option value="close">Close</Option>
                                      </Select>
                                  </div>
                                  <div className="add-input2">Project Name:<Input  /></div>
                                  <div className="add-input3">Team member:<Input  /></div>
                                  <div className="add-input4">Brief:<Input className='big-input' type="textarea"
                                                                           placeholder="Autosize height with minimum and maximum number of lines"
                                                                           autosize={{minRows: 4, maxRows: 8}}/></div>
                              </div>
                          </Modal>
                      </div>
                  </div>}>


                <div className="filter"><span>Filter</span><span className="project">Projects:</span>
                    <Select defaultValue="ALL" onSelect={this.projectsSelect}>
                        {this.state.projects.map(
                            (project) => {
                                return <Option key={project.pid} value={project.pid}>{project.projectName}</Option>
                            }
                        )}
                    </Select>
                    <span className="status">Status:</span>
                    <Select defaultValue="ALL" onSelect={this.statusSelect}>
                        <Option value="ALL">所有</Option>
                        <Option value="ACTIVE">活动</Option>
                        <Option value="PENDING">暂停</Option>
                        <Option value="CLOSE">关闭</Option>
                    </Select>
                </div>
                <div className="projectList">
                    <Collapse onChange={this.onExpand}>
                        {this.state.projectList.map((p)=> {
                            return (
                                <Panel header={<ProjectHeader title={p.projectName} extra={<ProjectStatusHelper project={p}/>}></ProjectHeader>} key={p.pid}>
                                    <ProjectContent project={p}/>
                                </Panel>
                            )
                        })}

                    </Collapse>
                    <div className="pagination-box">
                        <Pagination showQuickJumper
                                    pageSize={this.state.pageSize}
                                    current={this.state.pageNum+1}
                                    total={this.state.total * this.state.pageSize}
                                    defaultCurrent={1}
                                    onChange={(i)=>this.renderProjectList(i-1,this.state.projectStatus,this.state.pid)}
                        />
                    </div>
                </div>

            </Card>
        )
    }

}
export  default  Project;
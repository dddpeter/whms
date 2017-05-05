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
import ProjectAddHelper from './ProjectAddHelper.js'
import ProjectExport from './ProjectExport.js'
import {
    Collapse,
    Card,
    Icon,
    Select,
    Pagination,
    message,
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
        super(props);
        this.state = {
            visibleAdd: false,
            visibleEdit: false,
            status: '',
            visibleMemberEdit: false,
            projects: [{pid: 'ALL', projectName: '所有'}],
            projectsExport: [],
            projectList: [],
            pid: 'ALL',
            projectStatus: 'ALL',
            pageNum: 0,
            pageSize: 10,
            total: 1,
            addProjectLayer: <span></span>,
            exportProjectLayer: <span></span>,
            dateDisable: true,
        }
    }
    projectsSelect = (value) => {
        let status = this.state.projectStatus;
        this.renderProjectList(0, status, value);
    };
    statusSelect = (value) => {
        let pid = this.state.pid;
        this.renderProjectList(0, value, pid);
    };
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
                        projects: projects,
                        projectsExport: projectsAll
                    });
                }
            });
    }
    //点击弹出下载窗口
    showModalDownload = () => {
        this.setState({
            exportProjectLayer: <ProjectExport projectExportList={this.props.projectExportList}
                                               projectsList={this.state.projectsExport}
                                               callbackExport={this.callbackExport}
                                               callbackExportCancle={this.callbackExportCancle }
            />
        });
    };
    callbackExport = (projectExportList) => {
        let pids = projectExportList.pids;
        let pidQueryString = 'pids[]='+pids.join('&pids[]=');
        let url = `/api/tasks/export?start=${projectExportList.start}&end=${projectExportList.end}&${pidQueryString}`;
        window.open(url);
        /*this.setState({
            exportProjectLayer: <span></span>
        });*/
    };
    callbackExportCancle = () => {
        this.setState({
            exportProjectLayer: <span></span>
        });
    };
    // 点击弹出添加列表
    showModalAdd = () => {
        let that = this;
        //调取member
        fetch(`/api/users/pid`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                message.info('网络错误');
            }
        }).then((data) => {
            that.setState({
                addProjectLayer: <ProjectAddHelper project={that.props.project}
                                                   usersList={data.users}
                                                   projects={this.state.projects}
                                                   callbackAddEdit={that.callbackAddEdit}
                                                   callbackAddCancel={that.callbackAddCancel }
                />
            });
        }).catch(err => {
            message.error('读取内容失败');
            console.error(err);
        });
        this.setState({
            visibleAdd: true,
        });
    };
    //关闭添加弹框
    callbackAddCancel = () => {
        this.setState({
            addProjectLayer: <span></span>
        });
    };
    callbackAddEdit = (project) => {
        let that = this;
        fetch(`/api/project`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(project)
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                return {data: []};
            }
        }).then((data) => {
            if (data.result) {
                message.success('添加成功');
                that.renderFirstPage();
                that.renderProjectList();
            }
            else {
                message.error('添加失败');
            }
        }).catch(err => {
            message.error('添加失败');
            console.error(err);
        });
        this.setState({
            addProjectLayer: <span></span>
        });
    };
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
    renderProjectList(i = 0, status = 'ALL', pid = 'ALL') {
        let that = this;
        if (i == undefined) {
            i = this.state.pageNum;
        }
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
                        projectList: data.projects,
                        total: Number(data.total),
                        pageNum: Number(data.current)
                    });
                }
                else {
                    that.setState({
                        projectStatus: status,
                        pid: pid
                    });
                }
            });
    };
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
                          {this.state.exportProjectLayer}
                          {this.state.addProjectLayer}
                      </div>
                  </div>}>
                <div className="filter"><span className="project">Filter Projects:</span>
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
                    <Collapse accordion
                        onChange={this.onExpand}
                        className='collapseStyle'>
                        {this.state.projectList.map((p) => {
                            return (
                                <Panel header={<ProjectHeader title={p.projectName}
                                                              extra={<ProjectStatusHelper
                                                                  project={p}/>}></ProjectHeader>}
                                       key={p.pid}
                                >
                                    <ProjectContent project={p}/>
                                </Panel>
                            )
                        })}
                    </Collapse>
                    <div className="pagination-box">
                        <Pagination showQuickJumper
                                    pageSize={this.state.pageSize}
                                    current={this.state.pageNum + 1}
                                    total={this.state.total * this.state.pageSize}
                                    defaultCurrent={1}
                                    onChange={(i) => this.renderProjectList(i - 1, this.state.projectStatus, this.state.pid)}
                        />
                    </div>
                </div>

            </Card>
        )
    }
}
export  default  Project;
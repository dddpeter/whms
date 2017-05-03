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
    Pagination,
    message,
    Button
} from 'antd';
const {RangePicker} = DatePicker;
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
            visibleDownload: false,
            visibleAdd: false,
            visibleEdit: false,
            status: '',
            visibleMemberEdit: false,
            projects: [{pid: 'ALL', projectName: '所有'}],
            projectsExport:[],
            projectList:[],
            pid: 'ALL',
            projectStatus: 'ALL',
            pageNum: 0,
            pageSize: 10,
            total: 1,
            usersList: [],
            projectList: [],
            firstProject: '',
            projectError:true,
            projectErrorTip:false,
            memberError:true,
            briefError:true,
            isNameExists:false,
            project: {
                status: 'ACTIVE',
                members: [],
                uid: '',
                brief:''
            },
            addProjectModel:<span></span>,
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
    showModalDownload = () => {
        this.setState({
            visibleDownload: true,
        });
    };
    handleOkDownload = (e) => {
        console.log(e);
        this.setState({
            visibleDownload: false,
        });
    };
    handleCancelDownload = (e) => {
        console.log(e);
        this.setState({
            visibleDownload: false,
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
            if (data.result) {
                this.setState({
                    usersList: data.users,
                })
            }
        }).catch(err => {
            message.error('读取内容失败');
            console.error(err);
        });
        this.setState({
            visibleAdd: true,
        });
    };
    //status变化时
    statusChange = (value) => {
        let project = this.state.project;
        project.status = value;
        this.setState({
            project: project
        });
    };
    //输入project name
    projectNameChange = (e) => {
        let that=this;
        let project = this.state.project;
        var isNameExists = false;
        project.projectName = e.target.value;
        if(project.projectName.length<4){
            this.setState({
                projectError:true,
                projectErrorTip:true,
                isAble:true,
            })
        }else{
            this.setState({
                projectError:false,
                projectErrorTip:false,
                isAble:false,
            })
        }
        this.state.projects.map(p=>{
            if(p.projectName==project.projectName){
                isNameExists = true;
            }
        });
        if(!isNameExists){
            this.setState({
                project: project,
                isNameExists: isNameExists
            });
        }
        else{
            this.setState({
                isNameExists: isNameExists
            });
        }
    };
    //team member发生变化时
    teamMemberChange = (value) => {
        console.log(value);
        let project = this.state.project;
        project.members = value;
        if(project.members.length<1){
            this.setState({
                memberError:true,

            })
        }else{
            this.setState({
                project: project,
                memberError:false,

            })
        }
    };
    // brief发生变化时
    briefChange= (e) => {
        let project = this.state.project;
        project.brief = e.target.value;
        if(project.brief===''){
            this.setState({
                briefError:true,

            })
        }else{
            this.setState({
                project: project,
                briefError:false,

            })
        }
    };
    handleOkAdd = (project) => {
        console.log(project);
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
        this.handleCancelAdd();
    };
    handleCancelAdd = () => {

        this.setState({
            visibleAdd: false,
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
                        projectsExport:projectsAll
                    });
                }
            });
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
                        console.log(that.state);
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
                          <Modal title="Report Export" className="" visible={this.state.visibleDownload}
                                 onOk={this.handleOkDownload} onCancel={this.handleCancelDownload}>
                              <div>
                                  <div className="report-input"><span className="label">Projects:</span>
                                      <Select  className={'filter'} mode="multiple" style={{ width: 300 }} >
                                          {this.state.projectsExport.map(p=>{
                                              return <Option key={p.pid} value={p.pid}>{p.projectName}</Option>
                                          })}

                                      </Select>
                                  </div>
                                  <div className="report-input"><span className="label">Period:</span>
                                      <Select className={'filter'} defaultValue="0" style={{ width: 150 }}>
                                          <Option value="0">This Week</Option>
                                          <Option value="1">Last Week</Option>
                                          <Option value="2">Custom</Option>
                                      </Select>
                                  </div>
                                  <div className="report-input date-div">
                                      <span className="label">Range:</span>
                                      <RangePicker />
                                  </div>
                              </div>
                          </Modal>
                          <Modal title="Add Project"
                                 visible={this.state.visibleAdd}
                                 maskClosable={true}
                                 onCancel={this.handleCancelAdd}
                                 footer={null}>
                              <div className="addContent">
                                  <div className="add-input">
                                      <span className="table-title">Status:</span>
                                      <Select defaultValue="ACTIVE"
                                              className='select-style'
                                              onChange={this.statusChange}>
                                          <Option value="ACTIVE">Active</Option>
                                          <Option value="PENDING">Pending</Option>
                                          <Option value="CLOSE">Close</Option>
                                      </Select>
                                  </div>
                                  <div className="add-input">
                                      <span className="table-title">Project Name:</span>
                                      <Input placeholder="input projectName" style={{
                                          border:this.state.isNameExists?'1px solid rgba(240,65,52,0.5)':''
                                      }}
                                             className='select-style'
                                             onChange={(val)=>this.projectNameChange(val)}/>
                                      <span className="error-tip" style={{display:this.state.projectError?'inline-block':'none'}}>*</span>
                                      <div style={{ display:this.state.isNameExists?'block':'none',
                                          margin:'5px 0 0 104px',color:'#f04134'}}>Project Name Exists!
                                      </div>
                                      <span style={{display:this.state.projectErrorTip?'inline-block':'none',
                                          margin:'5px 0 0 104px',color:'#f04134'}}>不能少于四个字符</span>
                                  </div>
                                  <div className="add-input">
                                      <span className="table-title">Team member:</span>
                                      <Select
                                          mode="tags"
                                          className='select-style'
                                          searchPlaceholder="标签模式"
                                          placeholder="Please select"
                                          onChange={this.teamMemberChange}
                                      >
                                          {
                                              this.state.usersList.map(function (list) {
                                                  return (
                                                      <Option key={list.uid}>{list.uid}</Option>
                                                  )
                                              })
                                          }
                                      </Select>
                                      <span className="error-tip" style={{display:this.state.memberError?'inline-block':'none'}}>*</span>
                                  </div>
                                  <div className="add-input">
                                      <span className="table-title">Brief:</span>
                                      <Input  className='select-style'
                                              type="textarea"
                                              autosize={{minRows: 4}}
                                              onChange={this.briefChange}
                                      />
                                      <span className="error-tip" style={{display:this.state.briefError?'inline-block':'none'}}>*</span>
                                  </div>
                              </div>
                              <div className="dialog-footer">
                                  <Button key="add" className="dialog-footer-button" size="large"
                                          disabled={this.state.projectError||this.state.memberError||this.state.briefError}
                                          onClick={(project)=>this.handleOkAdd(this.state.project)}>Add</Button>
                                  <Button key="cancel" className="dialog-footer-button cancel" size="large"
                                          onClick={this.handleCancelAdd}>Cancel</Button>
                              </div>
                          </Modal>
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
                    <Collapse onChange={this.onExpand} className='collapseStyle'>
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
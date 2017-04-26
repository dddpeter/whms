/**
 * Created by lin on 2017/4/19.
 */
import React, {Component} from 'react';
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';
import MainCollapse from './MainCollapse.js';
import {
    Card,
    Icon,
    Modal,
    Pagination,
    Input,
    Select,
    DatePicker
} from 'antd';
import {browserHistory} from 'react-router';
import './project.scss';

const Option = Select.Option;


function projectsSelect(value) {
    console.log(`selected ${value}`);
}
function statusSelect(value) {
    console.log(`selected ${value}`);
}
function onChange(pageNumber) {
    console.log('Page: ', pageNumber);
}

class Project extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };
    constructor(props){
        super(props)
        this.state = {
            visibleDownload: false,
            visibleAdd: false,
            visibleEdit: false,
            status: '',
            teamMember: 'zhengjj tasi',
            duration: '12weeks',
            visibleMemberEdit:false,
            projects:[{pid:'ALL',projectName:'所有'}]
        }
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
    renderFirstPage(){
        let that = this;
        let projects = this.state.projects;
        fetch('/api/projects/all',
            { credentials: 'same-origin'})
            .then((response) => {
            if (response.status === 200) {
                return response.json();
            }
            else {
               return {data:[]};
            }
            })
            .then(function (data) {
               if(data.result){
                   let projectsAll = data.data;
                   projectsAll.map(p =>{
                       projects.push(p);
                   });
                   that.setState({
                       projects:projects
                   });
               }
        });
        

    }
    componentWillMount(){
        this.checkLogin();
    }
    componentDidMount(){
        this.renderFirstPage();
    }
    render() {
        return (
            <Card title={<span className="content-title-big">Projects</span>} className="projects-header" extra={<div className="icon-container">
            <Icon type="download" className='content-title-icon-big'  onClick={this.showModalDownload}/>
            <Icon type="plus-circle" className='content-title-icon-big' onClick={this.showModalAdd}/><div>
        <Modal title="Report Export" visible={this.state.visibleDownload}
          onOk={this.handleOkDownload} onCancel={this.handleCancelDownload}>
            <div>
            <div className="report-input1">Projects:<Input  /></div>
            <div className="report-input2">period:
            <Select defaultValue="Custom"  >
      <Option value="Custom">Custom</Option>
    </Select>
    From<DatePicker onChange={onChange} />To<DatePicker onChange={onChange} />
    </div>
</div>
        </Modal>
        <Modal title="" visible={this.state.visibleAdd} onOk={this.handleOkAdd} onCancel={this.handleCancelAdd}>
          <div className="addContent">
            <div className="add-input1">Status:
            <Select defaultValue="Active"  >
      <Option value="active">Active</Option>
      <Option value="paused">Paused</Option>
      <Option value="close">Close</Option>
    </Select>
            </div>
            <div className="add-input2">Project Name:<Input  /></div>
            <div className="add-input3">Team member:<Input  /></div>
            <div className="add-input4">Brief:<Input className='big-input' type="textarea" placeholder="Autosize height with minimum and maximum number of lines" autosize={{ minRows: 4, maxRows: 8 }} /></div>
</div>
        </Modal>
      </div></div>}>




                <div className="filter"><span>Filter</span><span className="project">Projects:</span>
                    <Select defaultValue="ALL" onChange={projectsSelect}>
                        {this.state.projects.map(
                            (project) => { return <Option key={project.pid} value={project.pid}>{project.projectName}</Option> }
                        )}
                    </Select>
                    <span className="status">Status:</span>
                    <Select defaultValue="ALL" onChange={statusSelect}>
                        <Option value="ALL">所有</Option>
                        <Option value="ACTIVE">活动</Option>
                        <Option value="PENDING">暂停</Option>
                        <Option value="CLOSE">关闭</Option>
                    </Select>
                </div>
                <MainCollapse />
               
            </Card>
        )
    }

}
export  default  Project;
/**
 * Created by lin on 2017/4/19.
 */
import React, {Component} from 'react';
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
            visibleMemberEdit:false
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
        console.log(that.context);
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
    componentWillMount(){
        this.checkLogin();
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
    </Select>
            </div>
            <div className="add-input2">Project Name:<Input  /></div>
            <div className="add-input3">Team member:<Input  /></div>
            <div className="add-input4">Brief:<Input  className="big-input"/></div>
</div>
        </Modal>
      </div></div>}>




                <div className="filter"><span>Filter</span><span className="project">Projects:</span>
                    <Select defaultValue="All" onChange={projectsSelect}>
                        <Option value="all">All</Option>

                    </Select>
                    <span className="status">Status:</span>
                    <Select defaultValue="All" onChange={statusSelect}>
                        <Option value="all">All</Option>
                    </Select>
                </div>
                <MainCollapse />




                <div className="pagination-box"><Pagination showQuickJumper defaultCurrent={2} total={500}
                                                            onChange={onChange} defaultCurrent={1} /></div>
            </Card>
        )
    }

}
export  default  Project;
import React, {Component} from 'react';
import {Card, Row, Col, Icon, Button, Popconfirm, Pagination, Select, message} from 'antd';
const Option = Select.Option;
import  Highcharts from 'highcharts'
import ModalDialog from './ModalDialog'
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';
import './dashboard.scss'
import EditDialog from './EditDialog';
import {browserHistory} from 'react-router';
const typeList = {
    'DEVELOPMENT': '开发',
    'TEST': '测试',
    'REQUIREMENT': '需求',
    'MAINTAIN': '运维',
    'TEAM': '团队',
    'ADMIN': '管理'
};


class DashBoard extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };
    //点击退出登陆
    constructor(props) {
        super(props);
        this.handleOutClick = this.handleOutClick.bind(this);
        this.state = {
            login: false,
            blankTask: {
                display: 'none',
            },//列表为空时默认显示
            paginationHiden: {
                display: 'inline-block',
            },
            editAble: 'true',
            uid: '--',
            email: '--',
            data: [],
            dataList: [],
            current: 0,
            total: 1,
            pageSize: 25,
            pageNum: 0,
            loading: false,
            taskList: [],
            addModalLayer: <span></span>,
            editModalLayer:<span></span>
        };
    }

    //修改饼图选择框的内容
    changeSelect = (value) => {
        this.getStat(value);
    };

    renderChart(data) {

        if (data.length < 1) {
            var charts = new Highcharts.chart('summaryCharts', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'No data Found'
                },
                tooltip: {
                    pointFormat: '<b>{point.percentage:.2f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                        },
                        showInLegend: true
                    }
                },
                colors: ['#dcdcdc'],
                series: [{
                    type: 'pie',
                    name: 'Projects',
                    data: [{y: 1, name: 'No Data'}]
                }]
            });

        }
        else {
            var charts = new Highcharts.chart('summaryCharts', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '<b>{point.percentage:.2f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Projects',
                    colorByPoint: true,
                    data: data
                }]
            });

        }


    }
    //点击add图标之后弹出对话框
    clickPlus = () => {
        let that = this;
        fetch(`/api/projects/all`, {
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
                return {data: []};
            }
        })
            .then((data)=>{
                let projectList = data.data.filter(v =>
                    v.status === 'OPEN'
                );
                this.setState({
                    addModalLayer: <ModalDialog callbackContent={that.callbackContent}
                                                callbackAddCancel={that.callbackAddCancel}
                                                projectList={projectList}
                                                uidName={that.state.uid}
                                                task={that.props.task}
                    />
                });

            });
    };
    callbackAddCancel = () => {
        this.setState({
            addModalLayer: <span></span>
        })
    };
    //点击增加按钮后
    callbackContent = (task) => {
        let that = this;
        fetch(`/api/task`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(task)
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                return {data: []};
            }
        }).then((data) => {

            if (data.result) {
                message.success('添加成功');
                that.getTasks();
                that.getStat(0);
            }
            else {
                message.error('添加失败');
            }
        }).catch(err => {
            message.error('添加失败');
            console.error(err);
        });
        this.setState({
            addModalLayer: <span></span>
        })
    };
    //点击修改按钮后
    callbackEdit = (task) => {
        let that = this;
        fetch(`/api/task`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(task)
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                return {data: []};
            }
        }).then((data) => {
            if (data.result) {
                message.success('修改成功');
                that.getTasks();
                that.getStat(0);
            }
            else {
                message.error('编辑任务失败');
            }
        }).catch(err => {
            message.error('编辑任务失败');
            console.error(err);
        });
    };
    //点击修改图标后弹出修改对话框
    editChanged = (e, task) => {
        this.setState({
            taskList: task,
            editModalLayer:<EditDialog
                    taskList={task}
                    backEditClick={this.backEditClick}
                    callbackEdit={this.callbackEdit}
        />
        });
    };
    //修改页面用户是否点击了关闭按钮
    backEditClick = () => {
        this.setState({
            editModalLayer: <span></span>
        });
    };
    //点击退出
    handleOutClick = (e) => {
        e.preventDefault();
        let returnUrl = encodeURIComponent(browserHistory.getCurrentLocation().pathname);
        let that = this;
        fetch('/api/logout', {    //发送退出登录的请求
            method: 'DELETE',
            credentials: 'same-origin'

        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    message.error('登出失败');
                }
            }).then((data)=> {
            if(data.result){
                message.success('登出成功');
            }
            that.context.router.push({pathname: `/login?returnUrl=${returnUrl}`});
        }).catch((error) => {
            message.error('登出失败');
            console.log('logout failed', error)
        })
    };
    //list
    showTotal = (total) => {
        return `Total ${total} items`;
    };
//调取工作统计图标接口
    getStat(val) {
        let that = this;
        let url = '/api/tasks/this/week';
        if (val === '1') {
            url = '/api/tasks/last/week';
        }
        else if (val === '2') {
            url = '/api/tasks/last/month';
        }

        fetch(url, {
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
                return {data: []};
            }
        })
            .then(function (data) {
                data.data.map((o) => {
                    o.y = Number(o.y);
                });
                that.renderChart(data.data);
            });
    }
//调取姓名接口
    getName() {
        let that = this;
        fetch('/api/user', {
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
                return {data: []};
            }
        }).then((data) => {
            if (data.result) {
                this.setState({
                    uid: data.user.uid,
                    email: data.user.email,
                });
                window.localStorage['user'] = JSON.stringify(data.user);

            }
        });
    }
    //调取pageNum和pageSize接口
    getTasks(pageNum = 0) {
        let that = this;
        fetch(`/api/tasks?pageNum=${pageNum}&pageSize=${this.state.pageSize}`, {
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
                message.info('网络错误');
            }
        }).then((data) => {

            if (data) {
                that.setState({
                    dataList: data.tasks,
                    total: Number(data.total)
                });
                if (Number(data.total) === 0) {
                    this.setState({
                        paginationHiden: {
                            display: 'none',
                        },
                        blankTask: {
                            display: 'block',
                        }
                    });
                }
            } else {

                return {data: []};
            }
        });
    };
    //删除项目
    deleteTask = (taskId) => {
        let that = this;
        fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            credentials: 'same-origin',
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                return {data: []};
            }
        }).then((data) => {
            if (data.result) {
                this.getTasks(this.state.pageNum);
                that.getStat(0);
                message.success('删除成功');
            }
        }).catch(err => {
            console.error(err);
        });
    };
    //Pagination改变时
    onChange = (page) => {
        this.setState({
            pageNum: page - 1,
            current: page - 1
        });
        this.getTasks(page - 1);

    };
//判断是否是登陆状态
    checkLogin() {
        let that = this;
        let returnUrl = encodeURIComponent(browserHistory.getCurrentLocation().pathname);
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
            else{
                that.getName();
                that.getStat(0);
                that.getTasks();
            }
        }).catch((error) => {
            console.log('not logins', error)
        })
    }
    componentDidMount() {
        this.checkLogin();
    }
    render() {
        return (
            <div className="content">
                <Row gutter={8}>
                    <Col span={16}>
                        <Card className="content-title" title={<span className="content-title-big">我的任务</span>}
                              extra={<Icon className='content-title-icon-big'
                                           type="plus-circle" onClick={this.clickPlus}
                              />}>
                            <div> {this.state.addModalLayer}</div>

                            {
                                this.state.dataList.map(function (list) {
                                    return (
                                        <Card key={list.id} title={list.projectname} className="content-title-secondary"
                                              extra={
                                                  (list.status == 1) ? (
                                                      <span>
                                                                  <span className='big-area'
                                                                        onClick={(e, o) => this.editChanged(e, list)}>
                                                          <Icon className='content-title-icon-small'
                                                                type="edit"/></span>

                                                          <Popconfirm title="确认删除？"
                                                                      placement="right"
                                                                      okText="确认"
                                                                      cancelText="取消"
                                                                      onConfirm={() => this.deleteTask(list.id)}>
                                                          <span><Icon type="delete"
                                                                      className='content-title-icon-small'/></span>
                                                          </Popconfirm>
                                                          </span>
                                                  ) : (<span/>)
                                              }
                                              bodyStyle={{fontSize: '12px', background: 'rgba(220,220,220,0.2)'}}>
                                            <Row>
                                                <Col span={3}>{list.uid}</Col>
                                                <Col span={3}>{list.issueDate.substring(0, 10)}</Col>
                                                <Col span={3} value={list.type}>{typeList[list.type]}</Col>
                                                <Col span={3}>{list.spendTime}</Col>
                                                <Col span={12}>
                                                    {list.content}
                                                </Col>
                                            </Row>
                                        </Card>
                                    );
                                }.bind(this))
                            }
                            <div className="clear">
                                <p className="blankTip" style={this.state.blankTask}>
                                    <Icon type="info-circle-o" className="icon-tip"/>
                                    您当前还没有填写任何信息
                                </p>
                                <div style={this.state.paginationHiden}>
                                    <Pagination pageSize={this.state.pageSize}
                                                current={this.state.current + 1}
                                                total={this.state.pageSize * this.state.total}
                                                showQuickJumper
                                                onChange={this.onChange}
                                                className="pagination"
                                    />
                                    <span className="pagination-tip">（点击回车进行跳转）</span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="right-content">
                            <div className="right-content-table">
                                <Row className="right-content-table">
                                    <Col><span className="col-span">欢迎！</span>{this.state.uid}</Col>
                                    <Col>{this.state.email}</Col>
                                    <Col><a href={`http://auth.dev.s.unicc.com.cn/?login=${this.state.uid}`}
                                            target="about_blank">修改密码</a></Col>
                                    <Col>
                                        <Button className='button-purple' size={'large'} onClick={this.handleOutClick}>
                                            <Icon type="logout"/>退出
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                        <Card title="My Summary">
                            <Select
                                showSearch
                                className="selectOption"
                                placeholder="this week"
                                optionFilterProp="children"
                                onChange={this.changeSelect}
                                defaultValue={"0"}
                                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value='0'>本周</Option>
                                <Option value='1'>上周</Option>
                                <Option value='2'>上个月</Option>
                            </Select>
                            <div id="summaryCharts">
                            </div>
                        </Card>
                    </Col>
                </Row>
                {this.state.editModalLayer}
            </div>
        );
    }
}
export default DashBoard
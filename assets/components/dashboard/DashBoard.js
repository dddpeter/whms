import React, {Component} from 'react';
import {Card, Row, Col, Icon, Button, Popconfirm, Pagination, Select,Alert} from 'antd';
import {Link} from 'react-router'
import  Highcharts from 'highcharts'
import ModalDialog from './ModalDialog'
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';
import './dashboard.scss'
import EditDialog from './EditDialog';


class DashBoard extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };
    //修改饼图选择框的内容
    changeSelect = (value) => {
        this.getStat(value);
    }

    renderChart(data) {
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
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
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

    //点击add图标之后弹出对话框
    clickPlus = () => {
        this.setState({
            visibleState: true,
        });
    };
    //点击增加按钮后
    callbackVal=(params)=>{
        console.log(params);
        this.setState({

        });

    };
    //响应用户是否点击了关闭按钮
    onClickChanged = () => {
        this.setState({
            visibleState: false,
        });
    };
    //点击修改图标后弹出修改对话框
    editChanged = () => {
        this.setState({
            editState: true,
        });
    };

    //修改页面用户是否点击了关闭按钮
    backEditClick = () => {
        this.setState({
            editState: false,
        });
    };


    //点击退出登陆
    constructor(props) {
        super(props);
        this.handleOutClick = this.handleOutClick.bind(this);
        this.state = {
            login: false,
            styleError: {
                fontSize: '12px',
                display: 'none',
            },
            blankTask:{
                display:'none',
            },//列表为空时默认显示
            paginationHiden: {
                display:'inline-block',
            },
            uid: '--',
            email: '--',
            data: [],
            dataList: [],
            current: 0,
            total: 1,
            pageSize: 1,
            pageNum: 0,
            loading: false,
        }
    }

    handleOutClick = (e) => {
        e.preventDefault();
        let that = this;
        fetch('/api/logout', {    //发送退出登录的请求
            method: 'DELETE'
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    this.setState({
                        styleError: {
                            fontSize: '12px',
                            display: 'block',
                        }
                    })
                }
            }).then(function (data) {
            that.context.router.push({pathname: '/login'});
        }).catch((error) => {
            console.log('logout failed', error)
        })
    };

    //list
    showTotal = (total) => {
        return `Total ${total} items`;
    }
//调取工作统计接口
    getStat(val) {
        var that = this;
        var url = '/api/tasks/this/week';
        if (val === 1) {
            url = '/api/tasks/last/week';
        }
        else if (val === 2) {
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
                console.log(data.data);

                that.renderChart(data.data);
            });
    }

//调取姓名接口
    getName() {
        var that = this;
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
            if (data) {
                this.setState({
                    uid: data.user.uid,
                    email: data.user.email,
                })
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
                //todo: 显示错误信息 网络错误
            }
        }).then((data) => {
            if (data) {
                that.setState({
                    dataList: data.tasks,
                    total: Number(data.total)
                })
            } else {
                // this.setState({
                //     paginationHiden: {
                //         display:'none',
                //     },
                //     blankTask:{
                //         display:'block',
                //     }
                // });
                return {data: []};
            }
        });
    };

    //删除项目
    deleteTask = (taskId) => {
        let that = this;
        fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            credentials:'same-origin',
        }).then((response)=>{
            if (response.status === 200) {
                return response.json();
            } else {
                return {data: []};
            }
        }).then((data) => {
            console.log(data+"data")
           if(data.result){
               this.getTasks(this.state.pageNum);
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
                that.context.router.push({pathname: '/login'});
            }
        }).catch((error) => {
            console.log('not logins', error)
        })
    }

    componentDidMount() {
        this.checkLogin();
        this.getName();
        this.getStat(0);
        this.getTasks();

        //this.deleteProduct();
    }

    render() {
        return (
            <div className="content">
                <Row gutter={8}>
                    <Col span={16}>
                        <Card className="content-title" title={<span className="content-title-big">My Entries</span>}
                              extra={<Icon className='content-title-icon-big'
                                           type="plus-circle" onClick={this.clickPlus}
                              />}>
                            {
                                this.state.dataList.map(function (list) {
                                    return (
                                        <Card key={list.id} title={list.projectname} className="content-title-secondary"
                                              extra={
                                                  <span>
                                                   <Link to={"/EditDialog" + list.id}>
                                                        <Icon className='content-title-icon-small'
                                                              type="edit"/>
                                                    </Link>
                                                    <Popconfirm title="确认删除？"
                                                                placement="right"
                                                                okText="确认"
                                                                cancelText="取消"
                                                                onConfirm={() =>this.deleteTask(list.id)}>
                                                       <a><Icon type="delete" className='content-title-icon-small'/></a>
                                                    </Popconfirm>
                                              </span>
                                              }
                                              bodyStyle={{fontSize: '12px', background: 'rgba(220,220,220,0.2)'}}>
                                            <Row>
                                                <Col span={3}>{list.uid}</Col>
                                                <Col span={3}>{list.issueDate.substring(0, 10)}</Col>
                                                <Col span={4}>{list.type}</Col>
                                                <Col span={3}>{list.spendTime}</Col>
                                                <Col span={11}>
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
                                    <Pagination pageSize={this.state.pageSize + 1}
                                                current={this.state.current + 1}
                                                total={this.state.pageSize * this.state.total}
                                                showQuickJumper
                                                onChange={this.onChange}
                                                className="pagination"
                                                style={this.state.paginationHiden}
                                    />
                                    <span className="pagination-tip">(<Icon type="info-circle-o" className="icon-tip" />点击回车进行跳转)</span>
                           </div>
                        </Card>

                    </Col>
                    <Col span={8}>
                        <Card className="right-content">
                            <div className="right-content-table">
                                <Row className="right-content-table">
                                    <Col><span className="col-span">Welcome!</span>{this.state.uid}</Col>
                                    <Col>{this.state.email}</Col>
                                    <Col><a href="#">Change your password</a></Col>
                                    <Col>
                                        <Button className='button-purple' onClick={this.handleOutClick}>
                                            <Icon type="logout"/>Log out
                                        </Button>
                                        <p style={this.state.styleError}>网络错误</p>
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
                                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value={0}>This week</Option>
                                <Option value={1}>Last week</Option>
                                <Option value={2}>Last month</Option>
                            </Select>
                            <div id="summaryCharts" style={{height: '300px'}}>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <ModalDialog visible={this.state.visibleState}
                             uidName={this.state.uid}
                             callbackClick={this.onClickChanged}
                             callbackContent={this.callbackVal}/>
                <EditDialog visible={this.state.editState}
                            backEditClick={this.backEditClick}
                />

            </div>

        );
    }
}

export default DashBoard
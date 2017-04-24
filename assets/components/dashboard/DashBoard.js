import React, {Component} from 'react';
import {Card, Row, Col, Icon, Button, Popconfirm, Pagination} from 'antd';
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

    renderChart() {
        var charts = new Highcharts.chart('summaryCharts', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Browser market shares January, 2015 to May, 2015'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Microsoft Internet Explorer',
                    y: 56.33
                }, {
                    name: 'Chrome',
                    y: 24.03,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Firefox',
                    y: 10.38
                }, {
                    name: 'Safari',
                    y: 4.77
                }, {
                    name: 'Opera',
                    y: 0.91
                }, {
                    name: 'Proprietary or Undetectable',
                    y: 0.2
                }]
            }]
        });
    }

    //点击add图标之后弹出对话框
    clickPlus = () => {
        this.setState({
            visibleState: true,
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
            dataList: [{
                id: '1',
                project: '青青互助',
                name: 'linqj',
                date: '2017-01-22',
                type: '需求',
                duration: '34',
                description: '需求分析',
            }, {
                id: '2',
                project: '青青互助',
                name: 'linqj',
                date: '2017-01-22',
                type: '需求',
                duration: '34',
                description: '需求分析',
            }, {
                id: '3',
                project: '青青互助',
                name: 'linqj',
                date: '2017-01-22',
                type: '需求',
                duration: '34',
                description: '需求分析',
            },
                {
                    id: '4',
                    project: '青青互助',
                    name: 'linqj',
                    date: '2017-01-22',
                    type: '需求',
                    duration: '34',
                    description: '需求分析',
                }]
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
                    //todo: 显示错误信息 网络错误
                }
            }).then(function (data) {
            that.context.router.push({pathname: '/login'});
        }).catch((error) => {
            console.log('logout failed', error)
        })
    };
    //list
    showTotal=(total)=>{
    return `Total ${total} items`;
}

    componentDidMount() {

        this.renderChart();
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
                                    /*this.state.data*/
                                    this.state.dataList.map(function (list) {
                                        return (
                                            <Card key={list.id} title={list.project} className="content-title-secondary" extra={
                                                <span>
                                                    <Link>
                                                        <Icon className="className='content-title-icon-small'" type="edit"/>
                                                    </Link>
                                                    <Popconfirm title="确认删除？"
                                                                placement="right"
                                                                okText="确认"
                                                                cancelText="取消">
                                                       <a><Icon type="delete" className='content-title-icon-small'/></a>
                                                    </Popconfirm>
                                              </span>
                                            }
                                                  bodyStyle={{fontSize: '12px', background: 'rgba(220,220,220,0.2)'}}>
                                                <Row>
                                                    <Col span={3}>{list.name}</Col>
                                                    <Col span={3}>{list.date}</Col>
                                                    <Col span={3}>{list.type}</Col>
                                                    <Col span={3}>{list.duration}</Col>
                                                    <Col span={12}>
                                                        {list.description}
                                                    </Col>
                                                </Row>
                                            </Card>
                                        );
                                    }.bind(this))
                                }
                            <div>
                                <Pagination size="small" total={50} showSizeChanger showQuickJumper />
                            </div>
                        </Card>

                    </Col>
                    <Col span={8}>
                        <Card className="right-content">
                            <div className="right-content-table">
                                <Row className="right-content-table">
                                    <Col><span className="col-span">Welcome!</span>{this.props.location.state.uid}</Col>
                                    <Col>{this.props.location.state.uid}@unicc.com.cn</Col>
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
                            <div id="summaryCharts">

                            </div>
                        </Card>
                    </Col>
                </Row>
                <ModalDialog visible={this.state.visibleState}
                             callbackClick={this.onClickChanged}/>
                <EditDialog visible={this.state.editState}
                            backEditClick={this.backEditClick}
                />

            </div>

        );
    }
}

export default DashBoard
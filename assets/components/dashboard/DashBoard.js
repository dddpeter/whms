import React, {Component} from 'react';
import {Card, Row, Col, Icon,Button} from 'antd';
import  Highcharts from 'highcharts'
import ModalDialog from './ModalDialog'

import './dashboard.scss'

class DashBoard extends Component {
    renderChart(){
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

    constructor(props) {
        super(props);
        this.state = {
            visibleState:false,
        };
    }
    //点击add图标之后弹出对话框
    clickPlus=()=>{
        this.setState({
            visibleState:true,
        });
    };
    //响应用户是否点击了关闭按钮
    onClickChanged=()=>{
        this.setState({
            visibleState:false,
        });
    };
    componentDidMount(){

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
                            <Card title="青青互助" className="content-title-secondary" extra={
                                <span>
                            <Icon type="edit" className='content-title-icon-small'></Icon>
                            <Icon type="delete" className='content-title-icon-small'></Icon>
                            </span>
                            }
                                  bodyStyle={{fontSize:'12px',background:'rgba(220,220,220,0.2)'}}>
                                <Row>
                                    <Col span={3}>xiexin</Col>
                                    <Col span={3}>2017/04/10</Col>
                                    <Col span={3}>需求</Col>
                                    <Col span={3}>30h</Col>
                                    <Col span={12}>
                                        <div>
                                            <Row>
                                                <Col span={24}>1.需求分析</Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>2.需求分析</Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>3.需求分析</Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>4.需求分析</Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                            <Card title="青青互助"  className="content-title-secondary" extra={
                                <span>
                            <Icon type="edit" className='content-title-icon-small'></Icon>
                            <Icon type="delete" className='content-title-icon-small'></Icon>
                            </span>
                            }
                                  bodyStyle={{fontSize:'12px',background:'rgba(220,220,220,0.2)'}}>
                                <Row>
                                    <Col span={3}>xiexin</Col>
                                    <Col span={3}>2017/04/10</Col>
                                    <Col span={3}>需求</Col>
                                    <Col span={3}>30h</Col>
                                    <Col span={12}>
                                        <div>
                                            <Row>
                                                <Col span={24}>需求分析</Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card className="right-content">
                            <div className="right-content-table">
                                <Row className="right-content-table">
                                    <Col>Welcome! Xiexin</Col>
                                    <Col>xiexin@unicc.com.cn</Col>
                                    <Col><a href="#">Change your password</a></Col>
                                    <Col> <Button className='button-purple'>
                                        <Icon type="logout"/>Log out
                                    </Button></Col>
                                </Row>

                            </div>

                        </Card>
                        <Card title="My Summary">
                            <div id="summaryCharts"></div>
                        </Card>
                    </Col>
                </Row>
                <ModalDialog  visible={this.state.visibleState}
                              callbackClick={this.onClickChanged}/>
            </div>

        );
    }
}

export default DashBoard
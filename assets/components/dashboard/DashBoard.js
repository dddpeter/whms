import React, {Component} from 'react';
import {Card, Row, Col, Icon} from 'antd';
import  Highcharts from 'highcharts'

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
    }
    componentDidMount(){
        this.renderChart();
    }

    render() {
        return (
            <div className="content">
                <Row gutter={8}>
                    <Col span={16}>
                        <Card title="My Entries"
                              style={{border:'2px solid rgba(145,6,133,0.2)'}}
                              extra={<Icon style={{fontSize:'20px',color:'#930784'}}
                              type="plus-circle"

                              />}>

                            <Card title="青青互助"  style = {{marginBottom:'16px',border:'2px solid rgba(145,6,133,0.2)'}} extra={
                            <span>
                            <Icon type="edit" style={{fontSize:'19px',color:'#930784',margin:'4px'}}></Icon>
                            <Icon type="delete" style={{fontSize:'19px',color:'#930784',margin:'4px'}}></Icon>
                            </span>
                            }
                            bodyStyle={{fontSize:'15px',background:'rgba(220,220,220,0.2)'}}>
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
                            <Card title="青青互助"  style = {{marginBottom:'16px',border:'2px solid rgba(145,6,133,0.2)'}} extra={
                            <span>
                            <Icon type="edit" style={{fontSize:'19px',color:'#930784',margin:'4px'}}></Icon>
                            <Icon type="delete" style={{fontSize:'19px',color:'#930784',margin:'4px'}}></Icon>
                            </span>
                            }
                                  bodyStyle={{fontSize:'15px',background:'rgba(220,220,220,0.2)'}}>
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
                            <Card title="青青互助"  style = {{marginBottom:'16px',border:'2px solid rgba(145,6,133,0.2)'}} extra={
                            <span>
                            <Icon type="edit" style={{fontSize:'19px',color:'#930784',margin:'4px'}}></Icon>
                            <Icon type="delete" style={{fontSize:'19px',color:'#930784',margin:'4px'}}></Icon>
                            </span>
                            }
                                  bodyStyle={{fontSize:'15px',background:'rgba(220,220,220,0.2)'}}>
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
                        <Card style={{marginBottom:'10px'}}
                              bodyStyle={{color:'#930784',margin:'20px auto',width:'60%'}}>
                            Welcome, Xiexin<br/>
                            xiexin@unicc.com.cn
                        </Card>
                        <Card title="My Summary">
                            <div id="summaryCharts"></div>
                        </Card>
                    </Col>
                </Row>
            </div>

        );
    }
}

export default DashBoard
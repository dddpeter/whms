import React, {Component} from 'react';
import PanelRow1 from'./PanelRow1.js'
import CollapsePanel from './CollapsePanel.js'
import {Collapse, Pagination} from 'antd';
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';
const Panel = Collapse.Panel;
import Pop from './Pop.js';
import PanelHeader from './PanelHeader.js'
class MainCollapse extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: '',
            pageNum: 0,
            pageSize: 2,
            total: 0,
            projects: []
        }

    }

    onChange = ()=> {

    }

    renderMe(i) {
        let that =this;
        if(i==undefined){
            i = this.state.pageNum;
        }
        fetch(`/api/projects?pageSize=${this.state.pageSize}&pageNum=${i}`,
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
                        projects:data.projects,
                        total: Number(data.total),
                        pageNum:Number(data.current)
                    });
                }
            });

    }
    getProjectsList(i){
        this.renderMe(i-1);

    }
    componentWillMount(){

    }
    componentDidMount() {
        this.renderMe();
    }

    render() {
        return (
            <div>
                <Collapse onChange={this.onChange}>
                    {this.state.projects.map((p)=> {
                        return (
                            <Panel header={<PanelHeader title={p.projectName} extra={<Pop project={p}/>}></PanelHeader>} key={p.pid}>
                                <PanelRow1 project={p}/>
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
                                onChange={(i)=>this.getProjectsList(i)}
                    />
                </div>
            </div>
        )
    }
}
export default MainCollapse;

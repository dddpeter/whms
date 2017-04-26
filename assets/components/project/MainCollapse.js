import React, {Component} from 'react';

import CollapsePanel from './CollapsePanel.js'
import {Collapse} from 'antd';
const Panel = Collapse.Panel;
import Pop from './Pop.js';
import PanelHeader from './PanelHeader.js'
class MainCollapse extends Component{
    state = {
        status: '',
    }
    onChange=()=>{

    }
    
    render(){
        return(
            <Collapse onChange={this.onChange}>
                <Panel header={<PanelHeader title="青青互助" extra={
                    <Pop />

                    }>
                    </PanelHeader>} key="1">
                    <CollapsePanel />
                </Panel>
                <Panel header={<PanelHeader title="青青互助" extra={
                    <Pop/>

                    }>
                    </PanelHeader>} key="2">
                    <CollapsePanel />
                </Panel>
                <Panel header={<PanelHeader title="青青互助" extra={
                    <Pop />

                    }>
                    </PanelHeader>} key="3">
                    <CollapsePanel />
                </Panel>
            </Collapse>
        )
    }
}
export default MainCollapse;

import React, {Component} from 'react';
import PanelRow1 from'./PanelRow1.js'
import CollapseTable from './CollapseTable.js';

import {
    InputNumber,
    Collapse,
    Card,
    Icon,
    Row,
    Col,
    Table,
    Button,
    Modal,
    Pagination,
    Input,
    Popover,
    Select,
    DatePicker,

} from 'antd';
const Panel = Collapse.Panel;

class CollapsePanel extends Component{

   

   

    render(){

        return(
            
                <PanelRow1 />
         /*   <Panel header={<PanelHeader title="青青互助" extra={<div className="edit-div"><span>Status:{this.state.status}</span>
                    <Pop statusChange={this.statusChange}/>

                    </div>}>
                    </PanelHeader>} key={this.props.postkey}>*/

          /*  </Panel>*/
            
        )
    }
}
export default CollapsePanel;
/**
 * Created by lin on 2017/4/19.
 */
import React, {Component} from 'react';
import {Collapse,Card,Icon} from 'antd';
class PanelHeader extends Component {
    static defaultProps = {
        extra: '',
    };
    static propTypes = {
        title: React.PropTypes.string.isRequired
    };
    panelExtraStyle={
        display:'inline-block',
        float:'right'
    };

    render(){
        return (
            <div className="collapse-panel-title">
                <span className="title">{this.props.title}</span>
                <span className="rightExtra" style={this.panelExtraStyle}>{this.props.extra}</span>
            </div>)
    }
}
class Project extends Component {
    text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
    callback(key) {
        console.log(key);
    }

    render(){
        return (
            <Card title="Projects" style={{border:'2px solid rgba(145,6,133,0.2)'}}>
                <Collapse defaultActiveKey={['1']} onChange={this.callback}>
                    <Collapse.Panel header={<PanelHeader title="青青互助" extra={<Icon type="edit" style={{fontSize:'19px',color:'#930784',margin:'4px'}}></Icon>}></PanelHeader>} key="1">
                        <p>{this.text}</p>
                    </Collapse.Panel>
                    <Collapse.Panel header="青青互助" key="2">
                        <p>{this.text}</p>
                    </Collapse.Panel>
                    <Collapse.Panel header="青青互助" key="3">
                        <p>{this.text}</p>
                    </Collapse.Panel>
                </Collapse>
            </Card>
        )
    }

}
export  default  Project;
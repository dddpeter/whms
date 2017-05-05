import React, {Component} from 'react';
import {
    Modal,
    Select,
    DatePicker,
    Button,
} from 'antd';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
import './project.scss';
const Option = Select.Option;
let curr = moment();
let day = curr.format('d');
let first = curr.add(0 - day, 'days').add(1, 'days').format('YYYY-MM-DD');
let last = moment(first, 'YYYY-MM-DD').add(6, 'days').format('YYYY-MM-DD');


class ProjectExport extends Component {
    constructor(props) {
        super(props);
        let list =[];
        props.projectsList.map((p,i)=>{
            list[i] = p.pid;
        });
        this.state = {
            projectsList: this.props.projectsList,
            start: first,
            end: last,
            startTime: first,
            endTime: moment(new Date()).format('YYYY-MM-DD'),
            dataVisible: true,
            pickerVisible: false,
            exportError:false,
            projectExportList:{
                pids:list,
                start: first,
                end: last,
            },
            pidList:list,
        };
    }
    periodTime = (v) => {
        let projectExportList=this.state.projectExportList;
        if (v === '0') {
            projectExportList.start=first;
            projectExportList.end=last;
            this.setState({
                projectExportList:projectExportList,
                start: first,
                end: last,
                dataVisible: true,
                pickerVisible: false,
            })
        } else if (v === '1') {
            projectExportList.start= moment(first, 'YYYY-MM-DD').add(-7, 'days').format('YYYY-MM-DD');
            projectExportList.end=moment(first, 'YYYY-MM-DD').add(-7, 'days').add(6, 'days').format('YYYY-MM-DD');
            this.setState({
                start: moment(first, 'YYYY-MM-DD').add(-7, 'days').format('YYYY-MM-DD'),
                end: moment(first, 'YYYY-MM-DD').add(-7, 'days').add(6, 'days').format('YYYY-MM-DD'),
                projectExportList:projectExportList,
                dataVisible: true,
                pickerVisible: false,
            })
        } else {
            projectExportList.start= first;
            projectExportList.end=moment(new Date()).format('YYYY-MM-DD');
            this.setState({
                start: first,
                end: moment(new Date()).format('YYYY-MM-DD'),
                projectExportList:projectExportList,
                dataVisible: false,
                pickerVisible: true,
            })
        }
    };
    //project选择发生变化时
    selectProjectsChange=(value)=>{
        let  projectExportList=this.state.projectExportList;
        projectExportList.pids=value;
        if(value.length){
            this.setState({
                exportError:true,
            })
        }else{
            this.setState({
                projectExportList:projectExportList,
                exportError:false,
            })
        }
    };
    //时间变化时
    onDateChange=(dates)=>{
        let  projectExportList=this.state.projectExportList;
        projectExportList.start=dates[0].format('YYYY-MM-DD');
        projectExportList.end=dates[1].format('YYYY-MM-DD');
        this.setState({
            projectExportList:projectExportList,
        })
    };
    componentWillReceiveProps(props) {
        this.setState({
            projectsList: props.projectsList
        });
    };
    handleOkDownload = (e) => {
        e.preventDefault();
        this.props.callbackExport(this.state.projectExportList);
    };
    render() {
        return (
            <div>
                <Modal title="Report Export" className="" visible={true}
                       maskClosable={true}
                       footer={null}
                       onCancel={this.props.callbackExportCancle}>
                    <div>
                        <div className="report-input"><span className="label">Projects:</span>
                            <Select className={'filter'}
                                    mode="multiple"
                                    style={{width: 300}}
                                    onChange={this.selectProjectsChange}
                                    defaultValue={this.state.pidList}
                            >
                                {this.state.projectsList.map(p => {
                                    return <Option key={p.pid} value={p.pid}>{p.projectName}</Option>
                                })}
                            </Select>
                        </div>
                        <div className="report-input"><span className="label">Period:</span>
                            <Select className={'filter'}
                                    defaultValue="0"
                                    style={{width: 150}}
                                    onChange={this.periodTime}
                            >
                                <Option value="0">This Week</Option>
                                <Option value="1">Last Week</Option>
                                <Option value="2">Custom</Option>
                            </Select>
                        </div>
                        <div className="report-input date-div">
                            <span className="label">Range:</span>
                            <span style={{display:this.state.dataVisible?'inline-block':'none'}}>{this.state.start} ~ {this.state.end}</span>
                            <RangePicker
                                style={{display:this.state.pickerVisible?'inline-block':'none'}}
                                defaultValue={[moment(this.state.startTime), moment(this.state.endTime)]}
                                onChange={this.onDateChange}
                            />
                        </div>
                    </div>
                    <div className="dialog-footer">
                        <Button key="export" className="dialog-footer-button" size="large"
                                disabled={this.state.exportError}
                                onClick={this.handleOkDownload}>Export</Button>
                        <Button key="cancel" className="dialog-footer-button cancel" size="large"
                                onClick={this.props.callbackExportCancle}>Cancel</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default ProjectExport;
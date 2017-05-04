import React, {Component} from 'react';
import {
    Modal,
    Select,
    DatePicker,
    Button
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
        this.state = {
            projectsList: this.props.projectsList,
            start: first,
            end: last,
            startTime: first,
            endTime: moment(new Date()).format('YYYY-MM-DD'),
            dataVisible: true,
            pickerVisible: false,
            exportError:true,
            projectExportList:{
                pids:'',
                start: first,
                end: last,
            }
        };
    }

    periodTime = (v) => {
        if (v === '0') {
            this.setState({
                start: first,
                end: last,
                dataVisible: true,
                pickerVisible: false,
            })

        } else if (v === '1') {
            this.setState({
                start: moment(first, 'YYYY-MM-DD').add(-7, 'days').format('YYYY-MM-DD'),
                end: moment(first, 'YYYY-MM-DD').add(-7, 'days').add(6, 'days').format('YYYY-MM-DD'),
                dataVisible: true,
                pickerVisible: false,
            })
        } else {
            this.setState({
                start: first,
                end: moment(new Date()).format('YYYY-MM-DD'),
                dataVisible: false,
                pickerVisible: true,
            })
        }
    };
    //不可点击时间
    disabledDate = (current) => {
        if(current){
            let now = new Date();
            let myyear = now.getFullYear();
            let mymonth = now.getMonth()+1;
            let myweekday = now.getDate()-now.getDay()+1;
            if(mymonth < 10){
                mymonth = "0" + mymonth;
            }
            if(myweekday < 10){
                myweekday = "0" + myweekday;
            }
            let fristDayWeek=moment(myyear+"-"+mymonth + "-" + myweekday, 'YYYY-MM-DD');
            return fristDayWeek.valueOf() > current.valueOf() || current.valueOf() > Date.now();
        }
    };
    //project选择发生变化时
    selectProjectsChange=(value)=>{
        let  projectExportList=this.state.projectExportList;
        projectExportList.pids=value;
        if(value===''){
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
    onDateChange=(dates)=>{
        let  projectExportList=this.state.projectExportList;
        projectExportList.start=dates[0];
        projectExportList.end=dates[1];
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
                                disabledDate={this.disabledDate}
                            />
                        </div>
                    </div>
                    <div className="dialog-footer">
                        <Button key="add" className="dialog-footer-button" size="large"
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
/**
 * Created by lin on 2017/4/20.
 */
import React from 'react'
import moment from 'moment'
import {
    Form,
    Modal,
    Select,
    DatePicker,
    InputNumber,
    Input,
    Button
} from 'antd';
import './modalDialog.scss'
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

class ModalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectProject: '',
            defaultProject: {pid: ''},
            dateStatus: 'success',
            dataHelp: '',
            dataError: false,
            contentStatus: 'success',
            contentHelp: '',
            contentError: true,
            projectList: this.props.projectList,
            task: {
                pid: this.props.projectList[0].pid,
                uid: this.props.uidName,
                status: 1,
                type: 'DEVELOPMENT',
                spendTime: 1,
                issueDate: moment().format('YYYY-MM-DD HH:mm:ss')
            },
        };
    }
    //点击选择project
    handleChangeProject = (value) => {
        let task = this.state.task;
        task.pid = value;
        this.setState({
            task: task
        });
    };
    //点击date后选择日期
    onChangeDate = (time) => {
        let task = this.state.task;
        task.issueDate = moment(time).format('YYYY-MM-DD');
        this.setState({
            task: task
        });
        if (this.state.task.issueDate === 'Invalid date') {
            this.setState({
                dateStatus: 'error',
                dataHelp: 'Please select the correct date',
                dataError: true
            })
        } else {
            this.setState({
                dateStatus: 'success',
                dataHelp: '',
                dataError: false
            })
        }
    };
    //格式化日期并限制可选日期在本周内
    disabledDate = (current) => {
        if (current) {
            let now = new Date();
            let myyear = now.getFullYear();
            let mymonth = now.getMonth() + 1;
            let myweekday = now.getDate() - now.getDay() + 1;
            if (mymonth < 10) {
                mymonth = "0" + mymonth;
            }
            if (myweekday < 10) {
                myweekday = "0" + myweekday;
            }
            let fristDayWeek = moment(myyear + "-" + mymonth + "-" + myweekday, 'YYYY-MM-DD');
            return fristDayWeek.valueOf() > current.valueOf() || current.valueOf() > Date.now();
        }
    };
    //type
    handleChangeType = (value) => {
        let task = this.state.task;
        task.type = value;
        this.setState({
            task: task
        });
    };

    //选择Duration
    onChangeDuration = (value) => {
        let task = this.state.task;
        task.spendTime = value;
        this.setState({
            task: task
        });
        if (this.state.task.spendTime === '' || this.state.task.spendTime === null) {
            this.setState({
                durationStatus: 'error',
                durationHelp: 'Duration cannot be empty',
                durationError: true
            })
        } else {
            this.setState({
                durationStatus: 'success',
                durationHelp: '',
                durationError: false
            })
        }
    };
    //Description内容改变
    onChangeDescription = (e) => {
        let task = this.state.task;
        task.content = e.target.value;
        this.setState({
            task: task
        });
        if (this.state.task.content === '' || this.state.task.content === null) {
            this.setState({
                contentStatus: 'error',
                contentHelp: 'Please enter a description on the content',
                contentError: true
            })
        } else {
            this.setState({
                contentStatus: 'success',
                contentHelp: '',
                contentError: false
            })
        }
    };
    //点击add按钮
    onAdd = (e) => {
        e.preventDefault();
        let task = this.state.task;
        this.props.callbackContent(task);
    };

    componentWillReceiveProps(props) {
        this.setState({
            projectList: props.projectList,
            uidName: props.uidName,
        });
    };
    render() {
        return (
            <div>
                <Modal
                    visible={true}
                    maskClosable={true}
                    onCancel={this.props.callbackAddCancel}
                    title="Add Task"
                    footer={null}
                >
                    <Form className="modal-dialog">
                        <FormItem
                            {...formItemLayout}
                            label="Project:"
                        >
                            <Select className='selectProject'
                                    defaultValue={this.props.projectList[0].pid}
                                    style={{width: 120}}
                                    onChange={(v) => this.handleChangeProject(v)}>
                                {
                                    this.state.projectList.map(function (list) {
                                        return (
                                            <Option key={list.pid} value={list.pid}>{list.projectName}</Option>
                                        )
                                    }.bind(this))
                                }
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Name:"
                        >
                            <span>{this.props.uidName}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Date:"
                            validateStatus={this.state.dateStatus}
                            help={this.state.dataHelp}
                        >
                            <DatePicker defaultValue={moment()}
                                        format="YYYY-MM-DD"
                                        disabledDate={this.disabledDate}
                                        onChange={this.onChangeDate}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Type:"
                        >
                            <Select ref="selectType" defaultValue={this.state.task.type} style={{width: 120}}
                                    onChange={this.handleChangeType}>
                                <Option value="DEVELOPMENT">开发</Option>
                                <Option value="TEST">测试</Option>
                                <Option value="REQUIREMENT">需求</Option>
                                <Option value="MAINTAIN">运维</Option>
                                <Option value="TEAM">团队</Option>
                                <Option value="ADMIN">管理</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Duration"
                            validateStatus={this.state.durationStatus}
                            help={this.state.durationHelp}
                        >
                            <InputNumber min={1} defaultValue={this.state.task.spendTime}
                                         onChange={this.onChangeDuration}/>(单位：h)

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Description"
                            validateStatus={this.state.contentStatus}
                            help={this.state.contentHelp}
                        >
                            <Input ref="content" type="textarea" style={{width: '80%'}} rows={4}
                                   onChange={this.onChangeDescription}/>
                        </FormItem>
                        <div className="dialog-footer">
                            <Button key="add" className="dialog-footer-button" size="large"
                                    onClick={this.onAdd}
                                    disabled={this.state.contentError || this.state.dataError || this.state.durationError}
                            >
                                Add
                            </Button>
                            <Button key="cancel" className="dialog-footer-button cancel" size="large"
                                    onClick={this.props.callbackAddCancel}>cancel</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default ModalDialog
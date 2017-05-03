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
const config = {
    rules: [{type: 'object', required: true, message: 'Please select time!'}],
};

class ModalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            selectProject: '',
            projectList: [],
            defaultProject: {pid: ''},
            dateStatus: 'success',
            dataHelp: '',
            dataError: false,
            contentStatus: 'success',
            contentHelp: '',
            contentError: true,
            task: {
                status: moment().format('YYYY-MM-DD'),
                type: 'DEVELOPMENT',
                spendTime: 1
            }

        };
    }

    componentWillReceiveProps(props) {
        let task = this.state.task;
        task.uid = props.uidName;
        this.setState({
            task: task
        });
    };

    //引入project接口
    getProjects = () => {
        let that = this;
        fetch(`/api/user/projects`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        }).then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                return {data: []};
            }
        })
            .then(function (data) {
                let task = that.state.task;
                if (data.result) {
                    task.pid = data.data[0].pid;
                    that.setState({
                        defaultProject: data.data[0],
                        projectList: data.data,
                        task: task
                    })

                }

            });
    };
    //选择检验


    //点击了弹出框的关闭按钮
    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.props.callbackClick(this.state.visible);
    };
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
        this.handleCancel();
    };

    componentDidMount() {
        this.getProjects();
    }


    render() {
        return (
            <div>
                <Modal
                    visible={this.props.visible}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    title="Add Task"
                    footer={null}
                >
                    <Form className="modal-dialog">
                        <FormItem
                            {...formItemLayout}
                            label="Project:"
                        >
                            <Select className='selectProject'
                                    defaultValue={this.state.defaultProject.pid}
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
                            <DatePicker defaultValue={moment(this.state.task.issueDate, 'YYYY-MM-DD')}
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
                                    disabled={this.state.contentError || this.state.dataError|| this.state.durationError}
                            >
                                Add
                            </Button>
                            <Button key="cancel" className="dialog-footer-button cancel" size="large"
                                    onClick={this.handleCancel}>cancel</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default ModalDialog
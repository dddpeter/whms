/**
 * Created by lin on 2017/4/21.
 */
/**
 * Created by lin on 2017/4/20.
 */
import React from 'react'
import {
    Form,
    Modal,
    Select,
    DatePicker,
    InputNumber,
    Input,
    Button
} from 'antd';
import './dashboard.scss'
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment'
const typeList={'DEVELOPMENT':'开发','TEST':'测试','REQUIREMENT':'需求','MAINTAIN':'运维','TEAM':'团队','ADMIN':'管理'};
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
            visible: false,
            dateStatus: 'success',
            dataHelp: '',
            dataError: false,
            contentStatus: 'success',
            contentHelp: '',
            contentError: false,
            durationStatus: 'success',
            durationHelp: '',
            durationError: false,
            task: {
                id:this.props.taskList.id,
                issueDate: moment(this.props.taskList.issueDate).format('YYYY-MM-DD'),
                type:this.props.taskList.type,
                spendTime:this.props.taskList.spendTime,
                content:this.props.taskList.content
            },
        };
    }
    componentWillReceiveProps(props){
        this.setState({
            visible:props.visible,
            task: {
                id:props.taskList.id,
                issueDate: moment(props.taskList.issueDate).format('YYYY-MM-DD'),
                type:props.taskList.type,
                spendTime:props.taskList.spendTime,
                content:props.taskList.content
            },
        });
    }
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
    //选择type
    handleChangeType=(value)=>{
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
    //点击了弹出框的关闭按钮
    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.props.backEditClick(this.state.visible);
    };
    //点击修改按钮后
    onEdit=(e)=>{
        e.preventDefault();
        let task = this.state.task;
        this.props.callbackEdit(task);
        this.handleCancel();
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
    render() {
        return (
            <div>

                <Modal
                    visible={this.state.visible}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    footer={null}
                    title={'Edit Task'}
                >
                    <Form className="modal-dialog">
                        <FormItem
                            {...formItemLayout}
                            label="Project:"
                        >
                           <span>{this.props.taskList.projectname}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Name:"
                        >
                            <span>{this.props.taskList.uid}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Date:"
                            validateStatus={this.state.dateStatus}
                            help={this.state.dataHelp}
                        >
                            <DatePicker  defaultValue={moment(this.props.taskList.issueDate, 'YYYY-MM-DD')}
                                         disabledDate={this.disabledDate}
                                         onChange={this.onChangeDate}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Type:"
                        >
                            <Select defaultValue={typeList[this.props.taskList.type]}
                                    style={{width: 120}}
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
                            <InputNumber min={1}
                                         defaultValue={this.props.taskList.spendTime}
                                         onChange={this.onChangeDuration}
                            />(单位：h)
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Description"
                            validateStatus={this.state.contentStatus}
                            help={this.state.contentHelp}
                        >
                            <Input type="textarea"
                                   defaultValue={this.props.taskList.content}
                                   style={{width:'80%'}}
                                   rows={4}
                                   onChange={this.onChangeDescription}/>
                        </FormItem>
                        <div className="dialog-footer">
                            <Button key="edit"
                                    className="dialog-footer-button button-style"
                                    size="large"
                                    onClick={this.onEdit}
                                    disabled={this.state.contentError || this.state.dataError|| this.state.durationError}
                            >Ok</Button>
                            <Button key="cancel"
                                    className="cancel"
                                    size="large"
                                    onClick={this.handleCancel}>Cancel</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default ModalDialog
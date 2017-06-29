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
@Form.create()
class ModalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
                spendTime:this.props.taskList.spendTime?this.props.taskList.spendTime:0,
                content:this.props.taskList.content
            },
        };
    }
    componentWillReceiveProps(props){
        this.setState({
            task: {
                id:props.taskList.id,
                issueDate: moment(props.taskList.issueDate).format('YYYY-MM-DD'),
                type:props.taskList.type,
                spendTime:props.taskList.spendTime?props.taskList.spendTime:0,
                content:props.taskList.content
            }
        });
    }

    //点击了弹出框的关闭按钮
    handleCancel = () => {
        this.props.backEditClick();
    };
    //点击修改按钮后
    onEdit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                let originTask = this.state.task;
                let task = Object.assign(originTask,values);
                task.issueDate = moment(task.issueDate).format('YYYY-MM-DD');
                this.props.callbackEdit(task);
                this.handleCancel();
            }
        });

    };
    numberValidator(rule, value, callback){
        var reg = /^\d*$/i;
        if(value && reg.test(value)){
            if(Number(value)>0 && Number(value)<=50){
                callback();
            }
            else{
                callback('花费时间超过范围(1-50小时)');
            }

        }
        else{
            callback('只能输入整数');
        }
    }
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
        const { getFieldDecorator } = this.props.form;
        console.log(this.state.task);
        return (
            <div>
                <Modal
                    visible={true}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    footer={null}
                    title={'任务编辑'}
                >
                    <Form className="modal-dialog" onSubmit={this.onEdit}>
                        <FormItem
                            {...formItemLayout}
                            label="项目名称:"
                        >
                           <span>{this.props.taskList.projectname}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="用户:"
                        >
                            <span>{this.props.taskList.uid}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="发起日期:"
                        > {getFieldDecorator('issueDate',{initialValue: moment(this.state.task.issueDate, 'YYYY-MM-DD')})(
                            <DatePicker disabledDate={this.disabledDate}/>
                        )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="任务类型:"
                        >
                            {getFieldDecorator('type',{rules:[{require:true,message:'请选择任务类型'}],initialValue: this.state.task.type})(
                            <Select style={{width: 120}}>
                                <Option value="DEVELOPMENT">开发</Option>
                                <Option value="TEST">测试</Option>
                                <Option value="REQUIREMENT">需求</Option>
                                <Option value="MAINTAIN">运维</Option>
                                <Option value="TEAM">团队</Option>
                                <Option value="ADMIN">管理</Option>
                            </Select>)}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="历时："
                        > {getFieldDecorator('spendTime',{rules:[{require:true,message:'请填写任务花费时间'},{validator:this.numberValidator}],initialValue: this.state.task.spendTime})(
                            <Input style={{width: 120}}/>)}(单位：h)
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="任务描述："
                        >{getFieldDecorator('content',{rules:[{require:true,message:'请输入任务描述'}],initialValue: this.state.task.content})(
                            <Input type="textarea"
                                   style={{width:'80%'}}
                                   rows={4}
                            />
                        )}
                        </FormItem>
                        <div className="dialog-footer">
                            <Button key="edit"
                                    htmlType={'submit'}
                                    className="dialog-footer-button button-style"
                                    size="large"
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
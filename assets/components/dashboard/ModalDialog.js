/**
 * Created by lin on 2017/4/20.
 */
import React from 'react'
import ReactDOM from 'react-dom';
import {
    Form,
    Modal,
    Select,
    DatePicker,
    InputNumber,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Row,
    Col,
    Checkbox,
    Button
} from 'antd';
import './modalDialog.scss'
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
};

class ModalDialog extends React.Component {
    // state = {
    //     loading: false,
    //     visible: false,
    // };
    // showModal = () => {
    //     this.setState({
    //         visible: true,
    //     });
    // };
    // handleOk = () => {
    //     this.setState({ loading: true });
    //     setTimeout(() => {
    //         this.setState({ loading: false, visible: false });
    //     }, 3000);
    // };
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            uidName: '',
            selectProject: '',
        };
    }


    //点击了弹出框的关闭按钮
    handleCancel = () => {
        this.setState({
            visible: false,
        });
        this.props.callbackClick(this.state.visible);
    };
    //点击选择project
    handleChangeProject(event) {

    };

    //点击date后选择日期
    onChangeDate = (date, dateString) => {
        console.log(date, dateString);
    };
    //选择Duration
    onChangeDuration = (value) => {
        console.log('changed', value);
    };
    //Description内容改变
    onChangeDescription = (value) => {
        console.log('changed', value);
    };
    //点击add按钮
    onAdd = (e) => {
        e.preventDefault();
        let params = {};
        let projectname = this.refs.selectProject;
        let uid = this.props.uidName;
        let issueDate = ReactDOM.findDOMNode(this.refs.selectData).value;
        let type = ReactDOM.findDOMNode(this.refs.selectType).value;
        let spendTime = ReactDOM.findDOMNode(this.refs.selectNum).value;
        let content = ReactDOM.findDOMNode(this.refs.content).value;
        params['projectname'] = projectname;
        params['uid'] = uid;
        params['issueDate'] = issueDate;
        params['type'] = type;
        params['spendTime'] = spendTime;
        params['content'] = content;
        this.props.callbackContent(params);
        setTimeout(() => {
            this.handleCancel();
                }, 500);
    };

    render() {
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
        return (
            <div>

                <Modal
                    visible={this.props.visible}
                    closable={false}
                    maskClosable={true}
                    footer={null}
                >
                    <Form className="modal-dialog">
                        <FormItem
                            {...formItemLayout}
                            label="Project:"
                        >
                            <Select className='selectProject'
                                    defaultValue="zqit"
                                    ref="selectProject"
                                    style={{width: 120}}
                                    onChange={this.handleChangeProject}>
                                <Option value="zqit">中青IT</Option>
                                <Option value="qqhz">青青互助</Option>
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
                        >
                            <DatePicker ref='selectData' onChange={this.onChangeDate}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Type:"
                        >
                            <Select ref="selectType" defaultValue="demand" style={{width: 120}}
                                    onChange={this.handleChangeProject}>
                                <Option value="demand">需求</Option>
                                <Option value="group">团队</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Duration"
                        >
                            <InputNumber ref="selectNum" min={1} max={35} defaultValue={1}
                                         onChange={this.onChangeDuration}/>(单位：h)

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Description"
                        >
                            <Input ref="content" type="textarea" style={{width: '80%'}} rows={4}
                                   onChange={this.onChangeDescription}/>
                        </FormItem>
                        <div className="dialog-footer">
                            <Button key="add" className="dialog-footer-button" size="large"
                                    onClick={this.onAdd}>Add</Button>
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
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
    handleChangeProject(value) {
        console.log(`selected ${value}`);
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

                    // onOk={this.handleOk}
                    // onCancel={this.handleCancel}
                >
                    <Form className="modal-dialog">
                        <FormItem
                            {...formItemLayout}
                            label="Project:"
                        >
                            <Select defaultValue="zqit" style={{width: 120}} onChange={this.handleChangeProject}>
                                <Option value="zqit">中青IT</Option>
                                <Option value="qqhz">青青互助</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Name:"
                        >
                            <span>xiexin</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Date:"
                        >
                            <DatePicker onChange={this.onChangeDate}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Type:"
                        >
                            <Select defaultValue="zqit" style={{width: 120}} onChange={this.handleChangeProject}>
                                <Option value="demand">需求</Option>
                                <Option value="group">团队</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Duration"
                        >
                            <InputNumber min={1} max={7} defaultValue={1} onChange={this.onChangeDuration}/>

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="Description"
                        >
                            <Input type="textarea" style={{width:'80%'}} rows={4} onChange={this.onChangeDescription}/>
                        </FormItem>
                        <div className="dialog-footer">
                            <Button key="add" className="dialog-footer-button" size="large" onClick={this.handleCancel}>Add</Button>
                            <Button key="cancel" className="dialog-footer-button cancel" size="large" onClick={this.handleCancel}>cancel</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default ModalDialog
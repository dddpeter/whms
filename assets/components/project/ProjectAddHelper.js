import React, {Component} from 'react';
import {
    Modal,
    Input,
    Select,
    Button,
    Form
} from 'antd';
import './project.scss';
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


class ProjectAddHelper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: {
                status: 'OPEN',
                members: [],
                brief: ''
            },
            usersList: this.props.usersList,
            projectError: true,
            projectErrorTip: false,
            memberError: true,
            briefError: true,
            isNameExists: false,
            projects: this.props.projects,
        }
    }
    handleProjectAdd = (e) => {
        e.preventDefault();
        let project = this.state.project;
        this.props.callbackAddEdit(project);
    };
    //status变化时
    statusChange = (value) => {
        let project = this.state.project;
        project.status = value;
              this.setState({
            project: project
        });
    };
    //输入project name
    projectNameChange = (e) => {
        let that = this;
        let project = this.state.project;
        let isNameExists = false;
        project.projectName = e.target.value;
        if (project.projectName.length < 2) {
            this.setState({
                projectError: true,
                projectErrorTip: true,
                isAble: true,
            })
        } else {
            this.setState({
                projectError: false,
                projectErrorTip: false,
                isAble: false,
            })
        }
        this.state.projects.map(p => {
            if (p.projectName == project.projectName) {
                isNameExists = true;
            }
        });
        if (!isNameExists) {
            this.setState({
                project: project,
                isNameExists: isNameExists
            });
        }
        else {
            this.setState({
                isNameExists: isNameExists
            });
        }
    };
    //team member发生变化时
    teamMemberChange = (value) => {
        let project = this.state.project;
        project.members = value;
        if (project.members.length < 1) {
            this.setState({
                memberError: true,

            })
        } else {
            this.setState({
                project: project,
                memberError: false,
            })
        }
    };
    // brief发生变化时
    briefChange = (e) => {
        let project = this.state.project;
        project.brief = e.target.value;
        if (project.brief === '') {
            this.setState({
                briefError: true,

            })
        } else {
            this.setState({
                project: project,
                briefError: false,

            })
        }
    };
    // componentWillMount() {
    //     this.getName();
    // }
    componentWillReceiveProps(props) {
        this.setState({
            usersList: props.usersList
        });
    }

    render() {
        return (
            <div>
                <Modal title="Add Project"
                       visible={true}
                       maskClosable={true}
                       onCancel={this.props.callbackAddCancel}
                       footer={null}>
                    <div className="addContent">
                        <Form>
                            <FormItem
                                {...formItemLayout}
                                label="Status:"
                            >
                                <Select defaultValue="OPEN"
                                        className='select-style'
                                        onChange={this.statusChange}
                                >
                                    <Option value="OPEN">Open</Option>
                                    <Option value="CLOSE">Close</Option>
                                </Select>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="Project Name:"
                            >
                                <Input placeholder="input projectName" style={{
                                    border: this.state.isNameExists ? '1px solid rgba(240,65,52,0.5)' : ''
                                }}
                                       className='select-style'
                                       onChange={(val) => this.projectNameChange(val)}/>
                                <span className="error-tip"
                                      style={{display: this.state.projectError ? 'inline-block' : 'none'}}>*</span>
                                <div style={{
                                    display: this.state.isNameExists ? 'block' : 'none',
                                    marginTop: '5px', color: '#f04134'
                                }}>Project Name Exists!
                                </div>
                                <span style={{
                                    display: this.state.projectErrorTip ? 'inline-block' : 'none',
                                    marginTop: '5px', color: '#f04134'
                                }}>不能少于两个字符</span>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="Team member:"
                            >
                                <Select
                                    mode="multiple"
                                    className='select-style'
                                    searchPlaceholder="标签模式"
                                    placeholder="Please select"
                                    onChange={this.teamMemberChange}

                                >
                                    {
                                        this.state.usersList.map(function (list) {
                                            return (
                                                <Option key={list.uid}>{list.uid}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                <span className="error-tip"
                                      style={{display: this.state.memberError ? 'inline-block' : 'none'}}>*</span>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="Brief:"
                            >
                                <Input className='select-style'
                                       type="textarea"
                                       autosize={{minRows: 4}}
                                       onChange={this.briefChange}/>
                                <span className="error-tip"
                                      style={{display: this.state.briefError ? 'inline-block' : 'none'}}>*</span>
                            </FormItem>
                        </Form>
                    </div>
                    <div className="dialog-footer">
                        <Button key="add" className="dialog-footer-button button-style" size="large"
                                disabled={this.state.projectError || this.state.memberError || this.state.briefError}
                                onClick={this.handleProjectAdd}>Add</Button>
                        <Button key="cancel" className="cancel" size="large"
                                onClick={this.props.callbackAddCancel}>Cancel</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default ProjectAddHelper;
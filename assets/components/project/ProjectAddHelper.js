import React, {Component} from 'react';
import {
    Modal,
    Input,
    Select,
    Button
} from 'antd';
import './project.scss';
const Option = Select.Option;


class ProjectAddHelper extends Component{

    constructor(props){
        super(props);
        this.state = {
            project: {
                status: 'ACTIVE',
                members: [],
                uid: '',
                brief:''
            },
            usersList: this.props.usersList,
            projectError:true,
            projectErrorTip:false,
            memberError:true,
            briefError:true,
            isNameExists:false,
            projects:this.props.projects
        }
    }
    handleProjectAdd=(e)=>{
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
        let that=this;
        let project = this.state.project;
        let isNameExists = false;
        project.projectName = e.target.value;
        if(project.projectName.length<4){
            this.setState({
                projectError:true,
                projectErrorTip:true,
                isAble:true,
            })
        }else{
            this.setState({
                projectError:false,
                projectErrorTip:false,
                isAble:false,
            })
        }
        this.state.projects.map(p=>{
            if(p.projectName==project.projectName){
                isNameExists = true;
            }
        });
        if(!isNameExists){
            this.setState({
                project: project,
                isNameExists: isNameExists
            });
        }
        else{
            this.setState({
                isNameExists: isNameExists
            });
        }
    };
    //team member发生变化时
    teamMemberChange = (value) => {
        let project = this.state.project;
        project.members = value;
        if(project.members.length<1){
            this.setState({
                memberError:true,

            })
        }else{
            this.setState({
                project: project,
                memberError:false,
            })
        }
    };
    // brief发生变化时
    briefChange= (e) => {
        let project = this.state.project;
        project.brief = e.target.value;
        if(project.brief===''){
            this.setState({
                briefError:true,

            })
        }else{
            this.setState({
                project: project,
                briefError:false,

            })
        }
    };
    componentWillReceiveProps(props){
        this.setState({
            usersList:props.usersList
        });

    }

    render(){

        return(
            <div>
                <Modal title="Add Project"
                       visible={true}
                       maskClosable={true}
                       onCancel={this.props.callbackAddCancel}
                       footer={null}>
                    <div className="addContent">
                        <div className="add-input">
                            <span className="table-title">Status:</span>
                            <Select defaultValue="ACTIVE"
                                    className='select-style'
                                    onChange={this.statusChange}>
                                <Option value="ACTIVE">Active</Option>
                                <Option value="PENDING">Pending</Option>
                                <Option value="CLOSE">Close</Option>
                            </Select>
                        </div>
                        <div className="add-input">
                            <span className="table-title">Project Name:</span>
                            <Input placeholder="input projectName" style={{
                                border:this.state.isNameExists?'1px solid rgba(240,65,52,0.5)':''
                            }}
                                   className='select-style'
                                   onChange={(val)=>this.projectNameChange(val)}/>
                            <span className="error-tip" style={{display:this.state.projectError?'inline-block':'none'}}>*</span>
                            <div style={{ display:this.state.isNameExists?'block':'none',
                                margin:'5px 0 0 104px',color:'#f04134'}}>Project Name Exists!
                            </div>
                            <span style={{display:this.state.projectErrorTip?'inline-block':'none',
                                margin:'5px 0 0 104px',color:'#f04134'}}>不能少于四个字符</span>
                        </div>
                        <div className="add-input">
                            <span className="table-title">Team member:</span>
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
                            <span className="error-tip" style={{display:this.state.memberError?'inline-block':'none'}}>*</span>
                        </div>
                        <div className="add-input">
                            <span className="table-title">Brief:</span>
                            <Input  className='select-style'
                                    type="textarea"
                                    autosize={{minRows: 4}}
                                    onChange={this.briefChange}
                            />
                            <span className="error-tip" style={{display:this.state.briefError?'inline-block':'none'}}>*</span>
                        </div>
                    </div>
                    <div className="dialog-footer">
                        <Button key="add" className="dialog-footer-button" size="large"
                                disabled={this.state.projectError||this.state.memberError||this.state.briefError}
                                onClick={this.handleProjectAdd}>Add</Button>
                        <Button key="cancel" className="dialog-footer-button cancel" size="large"
                                onClick={this.props.callbackAddCancel}>Cancel</Button>
                    </div>
                </Modal>

            </div>
        )
    }
}
export default ProjectAddHelper;
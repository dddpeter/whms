/**
 * Created by lin on 2017/4/20.
 */
import React, {Component} from 'react';
import './login.scss'
import { Form,Card, Icon, Input, Button} from 'antd';
const FormItem = Form.Item;
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props){
        super(props);
        this.state={
            canSubmit:true
        };


    }
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();

    }
    handleSubmit = (e) => {
        var returnUrl = this.props.location.query.returnUrl;
        var that = this;
        e.preventDefault();
        this.setState({canSubmit:false});
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch('/api/login',{
                    method:'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(values)
                }).then(function(response) {
                    if (response.status === 200) {
                        return response.json();
                    }else{
                        this.setState({canSubmit:true});
                        //todo: 显示错误信息
                    }
                })
                    .then(function(data){
                        if(data.result){
                            if(returnUrl){
                                that.context.router.push(returnUrl);
                            }
                            else{
                                that.context.router.push('/');
                            }

                        }
                        else{

                            this.setState({canSubmit:true});
                            //todo: 显示错误信息
                        }

                    });
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <div className="login">
                <div className="login-background">
                </div>
                <div>
                    <Card className="login-content">
                        <h1>中青IT工时统计系统</h1>
                        <Form onSubmit={this.handleSubmit} className="login-content-form">
                            <FormItem
                                validateStatus={userNameError ? 'error' : ''}
                                help={userNameError || ''}
                            >
                                {getFieldDecorator('uid', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
                                )}
                            </FormItem>
                            <FormItem
                                validateStatus={passwordError ? 'error' : ''}
                                help={passwordError || ''}
                            >
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please input your Password!' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button
                                    className='login-content-form-submit'
                                    htmlType="submit"
                                    disabled={this.state.canSubmit && hasErrors(getFieldsError())}
                                >
                                    Log in
                                </Button>
                            </FormItem>
                        </Form>
                    </Card>
                </div>
            </div>
        );
    }
}
const WrappedHorizontalLoginForm = Form.create()(Login);
export default WrappedHorizontalLoginForm
/**
 * Created by lin on 2017/4/20.
 */
import React, {Component} from 'react';
import './login.scss'
import { Form,Card, Icon, Input, Button,Tooltip,message} from 'antd';
const FormItem = Form.Item;
import ePromise from 'es6-promise'
ePromise.polyfill();
import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Login extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };
    constructor(props){
        super(props);
        this.state={
            canSubmit:true,
        };
    }
    //判断是否是登陆状态
    checkLogin() {
        let that = this;
        fetch('/api/check/login', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        }).then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
            else {
                return [];
            }
        }).then((data) => {
            if (data.result) {
                message.info('已经登陆');
                that.context.router.push({pathname:'/'});
            }
        }).catch((error) => {
            console.log('not logins', error)
        })
    }
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.checkLogin();
        this.props.form.validateFields();

    }
    //点击登陆按钮
    handleSubmit = (e) => {
        var returnUrl = decodeURIComponent(browserHistory.getCurrentLocation().query.returnUrl);
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
                    credentials:'same-origin',
                    body:JSON.stringify(values)
                }).then(function(response) {
                    if (response.status === 200) {
                        return response.json();
                    }else{
                        that.setState({canSubmit:true});
                       return {}
                    }
                })
                    .then(function(data){
                       var uid=data.uid;
                        if(data.result){
                            if(returnUrl && returnUrl!='undefined'){
                                that.context.router.push(returnUrl);
                            }
                            else{
                                that.context.router.push({pathname:'/',state:{uid:uid}});
                            }
                        }
                        else{
                            that.setState({canSubmit:true});
                            message.error('登录失败');
                        }

                    });
            }
        });
    };
  //网络错误提示框显示的时间限制
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
                                        style={{width:'100%'}}
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
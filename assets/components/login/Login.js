/**
 * Created by lin on 2017/4/20.
 */
import React, {Component} from 'react';
import './login.scss'
import { Form,Layout,Card, Icon, Input, Button} from 'antd';
const FormItem = Form.Item;

const { Header, Content, Footer } = Layout;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        console.log(this.props);
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
                               {getFieldDecorator('userName', {
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
                                   // disabled={hasErrors(getFieldsError())}

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
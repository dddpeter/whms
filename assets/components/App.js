import React, {Component} from 'react';
import { Link } from 'react-router';
import '../../node_modules/antd/dist/antd.css'
import '../sass/App.scss'
import {Layout,Menu} from 'antd';
const { Header, Content, Footer } = Layout;

class App extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };
    constructor(props) {
        super(props);
        var pathname = this.props.location.pathname.replace('/','');
        if(pathname===undefined || pathname===null || pathname === '') {
            this.state = {
                current: 'dashboard',
            }
        }
        else{
            this.state = {
                current: pathname,
            }
        }

    }
    handleClick = (e) => {
       // console.log('click ', e);
        this.setState({
            current: e.key,
        });
        this.context.router.push('/'+e.key)
    };
    gotoIndex(){
        this.setState({
            current: 'dashboard',
        });
        this.context.router.push('/dashboard')
    }
    render() {
        return (
            <Layout className="main-content">
                <Header className="main-content">
                    <div className="logo">
                        <Link onClick={()=>this.gotoIndex()} className="logo-img">
                            <img  src="/images/whms-logo.png"/>
                        </Link>

                        <Link  onClick={()=>this.gotoIndex()} className="sysName">
                            <span>中青IT工时统计系统</span>
                        </Link>
                    </div>
                    <Menu theme="light" mode="horizontal"
                          selectedKeys={[this.state.current]}
                          onClick={this.handleClick}
                    >
                        <Menu.Item key="dashboard">任务面板</Menu.Item>
                        <Menu.Item key="project">项目列表</Menu.Item>
                    </Menu>
                </Header>
                <Layout className="main-content">
                    <Content>{this.props.children}</Content>
                </Layout>
                <Footer className="main-content">Copyright @2017 Create By UNICC Developer</Footer>
            </Layout>
        );
    }
}

export default App
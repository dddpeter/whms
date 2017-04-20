import React, {Component} from 'react';
import { Link } from 'react-router';
import '../../node_modules/antd/dist/antd.css'
import '../sass/App.scss'
import {Layout,Menu} from 'antd';

const { Header, Content, Footer } = Layout;

class App extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {
            current: 'dashboard',
        }
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
        this.context.router.push('/'+e.key)
    }
    render() {
        return (
            <Layout>
                <Header>
                    <div className="logo">
                        <Link to="/" className="logo-img">
                            <img  src="/images/whms-logo.png"/>
                        </Link>

                        <Link to="/" className="sysName">
                            <span>中青IT工时统计系统</span>
                        </Link>
                    </div>
                    <Menu theme="light" mode="horizontal"
                          selectedKeys={[this.state.current]}
                          onClick={this.handleClick}
                    >
                        <Menu.Item key="dashboard">My Dashboard</Menu.Item>
                        <Menu.Item key="project">Projects</Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    <Content>{this.props.children}</Content>
                </Layout>
                <Footer>CopyRight @2017 Create By UNICC Developer</Footer>
            </Layout>
        );
    }
}

export default App
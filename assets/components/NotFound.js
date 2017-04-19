import React, {Component} from 'react'

class  NotFound extends Component{
    render() {
        return (
            <div className="content c404">
               <img src="/images/404/404.gif"/>
                    <h2> 抱歉，您访问的页面被外星人劫持了</h2>
                    <h3>Sorry,We cannot find the page you requested.</h3>
                    <p>输入的网址不正确</p>
                    <p>页面已被删除</p>
                <span className="back-home"><a className="back-home-link" href="/">返回首页</a></span>
            </div>
        );
    }
}

export default NotFound
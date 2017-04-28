
import React, {Component} from 'react';

class ProjectHeader extends Component {
    static defaultProps = {
        extra: '',
    };
    static propTypes = {
        title: React.PropTypes.string.isRequired
    };
    panelExtraStyle = {
        display: 'inline-block',
        float: 'right'
    };

    render() {
        return (
            <div className="collapse-panel-title">
                <span className="title">{this.props.title}</span>
                <span className="rightExtra" style={this.panelExtraStyle}>{this.props.extra}</span>
            </div>
        )
    }
}

export default ProjectHeader;

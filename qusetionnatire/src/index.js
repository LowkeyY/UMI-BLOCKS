import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';


@connect(({ questionnaire }) => ({
    questionnaire
}))
class Questionnaire extends Component {

    handlerClick = () => {
        console.log(2)
        this.props.dispatch(routerRedux.push({
            pathname: '/manage'
        }));
    };

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.handlerClick}>Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="danger">Danger</Button>
                <Button type="link">Link</Button>
            </div>
        );
    }
}

export default Questionnaire;
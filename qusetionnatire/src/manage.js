import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';


@connect(({ questionnaire }) => ({
    questionnaire
}))
class Manage extends Component {

    render() {
        return (
            <div>
                <Button>Default</Button>
            </div>
        );
    }
}

export default Manage;
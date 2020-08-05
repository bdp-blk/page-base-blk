/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-08-05 16:08:09
 * @modify date 2020-08-05 16:08:09
 * @desc 头左右部分
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Spin } from 'antd';
import styles from './index.less';
import Base from '@<%=proName%>/base/BaseSub';

@connect(({ <%=moduleName%>, loading }) => ({
  <%=moduleName%>,
  loading: !!loading.effects['<%=moduleName%>/test'],
}))
@Form.create()
class Index extends Base {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.index}>
        <Spin spinning={loading} className={styles.spinStyle} />
        {/* <Card title="关联脚本" bordered={false} /> */}
        <div className={styles.title}>
          <span>基础页面</span>
        </div>
        <div className={styles.main}>
          <div className={styles.left} />
          <div className={styles.right} />
        </div>
      </div>
    );
  }
}
export default Index;

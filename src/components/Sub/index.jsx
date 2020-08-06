/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-07-17 10:04:05
 * @modify date 2020-07-17 10:04:05
 * @desc components示例
 */
import React from 'react';
import { connect } from "dva";
import { Form } from 'antd';
import styles from "./index.less";
import Base from '@<%=proName%>/base/BaseSub';

@connect(({ <%=name%> }) => ({
  <%=name%>: <%=name%>,
//   loading: !!loading.effects["<%=name%>/<%=method%>"],
}))
@Form.create()
class Index extends Base {
  constructor(props) {
    super(props);
    this.state = {};
  }

  initData(){
    super.initData();
  }

  getRefData() {
    // return this.state
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    let data = {};
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        data = values;
      }
    });
    return data;
  }

  render() {
    return <div className={styles.index}><%=name%> Sub Components</div>;
  }
}
export default Index;

/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-07-17 10:04:34
 * @modify date 2020-07-17 10:04:34
 * @desc 头左右部分
 */
import React, { Component } from "react";
import { connect } from "dva";
import { Form } from "antd";
import styles from "./index.less";
import { handleResponse } from "../utils/utils";

// const formItemLayout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 8 },
// };

@connect(({ apiMgt, loading }) => ({
  ...apiMgt,
  loading: !!loading.effects["apiMgt/test"],
}))
@Form.create()
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initData();
    this.getData();
  }

  // eslint-disable-next-line class-methods-use-this
  getRefData() {}

  // eslint-disable-next-line class-methods-use-this
  initData() {}

  getData() {
    // this.test();
  }

  test() {
    const { dispatch } = this.props;
    dispatch({
      type: "apiMgt/test",
    }).then((res) => {
      const { isSuccess, data } = handleResponse(res);
      if (isSuccess && data) {
        console.log(data);
      }
    });
  }

  render() {
    return (
      <div className={styles.apiMgt}>
        <div className={styles.title}>
          <span>API管理</span>
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

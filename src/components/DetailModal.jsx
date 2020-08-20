/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-08-10 19:49:57
 * @modify date 2020-08-10 19:49:57
 * @desc <%=name%>页面详情(by cli)
 */
import React from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { ExpandTable } from '@/bdpcloud/components';
import {BaseSub as Base} from '@<%=proName%>/base';
import { formatDate } from '@<%=proName%>/utils/time';

@connect(({ <%=moduleName%>, loading }) => ({
  <%=moduleName%>,
  loading: !!loading.effects['<%=moduleName%>/getList'],
}))
class Index extends Base {
  state = {};
  
  columns = [
    {
      title: formatMessage({ id: '<%=moduleName%>.code', defaultMessage: '编码' }),
      key: 'rowId',
      dataIndex: 'rowId',
      width: '10%',
      ellipsis: true,
    },  {
      title: formatMessage({ id: '<%=moduleName%>.type', defaultMessage: '类型' }),
      key: 'type',
      dataIndex: 'type',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.name', defaultMessage: '名称' }),
      key: 'title',
      dataIndex: 'title',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.createDate', defaultMessage: '时间' }),
      key: 'createDate',
      dataIndex: 'createDate',
      width: '15%',
      render: text => (text ? formatDate(text) : '-'),
    },
  ];

  initData = () => {
    this.getList();
  };

  getList() {
    const { dispatch } = this.props;
    dispatch({
      type: '<%=moduleName%>/getList',
    });
  }

  render() {
    const {
      viewType,
      selectedRow,
      loading,
      <%=moduleName%>: { listInfo },
      ...restProps
    } = this.props;
    // const { listInfo } = this.state;
    const modalProps = {
      width: 720,
      maskClosable: false,
      footer: null,
      // confirmLoading,
      ...restProps,
    };
    return (
      <Modal {...modalProps}>
        <div>名称：{selectedRow.title}</div>
        <ExpandTable
          rowKey="rowId"
          noTablePaddingH
          data={listInfo}
          canSelect={false}
          canExpand={false}
          loading={loading}
          columns={this.columns}
          footerRender={null}
          showFoot={false}
        />
      </Modal>
    );
  }
}

export default Index;

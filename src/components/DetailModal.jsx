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
import Base from '@<%=proName%>/base/BaseSub';
import { formatDate } from '@<%=proName%>/utils/time';

@connect(({ <%=moduleName%>, loading }) => ({
  <%=moduleName%>,
  loading: !!loading.effects['<%=moduleName%>/getSearchList'],
}))
class Index extends Base {
  state = {};
  columns = [
    {
      title: formatMessage({ id: '<%=moduleName%>.indicatorType', defaultMessage: '指标类型' }),
      key: 'indicatorType',
      dataIndex: 'indicatorType',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.indicatorSubItem', defaultMessage: '指标子项' }),
      key: 'indicatorSubItem',
      dataIndex: 'indicatorSubItem',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.indicatorName', defaultMessage: '指标名称' }),
      key: 'indicatorName',
      dataIndex: 'indicatorName',
      width: '10%',
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.indicatorCode', defaultMessage: '指标编码' }),
      key: 'indicatorCode',
      dataIndex: 'indicatorCode',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.indicatorValue', defaultMessage: '指标值' }),
      key: 'indicatorValue',
      dataIndex: 'indicatorValue',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.unit', defaultMessage: '单位' }),
      key: 'unit',
      dataIndex: 'unit',
      width: '10%',
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.parameterRangeValue', defaultMessage: '参数范围值' }),
      key: 'parameterRangeValue',
      dataIndex: 'parameterRangeValue',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.abnormalLocation', defaultMessage: '异常位置' }),
      key: 'abnormalLocation',
      dataIndex: 'abnormalLocation',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.affectedHostNum', defaultMessage: '影响主机数' }),
      key: 'affectedHostNum',
      dataIndex: 'affectedHostNum',
      width: '10%',
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.riskLevel', defaultMessage: '风险级别' }),
      key: 'riskLevel',
      dataIndex: 'riskLevel',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.remark', defaultMessage: '备注' }),
      key: 'remark',
      dataIndex: 'remark',
      width: '10%',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: '<%=moduleName%>.createDate', defaultMessage: '产生时间' }),
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
      width: 1000,
      footer: null,
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

import React from 'react';
import { connect } from 'dva';
import { Button, Input, Form, DatePicker, Tooltip } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import ExpandTable from '@/components/ExpandTable';
import styles from './index.less';
import CommonFilter from '@/components/CommonFilter';
import { getPlaceholder } from '@/utils/utils';

export const FORM_LAYOUT = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

@connect(({ logOperate }) => ({
  logOperate,
}))
@Form.create()
class Index extends React.Component {
  state = {
    loading: false,
    downLoading: false,
    data: {
      list: [],
      pagination: {},
    },
  };

  columns = [
    {
      title: formatMessage({
        id: 'logSysOperateInfoView.OperationView',
        defaultMessage: '操作页面',
      }),
      dataIndex: 'classnameCn',
      key: 'classnameCn',
      width: 130,
      onHeaderCell: () => ({
        className: styles.rowHeaderStyle,
      }),
    },
    {
      title: formatMessage({ id: 'logSysOperateInfoView.action', defaultMessage: '动作' }),
      dataIndex: 'methodCn',
      key: 'methodCn',
      width: 130,
      onHeaderCell: () => ({
        className: styles.rowHeaderStyle,
      }),
    },
    {
      title: formatMessage({ id: 'logSysOperateInfoView.log', defaultMessage: '日志' }),
      dataIndex: 'lContent',
      key: 'lContent',
      onHeaderCell: () => ({
        className: styles.rowHeaderStyle,
      }),
      render: value => {
        return (
          <Tooltip title={value}>
            <div className={styles.ellipsis}>{value}</div>
          </Tooltip>
        );
      },
    },
    {
      title: formatMessage({ id: 'logSysOperateInfoView.OperateTime', defaultMessage: '操作时间' }),
      dataIndex: 'lTime',
      key: 'lTime',
      width: 150,
      onHeaderCell: () => ({
        className: styles.rowHeaderStyle,
      }),
      render: value => {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: formatMessage({ id: 'logSysOperateInfoView.ip', defaultMessage: '操作IP' }),
      dataIndex: 'cusIp',
      key: 'cusIp',
      width: 150,
      onHeaderCell: () => ({
        className: styles.rowHeaderStyle,
      }),
    },
    {
      title: formatMessage({
        id: 'logSysOperateInfoView.OperatorPerson',
        defaultMessage: '操作人',
      }),
      dataIndex: 'staffName',
      key: 'staffName',
      width: 100,
      onHeaderCell: () => ({
        className: styles.rowHeaderStyle,
      }),
    },
  ];

  onPageChange = (pageIndex, pageSize) => {
    this.getDataSource({
      pageIndex,
      pageSize,
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleSearch = () => {
    const {
      data: {
        pagination: { pageSize },
      },
    } = this.state;
    this.getDataSource({
      pageIndex: 1,
      pageSize,
    });
  };

  rowClick = rowData => {
    if (this.TaskConfig && this.TaskConfig.resetForm) {
      this.TaskConfig.resetForm();
    }
    this.setState({
      activeData: rowData,
    });
  };

  rowClassName = record => {
    const { activeData } = this.state;
    if (JSON.stringify(activeData) === JSON.stringify(record)) {
      return 'rowActive';
    }
    return '';
  };

  getDataSource = pageInfo => {
    const {
      data: {
        pagination: { pageIndex: oldPageIndex, pageSize: oldPageSize },
      },
    } = this.state;
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const pageIndex = (pageInfo && pageInfo.pageIndex) || oldPageIndex || 1;
    const pageSize = (pageInfo && pageInfo.pageSize) || oldPageSize || 10;
    const values = getFieldsValue();
    this.setState({
      loading: true,
    });
    const formParam = {
      ...values,
      dateStart:
        values.dateRange && values.dateRange[0]
          ? moment(values.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
          : '',
      dateEnd:
        values.dateRange && values.dateRange[1]
          ? moment(values.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
          : '',
    };
    delete formParam.dateRange;
    dispatch({
      type: 'logOperate/querySysOperateInfoList',
      payload: {
        pageIndex,
        pageSize,
        ...formParam,
      },
    }).then(o => {
      this.setState({
        data: {
          list: o.data,
          pagination: o.page,
        },
        loading: false,
      });
    });
  };

  handleExpand = () => {
    if (this.table) {
      this.table.getScrollY();
    }
  };

  render() {
    const { data, loading, downLoading } = this.state;
    const {
      form,
      form: { getFieldsValue },
    } = this.props;

    return (
      <div className={styles.index}>
        <CommonFilter
          onExpand={this.onExpand}
          extra={
            <Button
              loading={downLoading}
              disabled={downLoading}
              type="primary"
              className="margin-left-8"
              onClick={() => {
                const { dispatch } = this.props;
                const formData = new FormData();
                const formParam = getFieldsValue();
                formData.append('classnameCn', formParam.classnameCn || '');
                formData.append('methodCn', formParam.methodCn || '');
                formData.append(
                  'dateStart',
                  formParam.dateRange && formParam.dateRange[0]
                    ? moment(formParam.dateRange[0]).format('YYYY-MM-DD HH:mm:ss')
                    : ''
                );
                formData.append(
                  'dateEnd',
                  formParam.dateRange && formParam.dateRange[1]
                    ? moment(formParam.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
                    : ''
                );
                this.setState({
                  downLoading: true,
                });
                dispatch({
                  type: 'logOperate/downloadSysOperateInfoList',
                  payload: formData,
                }).then(result => {
                  this.setState({
                    downLoading: false,
                  });
                  if (result) {
                    const url = window.URL.createObjectURL(result); // 转换文件流未url
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `Exp-log-${moment(new Date()).format('YYYY-MM-DD HHmmss')}.xls`;
                    a.click();
                    a = null;
                  }
                });
              }}
            >
              {formatMessage({
                id: 'logSysOperateInfoView.export',
                defaultMessage: '导出',
              })}
            </Button>
          }
          handleSubmit={this.handleSearch}
          handleReset={this.handleReset}
        >
          <Form.Item
            {...FORM_LAYOUT}
            label={formatMessage({
              id: 'logSysOperateInfoView.OperationView',
              defaultMessage: '操作页面',
            })}
            span={6}
          >
            {form.getFieldDecorator('classnameCn')(
              <Input
                placeholder={getPlaceholder(
                  formatMessage({
                    id: 'logSysOperateInfoView.OperationView',
                    defaultMessage: '操作页面',
                  })
                )}
                onPressEnter={() => this.handleSearch()}
                allowClear
              />
            )}
          </Form.Item>
          <Form.Item
            {...FORM_LAYOUT}
            label={formatMessage({
              id: 'logSysOperateInfoView.action',
              defaultMessage: '动作',
            })}
            span={6}
          >
            {form.getFieldDecorator('methodCn')(
              <Input
                placeholder={getPlaceholder(
                  formatMessage({
                    id: 'logSysOperateInfoView.action',
                    defaultMessage: '动作',
                  })
                )}
                onPressEnter={() => this.handleSearch()}
                allowClear
              />
            )}
          </Form.Item>
          <Form.Item
            {...FORM_LAYOUT}
            label={formatMessage({
              id: 'logSysOperateInfoView.OperateTime',
              defaultMessage: '操作时间',
            })}
          >
            {form.getFieldDecorator('dateRange')(
              <DatePicker.RangePicker
                className={styles.dateStyle}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={[
                  `${formatMessage({ id: 'MAINTAINMGR_FROM' })}`,
                  `${formatMessage({ id: 'MAINTAINMGR_TO' })}`,
                ]}
                allowClear
                showTime
              />
            )}
          </Form.Item>
        </CommonFilter>
        <div className={styles.tableHeight}>
          <ExpandTable
            ref={e => {
              this.table = e;
            }}
            loading={loading}
            canExpand={false}
            canSelect={false}
            data={data}
            onChange={this.onPageChange}
            columns={this.columns}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  this.rowClick(record, index);
                }, // 点击行
              };
            }}
            rowClassName={this.rowClassName}
          />
        </div>
      </div>
    );
  }
}

export default Index;

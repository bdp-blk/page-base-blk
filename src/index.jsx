/*
 * @Author: <%=author%>
 * @email: <%=email%>
 * @time: <%=time%>
 * @modAuthor: samy
 * @modTime: 2021-01-29 16:24:37
 * @desc: <%=name%>页面(by cli)
 * @Copyright © 2015~2021 BDP FE
 */
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { getPlaceholder } from '@/bdpcloud/utils/utils';
import classnames from 'classnames';
import { Form, Input, Button, Select, Divider, Popconfirm, Tag, DatePicker, message, Modal, Row, Col} from 'antd';
import { moduleName } from '../conf/constant';
import { Base, DetailModal, ExpandTable, MyIcon, CommonFilter, BatchButton } from './components';
import styles from './index.less';
import { formatDate, STR_FORMAT_1 } from '@<%=proName%>/utils/time';

const defaultSelected = {
  selectedRow: undefined,
  selectedRowDir: undefined,
  selectedRowKeys: [],
  selectedRows: [],
}

@connect(({ <%=moduleName%>, common, loading }) => ({
  ...<%=moduleName%>,
  common,
  loading: !!loading.effects[`${moduleName}/getList`] || !!loading.effects[`${moduleName}/delOne`]
}))
@Form.create()
class Index extends Base {
  constructor(props) {
    super(props);
    this.moduleName = moduleName;
    this.state = {
      ...defaultSelected,
      viewType: 'add',
      statusCd: '',
      detailModalShow: false
    };
  }

  getList = (pageInfo = {}, resetFlag) => {
    const {
      dispatch,
      form: { getFieldsValue, resetFields },
    } = this.props;
    if (resetFlag) {
      resetFields();
      this.setState({
        selectedRowDir: undefined,
      });
    } else {
      const { statusCd } = this.state;
      const { pageIndex, pageSize } = pageInfo;
      const { timeFilter } = getFieldsValue();
      const payload = {
        pageIndex,
        pageSize,
        params:{
          statusCd,
          ...getFieldsValue(),
          startTime: (timeFilter && formatDate(timeFilter[0])) || '',
          endTime: (timeFilter && formatDate(timeFilter[1])) || '',
        }
      };
      dispatch({
        type: `${moduleName}/getList`,
        payload,
      });
    }
  };

  getColumns = () => {
    const { common: { staticData: { STATUS_CD = [] } = {} }} = this.props;
    return [
      {
        title: formatMessage({id: `${moduleName}.title`,defaultMessage: '名字'}),
        key: 'title',
        dataIndex: 'title',
        width: '15%',
        // ellipsis: true,
        render: (text, record) => {
          return (
            <a
              onClick={e => {
                e.stopPropagation();
                this.operAction('view', record);
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: formatMessage({id: `${moduleName}.type`,defaultMessage: '类型',}),
        key: 'type',
        dataIndex: 'type',
        width: '15%',
        ellipsis: true,
      },
      {
        title: formatMessage({ id: `${moduleName}.statusCd`, defaultMessage: '状态' }),
        key: 'statusCd',
        dataIndex: 'statusCd',
        width: '10%',
        ellipsis: true,
        filters: STATUS_CD,
        filterMultiple: false,
        render: text => {
          const [item] = STATUS_CD.filter(ele => text === ele.value);
          return <Tag color={item && item.value === '00X' ? 'red' : 'lime'}>{item && item.label}</Tag>;
        },
      },
      {
        title: formatMessage({id: 'COMMON_CREATOR',defaultMessage: '创建人'}),
        key: 'creator',
        dataIndex: 'creator',
        width: '15%',
        ellipsis: true,
      },
      {
        title: formatMessage({id: 'COMMON_CREATE_TIME',defaultMessage: '创建时间'}),
        key: 'createDate',
        dataIndex: 'createDate',
        width: '20%',
        ellipsis: true,
        render: text => (text ? formatDate(text) : '-'),
      },
      {
        title: formatMessage({ id: 'OPERATE', defaultMessage: '操作' }),
        key: 'action',
        dataIndex: 'action',
        width: 150,
        ellipsis: true,
        fixed: 'right', // 扩展时不要使用；
        render: this.renderAction,
      },
    ];
  };

  filterChange = (pagination, filters) => {
    this.setState({ statusCd: (filters.statusCd && filters.statusCd[0]) || '' }, () => {
      this.handleSearch();
    });
  };

  pageOnChange = (pageIndex, pageSize) => {
    this.getList({pageIndex,pageSize});
  };

  handleExpand = () => {
    if (this.ExpandTable && this.ExpandTable.getScrollY) {
      this.ExpandTable.getScrollY();
    }
  };

  renderFooter = () => {
    const { selectedRowKeys } = this.state;
    const { loading } = this.props;
    const batchMenus = [{ value: 'del', label: '批量删除' }];
    return (
      <BatchButton
        menus={batchMenus}
        disabled={loading || selectedRowKeys.length === 0}
        handleMenuClick={this.onBatchMenuClick}
      />
    );
  };

  expandedRowRender = record => {
    return (
      <Row className={styles.expandedRowBox}>
        <Col span={8}>
          <div className={styles.expandedRowItem}>
            <span>
              {formatMessage({ id: `${moduleName}.staffId`, defaultMessage: '更新人' })}：
              {record.staffId}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.expandedRowItem}>
            <span>
              {formatMessage({ id: `${moduleName}.createTime`, defaultMessage: '更新时间' })}：
              {record.updateDate ? formatDate(record.updateDate) : '-'}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div className={styles.expandedRowItem}>
            <span>
              {formatMessage({ id: `${moduleName}.comments`, defaultMessage: '备注' })}：
              {record.comments}
            </span>
          </div>
        </Col>
      </Row>
    );
  };

  renderAction = (text, record) => {
    return (
      <>
        <a
          onClick={e => {
            e.stopPropagation();
            this.operAction('export', record);
          }}
        >
          导出
        </a>
        <Divider type="vertical" />
        <MyIcon
          type="iconedit"
          title="编辑"
          onClick={e => {
            e.stopPropagation();
            this.operAction('edit', record);
          }}
        />
        <Divider type="vertical" />
        <Popconfirm
          title={formatMessage({ id: 'CONFIRM_DELETION', defaultMessage: '是否删除?' })}
          onConfirm={e => {
            e.stopPropagation();
            this.operAction('del', record);
          }}
          onCancel={e => {
            e.stopPropagation();
          }}
        >
          <a onClick={e => e.stopPropagation()} >
            {formatMessage({ id: 'COMMON_DELETE', defaultMessage: '删除' })}
          </a>
        </Popconfirm>
      </>
    );
  }

  operAction = (type, record) => {
    switch (type) {
      case 'del':
        // this.handleDel([record.rowId]);
        this.handleDel(record.rowId);
        break;
      case 'view':
      case 'edit':
        this.gotoNext(type, record);
        break;
      case 'exprot':
        this.handleExport([record.rowId]);
        break;
      default:
        break;
    }
  };

  onBatchMenuClick = ({ key }) => {
    if (!key) return;
    switch (key) {
      case 'del':
        this.batchDel();
        break;
      default:
        break;
    }
  };

  batchDel = () => {
    const { selectedRowKeys } = this.state;
    // const selectedRows = list.filter(item => selectedRowKeys.indexOf(item.rowId) > -1);
    // const isIneligible = selectedRows.some(item => item.statusCd != '0');
    const isIneligible = false;
    if (isIneligible) {
      message.warning(`${formatMessage({ id: `${moduleName}.batchTips`, defaultMessage: '当前批量列表中包含不可操作项，请检查后再次批量操作!' })}`);
    } else {
      Modal.confirm({
        content: `${formatMessage({ id: `${moduleName}.confirmBatch`, defaultMessage: '将进行批量删除操作，确定操作？' })}`,
        onOk: () => {
          // const rowIds = selectedRows.map(item => item.rowId).join(',');
          this.handleDel(selectedRowKeys);
        },
      });
    }
  };

  handleDel = rowIds => {
    const { dispatch } = this.props;
    dispatch({
      type: `${moduleName}/delOne`,
      payload: {
        // ids:rowIds,// TODO: 要考虑批量删除的情况
        rowId:rowIds,
      },
    }).then(res => {
      const { isSuccess } = res;
      if (isSuccess) {
        this.getList();
      }
    });
  };

  gotoNext = (type, selectedRowNew) => {
    const { selectedRow, selectedRowDir } = this.state;
    // if (selectedRowKeys.length == 0) {
    //   message.warning(`${formatMessage({ id: `${moduleName}。tips`, defaultMessage: '请先选中一项后，才可以进行操作！' })}`);
    //   return;
    // }
    // if (!selectedRowDir || (selectedRowDir && selectedRowDir.compId === -1)) {
    //   message.warning(`${formatMessage({ id: `${moduleName}。tips`, defaultMessage: '请先选中左侧目录后，才可以进行操作！' })}`);
    //   return;
    // }
    const baseProps = {
      viewType: type,
      selectedRow: type === 'add' ? undefined : selectedRowNew || selectedRow,
      selectedRowDir,
    };
    switch (type) {
      case 'view':
      case 'add':
      case 'edit':
        // this.jumpNext(`${moduleRoute}/add`, type, baseProps)
        this.setState({ detailModalShow: true, ...baseProps });
        break;
      default:
        break;
    }
  };

  handleExport = rowIds => {
    const { dispatch } = this.props;
    dispatch({
      type: `${moduleName}/export`,
      payload: {
        rowIds,
      },
    })
  };

  handleSearch = resetFlag => {
    this.setState({
      ...defaultSelected,
    })
    this.getList({ pageIndex: 1 }, resetFlag);
  };

  handleDirSelect = (keys, { node }={}) => {
    this.setState({ selectedRowDir: !Array.isArray(keys) ? undefined : node.props.dataRef }, () => {
      this.handleSearch();
    });
  };

  render() {
    const {
      listInfo,
      common: { staticData: { STATUS_CD = [] }} = {},
      loading,
      form: { getFieldDecorator, setFieldsValue },
    } = this.props;
    const { viewType, selectedRow, detailModalShow } = this.state;

    const detailModalProps = {
      selectedRow,
      viewType,
      visible: detailModalShow,
      title: viewType === 'add' ? '添加' : viewType === 'edit' ? '编辑' : '查看',
      Refs: v => {
        this.DetailModal = v;
      },
      onCancel: () => {
        this.setState({ detailModalShow: false });
      },
      onOk: async () => {
        const { isSuccess } = await this.DetailModal.getRefData();
        if (viewType !== 'view' && isSuccess) {
          this.getList();
        }
      }
    };

    return (
      <div className={styles.index}>
        {detailModalShow && <DetailModal {...detailModalProps} />}
        <div className={styles.title}> 
          <span><%=name%></span>
          <div className={styles.flexSb}>
            <Button
              type="primary"
              className="margin-right-16"
              onClick={() => {
                this.gotoNext('card');
              }}
            >
              next
            </Button>
            <Button type="primary" onClick={() => { this.gotoNext('add'); }} > 
              添加 
            </Button>
            <span/>
          </div>
        </div>
        <div className={styles.main}>
          {/* <div className={styles.left}> </div> */}
          <div className={classnames(styles.right)}>
            <CommonFilter
              handleSubmit={() => this.handleSearch()}
              handleReset={() => this.handleSearch(true)}
              onExpanedCallBack={this.handleExpand}
              extra={
                <>
                  <Button
                    className={classnames('margin-left-10')}
                    type="primary"
                    onClick={() => {
                      this.getList({});
                    }}
                  >
                    刷新
                  </Button>
                </>
              }
            >
              <Form.Item {...this.formItemLayout} label={formatMessage({id: `${moduleName}.type`,defaultMessage: '类型'})}>
                {getFieldDecorator('type', {
                  rules: [{ required: false }],
                })(
                  <Select
                    style={{ width: 120 }}
                    allowClear
                    onChange={value => {
                      setFieldsValue({ type: value });
                      this.handleSearch();
                    }}
                  >
                    {STATUS_CD.map(item => {
                      return (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...this.formItemLayout} label={formatMessage({id: `${moduleName}.name`,defaultMessage: '名称',})}>
                {getFieldDecorator('name')(
                  <Input
                    style={{ width: 120 }}
                    onSearch={() => this.handleSearch()}
                    onPressEnter={() => this.handleSearch()}
                    placeholder={getPlaceholder(formatMessage({id: `${moduleName}.name`,defaultMessage: '名称',}))}
                  />
                )}
              </Form.Item>
              <Form.Item {...this.formItemLayout} label={formatMessage({ id: `${moduleName}.timeFilter`, defaultMessage: '时间筛选' })}>
                {getFieldDecorator('timeFilter')(
                  <DatePicker.RangePicker
                    style={{ width: 210 }}
                    format={STR_FORMAT_1}
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
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ExpandTable
                rowKey="rowId"
                data={listInfo}
                loading={loading}
                columns={this.getColumns()}
                onChange={this.pageOnChange}
                filterChange={this.filterChange}
                canSelect={false} 
                footerRender={this.renderFooter}
                canExpand={false}
                ref={v => {
                  this.ExpandTable = v;
                }}
                onRow={record => ({
                  onClick: () => {
                    this.setState({ selectedRow: record });
                  },
                })}
                onSelectRow={(rows, keys) => {
                  this.setState({ selectedRows:rows, selectedRowKeys:keys });
                }}
                allCheckedChange={(keys, rows) => {
                  this.setState({ selectedRows:rows, selectedRowKeys:keys });
                }}
                // expandedRowRender={this.expandedRowRender}
                // noTablePaddingH={false}
                // scroll={{ y: 500 }}
                // setScrollY={false}
                // showFoot={false} //是否显示分页
                // footerRender={null}
                // showPagination={false} // 不显示分页,可以显示左边全选
                // rowSelection={{ // radio单选
                //   type: 'radio',
                //   selectedRowKeys,
                //   onChange: keys => {
                //     this.setState({ selectedRowKeys: keys });
                //   },
                // }}
                // data={{
                //   pagination: { // 处理分页的方式
                //     ...listInfoIndex.pagination,
                //     showQuickJumper: false,
                //     showSizeChanger: false,
                //   },
                // }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Index;

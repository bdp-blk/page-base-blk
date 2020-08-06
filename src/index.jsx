/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-08-06 20:57:45
 * @modify date 2020-08-06 20:57:45
 * @desc 表单及目录示范
 */

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select } from 'antd';
import styles from './index.less';
import { BaseSub as Base } from '@<%=proName%>/base';
import { ExpandTable, MyIcon } from '@/bdpcloud/components';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { getPlaceholder } from '@/bdpcloud/utils/utils';
import CommonFilter from '@/components/CommonFilter';

@connect(({ <%=moduleName%>, loading }) => ({
  <%=moduleName%>,
  loading: !!loading.effects['<%=moduleName%>/getList'] || !!loading.effects['<%=moduleName%>/getTree'],
}))
@Form.create()
class Index extends Base {
  constructor(props) {
    super(props);
    this.state = {
      selectedRow: '',
      selectedRowDir: '',
      selectList: [
        {
          id: 1,
          standCode: 'code1',
          standDisplayValue: '类型1',
        },
      ],
    };
  }

  getColumns = () => {
    return [
      {
        title: formatMessage({
          id: '<%=moduleName%>.name',
          defaultMessage: '名字',
        }),
        key: 'apiName',
        dataIndex: 'apiName',
        width: '10%',
        ellipsis: true,
      },
      {
        title: formatMessage({
          id: '<%=moduleName%>.type',
          defaultMessage: '类型',
        }),
        key: 'type',
        dataIndex: 'type',
        width: '10%',
        ellipsis: true,
      },
      {
        title: formatMessage({
          id: 'COMMON_CREATOR',
          defaultMessage: '创建人',
        }),
        key: 'creator',
        dataIndex: 'creator',
        width: '10%',
        ellipsis: true,
      },
      {
        title: formatMessage({
          id: 'COMMON_CREATE_TIME',
          defaultMessage: '创建时间',
        }),
        key: 'createDate',
        dataIndex: 'createDate',
        width: '15%',
        ellipsis: true,
        render: text => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        },
      },
    ];
  };

  initData() {
    this.getTree();
  }

  getTree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: '<%=moduleName%>/getTree',
      payload: {},
    });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: '<%=moduleName%>/clear',
      payload: {},
    });
  }

  handleDirSelect = (keys, { node }) => {
    this.setState(
      {
        selectedRowDir: node.props.dataRef,
      },
      () => {
        this.handleSearch();
      }
    );
  };

  filterChange = (pagination, filters) => {
    this.setState(
      {
        statusCd: (filters.statusCd && filters.statusCd[0]) || '',
      },
      () => {
        this.handleSearch();
      }
    );
  };

  pageOnChange = (pageIndex, pageSize) => {
    this.getList({
      pageIndex,
      pageSize,
    });
  };

  handleSearch = resetFlag => {
    this.getList(
      {
        pageIndex: 1,
      },
      resetFlag
    );
  };

  getList = (pageInfo, resetFlag) => {
    const {
      dispatch,
      form: { getFieldsValue, resetFields },
    } = this.props;
    const { statusCd, selectedRowDir } = this.state;
    if (resetFlag) {
      resetFields();
      this.setState({
        selectedRowDir: undefined,
      });
    } else {
      const { pageIndex, pageSize } = pageInfo;
      const { apiName = '' } = getFieldsValue();
      const payload = {
        pageIndex,
        pageSize,
        apiName,
        statusCd,
        apiCatalogId: (selectedRowDir && selectedRowDir.catalogId) || '',
        customerId: null,
        orgId: '',
        topicId: '',
      };
      dispatch({
        type: '<%=moduleName%>/getList',
        payload,
      });
    }
  };

  render() {
    const {
      <%=moduleName%>: { treeData = [], listInfo },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { selectList } = this.state;

    return (
      <div className={styles.index}>
        <div className={styles.title}> 
          <span>表单及卡片列表示范</span>
          <Button type="primary" onClick={() => {}}>
              添加
          </Button>
        </div>
        <div className={styles.main}>
          <div className={styles.left} />
          <div className={styles.right}>
            <CommonFilter
              handleSubmit={() => this.handleSearch()}
              handleReset={() => this.handleSearch(true)}
              extra={
                <Fragment>
                  <Button type="primary" onClick={() => {}}>
                    重写重置
                  </Button>
                </Fragment>
              }
              advancedExtra={
                <Fragment>
                  <Button onClick={() => {this.getList({})}}>
                    刷新
                  </Button>
                </Fragment>
              }
              // advancedItem={[]}
            >
              <Form.Item {...this.formItemLayout}>
                {getFieldDecorator('apiName')(
                  <Input.Search
                    onSearch={() => this.handleSearch()}
                    onPressEnter={() => this.handleSearch()}
                    placeholder={getPlaceholder(
                      formatMessage({
                        id: '<%=moduleName%>.name',
                        defaultMessage: '名称',
                      })
                    )}
                  />
                )}
              </Form.Item>
              <Form.Item {...this.formItemLayout} label="类型">
                {getFieldDecorator('type', {
                  rules: [{ required: false }],
                })(
                  <Select allowClear>
                    {selectList.map(item => {
                      return (
                        <Select.Option key={item.id} value={item.standCode}>
                          {item.standDisplayValue}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </CommonFilter>
            <div style={{ height: 'calc(100% - 50px)' }}>
              <ExpandTable
                rowKey="rowId"
                data={listInfo}
                canExpand={false}
                loading={loading}
                columns={this.getColumns()}
                onChange={this.pageOnChange}
                filterChange={this.filterChange}
                canSelect={true}
                allCheckedChange={(keys, selectedRows) => {
                  this.setState({
                    selectedRowKeys: selectedRows.map(o => o.rowId),
                  });
                }}
                onSelectRow={(rows, selectedRowKeys) => {
                  this.setState({
                    selectedRowKeys,
                  });
                }}
                onRow={record => ({
                  onClick: () => {
                    this.setState({ selectedRow: record });
                  },
                })}
                ref={ref => {
                  this.tableRef = ref;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Index;

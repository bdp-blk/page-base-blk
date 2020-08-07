/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-08-06 20:57:45
 * @modify date 2020-08-06 20:57:45
 * @desc <%=name%>页面(by cli)
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider } from 'antd';
import styles from './index.less';
import { BaseSub as Base } from '@<%=proName%>/base';
import { CategoryTree, ExpandTable, MyIcon } from '@/bdpcloud/components';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { getPlaceholder } from '@/bdpcloud/utils/utils';
import CommonFilter from '@/bdpcloud/components/CommonFilter';
import router from 'umi/router';
import classnames from 'classnames';

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
      statusCd: '', // 状态筛选
      statusCdList: [
        {
          value: '0',
          text: '未发布',
        },
        {
          value: '1',
          text: '已发布',
        },
        {
          value: '2',
          text: '发布中',
        },
        {
          value: '3',
          text: '已失效',
        },
      ],
    };
  }

  getColumns = () => {
    const { statusCdList } = this.state;
    return [
      {
        title: formatMessage({id: '<%=moduleName%>.name',defaultMessage: '名字'}),
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
        title: formatMessage({ id: '<%=moduleName%>.statusCd', defaultMessage: '状态' }),
        key: 'statusCd',
        dataIndex: 'statusCd',
        width: 120,
        ellipsis: true,
        filters: statusCdList,
        filterMultiple: false,
        render: text => {
          const [item] = statusCdList.filter(ele => text === ele.value);
          return (item && item.text) || '-';
        },
      },
      {
        title: formatMessage({id: 'COMMON_CREATOR',defaultMessage: '创建人'}),
        key: 'creator',
        dataIndex: 'creator',
        width: '10%',
        ellipsis: true,
      },
      {
        title: formatMessage({id: 'COMMON_CREATE_TIME',defaultMessage: '创建时间'}),
        key: 'createDate',
        dataIndex: 'createDate',
        width: '15%',
        ellipsis: true,
        render: text => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: formatMessage({ id: 'OPERATE', defaultMessage: '操作' }),
        key: 'action',
        dataIndex: 'action',
        width: 150,
        ellipsis: true,
        fixed: 'right',
        render: (text, record) => {
          return (
            <Fragment>
              <MyIcon type="iconplay-circle" title="停止" onClick={() => {}} />
              <Divider type="vertical" />
              <MyIcon
                type="iconedit"
                title="修改"
                onClick={() => {
                  this.goToAdd('1', record);
                }}
              />
              <Divider type="vertical" />
              <MyIcon type="icondelete" title="删除" onClick={() => {}} />
            </Fragment>
          );
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

  getList = (pageInfo = {}, resetFlag) => {
    const {
      dispatch,
      form: { getFieldsValue, resetFields },
    } = this.props;
    const { statusCd } = this.state;
    if (resetFlag) {
      resetFields();
      this.setState({
        selectedRowDir: undefined,
      });
    } else {
      const { pageIndex, pageSize } = pageInfo;
      const { name = '' } = getFieldsValue();
      const payload = {
        pageIndex,
        pageSize,
        statusCd,
        name,
      };
      dispatch({
        type: '<%=moduleName%>/getList',
        payload,
      });
    }
  };

  menusList = () => {
    const menuList = [];
    // if (!node.isLeaf) {
    menuList.push({
      icon: 'iconplus',
      name: formatMessage({ id: 'BUTTON_ADD', defaultMessage: '新增' }),
      type: 'add',
    });
    // }
    menuList.push({
      icon: 'iconedit',
      name: formatMessage({ id: 'COMMON_EDIT', defaultMessage: '编辑' }),
      type: 'edit',
    });
    menuList.push({
      icon: 'icondelete',
      name: formatMessage({ id: 'COMMON_DELETE', defaultMessage: '删除' }),
      type: 'delete',
    });
    return menuList;
  };

  renderSearchIcon = () => (
    <MyIcon
      type="iconplus"
      title={formatMessage({
        id: 'DIRMENUMGR_NEW_DIR',
        defaultMessage: '新增目录',
      })}
      className="searchPlus"
      onClick={() => this.menuItemClick('add', {})}
    />
  );

  menuItemClick = (type, selectedRowDir) => {
    // if (type === 'add' && selectedRowDir && selectedRowDir.isLeaf) {
    //   message.info('子节点不能新增');
    //   return;
    // }
    if (type === 'add' || type === 'edit') {
      const dirItem = selectedRowDir;
      this.setState({
        // categoryModalShow: true,
        // viewTypeCate: type,
        selectedRowDir: dirItem,
      });
    } else if (type === 'delete') {
      console.log(type);
    }
  };

  handleExpand = () => {
    if (this.tableRef && this.tableRef.getScrollY) {
      this.tableRef.getScrollY();
    }
  };

  goToAdd = (key, selectedRow) => {
    const baseProps = {
      viewType: key === '0' ? 'add':'edit',
      selectedRow,
    };
    switch (key) {
      case '0': // 新增
      case '1': // 编辑
      router.push({
        pathname: '/<%=proName%>/<%=moduleName%>/add',
        breadcrumb: {
          name: key === '0' ? '新增':'编辑',
        },
        ...baseProps,
      });
        break;
      default:
        break;
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
          <span><%=name%></span>
          <Button type="primary" onClick={() => {this.goToAdd('0');}}>
              添加
          </Button>
        </div>
        <div className={styles.main}>
          <div className={styles.left}>
            <CategoryTree
              treeData={treeData}
              shouldUpdateProps={['treeData']}
              onSelect={this.handleDirSelect}
              // menusList={this.menusList}// 预留菜单操作
              // menuItemClick={this.menuItemClick}
              // renderSearchIcon={this.renderSearchIcon}
            />
          </div>
          <div className={styles.right}>
            <CommonFilter
              handleSubmit={() => this.handleSearch()}
              handleReset={() => this.handleSearch(true)}
              onExpanedCallBack={this.handleExpand}
              extra={
                <Fragment>
                  <Button className={classnames("margin-left-10")} type="primary" onClick={() => {this.getList()}}>
                    刷新
                  </Button>
                </Fragment>
              }
              // extraContent={} // 预留AdvancedFilter参数
              // advancedExtra={ }
              // advancedItem={[]}
            >
              <Form.Item
                {...this.formItemLayout}
                label={formatMessage({
                  id: '<%=moduleName%>.type',
                  defaultMessage: '类型',
                })}
              >
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
              <Form.Item
                {...this.formItemLayout}
                label={formatMessage({
                  id: '<%=moduleName%>.name',
                  defaultMessage: '名称',
                })}
              >
                {getFieldDecorator('name')(
                  <Input
                    // onSearch={() => this.handleSearch()}
                    // onPressEnter={() => this.handleSearch()}
                    placeholder={getPlaceholder(
                      formatMessage({
                        id: '<%=moduleName%>.name',
                        defaultMessage: '名称',
                      })
                    )}
                  />
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
                canSelect={false}// 为了简单示范，屏蔽多选功能
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

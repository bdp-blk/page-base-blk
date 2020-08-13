/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-08-06 20:57:45
 * @modify date 2020-08-06 20:57:45
 * @desc <%=name%>页面(by cli)
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Popconfirm, Tag, DatePicker, message, Modal } from 'antd';
import styles from './index.less';
import { Base } from '@<%=proName%>/base';
import { CategoryTree, ExpandTable, MyIcon} from '@/bdpcloud/components';
import { formatMessage } from 'umi/locale';
import { getPlaceholder } from '@/bdpcloud/utils/utils';
// import AdvancedFilter from '@/bdpcloud/components/AdvancedFilter';
import CommonFilter from '@/bdpcloud/components/CommonFilter';
import router from 'umi/router';
import classnames from 'classnames';
import { formatDate } from '@<%=proName%>/utils/time';
import { DetailModal } from './components';

const colors = ['red', 'green', 'blue']
@connect(({ <%=moduleName%>, loading }) => ({
  <%=moduleName%>,
  loading: !!loading.effects['<%=moduleName%>/getList'] || !!loading.effects['<%=moduleName%>/getTree'],
}))
@Form.create()
class Index extends Base {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRow: undefined,
      selectedRowDir: undefined,
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
      editState: false,
      detailModalShow: false,
    };
  }
 
  initData() {
    this.getTree();
    // this.getList();
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

  // ==============CategoryTree组件处理部分======start============== 
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
  // ==============CategoryTree组件处理部分======end============== 

  // ==============ExpandTable组件处理部分======start============== 
  getColumns = () => {
    const { statusCdList } = this.state;
    return [
      {
        title: formatMessage({id: '<%=moduleName%>.title',defaultMessage: '名字'}),
        key: 'title',
        dataIndex: 'title',
        width: '15%',
        ellipsis: true,
        render: text => {
          return (
            <a
              onClick={() => {
                this.setState({ detailModalShow: true });
              }}
            >
              {text}
            </a>
          );
        },
      },
      {
        title: formatMessage({
          id: '<%=moduleName%>.type',
          defaultMessage: '类型',
        }),
        key: 'type',
        dataIndex: 'type',
        width: '15%',
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
          const n  = Math.floor(Math.random() * colors.length + 1)-1
          return (item && <Tag color={colors[n]}>{item.text}</Tag>) || '-';
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
        fixed: 'right',
        render: (text, record) => {
          return (
            <Fragment>
              <MyIcon
                type="iconedit"
                title="修改"
                onClick={() => {
                  this.goToNext('edit', record);
                }}
              />
              <Divider type="vertical" />
              <Popconfirm
                title={formatMessage({ id: 'CONFIRM_DELETION', defaultMessage: '是否删除?' })}
                onConfirm={e => {
                  e.stopPropagation();
                  // this.handleDelete(record);
                }}
                onCancel={e => {
                  e.stopPropagation();
                }}
              >
                <MyIcon
                  onClick={e => e.stopPropagation()}
                  className={styles.iconHover}
                  title={formatMessage({ id: 'COMMON_DELETE', defaultMessage: '删除' })}
                  type="icondelete"
                />
              </Popconfirm>
            </Fragment>
          );
        },
      },
    ];
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
    const {
      <%=moduleName%>: {
        listInfo: { list },
      },
    } = this.props;
    const selectedRows = list.filter(item => selectedRowKeys.indexOf(item.rowId) > -1);
    const isIneligible = selectedRows.some(item => item.tableState != '0');
    if (isIneligible) {
      message.warning(
        `${formatMessage({
          id: '<%=moduleName%>.batchTips',
          defaultMessage: '当前批量列表中包含不可操作项，请检查后再次批量操作!',
        })}`
      );
    } else {
      Modal.confirm({
        content: `${formatMessage({
          id: '<%=moduleName%>.confirmBatch',
          defaultMessage: '将进行批量删除操作，确定操作？',
        })}`,
        onOk: () => {
          const rowIds = selectedRows.map(item => item.rowId).join(',');
          if (rowIds) {
            this.handleDelNode(rowIds);
          }
        },
      });
    }
  };

  handleDelNode = hostIds => {
    const { dispatch } = this.props;
    dispatch({
      type: '<%=moduleName%>/delNode',
      payload: {
        hostIds,
      },
    }).then(res => {
      const { isSuccess } = res;
      if (isSuccess) {
        this.getList();
      }
    });
  };

  // ==============ExpandTable组件处理部分======end============== 

  handleSearch = resetFlag => {
    this.getList(
      {
        pageIndex: 1,
      },
      resetFlag
    );
  };

  goToNext = (key, selectedRow) => {
    const baseProps = {
      viewType: key,
      selectedRow,
    };
    switch (key) {
      case 'add': // 新增
      case 'edit': // 编辑
      router.push({
        pathname: '/<%=proName%>/<%=moduleName%>/add',
        breadcrumb: {
          name: key === 'add' ? '新增':'编辑',
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
    const { selectList, selectedRow, detailModalShow } = this.state;

    const detailModalProps = {
      selectedRow,
      visible: detailModalShow,
      title: '详情',
      Refs: v => {
        this.DetailModal = v;
      },
      onCancel: () => {
        this.setState({ detailModalShow: false });
      },
      onOk: async () => {
        const data = this.DetailModal.getRefData();
        console.log(data);
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
              onClick={() => {
                this.goToNext('add');
              }}
            >
              添加
            </Button>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.left}>
            <CategoryTree
              treeData={treeData}
              shouldUpdateProps={['treeData']}
              onSelect={this.handleDirSelect}
              // menusList={this.menusList}
              // menuItemClick={this.menuItemClick}
              // renderSearchIcon={this.renderSearchIcon}
            />
          </div>
          <div className={classnames(styles.right)}>
            <CommonFilter
              handleSubmit={() => this.handleSearch()}
              handleReset={() => this.handleSearch(true)}
              onExpanedCallBack={this.handleExpand}
              extra={
                <Fragment>
                  <Button
                    className={classnames('margin-left-10')}
                    type="primary"
                    onClick={() => {
                      this.getList({});
                    }}
                  >
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
              <Form.Item
                {...this.formItemLayout}
                label={formatMessage({ id: 'taskMgt.timeFilter', defaultMessage: '时间筛选' })}
              >
                {getFieldDecorator('timeFilter')(
                  <DatePicker.RangePicker
                    style={{ minWidth: 200 }}
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
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ExpandTable
                rowKey="rowId"
                data={listInfo}
                canExpand={false}
                loading={loading}
                columns={this.getColumns()}
                onChange={this.pageOnChange}
                filterChange={this.filterChange}
                canSelect={false} // 为了简单示范，屏蔽多选功能
                footerRender={this.renderFooter}
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
                ref={v => {
                  this.ExpandTable = v;
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

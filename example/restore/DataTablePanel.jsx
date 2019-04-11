import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Card } from 'antd';
import { claimStatus, businessType } from '../Enum';
import {
  PAGINATION_OPTIONS,
  TABLE,
  PAGE,
  COMMON_TABLE_EMPTY_TEXT,
  COMMON_TABLE_QUERY_FAIL_TEXT,
  FIXED_COLUMN_WIDTH,
  DATETIME_FORMAT,
} from '../constants';
import { Link } from 'react-router-dom';
import DropdownMenu from 'Shared/components/DropdownMenu';
import WrappedPopconfirm from '../common/WrappedPopconfirm';
import {
  conventEnumValueToString,
  formatDateTime,
  formatAmount,
  isHavePermission,
} from '../utils';
import { PERMISSIONS } from './constants';
import difference from 'lodash/difference';
import { abandon, submit } from './api';
import routes from './routes';
import { renderBooleanValue } from './utils';
import { formatMessage } from './intl';

class DataTablePanel extends PureComponent {
  state = {
    isOperatting: false,
  };
  handleTableChange = (pagination, filters, sorter) => {
    const oldCondition = this.props.condition;
    if (
      pagination.current - 1 === oldCondition.pageIndex &&
      pagination.pageSize === oldCondition.pageSize
    )
      this.props.onSorterChange(sorter);
  };
  onClickAbandonBtn = id => {
    this.setState({
      isOperatting: true,
    });
    /*eslint-disable eqeqeq */

    const record = this.props.listData.data.content.filter(d => d.id == id)[0];
    abandon(id, record.rowVersion).then(res => {
      this.setState({
        isOperatting: false,
      });
      if (res.ok) this.props.refreshListData();
    });
  };
  onClickSubmitBtn = id => {
    this.setState({
      isOperatting: true,
    });
    const record = this.props.listData.data.content.filter(d => d.id == id)[0];
    submit(id, record.rowVersion).then(res => {
      this.setState({
        isOperatting: false,
      });
      if (res.ok) this.props.refreshListData();
    });
  };

  render() {
    const { data, isFetching, message: errorMessage } = this.props.listData;
    const { pageIndex, pageSize } = this.props.condition;
    const idDealerUser = this.props.isDealerUser;
    const columns = [
      {
        title: formatMessage({
          id: 'dataTablePanel.dealerCode',
          defaultMessage: '经销商编号',
        }),
        dataIndex: 'dealerCode',
        sorter: true,
        hidden: idDealerUser,
      },
    ];
    const fixedColumn = {
      title: formatMessage({
        id: 'dataTablePanel.operation',
        defaultMessage: '操作',
      }),
      dataIndex: 'id',
      render: (text, record) => {
        const menus = [
          {
            id: 'confirm',
            children: (
              <WrappedPopconfirm
                key="confirm"
                placement="topLeft"
                onConfirm={this.onClickSubmitBtn}
                id={record.id}
                title={formatMessage({
                  id: 'dataTablePanel.operation.submit.confirmMessage',
                  defaultMessage: '是否确认提交？',
                })}
              >
                <a>
                  {formatMessage({
                    id: 'dataTablePanel.operation.submit',
                    defaultMessage: '提交',
                  })}
                </a>
              </WrappedPopconfirm>
            ),
            hidden: !isHavePermission(
              PERMISSIONS.submit,
              this.props.pagePermissions,
              record.options
            ),
          },
          {
            id: 'markReturn',
            children: (
              <Link key="markReturn" to={routes.markReturn.format(record.id)}>
                {formatMessage({
                  id: 'dataTablePanel.operation.markReturn',
                  defaultMessage: '标记快返',
                })}
              </Link>
            ),
            hidden: !isHavePermission(
              PERMISSIONS.markReturn,
              this.props.pagePermissions,
              record.options
            ),
          },
          {
            id: 'approve',
            children: (
              <Link key="approve" to={routes.approve.format(record.id)}>
                {formatMessage({
                  id: 'dataTablePanel.operation.approve',
                  defaultMessage: '审核',
                })}
              </Link>
            ),
            hidden: !isHavePermission(
              PERMISSIONS.approve,
              this.props.pagePermissions,
              record.options
            ),
          },
          {
            id: 'update',
            children: (
              <Link key="update" to={routes.update.format(record.id)}>
                {formatMessage({
                  id: 'dataTablePanel.operation.update',
                  defaultMessage: '编辑',
                })}
              </Link>
            ),
            hidden: !isHavePermission(
              PERMISSIONS.update,
              this.props.pagePermissions,
              record.options
            ),
          },
          {
            id: 'abandon',
            children: (
              <WrappedPopconfirm
                key="disable"
                placement="topLeft"
                onConfirm={this.onClickAbandonBtn}
                id={record.id}
                title={formatMessage({
                  id: 'dataTablePanel.operation.abandon.confirmMessage',
                  defaultMessage: '是否确认作废？',
                })}
              >
                <a>
                  {formatMessage({
                    id: 'dataTablePanel.abandon',
                    defaultMessage: '作废',
                  })}
                </a>
              </WrappedPopconfirm>
            ),
            hidden: !isHavePermission(
              PERMISSIONS.abandon,
              this.props.pagePermissions,
              record.options
            ),
          },
        ];
        return <DropdownMenu key={text} id={text} menus={menus} />;
      },
      width: FIXED_COLUMN_WIDTH,
      fixed: 'right',
    };
    // 判断是否有页面操作权限
    // 否则，不显示操作列

    if (
      difference(this.props.pagePermissions, [
        PERMISSIONS.add,
        PERMISSIONS.export,
      ]).length > 0
    )
      columns.push(fixedColumn);
    const tableColumns = columns.filter(c => !c.hidden);
    const pagination = {
      total: data.totalElements,
      current: pageIndex + 1,
      pageSize,
      onShowSizeChange: (current, pageSize) => {
        const options = {
          pageIndex: PAGE.index,
          pageSize,
        };
        this.props.onPageOptionChange(options);
      },
      onChange: current => {
        const options = {
          pageIndex: current - 1,
        };
        this.props.onPageOptionChange(options);
      },
      ...PAGINATION_OPTIONS,
    };
    return (
      <Card>
        <Table
          className="white-space-nowrap"
          rowKey="id"
          dataSource={data.content}
          columns={tableColumns}
          loading={isFetching || this.state.isOperatting}
          pagination={pagination}
          onChange={this.handleTableChange}
          {...TABLE}
          locale={{
            emptyText: errorMessage
              ? COMMON_TABLE_QUERY_FAIL_TEXT
              : COMMON_TABLE_EMPTY_TEXT,
          }}
        />
      </Card>
    );
  }
}

DataTablePanel.propTypes = {
  condition: PropTypes.object,
  history: PropTypes.object,
  isDealerUser: PropTypes.bool,
  listData: PropTypes.object,
  pagePermissions: PropTypes.array,
  refreshListData: PropTypes.func,
  onPageOptionChange: PropTypes.func,
  onSorterChange: PropTypes.func,
};
import { connect } from 'react-redux';
import * as actions from './actions.js';
import { selectorFactory } from 'Shared/utils/immutableToJsSelectorFactory';
const getData = selectorFactory(['page', 'domainData', 'listData']);
const getCondition = selectorFactory(['page', 'appState', 'queryCondition']);
const getPagePermission = selectorFactory([
  'page',
  'domainData',
  'permissions',
  'data',
]);

const mapStateToProps = state => ({
  isDealerUser: state.getIn([
    'page',
    'domainData',
    'initData',
    'data',
    'isDealerUser',
  ]),
  listData: getData(state),
  condition: getCondition(state),
  pagePermissions: getPagePermission(state),
});

const mapDispatchToProps = dispatch => ({
  onPageOptionChange: options => dispatch(actions.onPageOptionChange(options)),
  onSorterChange: sorter => dispatch(actions.onSorterChange(sorter)),
  refreshListData: () => dispatch(actions.refreshListData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataTablePanel);

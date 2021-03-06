import React from 'react';
import {Table, Spin} from 'antd';
import PropTypes from 'prop-types';
import {vehicleOrderStatus} from '../../Enum';
import routes from './routes';
import {PAGINATION_OPTIONS, TABLE, PAGE, FIXED_COLUMN_WIDTH, DATATIME_FORMAT, AMOUNT_FORMATTER} from '../../constants';
import WrappedPopconfirm from '../../common/WrappedPopconfirm';
import {PAGE_PERMISSION} from './constants';
import DropdownMenu from 'Shared/components/DropdownMenu';
import {conventEnumValueToString, formatDateTimeStr} from '../../utils';
import style from './style.css';

export class TablePanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.hasPermission = this.hasPermission.bind(this);
        this.handleTableOnChange = this.handleTableOnChange.bind(this);
        this.submitConfirm = this.submitConfirm.bind(this);
        this.abandonConfirm = this.abandonConfirm.bind(this);
        this.handleDetail = this.handleDetail.bind(this);
    }

    handleMenuClick(name, {id}) {
        switch(name) {
            case PAGE_PERMISSION.update:
                this.props.history.push(routes.update.format(id));
                break;
        }
    }

    hasPermission(option) {
        return this.props.permissions.some(item => item === option);
    }

    handleDetail(e) {
        this.props.history.push(routes.detail.format(e.target.dataset.recordId));
    }

    handleTableOnChange(pagination, filters, sorter) {
        if(pagination.current - 1 === this.props.pageIndex && pagination.pageSize === this.props.pageSize)
            this.props.onConditionsChange({
                sortBy: sorter.field,
                sortOrder: sorter.order
            });
    }

    submitConfirm(id) {
        console.log("你好");
        this.props.submitStatus(id).then(isOk => {
            if(isOk) this.props.refreshList();
        });
    }

    abandonConfirm(id) {
        this.props.abandon(id).then(isOk => {
            if(isOk) this.props.refreshList();
        });
    }

    render() {
        const columns = [
            {
                title: '订单编号',
                dataIndex: 'code',
                sorter: true,
                render: (text, record) => (
                    <a data-record-id={record.id} onClick={this.handleDetail}>
                        {text}
                    </a>
                )
            },
            {
                title: '计划年',
                dataIndex: 'yearOfPlan'
            },
            {
                title: '计划周',
                dataIndex: 'weekOfPlan'
            },
            {
                title: '大区',
                dataIndex: 'markDepName'
            },
            {
                title: '省份',
                dataIndex: 'provinceName'
            },
            {
                title: '经销商编号',
                dataIndex: 'dealerCode'
            },
            {
                title: '经销商名称',
                dataIndex: 'dealerName'
            },
            {
                title: '订单状态',
                dataIndex: 'status',
                render: text => conventEnumValueToString(vehicleOrderStatus, text)
            },
            {
                title: '总金额',
                dataIndex: 'totalAmount',
                render: text => AMOUNT_FORMATTER.formatter(text)
            },
            {
                title: '资金类型',
                dataIndex: 'fundsTypeName'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                sorter: true,
                render: text => formatDateTimeStr(text, DATATIME_FORMAT)
            },
            {
                title: '创建人',
                dataIndex: 'creatorName'
            },
            {
                title: '备注',
                dataIndex: 'remark'
            },
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                width: FIXED_COLUMN_WIDTH,
                fixed: 'right',
                render: (text, record) => {
                    const menus = [
                        {
                            id: PAGE_PERMISSION.update,
                            children: '编辑',
                            hidden: !(
                                record.options &&
                                record.options.some(item => item === PAGE_PERMISSION.update) &&
                                this.hasPermission(PAGE_PERMISSION.update)
                            ),
                            onClick: this.handleMenuClick
                        },
                        {
                            id: PAGE_PERMISSION.submit,
                            children: (
                                <WrappedPopconfirm
                                    key="submit"
                                    placement="topLeft"
                                    onConfirm={this.submitConfirm}
                                    id={record.id}
                                    title="是否确认提交？"
                                    okText="确认"
                                    cancelText="取消">
                                    <a>提交</a>
                                </WrappedPopconfirm>
                            ),
                            hidden: !(
                                record.options &&
                                record.options.some(item => item === PAGE_PERMISSION.submit) &&
                                this.hasPermission(PAGE_PERMISSION.submit)
                            )
                        },
                        {
                            id: PAGE_PERMISSION.abandon,
                            children: (
                                <WrappedPopconfirm
                                    key="abandon"
                                    placement="topLeft"
                                    onConfirm={this.abandonConfirm}
                                    id={record.id}
                                    title="是否确认作废？"
                                    okText="确认"
                                    cancelText="取消">
                                    <a>作废</a>
                                </WrappedPopconfirm>
                            ),
                            hidden: !(
                                record.options &&
                                record.options.some(item => item === PAGE_PERMISSION.abandon) &&
                                this.hasPermission(PAGE_PERMISSION.abandon)
                            )
                        }
                    ];
                    return <DropdownMenu key={text} menus={menus} id={text} />;
                }
            }
        ];

        const pagination = {
            total: this.props.total,
            pageSize: this.props.pageSize,
            current: this.props.pageIndex + 1,
            onShowSizeChange: this.props.onPageSizeChange,
            onChange: this.props.onPageIndexChange,
            ...PAGINATION_OPTIONS
        };

        return (
            <Spin spinning={this.props.loading} className={style.spin}>
                <Table
                    className="white-space-nowrap"
                    columns={columns}
                    dataSource={this.props.data}
                    onChange={this.handleTableOnChange}
                    rowKey="id"
                    pagination={pagination}
                    {...TABLE}/>
            </Spin>
        );
    }
}

TablePanel.propTypes = {
    abandon: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    permissions: PropTypes.array.isRequired,
    refreshList: PropTypes.func.isRequired,
    submitStatus: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    onConditionsChange: PropTypes.func.isRequired,
    onPageIndexChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
    history: PropTypes.object,
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number
};

import {connect} from 'react-redux';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import * as actions from './actions';

const getData = selectorFactory(['page', 'domainData', 'list', 'data']);
const getPermissions = selectorFactory(['page', 'domainData', 'initData', 'permissions']);
const mapStateToProps = state => ({
    data: getData(state),
    loading: state.getIn(['page', 'domainData', 'list', 'isFetching']),
    total: state.getIn(['page', 'domainData', 'list', 'total']),
    pageIndex: state.getIn(['page', 'appState', 'pageTableCondition', 'pageIndex']),
    pageSize: state.getIn(['page', 'appState', 'pageTableCondition', 'pageSize']),
    permissions: getPermissions(state)
});

const mapDispatchToProps = dispatch => ({
    refreshList: () => dispatch(actions.changePageForList()),
    onPageSizeChange: (pageIndex, pageSize) =>
        dispatch(
            actions.changePageForList({
                pageSize,
                pageIndex: PAGE.index
            })
        ),
    onPageIndexChange: pageIndex =>
        dispatch(
            actions.changePageForList({
                pageIndex: pageIndex - 1
            })
        ),
    submitStatus: id => dispatch(actions.submitStatus(id)),
    abandon: id => dispatch(actions.abandon(id)),
    onConditionsChange: obj => dispatch(actions.searchList(obj))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TablePanel);
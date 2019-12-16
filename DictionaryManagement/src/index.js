/**
 * @author Lowkey
 * @date 2019/12/16 11:00:43
 * @Description: umi区块 安装宏替换：
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Table,
    Icon,
    Pagination,
    Button,
    Input,
    InputNumber,
    Popconfirm,
    Form,
    Divider,
    Switch,
    Tag
} from 'antd';
import styles from './index.less';


const namespace = 'BLOCK_NAME_CAMEL_CASE';


const EditableContext = React.createContext(); // 共享props

class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `请输入 ${title}!`
                                }
                            ],
                            initialValue: record[dataIndex]
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                     children
                 )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

@connect(({ BLOCK_NAME_CAMEL_CASE, loading }) => ({
    BLOCK_NAME_CAMEL_CASE,
    loading: loading.effects[`${namespace}/fetch`],
    loadingOption: loading.effects[`${namespace}/fetchOption`]
}))
@Form.create()

class PAGE_NAME_UPPER_CAMEL_CASE extends Component {
    addIndex = 0;
    addOptionIndex = 0;

    constructor(props) {
        super(props);
        this.state = {
            editingKey: '',
            editingOptionKey: ''

        };

        this.columns = [
            { title: '字典ID', dataIndex: 'dictionaryId', key: 'dictionaryId' },
            { title: '字典标题', dataIndex: 'dictionaryTitle', key: 'dictionaryTitle', editable: true },
            // { title: '字典类型', dataIndex: 'dictionaryType', key: 'dictionaryType' },
            { title: '字典长度', dataIndex: 'dictionaryLength', key: 'dictionaryLength', editable: true },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return (
                        editable ?
                        (<span>
              <EditableContext.Consumer>
                {form => (
                    <a
                        onClick={() => this.save(form, record)}
                        style={{ marginRight: 8 }}
                    >
                        {record.isNew ? '添加' : '保存'}
                    </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="确定取消吗?" onConfirm={() => this.cancel(record)}>
                <a> {record.isNew ? '删除' : '取消'}</a>
              </Popconfirm>
            </span>)
                                 :
                        (
                            <>
                                <a disabled={editingKey !== ''} onClick={() => this.edit(record.dictionaryId)}>
                                    编辑
                                </a>
                                <Divider type="vertical" />
                                <Popconfirm title="确定删除吗?"
                                            onConfirm={() => this.handlerDeleteClick(record.dictionaryId)}>
                                    <a>删除</a>
                                </Popconfirm>
                            </>
                        )
                    );


                }
            }
        ];
    }


    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: `${namespace}/fetch`,
            payload: {
                nowPage: 1,
                pageSize: 10
            }
        });
    }

    componentWillUnMount() {
        const { dispatch } = this.props;
        dispatch({
            type: `${namespace}/clear`,

        });
    }

    pageChangeHandler = page => {
        const {
            dispatch,
            [namespace]: { pagination }
        } = this.props;
        dispatch({
            type: `${namespace}/updatePagination`,
            payload: {
                ...pagination,
                nowPage: page
            }
        });
        dispatch({
            type: `${namespace}/fetch`,
            payload: {
                nowPage: page,
                pageSize: pagination.pageSize
            }
        });
    };

    onShowSizeChange = (current, pageSize) => {
        const { dispatch, [namespace]: { pagination } } = this.props;
        dispatch({
            type: `${namespace}/updatePagination`,
            payload: {
                ...pagination,
                pageSize
            }
        });
        dispatch({
            type: `${namespace}/fetch`,
            payload: {
                nowPage: current,
                pageSize
            }
        });
    };
    //判断是否为编辑状态
    isEditing = record => (record.dictionaryId === this.state.editingKey) || record.isNew;
    isOpinionEditing = record => (record.optionId === this.state.editingOptionKey) || record.isNew;

    updateSuccess = (key) => {
        this.setState({ [key]: '' });
    };

    //字典管理
    save(form, { isNew, dictionaryId }) {
        const { dispatch } = this.props;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            if (isNew) {
                dispatch({
                    type: `${namespace}/add`,
                    payload: {
                        ...row,
                        dictionaryType: '1'
                    }

                });

            } else {
                dispatch({
                    type: `${namespace}/update`,
                    payload: {
                        ...row,
                        dictionaryId,
                        dictionaryType: '1'
                    },
                    callback: this.updateSuccess.bind(null, 'editingKey')
                });
            }
        });
    }

    edit(key) {
        this.setState({ editingKey: key });
    }

    cancel = ({ key, isNew = false }) => {
        const { dispatch } = this.props;
        if (isNew) {
            dispatch({
                type: `${namespace}/removeDictionary`,
                payload: key
            });
        }
        this.setState({ editingKey: '' });
    };

    handlerDeleteClick = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: `${namespace}/deleteDictionary`,
            payload: {
                dictId: id
            }
        });
    };

    handlerAddClick = () => {
        const { dispatch } = this.props;
        dispatch({
            type: `${namespace}/addDictionary`,
            payload: {
                key: `NEW_DICTIONARY_ID_${this.addIndex}`,
                dictionaryId: `NEW_DICTIONARY_ID_${this.addIndex}`,
                dictionaryTitle: '',
                dictionaryType: '',
                dictionaryLength: '',
                isNew: true
            }
        });
        this.addIndex += 1;
    };

    //选项管理
    handlerAddOption = ({ dictionaryId }) => {
        const { dispatch } = this.props;
        dispatch({
            type: `${namespace}/addDictionaryOption`,
            payload: {
                key: `NEW_OPTION_ID_${this.addOptionIndex}`,
                optionId: `NEW_OPTION_ID_${this.addOptionIndex}`,
                optionTitle: '',
                optionValue: '',
                optionEnable: '',
                optionSort: 0,
                isNew: true,
                dictionaryId
            }
        });
        this.addOptionIndex += 1;
    };

    saveOption = (e, optionId, dictionaryId) => {
        const { dispatch, form } = this.props;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const { optionDefault, optionEnable } = row;
            dispatch({
                type: `${namespace}/updateOption`,
                payload: {
                    ...row,
                    optionDefault: optionDefault ? '1' : '0',
                    optionEnable: optionEnable ? '1' : '0',
                    dictionaryId,
                    optionId
                },
                callback: this.updateSuccess.bind(null, 'editingOptionKey')
            });
        });
    };

    addOption = (e, dictionaryId) => {
        const { dispatch, form } = this.props;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const { optionDefault, optionEnable } = row;
            dispatch({
                type: `${namespace}/addOption`,
                payload: {
                    ...row,
                    optionDefault: optionDefault ? '1' : '0',
                    optionEnable: optionEnable ? '1' : '0',
                    dictionaryId
                }
            });
        });
    };

    editOption(e, key) {
        this.setState({ editingOptionKey: key });
    }

    cancelOption = ({ key, isNew = false, dictionaryId }) => {
        const { dispatch } = this.props;
        if (isNew) {
            dispatch({
                type: `${namespace}/removeDictionaryOption`,
                payload: {
                    key,
                    dictionaryId
                }
            });
        }
        this.setState({ editingOptionKey: '' });
    };

    handlerDeleteOption = (optionId, dictionaryId) => {
        const { dispatch } = this.props;
        dispatch({
            type: `${namespace}/deleteOption`,
            payload: {
                optionId,
                dictionaryId

            }
        });
    };

    render() {
        const { editingOptionKey } = this.state;
        const { [namespace]: { listData, pagination, optionData }, form, loading, loadingOption } = this.props;
        const { nowPage, pageSize, totalCount } = pagination;

        const { getFieldDecorator } = form;

        const expandedRowRender = (preRecord) => {
            const columns = [
                {
                    title: '序号',
                    dataIndex: 'optionSort',
                    key: 'optionSort',
                    render: (text, record) => {
                        if (this.isOpinionEditing(record)) {
                            return (
                                <Form.Item style={{ margin: 0 }}>
                                    {getFieldDecorator('optionSort', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入序号!'
                                            }
                                        ],
                                        initialValue: record.optionSort
                                    })(<InputNumber />)}
                                </Form.Item>);
                        }
                        return text;
                    }
                },
                {
                    title: '名称',
                    dataIndex: 'optionTitle',
                    key: 'optionTitle',
                    render: (text, record) => {
                        if (this.isOpinionEditing(record)) {
                            return (
                                <Form.Item style={{ margin: 0 }}>
                                    {getFieldDecorator('optionTitle', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入名称!'
                                            }
                                        ],
                                        initialValue: record.optionTitle
                                    })(<Input />)}
                                </Form.Item>);
                        }
                        return text;
                    }
                },
                // { title: '键值', dataIndex: 'optionValue', key: 'optionValue' },
                {
                    title: '键值',
                    dataIndex: 'optionValue',
                    key: 'optionValue',
                    render: (text, record) => {
                        if (this.isOpinionEditing(record)) {
                            return (
                                <Form.Item style={{ margin: 0 }}>
                                    {getFieldDecorator('optionValue', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入键值!'
                                            }
                                        ],
                                        initialValue: record.optionValue
                                    })(<Input />)}
                                </Form.Item>);
                        }
                        return text;
                    }
                },
                {
                    title: '缺省值',
                    dataIndex: 'optionDefault',
                    key: 'optionDefault',
                    render: (text, record) => {
                        if (this.isOpinionEditing(record)) {
                            return (
                                <Form.Item style={{ margin: 0 }}>
                                    {getFieldDecorator('optionDefault', {
                                        initialValue: !!Number(record.optionDefault),
                                        valuePropName: 'checked'
                                    })(<Switch
                                        checkedChildren={<Icon type="check" />}
                                        unCheckedChildren={<Icon type="close" />}
                                    />)}
                                </Form.Item>
                            );
                        }
                        return (
                            <Tag color={text === '1' ? "green" : 'red'}>{text === '1' ? '是' : '否'}</Tag>
                        );
                    }
                },
                {
                    title: '可用？',
                    dataIndex: 'optionEnable',
                    key: 'optionEnable',
                    render: (text, record) => {
                        if (this.isOpinionEditing(record)) {
                            return (
                                <Form.Item style={{ margin: 0 }}>
                                    {getFieldDecorator('optionEnable', {
                                        initialValue: !!Number(record.optionEnable),
                                        valuePropName: 'checked'
                                    })(<Switch
                                        checkedChildren={<Icon type="check" />}
                                        unCheckedChildren={<Icon type="close" />}
                                    />)}
                                </Form.Item>
                            );
                        }
                        return (
                            <Tag color={text === '1' ? "green" : 'red'}>{text === '1' ? '是' : '否'}</Tag>
                        );
                    }
                },
                {
                    title: () => (<div className={styles.addButton}>
                        <span style={{ marginRight: '1em' }}>操作</span>
                        <Icon
                            type="plus-circle"
                            style={{ color: '#1890ff', fontSize: '20px' }}
                            onClick={() => this.handlerAddOption(preRecord)}
                        />
                    </div>),
                    dataIndex: 'operation',
                    key: 'operation',
                    render: (text, record) => {
                        const { editingOptionKey } = this.state;
                        if (this.isOpinionEditing(record)) {
                            if (record.isNew) {
                                return (
                                    <span>
                  <a onClick={e => this.addOption(e, preRecord.dictionaryId)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.cancelOption(record)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
                                );
                            }
                            return (
                                <span>
                <a onClick={e => this.saveOption(e, record.optionId, preRecord.dictionaryId)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancelOption(e, record.optionId)}>取消</a>
              </span>
                            );
                        }
                        return (
                            <span>
              <a disabled={editingOptionKey !== ''} onClick={e => this.editOption(e, record.optionId)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？"
                          onConfirm={() => this.handlerDeleteOption(record.optionId, record.dictionaryId)}>
                <a>删除</a>
              </Popconfirm>
            </span>
                        );
                    }
                }
            ];

            return (
                <>
                    <Table
                        columns={columns}
                        dataSource={optionData[preRecord.dictionaryId]}
                        loading={loadingOption}
                        rowKey={record => record.optionId}
                        pagination={false} />
                </>
            );
        };

        const handlerOpenRow = (expanded, preRecord) => {
            const { dispatch } = this.props;
            if (expanded && fetch) {
                dispatch({
                    type: `${namespace}/fetchOption`,
                    payload: {
                        dictId: preRecord.dictionaryId
                    }
                });
            }
        };

        const components = {
            body: {
                cell: EditableCell
            }
        };

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'dictionaryLength' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record)
                })
            };
        });

        return (
            <div>
                <Button disabled={editingOptionKey !== ''} icon="plus" type="primary" onClick={this.handlerAddClick}>
                    新建
                </Button>
                <EditableContext.Provider value={this.props.form}>
                    <Table
                        components={components}
                        loading={loading}
                        className="components-table-demo-nested"
                        rowKey={record => record.dictionaryId}
                        columns={columns}
                        expandedRowRender={expandedRowRender}
                        expandRowByClick
                        onExpand={handlerOpenRow}
                        dataSource={listData}
                        pagination={false}
                    />
                </EditableContext.Provider>
                <Pagination
                    className="ant-table-pagination"
                    total={parseInt(totalCount, 10)}
                    current={parseInt(nowPage, 10)}
                    pageSize={parseInt(pageSize, 10)}
                    onChange={this.pageChangeHandler}
                    onShowSizeChange={this.onShowSizeChange}
                />
            </div>
        );
    }
}

export default PAGE_NAME_UPPER_CAMEL_CASE;


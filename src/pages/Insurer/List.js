import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  //Form,
  DatePicker,
  Select,
} from 'antd';

import { Form } from 'react-formio';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './List.less';

//const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
//@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'list/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/submit',
      payload: { id },
    });
  };

  render() {
    const {
      list: { list },
      loading,
    } = this.props;
    // const {
    //   form: { getFieldDecorator },
    // } = this.props;
    const { visible, done, current = {} } = this.state;

    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: 'Delete Task',
          content: 'Are you sure you want to delete this task?',
          okText: 'Confirm',
          cancelText: 'Cancel',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'Save', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">All</RadioButton>
          <RadioButton value="progress">Progress</RadioButton>
          <RadioButton value="waiting">Waiting</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="Please Enter"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { owner, createdAt, percent, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Owner</span>
          <p>{owner}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>Starting time</span>
          <p>{moment(createdAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
        </div>
      </div>
    );

    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="edit">Edit</Menu.Item>
            <Menu.Item key="delete">Delete</Menu.Item>
          </Menu>
        }
      >
        <a>
          More <Icon type="down" />
        </a>
      </Dropdown>
    );

    const formControls =
    {
      "components": [
        {
          "input": true,
          "inputType": "text",
          "label": "Code",
          "key": "code",
          "placeholder": "Enter insurer code",
          "type": "textfield"
        },
        {
          "input": true,
          "inputType": "text",
          "label": "Name",
          "key": "name",
          "placeholder": "Enter insurer name",
          "type": "textfield"
        },
        {
          "input": true,
          "inputType": "checkbox",
          "label": "Is Active",
          "datagridLabel": true,
          "key": "isActive",
          "defaultValue": "true",
          "validate": {
            "required": false
          },
          "type": "checkbox"
        },
        {
          "input": true,
          "tableView": true,
          "inputMask": "",
          "inputType": "hidden",
          "key": "id",
          "type": "hidden"
        }
      ],
      "display": "form",
      "action": "/api/insurer", 
      "page": 0
    };

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="Successful operation"
            description="A series of information descriptions, short and equally punctuated."
            actions={
              <Button type="primary" onClick={this.handleDone}>
                Got it
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form form={formControls} />
        // <Form onSubmit={this.handleSubmit}>
        //   <FormItem label="Mission name" {...this.formLayout}>
        //     {getFieldDecorator('title', {
        //       rules: [{ required: true, message: 'Please enter task name' }],
        //       initialValue: current.title,
        //     })(<Input placeholder="Please enter" />)}
        //   </FormItem>
        //   <FormItem label="Starting time" {...this.formLayout}>
        //     {getFieldDecorator('createdAt', {
        //       rules: [{ required: true, message: 'Please select start time' }],
        //       initialValue: current.createdAt ? moment(current.createdAt) : null,
        //     })(
        //       <DatePicker
        //         showTime
        //         placeholder="Please choose"
        //         format="YYYY-MM-DD HH:mm:ss"
        //         style={{ width: '100%' }}
        //       />
        //     )}
        //   </FormItem>
        //   <FormItem label="Task owner" {...this.formLayout}>
        //     {getFieldDecorator('owner', {
        //       rules: [{ required: true, message: 'Please enter task owner' }],
        //       initialValue: current.owner,
        //     })(
        //       <Select placeholder="Please choose">
        //         <SelectOption value="Manager 1">Manager 1</SelectOption>
        //         <SelectOption value="Manager 2">Manager 2</SelectOption>
        //       </Select>
        //     )}
        //   </FormItem>
        //   <FormItem {...this.formLayout} label="Product description">
        //     {getFieldDecorator('subDescription', {
        //       rules: [
        //         {
        //           message: 'Please enter a product description of at least five characters！',
        //           min: 5,
        //         },
        //       ],
        //       initialValue: current.subDescription,
        //     })(<TextArea rows={4} placeholder="Please enter at least five characters" />)}
        //   </FormItem>
        // </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="My todo" value="8Task" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周任务平均处理时间" value="32min" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="Number of tasks completed this week" value="24Task" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="Standard List"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              Add to
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      Edit
                    </a>,
                    <MoreBtn current={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={<a href={item.href}>{item.title}</a>}
                    description={item.subDescription}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `Task${current ? 'Edit' : 'Add to'}`}
          className={styles.standardListForm}
          width={640}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;

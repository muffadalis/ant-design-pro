import React, { PureComponent, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  Card,
  Radio,
  Button,
  Menu,
  Modal,
  Table,
  Badge,
} from 'antd';

import { Form } from 'react-formio';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './List.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class InsurerList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'insurer/fetch',
      payload: {
        isActive: true,
      },
    });
  }

  showNewModal = () => {
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

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSave = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const current = this.formio.formio.data;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    dispatch({
      type: 'insurer/save',
      payload: { id, data: current },
    });

    this.setState({ 
      visible: false,
    });

  };

  render() {
    const {
      insurers: { insurers },
      loading,
    } = this.props;

    const { visible, done, current = {} } = this.state;

    const modalFooter = { okText: 'Save', onOk: this.handleSave, onCancel: this.handleCancel };

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="active">
          <RadioButton value="all">All</RadioButton>
          <RadioButton value="active">Active</RadioButton>
        </RadioGroup>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          icon="plus"
          onClick={this.showNewModal}
          ref={component => {
            /* eslint-disable */
            this.addBtn = findDOMNode(component);
            /* eslint-enable */
          }}
        >
          New
        </Button>
      </div>
    );

    const getModalContent = () => {
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
      };

      return (
        <Form
          form={formControls}
          submission={{ data: current }}
          ref={component => {
            this.formio = component;
          }}
        />
      );
    };

    const columns = [
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Active',
        render: (text, record) => (
          record.isActive == true
            ? <Badge status="success" text="Yes" />
            : <Badge status="error" text="No" />
        ),
      },
      {
        title: 'Actions',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.showEditModal(record)}>Edit</a>
          </Fragment>
        ),
      },

    ];

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>

          <Card
            className={styles.listCard}
            bordered={false}
            title="Insurer List"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Table
              style={{ marginBottom: 16 }}
              pagination={false}
              loading={loading}
              dataSource={insurers}
              columns={columns}
            />
          </Card>
        </div>
        <Modal
          title={current.name ? `Edit - ${current.name}` : 'New Insurer'}
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

//export default InsurerList;

function mapStateToProps(state) {
  return {
    insurers: state.insurer,
    loading: state.loading.effects['insurer/fetch']
  };
}

export default connect(mapStateToProps)(InsurerList);


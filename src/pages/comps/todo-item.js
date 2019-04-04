import React from 'react';
import { Input, Modal, Form, Checkbox } from 'antd';
class TodoItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showDel: false,  // 控制删除 icon 的显示隐藏
			modal: {
				visible: false,
				todo: ''
			}

		}
	}

	handleDelete() {
		// 获取父组件传递过来的 date 
		const date = this.props.date;
		// 执行父组件的 delete 方法
		this.props.onDeleteItem(date);
	}

	handleUpdate() {
		const { modal } = this.state;
		const { getFieldsValue } = this.props.form;
		const values = getFieldsValue();
		const date = this.props.date;
		const content = values.todo;
		this.props.onUpdateItem(date, content);
		modal.visible = false;
		this.setState({
			modal,
		})
	}

	handleModal(data) {
		const { modal } = this.state;
		modal.visible = data.visible;
		modal.data = this.props.content;
		this.setState({
			modal,
		})
	}

	handleChange(e) {
		const status = e.target.checked == true ? 'true' : 'false';
		this.props.onUpdateStatus(status, this.props.date);
	}
	render() {
		const { modal } = this.state;
		const { getFieldDecorator } = this.props.form;
		let checkedStatus = this.props.status == 'true' ? true : false;
		console.log('checkedStatus',checkedStatus);
		return (
			<div className="todoItem">
				<p>
					<Checkbox checked={checkedStatus} onChange={(e) => this.handleChange(e)} />
					{checkedStatus == true ? <span className="itemCont">{this.props.content}</span> : <span>{this.props.content}</span>}
					<span className="itemTime">{this.props.date}</span>
					<button className="editBtn" onClick={() => this.handleModal({ visible: true })}>
						<img className="editIcon" src="/images/edit.png" />
					</button>
					<button className="delBtn" onClick={this.handleDelete.bind(this)}>
						<img className="delIcon" src="/images/delete.png" />
					</button>
				</p>
				<Modal
					title='修改事项'
					visible={modal.visible}
					width='400px'
					okText='确定'
					cancelText='取消'
					onOk={this.handleUpdate.bind(this)}
					onCancel={() => this.handleModal({ visible: false })}
				>
					{getFieldDecorator('todo', {
						initialValue: modal.data,
					})(
						<Input />
					)}
				</Modal>
			</div>
		)
	}
}
TodoItem = Form.create()(TodoItem);
export default TodoItem;
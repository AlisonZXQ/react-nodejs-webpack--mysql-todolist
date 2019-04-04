import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import TodoList from './comps/todo-list'
import { Input, Button, Checkbox } from 'antd';
import '../../public/css/style.css';
class Todo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			todoList: [],//显示用
			todoListData: [],
			active: [],
			showTooltip: false  // 控制 tooltip 的显示隐藏
		}
	}

	componentDidMount() {
		// 获取所有的 todolist
		this._getTodoList();
	}

	// 获取 todolist
	_getTodoList() {
		const that = this;
		$.ajax({
			url: 'http://localhost:3000/getAllItems',
			type: 'get',
			dataType: 'json',
			success: data => {
				console.log('30', data);
				let ac = [];
				data.map((item, index) => (
					item.status == 'false' ? ac.push(item) : null
				))
				that.setState({
					todoList: data,
					todoListData: data,
					active: ac,
				});
			},
			error: err => {
				console.log(err);
			}
		});
	}

	// 添加 todo
	_onNewItem(newItem) {
		const that = this;
		$.ajax({
			url: 'http://localhost:3000/addItem',
			type: 'post',
			dataType: 'json',
			data: newItem,
			success: data => {
				console.log(data);
				const todoList = that.todoSort(data);
				that.setState({
					todoList
				}, () => { that._getTodoList() });
			},
			error: err => {
				console.log(err);
			}
		})
	}

	// 删除 todo
	_onDeleteItem(date) {
		const that = this;
		const postData = {
			date: date
		};
		console.log('postData', postData);
		$.ajax({
			url: 'http://localhost:3000/deleteItem',
			type: 'post',
			dataType: 'json',
			data: postData,
			success: data => {
				console.log(data);
				that._getTodoList();
			},
			error: err => {
				console.log(err);
			}
		})
	}
	//删除多条todo
	_onDeleteClearCompleted() {
		const that = this;
		const { todoListData } = this.state;
		todoListData.map((item, index) => (
			item.status == 'true' ?
				$.ajax({
					url: 'http://localhost:3000/deleteItem',
					type: 'post',
					dataType: 'json',
					data: { date: item.date },
					success: data => {
						console.log(data);
						that._getTodoList();
					},
					error: err => {
						console.log(err);
					}
				}) : null
		))
	}

	// 更新 todo
	_onUpdateItem(date, content) {
		const that = this;
		const postData = {
			date: date,
			content: content
		};
		$.ajax({
			url: 'http://localhost:3000/updateItem',
			type: 'post',
			dataType: 'json',
			data: postData,
			success: data => {
				console.log(data);
				that._getTodoList();
			},
			error: err => {
				console.log(err);
			}
		})
	}

	// 更新 todo status
	_onUpdateStatus(status, date) {
		const that = this;
		const postData = {
			date: date,
			status: status
		};
		$.ajax({
			url: 'http://localhost:3000/updateStatus',
			type: 'post',
			dataType: 'json',
			data: postData,
			success: data => {
				console.log(data);
				that._getTodoList();
			},
			error: err => {
				console.log(err);
			}
		})
	}

	//全选
	handleChange(e) {
		const { todoListData } = this.state;
		let value = e.target.checked == true ? 'true' : 'false'; 
		const that = this;
		todoListData.map((item,index)=>(
			$.ajax({
				url: 'http://localhost:3000/updateStatus',
				type: 'post',
				dataType: 'json',
				data: {
					date:item.date,
					status:value
				},
				success: data => {
					console.log(data);
					that._getTodoList();
				},
				error: err => {
					console.log(err);
				}
			})
		))
	}

	// 对 todolist 进行逆向排序（使新录入的项目显示在列表上面） 
	todoSort(todoList) {
		todoList.reverse();
		return todoList;
	}

	// 提交表单操作
	handleSubmit(event) {

		event.preventDefault();
		// 表单输入为空验证
		if (this.refs.content.value == "") {
			this.refs.content.focus();
			this.setState({
				showTooltip: true
			});
			return;
		}

		let month = new Date().getMonth() + 1;
		let date = new Date().getDate();
		let hours = new Date().getHours();
		let minutes = new Date().getMinutes();
		let seconds = new Date().getSeconds();

		if (hours < 10) { hours += '0'; }
		if (minutes < 10) { minutes += '0'; }
		if (seconds < 10) { seconds += '0'; }

		// 生成参数
		const newItem = {
			content: this.refs.content.value,
			date: month + "/" + date + " " + hours + ":" + minutes + ":" + seconds,
			status: 'false'
		};

		console.log('146', newItem);
		// 添加 todo
		this._onNewItem(newItem)
		// 重置表单
		this.refs.todoForm.reset();
		// 隐藏提示信息
		this.setState({
			showTooltip: false,
		});
	}

	//切换All Active Completed
	handleClick(data) {
		const { todoList, todoListData } = this.state;
		let com = [], ac = [], a = todoListData;
		todoListData.map((item, index) => (
			item.status == 'true' ? com.push(item) : ac.push(item)
		))
		if (data.type == 'all') {
			this.setState({
				todoList: a,
			})
		} else if (data.type == 'active') {
			this.setState({
				todoList: ac,
			})
		} else if (data.type == 'completed') {
			this.setState({
				todoList: com,
			})
		}
	}


	render() {
		return (
			<div>
				<div className="container">
					<div className="header">todos</div>
					<form className="todoForm" ref="todoForm" onSubmit={this.handleSubmit.bind(this)}>
						<input ref="content" type="text" placeholder="What needs to be done?" className="todoContent" />
						{this.state.showTooltip &&
							<span className="tooltip">Content is required !</span>
						}
					</form>
					<Checkbox onChange={(e) => this.handleChange(e)}>全选</Checkbox>
					<TodoList todoList={this.state.todoList} onDeleteItem={this._onDeleteItem.bind(this)} onUpdateItem={this._onUpdateItem.bind(this)}
						onUpdateStatus={this._onUpdateStatus.bind(this)} />
						<div className="tailer">
							{this.state.active.length}&nbsp;{this.state.active.length == 0 ? 'item left' : 'items left'}
							<a onClick={() => this.handleClick({ type: 'all' })}>All</a>
							<a onClick={() => this.handleClick({ type: 'active' })}>Active</a>
							<a onClick={() => this.handleClick({ type: 'completed' })}>Completed</a>
							<a onClick={() => this._onDeleteClearCompleted()}>Clear Completed</a>
					</div>
				</div>

			</div>
		)
	}
}

export default Todo;

import React from 'react';
import TodoItem from './todo-item';
import { Input } from 'antd';

class TodoList extends React.Component {

	render() {
		// 获取从父组件传递过来的 todolist
		const todoList = this.props.todoList;
		// 循环生成每一条 todoItem，并将 delete 方法传递给子组件 
		console.log('11 todoList',todoList)
		const todoItems = todoList.map((item, index) => {
			return (
				<TodoItem
					key={index}
					content={item.content}
					date={item.date}
					status={item.status}
					onUpdateItem={this.props.onUpdateItem}
					onUpdateStatus={this.props.onUpdateStatus}
					onDeleteItem={this.props.onDeleteItem}
				/>
			)
		});
		console.log('21 todo-list', todoItems);
		return (
			<div>
				{todoItems}
			</div>
		)
	}
}

export default TodoList;
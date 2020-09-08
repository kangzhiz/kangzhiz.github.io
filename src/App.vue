<template>
	<div id="app">
		<Header />
		<AddTodo v-on:add-todo="addTodo" />
		<Todos v-bind:todos="todos" v-on:del-todo="deleteTodo" />
	</div>
</template>

<script>
import Header from "./components/layout/Header";
import Todos from "./components/Todos";
import AddTodo from "./components/AddTodo";

export default {
	name: "App",
	components: {
		Header,
		Todos,
		AddTodo,
	},
	data() {
		return {
			todos: [
				{
					id: 0,
					title: "Charlie",
					completed: false,
				},
				{
					id: 1,
					title: "Moose",
					completed: false,
				},
				{
					id: 2,
					title: "Harriet",
					completed: false,
				},
				{
					id: 3,
					title: "Tiara",
					completed: false,
				},
				{
					id: 4,
					title: "Maria",
					completed: false,
				},
			],
		};
	},
	methods: {
		deleteTodo(id) {
			this.todos = this.todos.filter((todo) => todo.id !== id);
		},
		addTodo(newTodo) {
			this.todos = [...this.todos, newTodo];
		},
	},
};
</script>

<style>
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
body {
	font-family: Arial, Helvetica, sans-serif;
	line-height: 1.4;
}
.btn {
	display: inline-block;
	border: none;
	background: #69a0dc;
	color: #ffffff;
	padding: 7px 20px;
	cursor: pointer;
}
.btn:hover {
	background: #58738f;
}
</style>

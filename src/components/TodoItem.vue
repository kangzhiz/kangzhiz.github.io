<template>
	<div class="todo-item" v-bind:class="{'is-complete':todo.completed}">
		<p>
			<input type="checkbox" v-on:change="markComplete" />
			{{todo.title}}
			<button @click="$emit('del-todo', todo.id)" class="del">x</button>
		</p>
	</div>
</template>

<script>
export default {
	name: "TodoItem",
	props: ["todo"],
	methods: {
		markComplete() {
			this.todo.completed = !this.todo.completed;
		},
	},
};
</script>

<style scoped>
.todo-item {
	background: #f4f4f4;
	padding: 10px;
	border-bottom: 1px #cccccc dotted;
	font-size: 17px;
}
.is-complete {
	text-decoration: line-through;
}
.del {
	background: #555555;
	color: #ffffff;
	border: none;
	padding: 5px 9px;
	border-radius: 50%;
	cursor: pointer;
	float: right;
}
input[type="checkbox"] {
	-webkit-appearance: none;
	width: 15px;
	height: 15px;
	background: #ffffff;
	border-radius: 100%;
	border: 2px solid #555555;
}
input[type="checkbox"]:checked {
	background: #6b6b6b;
}
</style>
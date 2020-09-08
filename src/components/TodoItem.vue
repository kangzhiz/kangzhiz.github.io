<template>
	<div class="todo-item">
		<p>
			{{todo.title}}
			<button @click="$emit('del-todo', todo.id)" class="del">x</button>
		</p>
	</div>
</template>

<script>
export default {
	name: "TodoItem",
	props: ["todo"],
};
</script>

<style scoped>
.todo-item {
	background: #f4f4f4;
	padding: 10px;
	border-bottom: 1px #cccccc dotted;
	font-size: 17px;
}
.del {
	background: #ff2727;
	color: #ffffff;
	border: none;
	padding: 5px 9px;
	border-radius: 50%;
	cursor: pointer;
	float: right;
}
</style>
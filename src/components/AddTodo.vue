<template>
	<div>
		<form @submit="addTodo">
			<input type="text" v-model="title" name="title" placeholder="Add item...">
			<input type="submit" value="Submit" class="btn">
		</form>
	</div>
</template>

<script>
export default {
	name: "AddTodo",
	data() {
		return {
			title: "",
		};
	},
	methods: {
		addTodo(e) {
			e.preventDefault();
			const newTodo = {
				title: this.title,
				completed: false,
			};
			
			// Send up to parent
			this.$emit("add-todo", newTodo);
			this.title = "";
		},
	},
};
</script>

<style scoped>
form {
	display: flex;
	height: 50px;
}
input[type="text"] {
	flex: 10;
	padding: 5px;
	font-size: 20px;
}
input[type="submit"] {
	flex: 2;
	font-size: 20px;
}
</style>
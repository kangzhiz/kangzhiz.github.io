<template>
	<header class="header">
		<h2>hi, my name is</h2>
		<h1>john zhao</h1>
		<a href="https://gitlab.com/kangzhiz">gitlab</a>
	</header>
</template>

<script>
export default {
	name: "Header"
}
</script>

<style scoped>
header {
	text-align: center;
	padding: 50px;
	font-family: 'Courier New', Courier, monospace;
}
a {
	color: var(--kary-orange);
	font-size: 15px;
}
a:visited {
	color: var(--kary-orange);
	text-decoration: none;
}
h1 {
	color: var(--kary-green);
	font-size: 50px;
}
h2 {
	color: var(--kary-blue);
	font-size: 20px;
}
</style>
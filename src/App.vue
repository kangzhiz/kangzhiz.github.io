<template>
	<div id="app">
		<Header />
	</div>
</template>

<script>
import Header from "./components/Header";

export default {
	name: "App",
	components: {
		Header,
	},
};
</script>

<style>
:root {
	--main-bg-color: #1A1A1A;
	--kary-red: #d38569;
	--kary-orange: #d28468;
	--kary-green: #789f6b;
	--kary-blue: #819dc2;
	--kary-purple: #b98eb2;
}
body {
	background: var(--main-bg-color);
}
</style>

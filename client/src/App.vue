<template>
	<v-app>
		<NavivationDrawer />
	</v-app>
</template>

<script>
import NavivationDrawer from './components/NavigationDrawer';
export default {
	name: 'App',

	components: {
		NavivationDrawer,
	},

	data: () => ({}),
};
</script>

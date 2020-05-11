import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Summaries from '../views/Summaries';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/profile',
		name: 'Profile',
		component: Profile,
	},
	{
		path: '/summaries',
		name: 'Summaries',
		component: Summaries,
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

export default router;

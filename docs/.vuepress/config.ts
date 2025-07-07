import {defineUserConfig} from 'vuepress'
import {path} from '@vuepress/utils'
import {defaultTheme} from '@vuepress/theme-default'
import {viteBundler} from '@vuepress/bundler-vite'
import {shikiPlugin} from '@vuepress/plugin-shiki'

export default defineUserConfig({
	title: 'Geome',
	base: '/geome/',
	alias: {
		geome: path.resolve(__dirname, '../../src'),
	},
	head: [
		['link', {rel: 'icon', href: './logo.svg'}],
		['link', {rel: 'preconnect', href: 'https://fonts.googleapis.com'}],
		[
			'link',
			{rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true},
		],
		[
			'link',
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
				crossorigin: 'anonymous',
			},
		],
	],
	theme: defaultTheme({
		navbar: [
			{
				text: 'Home',
				link: '/',
			},
			{
				text: 'API',
				link: '/api/',
			},
		],
		logo: '/logo.svg',
		repo: 'baku89/geome',
	}),
	locales: {
		'/': {
			lang: 'English',
			title: 'Geome',
			description: 'A collection of types and functions for geometry',
		},
	},
	bundler: viteBundler(),
	plugins: [
		shikiPlugin({
			langs: ['ts', 'bash'],
			lineNumbers: 'disable',
		}),
	],
	markdown: {
		linkify: true,
		typographer: true,
	},
})

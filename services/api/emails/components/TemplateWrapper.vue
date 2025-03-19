<template>
	<Suspense>
		<Tailwind
			:config="{
				theme: {
					extend: {
						colors: {
							white: '#ffffff',
							black: '#000000',
							indigo: '#3219AF',
							orange: '#FA9632',
							magenta: '#AF19C8',
							green: '#4BAF7D',
							purple: '#9747FF',
						},
					},
				},
			}">
			<Html>
				<Head>
					<Font
						font-family="Lexend"
						fallback-font-family="sans-serif"
						:web-font="{
							url: 'https://fonts.gstatic.com/s/lexend/v23/wlptgwvFAVdoq2_F94zlCfv0bz1WCzsW_LA.ttf',
							format: 'truetype',
						}" />
				</Head>
				<body class="p-0 box-border">
					<Section class="p-4 max-w-[800px] mx-auto">
						<Section class="bg-indigo py-3 rounded-t-xl flex items-center justify-center">
							<AppLogo />
						</Section>

						<Section
							class="flex-1 min-h-[400px] bg-cover bg-center bg-no-repeat p-4 grid place-items-center"
							:style="`background-image: ${appBackground}`">
							<slot />
						</Section>

						<Section class="bg-orange">
							<Text class="text-white text-center">Join our community!</Text>
							<Container class="mx-auto w-auto mb-4">
								<Column v-for="link in socials" class="px-4" :key="link.name">
									<Link :href="link.link">
										<component :is="link.component" :key="link.link" />
									</Link>
								</Column>
							</Container>
						</Section>
					</Section>
				</body>
			</Html>
		</Tailwind>
	</Suspense>
</template>

<script setup lang="ts">
import { Column, Container, Font, Head, Html, Link, Section, Tailwind, Text } from '@vue-email/components'
import appBackground from '../assets/images/app-background.svg'
import AppLogo from '../assets/images/app-logo.vue'

import Instagram from '../assets/images/socials/instagram.vue'
import Tiktok from '../assets/images/socials/tiktok.vue'
import Twitter from '../assets/images/socials/twitter.vue'
import Whatsapp from '../assets/images/socials/whatsapp.vue'
import Youtube from '../assets/images/socials/youtube.vue'

const socials = [
	{
		name: 'Instagram',
		link: 'https://www.instagram.com/stranerdapp/',
		component: Instagram,
	},
	{
		name: 'TikTok',
		link: 'https://www.tiktok.com/@stranerd',
		component: Tiktok,
	},
	{
		name: 'WhatsApp',
		link: 'https://wa.me/+2348130322791',
		component: Whatsapp,
	},
	{
		name: 'YouTube',
		link: 'https://www.youtube.com/@Stranerd',
		component: Youtube,
	},
	{
		name: 'X',
		link: 'https://x.com/stranerds',
		component: Twitter,
	},
]
</script>

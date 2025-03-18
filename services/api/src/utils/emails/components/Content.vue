<template>
	<Container class="relative w-full h-full flex justify-center items-center">
		<template v-if="addEllipse">
			<Ellipse :style="ellipseStyle" />
		</template>
		<slot name="image" />
	</Container>
	<Container class="grid mt-6" :class="textAlign === 'left' ? 'text-left' : 'text-center'">
		<Heading v-if="heading" as="h3" :class="[headingColor, 'font-bold m-0 mb-4']">
			{{ heading }}
		</Heading>
		<Text v-if="text" class="font-medium m-0">{{ text }}</Text>
		<slot />
	</Container>
	<Preview v-if="text">{{ text }}</Preview>
</template>

<script setup lang="ts">
import { Container, Heading, Preview, Text } from '@vue-email/components'
import Ellipse from '../assets/images/content/ellipse.vue'

const {
	heading = '',
	headingColor = '',
	text = '',
	textAlign = 'center',
	addEllipse = false,
} = defineProps<{
	heading?: string
	headingColor?: string
	text?: string
	textAlign?: 'center' | 'left'
	addEllipse?: boolean
}>()

const ellipseStyle = {
	position: 'absolute',
	zIndex: -1,
	top: '40px',
	right: '40px',
	'@media (min-width: 768px)': {
		right: '144px',
	},
}
</script>

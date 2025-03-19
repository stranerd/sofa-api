<script setup lang="ts">
import { Text } from '@vue-email/components'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

const { name, email, phone, message } = defineProps<PropTypes['NewFormMessage']>()
</script>

<template>
	<TemplateWrapper>
		<Content :heading="name" :text="email">
			<Text>{{ phone }}</Text>
			<Text>{{ message }}</Text>
		</Content>
	</TemplateWrapper>
</template>

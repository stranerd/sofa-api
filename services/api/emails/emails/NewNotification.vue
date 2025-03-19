<script setup lang="ts">
import { Link } from '@vue-email/components'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

const { title, body, link } = defineProps<PropTypes['NewNotification']>()
</script>

<template>
	<TemplateWrapper>
		<Content :heading="title" :text="body">
			<Link :href="link">Continue to Stranerd</Link>
		</Content>
	</TemplateWrapper>
</template>

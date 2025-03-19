<script setup lang="ts">
import TutorApplicationRequest from '../assets/images/content/tutor-application-request.vue'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

const { name } = defineProps<PropTypes['TutorApplicationRequest']>()
</script>

<template>
	<TemplateWrapper>
		<Content
			headingColor="text-purple"
			:heading="`Dear ${name}!`"
			:text="`We are pleased to inform you that we have received your application for tutorship. 
Our team will process your information, and send you an update in 24 hours. In the meantime, keep exploring on Stranerd.`"
			textAlign="left">
			<template #image>
				<TutorApplicationRequest />
			</template>
		</Content>
	</TemplateWrapper>
</template>

<script setup lang="ts">
import TutorApplicationRequestAccepted from '../assets/images/content/tutor-application-request-accepted.vue'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

defineProps<PropTypes['TutorApplicationRequestAccepted']>()
</script>

<template>
	<TemplateWrapper>
		<Content
			:text="`Congratulations! Your tutor application has been accepted, and you’re officially a part of the Stranerd family.  
Thank you for joining us in our journey of providing knowledge and empowering minds. 
Let's make learning awesome together.`"
			textAlign="left"
			addEllipse>
			<template #image>
				<TutorApplicationRequestAccepted />
			</template>
		</Content>
	</TemplateWrapper>
</template>

<script setup lang="ts">
import AccountCreated from '../assets/images/content/account-created.vue'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

defineProps<PropTypes['AccountCreated']>()
</script>

<template>
	<TemplateWrapper>
		<Content
			headingColor="text-purple"
			heading="Welcome to Stranerd!"
			:text="`We're thrilled to have you on board. Get ready for an impactful, fun, and personalized learning experience.`">
			<template #image>
				<AccountCreated />
			</template>
		</Content>
	</TemplateWrapper>
</template>

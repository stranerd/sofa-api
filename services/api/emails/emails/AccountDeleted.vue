<script setup lang="ts">
import AccountDeleted from '../assets/images/content/account-deleted.vue'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

defineProps<PropTypes['AccountDeleted']>()
</script>

<template>
	<TemplateWrapper>
		<Content :text="`We're sorry to see you go. Your Stranerd account has been deleted. If you have feedback, we'd love to hear it.`">
			<template #image>
				<AccountDeleted />
			</template>
		</Content>
	</TemplateWrapper>
</template>

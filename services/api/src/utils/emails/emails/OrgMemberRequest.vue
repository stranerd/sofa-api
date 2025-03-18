<script setup lang="ts">
import OrgMemberRequest from '../assets/images/content/org-member-request.vue'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

const { name } = defineProps<PropTypes['OrgMemberRequest']>()
</script>

<template>
	<TemplateWrapper>
		<Content
			headingColor="text-indigo"
			heading="Exciting News!"
			:text="`${name} has applied to join your learning center. Approve their request to welcome them into your academic community.`"
			textAlign="left"
			addEllipse>
			<template #image>
				<OrgMemberRequest />
			</template>
		</Content>
	</TemplateWrapper>
</template>

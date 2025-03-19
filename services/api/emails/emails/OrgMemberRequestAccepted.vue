<script setup lang="ts">
import OrgMemberRequestAccepted from '../assets/images/content/org-member-request-accepted.vue'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

const { orgName } = defineProps<PropTypes['OrgMemberRequestAccepted']>()
</script>

<template>
	<TemplateWrapper>
		<Content
			headingColor="text-magenta"
			heading="Great News!"
			:text="`You've been added to ${orgName}. Start exploring resources and engaging with your learning community now.`">
			<template #image>
				<OrgMemberRequestAccepted />
			</template>
		</Content>
	</TemplateWrapper>
</template>

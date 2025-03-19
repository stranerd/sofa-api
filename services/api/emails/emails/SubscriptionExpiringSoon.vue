<script setup lang="ts">
import SubscriptionExpiringSoon from '../assets/images/content/subscription-expiring-soon.vue'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

const { name, planName } = defineProps<PropTypes['SubscriptionExpiringSoon']>()
</script>

<template>
	<TemplateWrapper>
		<Content
			headingColor="text-indigo"
			:heading="`Dear ${name},`"
			:text="`Your payment for ${planName} is due soon. Ensure your payment is up to date to keep enjoying uninterrupted access to premium educational content.`"
			textAlign="left"
			addEllipse>
			<template #image>
				<SubscriptionExpiringSoon />
			</template>
		</Content>
	</TemplateWrapper>
</template>

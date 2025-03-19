<script setup lang="ts">
import SubscriptionPaymentSuccessful from '../assets/images/content/subscription-payment-successful.vue'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

const { planName } = defineProps<PropTypes['SubscriptionPaymentSuccessful']>()
</script>

<template>
	<TemplateWrapper>
		<Content
			headingColor="text-green"
			heading="Congratulations!"
			:text="`Your payment for ${planName} was successful. Have a great time exploring a world of educational possibilities.`">
			<template #image>
				<SubscriptionPaymentSuccessful />
			</template>
		</Content>
	</TemplateWrapper>
</template>

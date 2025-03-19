<script setup lang="ts">
import WithdrawalRequested from '../assets/images/content/withdrawal-requested.vue'
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

defineProps<PropTypes['WithdrawalRequested']>()
</script>

<template>
	<TemplateWrapper>
		<Content
			headingColor="text-green"
			heading="Withdrawal requested!"
			:text="`Your funds are on the way. If you have any questions, feel free to reach out. Happy learning!`"
			:addEllipse="true">
			<template #image>
				<WithdrawalRequested />
			</template>
		</Content>
	</TemplateWrapper>
</template>

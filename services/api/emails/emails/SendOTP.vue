<script setup lang="ts">
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

const { token } = defineProps<PropTypes['SendOTP']>()
</script>

<template>
	<TemplateWrapper>
		<Content :heading="`Use this ${token} as your OTP`" :text="`Kindly ignore if you did not initiate the request.`"> </Content>
	</TemplateWrapper>
</template>

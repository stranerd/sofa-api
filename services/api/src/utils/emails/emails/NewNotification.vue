<script setup lang="ts">
import Content from '../components/Content.vue'
import TemplateWrapper from '../components/TemplateWrapper.vue'
import type { PropTypes } from '../types'

const { title, body, link: _ } = defineProps<PropTypes['NewNotification']>()
</script>

<template>
	<TemplateWrapper>
		<Content :heading="title" :text="body">
			<!-- button(style=`padding: 0.5rem 1.5rem; border-radius: 0.5rem; margin: 1rem 0; background: #17224d;`)
         a(href=link, style="text-decoration:none;color: #FFFFFF;", target="__blank") Continue To Stranerd -->
		</Content>
	</TemplateWrapper>
</template>

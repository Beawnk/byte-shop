<template>
	<div class="modal add-review">
		<div class="modal-content">
			<button class="close" @click="$emit('closeModal')"></button>
			
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['order']);

const emit = defineEmits(['closeModal']);
</script>

<style lang="scss" scoped>

</style>
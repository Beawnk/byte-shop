<template>
	<div class="add-product">
		<button class="btn secondary" @click="$emit('hideAddProduct')">Cancelar</button>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['hideAddProduct']);
</script>

<style lang="scss" scoped>

</style>
<template>
	<h2>Seus dados</h2>
	<UserData v-slot="{ saving }" :mode="'edit'">
		<button class="btn primary" type="submit" :disabled="saving">Salvar</button>
	</UserData>
</template>

<script setup>
import UserData from '@/components/UserData.vue';
</script>

<style lang="scss" scoped>
h2 {
	color: var(--text-color);
	margin-bottom: 20px;
}
</style>
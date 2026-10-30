<template>
	<transition name="alert-down" mode="out-in">
		<p class="field-alert" v-if="alertMessage">{{ alertMessage }}</p>
		<p class="field-alert" v-else-if="alertMessageStore">{{ alertMessageStore }}</p>
	</transition>
</template>

<script setup>
import { computed } from 'vue';
import { useFieldError } from 'vee-validate';
import { useAlertStore } from '@/stores/alertStore';

const props = defineProps(['field']); // The name of the field passed as a prop

const alertStore = useAlertStore();

// Reads the error of the field the parent form registered. (useField here would register a
// second field with the same name in the form.)
const alertMessage = useFieldError(props.field);
const alertMessageStore = computed(() => alertStore.fieldErrors[props.field]);
</script>

<style lang="scss" scoped>
.field-alert {
	color: var(--error-color);
	font-size: var(--text-small);
	margin-top: 5px;
}

.alert-down-enter-active,
.alert-down-leave-active {
	transition: opacity 0.5s ease, transform 0.5s ease;
}

.alert-down-enter-from,
.alert-down-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.alert-down-enter-to,
.alert-down-leave-from {
	opacity: 1;
	transform: translateY(0);
}
</style>

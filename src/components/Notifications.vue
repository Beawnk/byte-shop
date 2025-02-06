<template>
	<div class="alert-container">
		<transition name="alert" mode="out-in">
	  		<div v-if="successes.length" class="success alert">
				<p v-for="(success, index) in successes" :key="'success-' + index">{{ success }}</p>
	  		</div>
		</transition>
		<transition name="alert" mode="out-in">
	  		<div v-if="errors.length" class="error alert">
				<p v-for="(error, index) in errors" :key="'error-' + index">{{ error }}</p>
	  		</div>
		</transition>
	</div>
</template>
  
<script setup>
const props = defineProps({
  	errors: Array,
  	successes: Array,
});
</script>

<style lang="scss" scoped>
.alert-container {
  	position: fixed;
  	top: 40px;
  	right: 50%;
  	transform: translateX(50%);
  	display: flex;
  	flex-direction: column;
  	align-items: flex-end;
  	z-index: 2000;
	width: fit-content;
  	max-width: 600px;
	.alert {
		color: var(--white-color);
		padding: 10px 40px 10px 10px;
		border-radius: var(--border-radius);
		margin-bottom: 10px;
		background-size: 20px;
		background-repeat: no-repeat;
		background-position: calc(100% - 10px) 10px;
		&:last-child {
			margin-bottom: 0;
		}
		&.success {
			background-color: var(--success-color);
			background-image: url('../assets/img/icons/check-mark.png');
			background-size: 15px;
			background-position: calc(100% - 10px) 15px;
		}
		&.error {
			background-color: var(--error-color);
			background-image: url('../assets/img/icons/alert.png');
			
		}
	}
}

.alert-enter-active, .alert-leave-active {
	transition: all 0.5s;
}

.alert-enter-from, .alert-leave-to {
	opacity: 0;
	transform: translateY(-1000px);
}

.alert-enter-to, .alert-leave-from {
	opacity: 1;
	transform: translateY(0);
}

</style>
<template>
	<div class="user-reviews">
		<div class="tabs">
			<div class="tab" v-for="tab in tabs" :key="tab.id" :class="{ active: tab.id === activeTab }" @click="activeTab = tab.id">{{ tab.name }}</div>
		</div>
		<div class="tab-content">
			<component :is="getActiveComponent()" :vendorId="userStore.user.id" class="open"/>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/UserState';
import VendorReviews from '@/components/VendorReviews.vue';
import UserReviews from '@/components/UserReviews.vue';

const userStore = useUserStore();

// Define tabs with string identifiers
const tabs = ref([
	{ id: 'vendor-reviews', name: 'Minhas avaliações' },
	{ id: 'user-reviews', name: 'Avaliações enviadas' },
]);

// Default active tab
const activeTab = ref('vendor-reviews');

// Map tab IDs to their respective components
const components = {
	'vendor-reviews': VendorReviews,
	'user-reviews': UserReviews,
};

// Get the active component based on the activeTab
const getActiveComponent = () => components[activeTab.value];
</script>

<style lang="scss">
.user-reviews {
	.tabs {
		display: flex;
		margin-bottom: 20px;
		width: 100%;
		border-radius: var(--border-radius);
		overflow: hidden;
		background-color: var(--white-color);
		.tab {
			padding: 10px 20px;
			cursor: pointer;
			width: 50%;
			text-align: center;
			transition: var(--transition);
			color: var(--text-color);
			font-size: var(--text-medium);
			&.active {
				background-color: var(--primary-color);
				color: var(--white-color);
			}
		}
	}
	.tab-content {
		.modal {
			position: relative;
			display: block;
			background-color: transparent;
			.modal-content {
				max-width: 100%;
				padding: 0;
				box-shadow: none;
				.close {
					display: none;
				}
			}
		}
	}
}
</style>
<template>
	<div class="user-reviews">
		<div class="tabs" role="tablist">
			<button
				v-for="tab in tabs"
				:key="tab.id"
				type="button"
				role="tab"
				class="tab"
				:class="{ active: tab.id === activeTab }"
				:aria-selected="tab.id === activeTab"
				@click="activeTab = tab.id"
			>{{ tab.name }}</button>
		</div>
		<div class="tab-content" role="tabpanel">
			<VendorInfo v-if="activeTab === 'received' && vendor" :vendor="vendor" />
			<ReviewList :reviews="reviews" :loading="loading" :show-author="activeTab === 'received'" />
			<Loader v-if="loading" />
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/UserState';
import { useAlertStore } from '@/stores/alertStore';
import { useReviews } from '@/composables/useReviews';
import { fetchVendor } from '@/composables/fetchVendor';
import ReviewList from '@/components/ReviewList.vue';
import VendorInfo from '@/components/VendorInfo.vue';

const userStore = useUserStore();
const alertStore = useAlertStore();
const { reviews, loading, load } = useReviews();

const tabs = [
	{ id: 'received', name: 'Minhas avaliações' },
	{ id: 'sent', name: 'Avaliações enviadas' },
];

const activeTab = ref('received');
const vendor = ref(null);

const loadTab = async (tab) => {
	const userId = userStore.user.id;

	if (tab === 'sent') {
		load({ userId });
		return;
	}

	load({ vendorId: userId });
	try {
		vendor.value = await fetchVendor(userId);
	} catch (error) {
		alertStore.addGlobalError('Erro ao carregar sua nota de vendedor.', error);
	}
};

watch(activeTab, loadTab, { immediate: true });
</script>

<style lang="scss" scoped>
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
			font-family: inherit;
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
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 20px;
		min-height: 200px;
	}
}
</style>
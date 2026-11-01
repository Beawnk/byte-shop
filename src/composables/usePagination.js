import { computed, nextTick, ref, toValue, watch } from 'vue';

export function usePagination(items, pageSize = 10) {
	const page = ref(1);
	const listTop = ref(null);

	const totalPages = computed(() => Math.max(1, Math.ceil(toValue(items).length / pageSize)));

	const visibleItems = computed(() => {
		const start = (page.value - 1) * pageSize;
		return toValue(items).slice(start, start + pageSize);
	});

	watch(totalPages, (total) => {
		if (page.value > total) page.value = total;
	});

	const goToPage = async (target) => {
		page.value = target;
		await nextTick();
		listTop.value?.scrollIntoView({ block: 'start' });
	};

	return { page, totalPages, visibleItems, listTop, goToPage };
}

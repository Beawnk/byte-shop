import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useUserStore } from '@/stores/UserState';

const GUEST = 'guest';
const keyFor = (owner) => `cart:${owner}`;

// localStorage can be full or blocked (private mode): the cart then just lasts for this visit.
const read = (owner) => {
	try {
		const ids = JSON.parse(localStorage.getItem(keyFor(owner)));
		return Array.isArray(ids) ? ids : [];
	} catch {
		return [];
	}
};

const write = (owner, ids) => {
	try {
		localStorage.setItem(keyFor(owner), JSON.stringify(ids));
	} catch {
		// Keep working with the in-memory cart.
	}
};

// Only product ids are stored. Each product is unique (one unit, sold once) so there is no
// quantity, and price/availability always come from the database when the cart is shown.
export const useCartStore = defineStore('cart', () => {
	const userStore = useUserStore();
	const ids = ref([]);

	const owner = computed(() => userStore.user.id || GUEST);
	const count = computed(() => ids.value.length);

	const persist = () => write(owner.value, ids.value);
	const has = (productId) => ids.value.includes(productId);

	const add = (productId) => {
		if (has(productId)) return;
		ids.value.push(productId);
		persist();
	};

	const remove = (productId) => {
		ids.value = ids.value.filter((id) => id !== productId);
		persist();
	};

	const removeMany = (productIds) => {
		ids.value = ids.value.filter((id) => !productIds.includes(id));
		persist();
	};

	const clear = () => {
		ids.value = [];
		persist();
	};

	// Each account has its own cart. What was added before logging in moves into it.
	watch(
		owner,
		(current) => {
			const guestIds = current === GUEST ? [] : read(GUEST);
			ids.value = [...new Set([...read(current), ...guestIds])];
			if (guestIds.length) {
				write(GUEST, []);
				persist();
			}
		},
		{ immediate: true }
	);

	return { ids, count, has, add, remove, removeMany, clear };
});

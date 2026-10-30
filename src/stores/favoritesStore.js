import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useUserStore } from '@/stores/UserState';
import { useAlertStore } from '@/stores/alertStore';

export const useFavoritesStore = defineStore('favorites', () => {
	const favorites = ref([]);
	const userStore = useUserStore();
	const alertStore = useAlertStore();

	const fetchFavorites = async () => {
		if (!userStore.user.id) return;

		const { data, error } = await supabase
			.from('favorites')
			.select('product_id')
			.eq('user_id', userStore.user.id);

		if (error) {
			alertStore.addGlobalError('Erro ao buscar favoritos.');
		} else {
			favorites.value = data.map((fav) => fav.product_id);
		}
	};

	const addFavorite = async (productId) => {
		const { error } = await supabase
			.from('favorites')
			.insert([{ user_id: userStore.user.id, product_id: productId }]);

		if (error) {
			alertStore.addGlobalError('Erro ao adicionar favorito.');
		} else {
			favorites.value.push(productId);
		}
	};

	const removeFavorite = async (productId) => {
		const { error } = await supabase
			.from('favorites')
			.delete()
			.eq('user_id', userStore.user.id)
			.eq('product_id', productId);

		if (error) {
			alertStore.addGlobalError('Erro ao remover favorito.');
		} else {
			favorites.value = favorites.value.filter((id) => id !== productId);
		}
	};

	const isFavorite = (productId) => favorites.value.includes(productId);

	// One fetch per login instead of one per FavoriteButton; logout empties the list,
	// so the next person on the same browser never sees the previous user's favorites.
	watch(
		() => userStore.user.id,
		(id) => {
			favorites.value = [];
			if (id) fetchFavorites();
		},
		{ immediate: true }
	);

	return {
		favorites,
		fetchFavorites,
		addFavorite,
		removeFavorite,
		isFavorite,
	};
});

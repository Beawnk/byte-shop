import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useAlertStore } from '@/stores/alertStore';
import { DEFAULT_AVATAR } from '@/stores/UserState';
import { formatDate } from '@/utils/formatDate';

// One query with the author and product joined, instead of one extra query per review.
const REVIEW_COLUMNS = '*, author:public_profiles(name, avatar), product:products(name)';

const toReviewItem = (review) => ({
	id: review.id,
	title: review.title,
	review: review.review,
	stars: Number(review.stars),
	date: formatDate(review.created_at),
	authorName: review.author?.name ?? 'Usuário',
	authorAvatar: review.author?.avatar ?? DEFAULT_AVATAR,
	productName: review.product?.name ?? 'Produto removido',
});

// load({ vendorId }) = reviews a vendor received; load({ userId }) = reviews a user wrote.
export function useReviews() {
	const alertStore = useAlertStore();
	const reviews = ref([]);
	const loading = ref(false);
	let latestRequest = 0;

	const load = async ({ vendorId, userId }) => {
		const request = ++latestRequest;
		loading.value = true;

		let query = supabase
			.from('reviews')
			.select(REVIEW_COLUMNS)
			.order('created_at', { ascending: false });

		query = vendorId ? query.eq('vendor_id', vendorId) : query.eq('user_id', userId);

		const { data, error } = await query;

		// A slower, older request (e.g. the previous tab) must not overwrite a newer one.
		if (request !== latestRequest) return;
		loading.value = false;

		if (error) {
			reviews.value = [];
			alertStore.addGlobalError('Erro ao carregar as avaliações.', error);
			return;
		}

		reviews.value = data.map(toReviewItem);
	};

	return { reviews, loading, load };
}

import { supabase } from '@/lib/supabaseClient';

// Public vendor card data: profile from public_profiles plus the rating from their reviews.
// Returns null when the vendor doesn't exist; throws on query errors.
export async function fetchVendor(vendorId) {
  const [profileResult, ratingsResult] = await Promise.all([
    supabase.from('public_profiles').select('id, name, avatar').eq('id', vendorId).maybeSingle(),
    supabase.from('reviews').select('stars').eq('vendor_id', vendorId),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (ratingsResult.error) throw ratingsResult.error;
  if (!profileResult.data) return null;

  const total = ratingsResult.data.length;
  const average = total
    ? ratingsResult.data.reduce((sum, review) => sum + Number(review.stars), 0) / total
    : 0;

  return {
    ...profileResult.data,
    rating: Math.round(average * 2) / 2,
    reviews: total,
  };
}

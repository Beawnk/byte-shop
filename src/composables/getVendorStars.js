export function useGetVendorStars(averageRating) {
    const stars = []
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(averageRating)) {
            stars.push('full')
        } else if (i < averageRating) {
            stars.push('half')
        } else {
            stars.push('empty')
        }
    }
    return stars
}
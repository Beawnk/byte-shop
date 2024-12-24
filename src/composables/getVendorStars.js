export function useGetVendorStars(averageRating) {
    const stars = []
    for (let i = 0; i < 5; i++) {
        if (i < averageRating) {
            stars.push('full')
        } else if (i === Math.ceil(averageRating) && !Number.isInteger(averageRating)) {
            stars.push('half')
        } else {
            stars.push('empty')
        }
    }
    return stars
}
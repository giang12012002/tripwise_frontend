const formatDate = (dateString) => {
    let date = dateString
    if (!dateString) {
        date = '2025-01-01'
    }
    return new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
}

export { formatDate }

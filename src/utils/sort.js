const sortBlogsByLatest = (blogs) => {
    return blogs.sort((a, b) => {
        const dateA = new Date(a.modifiedDate || a.createdDate)
        const dateB = new Date(b.modifiedDate || b.createdDate)
        return dateB - dateA // mới nhất lên trước
    })
}

export { sortBlogsByLatest }

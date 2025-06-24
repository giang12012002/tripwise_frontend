const splitToParagraphs = (text) => {
    return text.split('\n').filter((paragraph) => paragraph.trim() !== '')
}
export { splitToParagraphs }

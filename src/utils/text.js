function splitTextByType(text, separatorType) {
    let regex

    switch (separatorType) {
        case 'newline':
            regex = /\n+/
            break
        case 'tab':
            regex = /\t+/
            break
        case 'dot_space': // tách sau dấu chấm + 1 hoặc nhiều khoảng trắng
            regex = /\. +/
            break
        case 'double_newline':
            regex = /\n{2,}/
            break
        case 'space':
            regex = / +/
            break
        case 'custom':
            throw new Error('Dùng splitTextByCustom nếu muốn regex tùy chọn.')
        default:
            throw new Error('Kiểu separator không hỗ trợ: ' + separatorType)
    }

    return text
        .split(regex)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
}

export { splitTextByType }

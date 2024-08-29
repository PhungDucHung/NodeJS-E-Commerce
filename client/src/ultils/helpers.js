// chuyển thành chữ thường ko dấu
export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(' ').join('-')

// ngăn cách tiền bằng dấu phẩy
export const formatMoney = number => Number(number.toFixed(1)).toLocaleString()
import icons from "./icons"
const {FaRegStar, FaStar} = icons

// chuyển thành chữ thường ko dấu
export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(' ').join('-')

// ngăn cách tiền bằng dấu phẩy
export const formatMoney = number => Number(number?.toFixed(1)).toLocaleString()

// star
export const renderStarFromNumber = (number, size) => {
        if (!Number(number)) return
        // 4 => [1,1,1,1,0]
        const stars = []
        for(let i = 0; i < +number; i++) stars.push(<FaStar color="orange" size={size || 16}/>)
        for(let i = 5; i > +number; i--) stars.push(<FaRegStar color="orange" size={size || 16}/>)
        return stars
}

export function secondsToHms(d){
        d = Number(d)/1000;
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 3600 % 60);
        return ({ h, m, s})
}

export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const formatPayload = Object.entries(payload);

    // Xóa các lỗi trước đó
    setInvalidFields([]);

    for (let [key, value] of formatPayload) {
        if (value.trim() === '') {
            invalids++;
            setInvalidFields(prev => [...prev, { name: key, mes: 'Không được để trống' }]);
        }
    }

    for (let [key, value] of formatPayload) {
        switch (key) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    invalids++;
                    setInvalidFields(prev => [...prev, { name: key, mes: 'Email không hợp lệ' }]);
                }
                break;

            case 'password':
                if (value.length < 6) {
                    invalids++;
                    setInvalidFields(prev => [...prev, { name: key, mes: 'Mật khẩu tối thiểu 6 ký tự' }]);
                }
                break;

            default:
                break;
        }
    }

    return invalids === 0; // Trả về true nếu không có trường nào không hợp lệ
};

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
        number = Math.round(number)
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

    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++;
            setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Không được để trống' }]);
        }
    }

    // for (let arr of formatPayload) {
    //     switch (arr[0]) {
    //         case 'email':
    //             const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //             if (!arr[1].match(regex)) {
    //                 invalids++
    //                 setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Email không hợp lệ' }]);
    //             }
    //             break;

    //         case 'password':
    //             if (arr[1].length < 6) {
    //                 invalids++;
    //                 setInvalidFields(prev => [...prev, { name: arr[0], mes: 'Mật khẩu tối thiểu 6 ký tự' }]);
    //             }
    //             break;

    //         default:
    //             break;
    //     }
    // }

    return invalids 
};

export const formatPrice = (number) => Math.round(number/1000)*1000;
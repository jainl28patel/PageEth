// export const BACKEND_HOST = 'http://localhost:4000'
export const BACKEND_HOST = 'http://10.51.3.243'

export const sendMessage = () => {
    return `${BACKEND_HOST}:3000/sendMessage`
}

export const avail = () => {
    return `${BACKEND_HOST}:3004/avail/store_msg`
}

export const sign = () => {
    return `${BACKEND_HOST}:3001/sendMessage`
}

export const layer0 = () => {
    return `${BACKEND_HOST}:3003/send-message`
}

export const ens = () => {
    return `${BACKEND_HOST}:3005/resolve`
}

export const worldcoin = () => {
    return `http://10.192.188.48:4000/api/verify`
}
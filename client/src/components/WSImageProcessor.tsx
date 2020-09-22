import React from 'react'
import { toast } from 'react-toastify';
import { wsEndpoint } from '../config/config'

const WSImageProcessor = (props: any) => {
    const { userId } = props

    const sock: WebSocket = new WebSocket(`${wsEndpoint}?userId=${encodeURI(userId)}`)

    sock.onmessage = (evt) => {
        const payload: WSPayload = JSON.parse(evt.data)
        toast.success(payload.message)
    }

    return (<></>)
}

interface WSPayload {
    message: string
}

export default WSImageProcessor
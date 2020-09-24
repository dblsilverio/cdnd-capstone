import React from 'react'
import { toast } from 'react-toastify';
import { wsEndpoint } from '../config/config'
import { WSImageProcessorProps } from '../types/states';
import { WSPayload } from '../types/states'

const WSImageProcessor = (props: WSImageProcessorProps) => {
    const { userId } = props

    const sock: WebSocket = new WebSocket(`${wsEndpoint}?userId=${encodeURI(userId)}`)

    sock.onmessage = (evt) => {
        const payload: WSPayload = JSON.parse(evt.data)
        toast.success(payload.message)
    }

    return (<></>)
}

export default WSImageProcessor
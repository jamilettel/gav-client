import { LS_SESSION_NAME } from '@/utils/constants'
import { AppDispatch } from '@/utils/store'
import {
    updateServerInfo,
    updateSession,
    updateSessionList,
} from '@/websocket/builtinSlice'
import { setProtocolWS } from '@/websocket/connectionSlice'

import {
    SessionInfo,
    SessionDescribeData,
    SessionListData,
} from '@/websocket/websocket-types'

export default class WSBuiltinHandler {
    static updateSessionList(dispatch: AppDispatch, data: SessionListData) {
        dispatch(updateSessionList(data.sessions))
    }

    static updateSession(dispatch: AppDispatch, data: SessionInfo) {
        dispatch(updateSession(data.session ?? undefined))
        if (data.session !== null) {
            console.log(data.session)
            localStorage.setItem(LS_SESSION_NAME, data.session)
        }
    }

    static updateServerInfo(dispatch: AppDispatch, data: SessionDescribeData) {
        dispatch(updateServerInfo(data))
        dispatch(setProtocolWS({ protocol: data.command_protocol, dispatch }))
    }
}

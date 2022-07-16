import { LS_SESSION_NAME } from '@/utils/constants'
import { AppDispatch } from '@/utils/store'
import {
    updateServerInfo,
    updateSession,
    updateSessionList,
} from '@/websocket/builtinSlice'

import {
    SessionData,
    SessionDescribeData,
    SessionListData,
} from '@/websocket/websocket-types'

export default class WSBuiltinHandler {
    static updateSessionList(dispatch: AppDispatch, data: SessionListData) {
        dispatch(updateSessionList(data.sessions))
    }

    static updateSession(dispatch: AppDispatch, data: SessionData) {
        dispatch(updateSession(data.session ?? undefined))
        localStorage.setItem(LS_SESSION_NAME, data.session ?? '')
    }

    static updateServerInfo(dispatch: AppDispatch, data: SessionDescribeData) {
        dispatch(updateServerInfo(data))
    }
}

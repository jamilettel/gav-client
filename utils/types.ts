export type LoadingState = {
    loading: boolean
    loaded: boolean
    success: boolean
}

export const EMPTY_LOADING_STATE: LoadingState = {
    loaded: false,
    loading: false,
    success: false,
}

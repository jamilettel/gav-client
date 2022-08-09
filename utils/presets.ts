import {
    MenuSettings,
    setMenuValueGeneric,
    Settings,
} from '@/modules/generic/genericSlice'
import { AppDispatch } from '@/utils/store'
import { sendCommand } from '@/websocket/websocket'

export type Preset = {
    name: string
    settings: Settings
}

type LocalStoragePresets = {
    [title: string]: Preset[]
}

function isValidPreset(preset: Preset): boolean {
    if (typeof preset.name !== 'string') return false
    for (const settingName in preset.settings) {
        const setting = preset.settings[settingName]
        if (setting.type === 'string') {
            if (typeof setting.value !== 'string') return false
            if (setting.values) {
                if (!Array.isArray(setting.values)) return false
                for (const value of setting.values)
                    if (typeof value !== 'string') return false
            }
        } else if (setting.type === 'number') {
            if (
                typeof setting.value !== 'number' ||
                (setting.range
                    ? !Array.isArray(setting.range) ||
                      setting.range.length !== 2 ||
                      typeof setting.range[0] !== 'number' ||
                      typeof setting.range[1] !== 'number'
                    : false) ||
                (setting.min_increment
                    ? typeof setting.min_increment !== 'number'
                    : false)
            )
                return false
        } else {
            return false
        }
    }
    return true
}

function getLocalStoragePresets(): LocalStoragePresets {
    try {
        const presets: LocalStoragePresets = JSON.parse(
            localStorage.getItem('presets') ?? '{}'
        )
        if (typeof presets !== 'object') return {}
        for (const i in presets)
            for (const preset of presets[i])
                if (!isValidPreset(preset)) return {}
        return presets
    } catch {}

    return {}
}

export function presetHasChanged(
    title: string,
    name: string,
    menus: MenuSettings
): boolean {
    const preset = getLocalStoragePresets()[title]?.find((p) => p.name === name)
    if (!preset) return true
    for (const menuName in menus) {
        const menu = menus[menuName]
        const presetValue = preset.settings[menuName]
        if (!presetValue || presetValue.value !== menu.currentValue) {
            return true
        }
    }
    return false
}

export function getPresetList(problemTitle: string): string[] {
    const presets = getLocalStoragePresets()
    const names: string[] = []

    for (const preset of presets[problemTitle] ?? []) {
        names.push(preset.name)
    }
    return names
}

export function getPreset(
    problemTitle: string,
    name: string
): Preset | undefined {
    const presets = getLocalStoragePresets()
    return presets[problemTitle]?.find((preset) => preset.name === name)
}

function menuSettingsToSettings(menuSettings: MenuSettings) {
    let settings = JSON.parse(JSON.stringify(menuSettings))
    for (const settingName in settings) {
        settings[settingName].value = settings[settingName].currentValue
    }
    return settings
}

export function savePreset(
    problemTitle: string,
    name: string,
    settings: MenuSettings
) {
    const presets = getLocalStoragePresets()
    if (!presets[problemTitle]) presets[problemTitle] = []
    let found = false

    for (let preset of presets[problemTitle]) {
        if (preset.name === name) {
            preset.settings = menuSettingsToSettings(settings)
            found = true
        }
    }

    if (!found)
        presets[problemTitle].push({
            name,
            settings: menuSettingsToSettings(settings),
        })

    localStorage.setItem('presets', JSON.stringify(presets))
}

export function deletePreset(problemTitle: string, name: string) {
    const preset = getLocalStoragePresets()
    if (!preset[problemTitle]) return
    preset[problemTitle] = preset[problemTitle].filter((p) => p.name !== name)
    localStorage.setItem('presets', JSON.stringify(preset))
}

export function loadPresetGeneric(
    problemTitle: string,
    name: string,
    dispatch: AppDispatch
): boolean {
    const preset = getLocalStoragePresets()[problemTitle]?.find(
        (preset) => preset.name === name
    )
    if (!preset) return false
    for (const settingName in preset.settings) {
        const setting = preset.settings[settingName]
        dispatch(
            setMenuValueGeneric({ key: settingName, value: setting.value })
        )
    }
    setUsedPreset(problemTitle, name)
    return true
}

export function getLastUsedPreset(title: string): string | undefined {
    let presets: { [title: string]: string } = {}
    try {
        presets = JSON.parse(localStorage.getItem('presetsUsed') ?? '{}')
    } catch {}
    return typeof presets[title] === 'string' ? presets[title] : undefined
}

export function setUsedPreset(title: string, preset: string) {
    let presets: { [title: string]: string } = {}
    try {
        presets = JSON.parse(localStorage.getItem('presetsUsed') ?? '{}')
    } catch {}
    presets[title] = preset
    localStorage.setItem('presetsUsed', JSON.stringify(presets))
}

export function setSettingsGenericPreset(
    title: string,
    name: string,
    dispatch: AppDispatch
) {
    const preset = getLocalStoragePresets()[title]?.find(
        (preset) => preset.name === name
    )
    if (!preset) return
    let settings: {
        [setting_name: string]: string | number
    } = {}

    for (const setting in preset.settings)
        settings[setting] = preset.settings[setting].value

    sendCommand(dispatch, 'set-setting', { settings })
}

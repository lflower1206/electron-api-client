import { contextBridge } from 'electron'

// Custom APIs for renderer
const api = {}

    contextBridge.exposeInMainWorld('api', api)

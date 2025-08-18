// Reexport the native module. On web, it will be resolved to ExpoSmsModule.web.ts
// and on native platforms to ExpoSmsModule.ts
export { default } from './src/ExpoSmsModule';
export { default as ExpoSmsView } from './src/ExpoSmsView';
export * from  './src/ExpoSms.types';

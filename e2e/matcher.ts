/* eslint-env detox/detox, jest/globals */

// Improved Detox API to reduce syntax noise
export const byId = (str: string) => element(by.id(str));
export const byLabel = (str: string) => element(by.label(str));
export const byText = (str: string) => element(by.text(str));
export const byType = (str: string) => element(by.type(str));

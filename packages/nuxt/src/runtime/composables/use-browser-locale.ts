export function useBrowserLocale() {
  // 1. try to get accept-language from request
  let locale;
  if (process.server) {
    const acceptLanguage = useRequestHeader('accept-language')
    // ko,en;q=0.9,en-US;q=0.8,ko-KR;q=0.7,ja-JP;q=0.6,ja;q=0.5
    locale = acceptLanguage?.split(',')[0].split(';')[0]
  }
  // 2. try to get navigator language
  return globalThis?.navigator?.language ?? locale ?? 'en'
}
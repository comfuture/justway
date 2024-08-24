import { ref } from 'vue'
import { useFetch } from '#app'

type OriginalFetchReturn = typeof useFetch<T>
type DelayedFetchReturn<T> = typeof useFetch<T> & {
  load: OriginalFetchReturn['refresh']
};

export async function useDelayedFetch<T>(request, opts): DelayedFetchReturn<T> {
  const { data, status, error, refresh } = await useFetch<T>(request, { ...opts, immediate: false })
  return { data, status, error, refresh, load: refresh }
}
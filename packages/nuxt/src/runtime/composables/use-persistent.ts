import { useStorage } from '@vueuse/core'

type Persistable<T = any> = Record<string, T>

interface SetValue<T> {
  (value: T): void
}

/**
 * A composable function that provides persistent state management using a key-value storage.
 * It is useful for storing values that need to be persisted across page reloads.
 * 
 * For example, you can use it to store the user's theme preference, language preference, popovers, etc.
 * 
 * @template T - The type of the value to be stored.
 * @param {string} key - The key under which the value will be stored.
 * @param {string} [category='default'] - The category or namespace for the storage. Defaults to 'default'.
 * @returns {[T, SetValue<T>]} - A tuple containing the stored value and a function to update the value.
 */
export function usePersistent<T extends any>(key: string, category: string = 'default'): [T, SetValue<T>] {
  const storage = useStorage<Persistable<T>>(`persistent:${category}`, {})
  const setValue: SetValue<T> = (value) => {
    const newValue = { ...storage.value, ['' + key]: value }
    storage.value = newValue
  }
  return [storage.value['' + key], setValue]
}

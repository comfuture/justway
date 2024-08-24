import { createApp, type App, ref } from "vue";
import UiToast from "../components/ui/toast.vue";
import { useState } from "#app";

export type ToastType = "success" | "info" | "warning" | "error";

export type ToastMessage = {
  id: number;
  type: ToastType;
  message: string;
  title?: string;
  handler?: () => void;
};

type ToastRemoveAction = () => void;

type ToastOptions = {
  type?: ToastType;
  title?: string;
  duration?: number;
  handler?: () => void;
};

interface ToastAction {
  (message: string, options?: ToastOptions): ToastRemoveAction;
}

export interface ToastInterface {
  add: (message: string, ToastOptions?: ToastOptions) => number;
  remove: (id: number) => void;
  info: ToastAction;
  success: ToastAction;
  warning: ToastAction;
  error: ToastAction;
}

// export const messages = useState<ToastMessage[]>('toast', () => []);
export const messages = ref<ToastMessage[]>([]);

function alias(type: ToastType): ToastAction {
  return function (
    this: ToastInterface,
    message: string,
    options?: ToastOptions
  ) {
    options = { ...options, type };
    const id = this.add(message, options);
    return () => this.remove(id);
  };
}

const toastImpl: ToastInterface = {
  /** Add a toast message */
  add(message: string, options?: ToastOptions): number {
    const id = Date.now();
    const { type = "info", title, duration = 3500, handler } = options || {};
    messages.value.push({
      id,
      type,
      message,
      title,
      handler,
    });
    if (duration) {
      globalThis?.setTimeout(() => {
        this.remove(id);
      }, duration);
    }
    return id;
  },
  /** Remove a toast message if it exists */
  remove(id: number): void {
    const pos = messages.value.findIndex((message) => message.id === id);
    if (pos !== -1) {
      messages.value.splice(pos, 1);
    }
  },
  success: alias("success"),
  info: alias("info"),
  warning: alias("warning"),
  error: alias("error"),
};

let toastContainerApp: App | undefined;

export const useToast = (): ToastInterface => {
  // TODO: prepare the toast container component to the document if it doesn't exist
  if (!toastContainerApp) {
    if (!globalThis?.document) {
      // throw new Error("useToast must be called in a browser environment");
      return toastImpl;
    }
    const container = globalThis?.document?.createElement("div");
    if (!container) {
      throw new Error("Failed to create toast container");
    }
    globalThis?.document?.body.appendChild(container);
    toastContainerApp = createApp(UiToast);
    toastContainerApp.mount(container);
  }
  return toastImpl;
};
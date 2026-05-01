import {
    AlertCircle,
    CheckCircle2,
    Info,
    RefreshCw,
    TriangleAlert,
    X,
} from "lucide-react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning" | "update";

type ToastInput = {
    type: ToastType;
    message: string;
    title?: string;
    durationMs?: number;
};

type ToastItem = ToastInput & {
    id: string;
    exiting?: boolean;
};

type ToastContextValue = {
    showToast: (input: ToastInput) => void;
    hideToast: (id: string) => void;
};

const DEFAULT_DURATION_MS = 4000;
const MAX_VISIBLE_TOASTS = 5;
const FADE_OUT_MS = 220;

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const dismissTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
        new Map()
    );
    const fadeOutTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
        new Map()
    );

    const clearDismissTimer = useCallback((id: string) => {
        const t = dismissTimersRef.current.get(id);
        if (t !== undefined) {
            clearTimeout(t);
            dismissTimersRef.current.delete(id);
        }
    }, []);

    const clearFadeOutTimer = useCallback((id: string) => {
        const t = fadeOutTimersRef.current.get(id);
        if (t !== undefined) {
            clearTimeout(t);
            fadeOutTimersRef.current.delete(id);
        }
    }, []);

    const removeFromDom = useCallback(
        (id: string) => {
            clearFadeOutTimer(id);
            dismissTimersRef.current.delete(id);
            setToasts((current) => current.filter((toast) => toast.id !== id));
        },
        [clearFadeOutTimer]
    );

    const removeFromDomRef = useRef(removeFromDom);
    removeFromDomRef.current = removeFromDom;

    const beginFadeOut = useCallback(
        (id: string) => {
            clearDismissTimer(id);
            if (fadeOutTimersRef.current.has(id)) return;

            setToasts((current) => {
                const target = current.find((t) => t.id === id);
                if (!target || target.exiting) return current;
                return current.map((toast) =>
                    toast.id === id ? { ...toast, exiting: true } : toast
                );
            });

            const fadeId = window.setTimeout(() => {
                fadeOutTimersRef.current.delete(id);
                removeFromDom(id);
            }, FADE_OUT_MS);
            fadeOutTimersRef.current.set(id, fadeId);
        },
        [clearDismissTimer, clearFadeOutTimer, removeFromDom]
    );

    const beginFadeOutRef = useRef(beginFadeOut);
    beginFadeOutRef.current = beginFadeOut;

    const showToast = useCallback(({ durationMs = DEFAULT_DURATION_MS, ...input }: ToastInput) => {
        const id = crypto.randomUUID();
        const next: ToastItem = { ...input, durationMs, id, exiting: false };

        setToasts((current) => {
            let list = current.map((t) => ({ ...t }));

            while (list.filter((t) => !t.exiting).length >= MAX_VISIBLE_TOASTS) {
                const idx = list.findIndex((t) => !t.exiting);
                if (idx === -1) break;
                const oldest = list[idx];
                const tid = dismissTimersRef.current.get(oldest.id);
                if (tid !== undefined) {
                    clearTimeout(tid);
                    dismissTimersRef.current.delete(oldest.id);
                }
                clearFadeOutTimer(oldest.id);
                list[idx] = { ...oldest, exiting: true };
                const oldestId = oldest.id;
                const fadeId = window.setTimeout(() => {
                    fadeOutTimersRef.current.delete(oldestId);
                    removeFromDomRef.current(oldestId);
                }, FADE_OUT_MS);
                fadeOutTimersRef.current.set(oldestId, fadeId);
            }

            list.push(next);
            return list;
        });

        const autoDismiss = window.setTimeout(() => {
            dismissTimersRef.current.delete(id);
            beginFadeOutRef.current(id);
        }, durationMs);
        dismissTimersRef.current.set(id, autoDismiss);
    }, [clearFadeOutTimer]);

    const hideToast = useCallback(
        (id: string) => {
            beginFadeOut(id);
        },
        [beginFadeOut]
    );

    useEffect(() => {
        return () => {
            dismissTimersRef.current.forEach((t) => clearTimeout(t));
            dismissTimersRef.current.clear();
            fadeOutTimersRef.current.forEach((t) => clearTimeout(t));
            fadeOutTimersRef.current.clear();
        };
    }, []);

    const contextValue = useMemo(
        () => ({ showToast, hideToast }),
        [showToast, hideToast]
    );

    return (
        <ToastContext.Provider value={contextValue}>
            {children}

            <div className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex justify-center px-4">
                <div className="flex w-full max-w-xl flex-col gap-3">
                    {toasts.map((toast) => (
                        <ToastCard
                            key={toast.id}
                            toast={toast}
                            onClose={() => hideToast(toast.id)}
                        />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};

const ToastCard = ({
    toast,
    onClose,
}: {
    toast: ToastItem;
    onClose: () => void;
}) => {
    const appearance = getToastAppearance(toast.type);
    const Icon = appearance.icon;
    const exiting = Boolean(toast.exiting);

    return (
        <div
            role="status"
            className={cn(
                "pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl",
                "transition-[opacity,transform] duration-200 ease-out",
                exiting
                    ? "translate-y-[-6px] scale-[0.98] opacity-0"
                    : "translate-y-0 scale-100 opacity-100 animate-in fade-in slide-in-from-top-2 duration-200",
                appearance.className
            )}
        >
            <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-4 shrink-0" />
                <div className="min-w-0 flex-1">
                    {toast.title && (
                        <p className="text-xs font-bold uppercase tracking-[0.14em]">
                            {toast.title}
                        </p>
                    )}
                    <p className="text-sm font-semibold">{toast.message}</p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
                    aria-label="Fechar notificação"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
};

const getToastAppearance = (type: ToastType) => {
    switch (type) {
        case "success":
            return {
                icon: CheckCircle2,
                className:
                    "border-emerald-200/80 bg-emerald-50/90 text-emerald-700",
            };
        case "error":
            return {
                icon: AlertCircle,
                className: "border-red-200/80 bg-red-50/90 text-red-700",
            };
        case "warning":
            return {
                icon: TriangleAlert,
                className:
                    "border-amber-200/80 bg-amber-50/90 text-amber-700",
            };
        case "update":
            return {
                icon: RefreshCw,
                className: "border-sky-200/80 bg-sky-50/90 text-sky-700",
            };
        default:
            return {
                icon: Info,
                className: "border-slate-200/80 bg-white/90 text-slate-700",
            };
    }
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider.");
    }
    return context;
};

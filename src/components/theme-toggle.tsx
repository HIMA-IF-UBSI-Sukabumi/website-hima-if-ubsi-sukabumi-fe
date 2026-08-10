"use client";

import {useEffect, useSyncExternalStore} from "react";
import {IoDesktopOutline, IoMoonOutline, IoSunnyOutline} from "react-icons/io5";
import clsx from "clsx";

const STORAGE_KEY = "himaif-theme";

type ThemePreference = "system" | "light" | "dark";

const OPTIONS: { value: ThemePreference; label: string; icon: React.ReactNode }[] = [
    {value: "system", label: "Sistem", icon: <IoDesktopOutline className="h-4 w-4"/>},
    {value: "light", label: "Terang", icon: <IoSunnyOutline className="h-4 w-4"/>},
    {value: "dark", label: "Gelap", icon: <IoMoonOutline className="h-4 w-4"/>},
];

let currentPref: ThemePreference = "system";
const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot(): ThemePreference {
    return currentPref;
}

function applyPreference(pref: ThemePreference): void {
    currentPref = pref;
    if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, pref);
        const dark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList.toggle("dark", dark);
    }
    emit();
}

export default function ThemeToggle() {
    const pref = useSyncExternalStore(subscribe, getSnapshot, () => "system");

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "system" || stored === "light" || stored === "dark") {
            applyPreference(stored);
        }
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => applyPreference(currentPref);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    const select = (value: ThemePreference) => {
        applyPreference(value);
    };

    return (
        <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 shadow-md">
            {OPTIONS.map(({value, label, icon}) => (
                <button
                    key={value}
                    type="button"
                    aria-label={`Mode ${label}`}
                    title={label}
                    onClick={() => select(value)}
                    className={clsx(
                        "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition",
                        pref === value
                            ? "bg-primary text-white shadow"
                            : "text-slate-500 hover:text-slate-700",
                    )}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
}

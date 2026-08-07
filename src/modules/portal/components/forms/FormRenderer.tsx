"use client";

import useAxios from "@/core/hooks/use-axios";
import {formService} from "@/modules/portal/services/api/form.service";
import type {
    FormDetail,
    FormQuestion,
    ParticipantFieldKey,
    SubmitResponse,
} from "@/modules/portal/services/api/form.service";
import {toPng} from "html-to-image";
import {IoDownloadOutline} from "react-icons/io5";
import {useMemo, useRef, useState} from "react";

const PARTICIPANT_FIELD_LABELS: Record<ParticipantFieldKey, string> = {
    full_name: "Nama Lengkap",
    nim: "NIM",
    class: "Kelas",
    email: "Email",
    phone: "Nomor HP",
    institution: "Instansi",
};

const PARTICIPANT_FIELD_TYPES: Partial<Record<ParticipantFieldKey, string>> = {
    email: "email",
    nim: "text",
    phone: "tel",
};

const FINGERPRINT_KEY = "himaif_guest_fingerprint";

function getGuestFingerprint(): string {
    if (typeof window === "undefined") return "";
    let fp = window.localStorage.getItem(FINGERPRINT_KEY);
    if (!fp) {
        fp = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
        window.localStorage.setItem(FINGERPRINT_KEY, fp);
    }
    return fp;
}

function formatPeriod(value: string | null): string {
    if (!value) return "";
    const d = new Date(value);
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
}

export default function FormRenderer({form}: { form: FormDetail }) {
    const client = useAxios();

    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [participant, setParticipant] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<SubmitResponse | null>(null);
    const [downloading, setDownloading] = useState(false);
    const attendanceCardRef = useRef<HTMLDivElement>(null);

    const enabledParticipantFields = useMemo(
        () =>
            (Object.entries(form.participant_fields ?? {}) as [ParticipantFieldKey, { enabled: boolean }][]).filter(
                ([, config]) => Boolean(config?.enabled),
            ),
        [form.participant_fields],
    );

    const setAnswer = (questionId: string, value: string | string[]) => {
        setAnswers((prev) => ({...prev, [questionId]: value}));
        setFieldErrors((prev) => {
            const next = {...prev};
            delete next[questionId];
            return next;
        });
    };

    const setParticipantValue = (key: string, value: string) => {
        setParticipant((prev) => ({...prev, [key]: value}));
        setFieldErrors((prev) => {
            const next = {...prev};
            delete next[`participant_${key}`];
            return next;
        });
    };

    const toggleCheckboxOption = (questionId: string, optionValue: string) => {
        const current = (answers[questionId] as string[] | undefined) ?? [];
        const next = current.includes(optionValue)
            ? current.filter((v) => v !== optionValue)
            : [...current, optionValue];
        setAnswer(questionId, next);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        const errors: Record<string, string> = {};
        for (const q of form.questions) {
            const value = answers[q.id];
            if (q.is_required && (value === undefined || value === "" || (Array.isArray(value) && value.length === 0))) {
                errors[q.id] = "Pertanyaan ini wajib diisi.";
            }
        }
        for (const [key, label] of enabledParticipantFields) {
            if (!participant[key]?.trim()) {
                errors[`participant_${key}`] = `Field "${label}" wajib diisi.`;
            }
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setSubmitting(true);
        try {
            const res = await formService.submitForm(client, form.slug, {
                answers,
                participant_data: participant,
                guest_fingerprint: getGuestFingerprint(),
            });
            setResult(res);
        } catch (err: unknown) {
            const data = (err as { response?: { data?: { errors?: Record<string, string>; message?: string } } })
                ?.response?.data;
            if (data?.errors && Object.keys(data.errors).length > 0) {
                setFieldErrors(data.errors);
            } else {
                setSubmitError(data?.message ?? "Terjadi kesalahan saat mengirim form. Silakan coba lagi.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownload = async () => {
        if (!attendanceCardRef.current || !result) return;
        setDownloading(true);
        try {
            const dataUrl = await toPng(attendanceCardRef.current, {
                pixelRatio: 2,
                backgroundColor: "#ffffff",
            });
            const link = document.createElement("a");
            link.download = `kartu-absensi-${result.attendance_token}.png`;
            link.href = dataUrl;
            link.click();
        } catch {
            setSubmitError("Gagal mengunduh kartu absensi. Silakan coba lagi.");
        } finally {
            setDownloading(false);
        }
    };

    if (result) {
        return (
            <div className="mx-auto w-full max-w-2xl px-4 py-12">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Form berhasil dikirim!</h1>
                    {result.success_message ? (
                        <div
                            className="prose prose-sm mx-auto mt-4 max-w-none text-slate-700"
                            dangerouslySetInnerHTML={{__html: result.success_message}}
                        />
                    ) : (
                        <p className="mt-4 text-slate-600">{result.message}</p>
                    )}
                    {result.attendance_token && (
                        <div ref={attendanceCardRef} className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api"}/forms/${form.slug}/qr/${result.attendance_token}`}
                                alt="QR Code absensi"
                                className="mx-auto h-44 w-44"
                            />
                            <p className="mt-4 text-sm font-medium text-slate-500">Kode Absensi (QR Check-in)</p>
                            <p className="mt-2 font-mono text-2xl font-bold tracking-widest text-indigo-700">
                                {result.attendance_token}
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                                Simpan kode ini dan tunjukkan kepada petugas saat check-in.
                            </p>
                        </div>
                    )}
                    {result.attendance_token && (
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={downloading}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <IoDownloadOutline className="h-5 w-5"/>
                            {downloading ? "Memproses..." : "Unduh Kartu Absensi"}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const renderQuestionInput = (q: FormQuestion) => {
        const value = answers[q.id] as string | undefined;
        const commonClass =
            "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

        if (q.type === "textarea") {
            return (
                <textarea
                    rows={4}
                    value={value ?? ""}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className={commonClass}
                    placeholder="Tulis jawaban kamu"
                />
            );
        }

        if (q.type === "select") {
            return (
                <select
                    value={value ?? ""}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className={commonClass}
                >
                    <option value="">Pilih jawaban</option>
                    {q.options.map((opt) => (
                        <option key={opt.id} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (q.type === "radio" || q.type === "checkbox") {
            const selected = q.type === "checkbox" ? ((answers[q.id] as string[]) ?? []) : null;
            return (
                <div className="space-y-2">
                    {q.options.map((opt) => {
                        const checked = q.type === "checkbox" ? selected!.includes(opt.value) : value === opt.value;
                        return (
                            <label
                                key={opt.id}
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                            >
                                <input
                                    type={q.type}
                                    checked={checked}
                                    onChange={() =>
                                        q.type === "checkbox"
                                            ? toggleCheckboxOption(q.id, opt.value)
                                            : setAnswer(q.id, opt.value)
                                    }
                                    className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{opt.label}</span>
                            </label>
                        );
                    })}
                </div>
            );
        }

        return (
            <input
                type={q.type}
                value={value ?? ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                className={commonClass}
                placeholder="Jawaban kamu"
            />
        );
    };

    return (
        <div className="mx-auto w-full max-w-2xl px-4 py-12">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900">{form.title}</h1>
                {form.description && <p className="mt-3 whitespace-pre-line text-slate-600">{form.description}</p>}
                {(form.start_at || form.end_at) && (
                    <p className="mt-4 text-xs font-medium text-slate-400">
                        {form.start_at && <>Dibuka {formatPeriod(form.start_at)}</>}
                        {form.start_at && form.end_at && " · "}
                        {form.end_at && <>Ditutup {formatPeriod(form.end_at)}</>}
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {enabledParticipantFields.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Data Peserta
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {enabledParticipantFields.map(([key]) => {
                                const label = PARTICIPANT_FIELD_LABELS[key];
                                return (
                                <div key={key}>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        {label} <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type={PARTICIPANT_FIELD_TYPES[key] ?? "text"}
                                        value={participant[key] ?? ""}
                                        onChange={(e) => setParticipantValue(key, e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder={`Masukkan ${label.toLowerCase()}`}
                                    />
                                    {fieldErrors[`participant_${key}`] && (
                                        <p className="mt-1 text-xs font-medium text-rose-500">
                                            {fieldErrors[`participant_${key}`]}
                                        </p>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {form.questions.map((q, idx) => (
                    <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-slate-400">Pertanyaan {idx + 1}</p>
                        <h3 className="mt-1 text-base font-semibold text-slate-900">
                            {q.label}
                            {q.is_required && <span className="ml-1 text-rose-500">*</span>}
                        </h3>
                        {q.description && <p className="mt-1 text-sm text-slate-500">{q.description}</p>}
                        <div className="mt-4">{renderQuestionInput(q)}</div>
                        {fieldErrors[q.id] && (
                            <p className="mt-1 text-xs font-medium text-rose-500">{fieldErrors[q.id]}</p>
                        )}
                    </div>
                ))}

                {submitError && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {submitError}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Mengirim..." : "Kirim Jawaban"}
                    </button>
                </div>
            </form>
        </div>
    );
}

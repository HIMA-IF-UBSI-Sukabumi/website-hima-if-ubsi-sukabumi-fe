export default function FormsLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-smoky text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            {children}
        </div>
    );
}

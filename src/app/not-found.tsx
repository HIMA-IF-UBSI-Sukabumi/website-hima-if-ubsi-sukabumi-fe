import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center space-y-4">

                <h1 className="text-6xl font-black text-gray-900">
                    404
                </h1>

                <p className="text-gray-500 text-sm">
                    Halaman yang kamu cari tidak ditemukan
                </p>

                <Link
                    href="/"
                    className="inline-block mt-4 px-5 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
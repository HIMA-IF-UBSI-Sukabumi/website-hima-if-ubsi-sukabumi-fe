import { ImageResponse } from 'next/og'

export const alt = 'HIMA-IF News'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'
    const storageUrl = process.env.STORAGE_URL ?? process.env.NEXT_PUBLIC_STORAGE_URL ?? ''

    let title = 'HIMA-IF News'
    let category = 'Berita'
    let coverUrl: string | null = null

    try {
        const res = await fetch(`${apiUrl}/news/${slug}`, { next: { revalidate: 3600 } })
        if (res.ok) {
            const json = await res.json()
            const news = json?.news
            if (news) {
                title = news.title ?? 'HIMA-IF News'
                category = news.category?.name ?? 'Berita'
                coverUrl = news.cover ? `${storageUrl}/${news.cover}` : null
            }
        }
    } catch { /* fallback ke default */ }

    // Truncate judul agar muat di kartu
    const displayTitle = title.length > 72 ? title.slice(0, 69).trimEnd() + '...' : title
    const fontSize = title.length > 50 ? 46 : 58

    // Fetch cover image sebagai buffer supaya bisa di-embed (bypass CORS)
    let coverData: string | null = null
    if (coverUrl) {
        try {
            const imgRes = await fetch(coverUrl, { cache: 'no-store' })
            if (imgRes.ok) {
                const buf = await imgRes.arrayBuffer()
                const mime = imgRes.headers.get('content-type') ?? 'image/jpeg'
                coverData = `data:${mime};base64,${Buffer.from(buf).toString('base64')}`
            }
        } catch { /* gambar tidak tersedia, skip */ }
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    position: 'relative',
                    backgroundColor: '#0f0f1a',
                    overflow: 'hidden',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* ── Background cover image ── */}
                {coverData && (
                    <img
                        src={coverData}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.3,
                        }}
                    />
                )}

                {/* ── Gradient overlay ── */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'linear-gradient(135deg, rgba(44,47,145,0.88) 0%, rgba(10,10,30,0.96) 70%)',
                        display: 'flex',
                    }}
                />

                {/* ── Left accent bar ── */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: 8,
                        background: 'linear-gradient(to bottom, #4f56f0, #2C2F91)',
                        display: 'flex',
                    }}
                />

                {/* ── Main content ── */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '52px 72px 56px 80px',
                    }}
                >
                    {/* Top: HIMA-IF brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: 8,
                                padding: '8px 18px',
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: 20,
                                fontWeight: 700,
                                letterSpacing: '0.08em',
                                display: 'flex',
                            }}
                        >
                            HIMA-IF NEWS
                        </div>
                        <div
                            style={{
                                backgroundColor: '#2C2F91',
                                borderRadius: 99,
                                padding: '8px 18px',
                                color: 'white',
                                fontSize: 18,
                                fontWeight: 600,
                                letterSpacing: '0.06em',
                                display: 'flex',
                            }}
                        >
                            {category.toUpperCase()}
                        </div>
                    </div>

                    {/* Center/bottom: article title */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 24,
                        }}
                    >
                        <div
                            style={{
                                color: '#ffffff',
                                fontSize: fontSize,
                                fontWeight: 800,
                                lineHeight: 1.25,
                                maxWidth: 980,
                            }}
                        >
                            {displayTitle}
                        </div>

                        {/* CTA + domain */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div
                                style={{
                                    backgroundColor: '#4f56f0',
                                    color: 'white',
                                    borderRadius: 99,
                                    padding: '12px 28px',
                                    fontSize: 20,
                                    fontWeight: 700,
                                    display: 'flex',
                                }}
                            >
                                Baca Selengkapnya →
                            </div>
                            <span
                                style={{
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: 20,
                                    fontWeight: 500,
                                    display: 'flex',
                                }}
                            >
                                news.himaifubsismi.or.id
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    )
}

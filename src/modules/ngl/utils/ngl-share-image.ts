export interface RenderNglReplyOptions {
    message: string;
    reply?: string;
    domainLabel?: string;
}

export interface RenderNglShareLinkOptions {
    displayName?: string;
    profilePictureUrl?: string;
    isAdmin?: boolean;
    domainLabel?: string;
}

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

const HIMAIF_PRIMARY = "#2C2F91";
const HIMAIF_PRIMARY_LIGHT = "#4F46E5";
const HIMAIF_SECONDARY = "#8A90B2";

function loadImage(src?: string): Promise<HTMLImageElement | null> {
    if (!src) return Promise.resolve(null);
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        const timeout = setTimeout(() => resolve(null), 3500);
        img.onload = () => {
            clearTimeout(timeout);
            resolve(img);
        };
        img.onerror = () => {
            clearTimeout(timeout);
            resolve(null);
        };
        img.src = src;
    });
}

function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
): string[] {
    const paragraphs = text.split(/\r?\n/);
    const lines: string[] = [];

    for (const paragraph of paragraphs) {
        const words = paragraph.split(/\s+/).filter(Boolean);
        if (words.length === 0) {
            lines.push("");
            continue;
        }

        let currentLine = "";
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            if (ctx.measureText(testLine).width <= maxWidth) {
                currentLine = testLine;
            } else {
                if (currentLine) lines.push(currentLine);
                if (ctx.measureText(word).width > maxWidth) {
                    let chunk = "";
                    for (const char of word) {
                        if (ctx.measureText(chunk + char).width <= maxWidth) {
                            chunk += char;
                        } else {
                            if (chunk) lines.push(chunk);
                            chunk = char;
                        }
                    }
                    currentLine = chunk;
                } else {
                    currentLine = word;
                }
            }
        }
        if (currentLine) lines.push(currentLine);
    }

    return lines;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Gagal membuat gambar PNG."));
        }, "image/png");
    });
}

function drawNavbarBrandHeader(
    ctx: CanvasRenderingContext2D,
    centerY: number
) {
    const centerX = STORY_WIDTH / 2;

    // "HIMA-IF" + "NGL" pill badge matching News/NglNavbar
    ctx.font = "900 40px Poppins, system-ui, -apple-system, sans-serif";
    const himaWidth = ctx.measureText("HIMA").width;
    const dashIfWidth = ctx.measureText("-IF").width;
    const badgeW = 88;
    const badgeH = 44;
    const gap = 14;
    const totalW = himaWidth + dashIfWidth + gap + badgeW;
    const startX = centerX - totalW / 2;

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("HIMA", startX, centerY + 24);

    ctx.fillStyle = HIMAIF_SECONDARY;
    ctx.fillText("-IF", startX + himaWidth, centerY + 24);

    const badgeX = startX + himaWidth + dashIfWidth + gap;
    const badgeY = centerY + 24 - badgeH / 2 - 2;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 10);
    ctx.fillStyle = HIMAIF_PRIMARY;
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 24px Poppins, system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("NGL", badgeX + badgeW / 2, centerY + 24);

    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.font = "500 22px Poppins, system-ui, -apple-system, sans-serif";
    ctx.fillText("UBSI PSDKU Sukabumi", centerX, centerY + 68);
}

function drawFooterWatermark(
    ctx: CanvasRenderingContext2D,
    domainLabel: string
) {
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 32px Poppins, system-ui, -apple-system, sans-serif";
    ctx.fillText("HIMA-IF NGL", STORY_WIDTH / 2, STORY_HEIGHT - 155);

    ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
    ctx.font = "500 24px Poppins, system-ui, -apple-system, sans-serif";
    ctx.fillText(domainLabel, STORY_WIDTH / 2, STORY_HEIGHT - 115);
}

export async function renderNglReplyCardBlob({
    message,
    reply,
    domainLabel = "ngl.himaifubsismi.or.id",
}: RenderNglReplyOptions): Promise<Blob> {
    const canvas = document.createElement("canvas");
    canvas.width = STORY_WIDTH;
    canvas.height = STORY_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas tidak didukung di browser ini.");

    // Dark Indigo-Slate Story Background
    const bgGrad = ctx.createLinearGradient(0, 0, STORY_WIDTH, STORY_HEIGHT);
    bgGrad.addColorStop(0, "#121329");
    bgGrad.addColorStop(0.5, "#15172b");
    bgGrad.addColorStop(1, "#1b1d3d");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    // Subtle primary glow behind card
    const glow = ctx.createRadialGradient(
        STORY_WIDTH / 2,
        STORY_HEIGHT / 2 - 40,
        60,
        STORY_WIDTH / 2,
        STORY_HEIGHT / 2 - 40,
        580
    );
    glow.addColorStop(0, "rgba(79, 70, 229, 0.28)");
    glow.addColorStop(1, "rgba(21, 23, 43, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    // Top Navbar-style Brand Header
    drawNavbarBrandHeader(ctx, 210);

    // Measure message lines
    const cardWidth = 840;
    const innerPadX = 48;
    const bubbleWidth = cardWidth - innerPadX * 2;
    const msgFontSize = message.length > 260 ? 34 : message.length > 120 ? 40 : 46;
    const msgLineHeight = msgFontSize * 1.38;

    ctx.font = `700 ${msgFontSize}px Poppins, system-ui, -apple-system, sans-serif`;
    const msgLines = wrapText(ctx, message.trim(), bubbleWidth - 88);
    const bubbleHeight = Math.max(170, msgLines.length * msgLineHeight + 88);

    const headerHeight = 155;
    const cardBottomPad = 48;
    const cardHeight = headerHeight + bubbleHeight + cardBottomPad;

    // Measure optional reply lines
    const trimmedReply = reply?.trim() || "";
    let replyLines: string[] = [];
    const replyFontSize = 42;
    const replyLineHeight = replyFontSize * 1.4;
    if (trimmedReply) {
        ctx.font = `700 ${replyFontSize}px Poppins, system-ui, -apple-system, sans-serif`;
        replyLines = wrapText(ctx, trimmedReply, 820);
    }

    const totalContentHeight =
        cardHeight + (replyLines.length > 0 ? 72 + replyLines.length * replyLineHeight : 0);
    const cardX = (STORY_WIDTH - cardWidth) / 2;
    const cardY = Math.max(390, (STORY_HEIGHT - 140 - totalContentHeight) / 2 + 70);

    // HIMA-IF Primary Gradient Card
    const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + cardHeight);
    cardGrad.addColorStop(0, HIMAIF_PRIMARY);
    cardGrad.addColorStop(0.55, "#3b3fa8");
    cardGrad.addColorStop(1, HIMAIF_PRIMARY_LIGHT);

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 56);
    ctx.fillStyle = cardGrad;
    ctx.fill();
    ctx.restore();

    // Card Header Text
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 40px Poppins, system-ui, -apple-system, sans-serif";
    ctx.fillText("kirim pesan anonim!", STORY_WIDTH / 2, cardY + 92);

    // Inner White Message Pill
    const bubbleX = cardX + innerPadX;
    const bubbleY = cardY + headerHeight - 10;
    drawRoundedRect(ctx, bubbleX, bubbleY, bubbleWidth, bubbleHeight, 44);
    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.fill();

    // Message Text
    ctx.fillStyle = "#111827";
    ctx.font = `700 ${msgFontSize}px Poppins, system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    const msgBlockHeight = msgLines.length * msgLineHeight;
    let currentMsgY =
        bubbleY + (bubbleHeight - msgBlockHeight) / 2 + msgFontSize * 0.85;
    for (const line of msgLines) {
        ctx.fillText(line, STORY_WIDTH / 2, currentMsgY);
        currentMsgY += msgLineHeight;
    }

    // Optional Reply Below Card
    if (replyLines.length > 0) {
        ctx.fillStyle = "#ffffff";
        ctx.font = `700 ${replyFontSize}px Poppins, system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        let replyY = cardY + cardHeight + 92;
        for (const line of replyLines) {
            ctx.fillText(line, STORY_WIDTH / 2, replyY);
            replyY += replyLineHeight;
        }
    }

    drawFooterWatermark(ctx, domainLabel);
    return canvasToBlob(canvas);
}

function drawSpeechBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    angleRad: number
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angleRad);

    ctx.font = "700 32px Poppins, system-ui, -apple-system, sans-serif";
    const textWidth = ctx.measureText(text).width;
    const w = textWidth + 72;
    const h = 84;

    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 42);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Speech tail
    ctx.beginPath();
    ctx.moveTo(-w / 4, h / 2 - 4);
    ctx.lineTo(-w / 4 - 16, h / 2 + 22);
    ctx.lineTo(-w / 4 + 24, h / 2 - 4);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.fillStyle = HIMAIF_PRIMARY;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 2);

    ctx.restore();
}

export async function renderNglShareLinkBlob({
    displayName,
    profilePictureUrl,
    isAdmin = false,
    domainLabel = "ngl.himaifubsismi.or.id",
}: RenderNglShareLinkOptions): Promise<Blob> {
    const [logo, avatarImg] = await Promise.all([
        loadImage("/assets/logo-himaif.webp"),
        isAdmin ? Promise.resolve(null) : loadImage(profilePictureUrl),
    ]);

    const canvas = document.createElement("canvas");
    canvas.width = STORY_WIDTH;
    canvas.height = STORY_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas tidak didukung di browser ini.");

    // HIMA-IF Indigo Palette Backdrop
    const bgGrad = ctx.createLinearGradient(0, 0, STORY_WIDTH, STORY_HEIGHT);
    bgGrad.addColorStop(0, "#15173d");
    bgGrad.addColorStop(0.5, "#191c47");
    bgGrad.addColorStop(1, HIMAIF_PRIMARY);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    // Soft ambient blobs
    const blob1 = ctx.createRadialGradient(240, 460, 40, 240, 460, 480);
    blob1.addColorStop(0, "rgba(99, 102, 241, 0.38)");
    blob1.addColorStop(1, "rgba(99, 102, 241, 0)");
    ctx.fillStyle = blob1;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    const blob2 = ctx.createRadialGradient(840, 1280, 40, 840, 1280, 480);
    blob2.addColorStop(0, "rgba(138, 144, 178, 0.28)");
    blob2.addColorStop(1, "rgba(138, 144, 178, 0)");
    ctx.fillStyle = blob2;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    // Top Navbar-style Brand Header
    drawNavbarBrandHeader(ctx, 210);

    // Decorative floating speech bubbles
    drawSpeechBubble(ctx, 130, 560, "spill dong!", -0.14);
    drawSpeechBubble(ctx, 940, 650, "jujurly...", 0.12);
    drawSpeechBubble(ctx, 150, 1450, "rahasiain ya", 0.1);
    drawSpeechBubble(ctx, 910, 1360, "pesan anonim", -0.11);

    // Center Profile Picture / Initials Avatar
    const centerX = STORY_WIDTH / 2;
    const avatarY = 580;
    const avatarRadius = 96;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = HIMAIF_PRIMARY;
    ctx.fill();

    if (isAdmin && logo) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, avatarY, avatarRadius - 4, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(
            centerX - avatarRadius,
            avatarY - avatarRadius,
            avatarRadius * 2,
            avatarRadius * 2
        );
        const logoSize = avatarRadius * 1.45;
        ctx.drawImage(
            logo,
            centerX - logoSize / 2,
            avatarY - logoSize / 2,
            logoSize,
            logoSize
        );
        ctx.restore();
    } else if (avatarImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, avatarY, avatarRadius - 4, 0, Math.PI * 2);
        ctx.clip();

        // Center-crop cover fit
        const scale = Math.max(
            (avatarRadius * 2) / avatarImg.width,
            (avatarRadius * 2) / avatarImg.height
        );
        const drawW = avatarImg.width * scale;
        const drawH = avatarImg.height * scale;
        ctx.drawImage(
            avatarImg,
            centerX - drawW / 2,
            avatarY - drawH / 2,
            drawW,
            drawH
        );
        ctx.restore();
    } else {
        const initials = (displayName || "HIMA")
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("");
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 54px Poppins, system-ui, -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(initials || "IF", centerX, avatarY + 4);
    }

    ctx.beginPath();
    ctx.arc(centerX, avatarY, avatarRadius, 0, Math.PI * 2);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.restore();

    // Headline
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 66px Poppins, system-ui, -apple-system, sans-serif";
    ctx.fillText("Kirim pesan", centerX, 765);
    ctx.fillText(isAdmin ? "untuk HIMA-IF!" : "anonim untukku!", centerX, 845);

    // Link Sticker Placeholder Pill
    const pillW = 680;
    const pillH = 128;
    const pillX = (STORY_WIDTH - pillW) / 2;
    const pillY = 935;

    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 12;
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 32);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    // Subtle dashed guide inside white pill
    ctx.save();
    drawRoundedRect(ctx, pillX + 10, pillY + 10, pillW - 20, pillH - 20, 24);
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(44, 47, 145, 0.28)";
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = HIMAIF_PRIMARY;
    ctx.font = "800 34px Poppins, system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🔗  Tempel stiker Link di sini!", centerX, pillY + pillH / 2 + 2);

    // Upward Arrows (↑ ↑ ↑)
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.font = "800 84px Poppins, system-ui, -apple-system, sans-serif";
    ctx.fillText("↑   ↑   ↑", centerX, 1175);

    drawFooterWatermark(ctx, domainLabel);
    return canvasToBlob(canvas);
}

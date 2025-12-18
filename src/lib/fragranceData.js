// src/lib/fragranceData.js

export const fragranceData = {
    "Perfume A": {
        id: 1,
        name: "ÉTERNEL",
        tagline: "The Morning Light",
        description: "Soft, luminous, warm skin and morning light. It's delicate, intimate, and quietly captivating.",
        price: "$145.00",
        volume: "70 ml ℮ / 2.4 fl. oz.",
        story: "A soft veil of musk warmed by creamy woods, Eternel rests close to the skin with quiet confidence. Clean, milky, and serene, it lingers gently, always present. A scent that feels intimate and comforting, as if it has always belonged to you.",
        notes: { top: "Bergamot, Pear Blossom, Almond Milk", heart: "White iris, Jasmine Sambac, Orris Butter", base: "Musk, Vanilla Bean, Cashmere Wood, Tonka" },
        accentColor: "#C5A059",
        image: "/product/etern/etern1.webp",
        resultImage: "/product/etern/nobg-eternal.webp",
        noteImage: "/product/etern/eternasset.webp",
        
        // ADDED VIDEO
        video: "/product/vid/eternvid.mp4",

        hoverImage: "/product/etern/etern2.webp", 
        gallery: [
            "/product/etern/etern1.webp",
            "/product/etern/etern3.webp",
            "/product/etern/etern5.webp",
            "/product/etern/etern4.webp"
        ]
    },
    "Perfume B": {
        id: 2,
        name: "ÉLYSIENNE",
        tagline: "The Graceful Bloom",
        description: "Balanced, elegant, and serene. It's smooth, refined, and a graceful rose scent.",
        price: "$145.00",
        volume: "70 ml ℮ / 2.4 fl. oz.",
        story: "Rose takes on a lighter touch in Elysienne. Fresh, tender, and effortlessly graceful. Subtle sweetness lifts the floral heart, while a smooth musky warmth settles beneath, creating a scent that feels delicate and romantic.",
        notes: { top: "Lychee, Pink Pepper, Raspberry", heart: "Rose de Mai, Peony, Violet", base: "Creamy Sandalwood, Musk, White Amber" },
        accentColor: "#D4AF37",
        image: "/product/elys/elys1.webp",
        resultImage: "/product/elys/nobg-elys.webp",
        noteImage: "/product/elys/elysasset.webp",
        
        // ADDED VIDEO
        video: "/product/vid/elysvid.mp4",

        hoverImage: "/product/elys/elys2.webp", 
        gallery: [
            "/product/elys/elys1.webp",
            "/product/elys/elys3.webp",
            "/product/elys/elys4.webp",
            "/product/elys/elys5.webp"
        ]
    },
    "Perfume C": {
        id: 3,
        name: "NOX",
        tagline: "The Midnight Velvet",
        description: "Deep, velvety nocturnal fragrance. A bold and magnetic presence.",
        price: "$145.00",
        volume: "70 ml ℮ / 2.4 fl. oz.",
        story: "Roses and smokes emerge through a warm, ambered base, creating a scent that feels enveloping and sensual. Deep, lingering, and undeniably alluring.",
        notes: { top: "Blackcurrant, Plum, Pink Grapefruit", heart: "Damask Rose, Jasmine, Patchouli", base: "Amber, Incense, Musk, Vetiver" },
        accentColor: "#8B4513",
        image: "/product/nox/nox1.webp",
        resultImage: "/product/nox/nobg-nox.webp",
        noteImage: "/product/nox/noxasset.webp",
        
        // ADDED VIDEO
        video: "/product/vid/noxvid.mp4",

        hoverImage: "/product/nox/nox2.webp",
        gallery: [
            "/product/nox/nox1.webp",
            "/product/nox/nox3.webp",
            "/product/nox/nox4.webp",
            "/product/nox/nox5.webp"
        ]
    },
    "Discovery Set": {
        id: 4,
        name: "L'ANTHOLOGIE",
        tagline: "The Complete Journey",
        description: "Experience the full spectrum of Maison des Rêves. Three 10ml vials containing Éternel, Élysienne, and Nox.",
        price: "$85.00",
        volume: "3 × 10 ml ℮ / 0.34 fl. oz. each",
        story: "Why choose one when you can experience them all? The Anthology set is curated for the explorer, the dreamer, and the collector.",
        notes: { top: "Variety", heart: "Discovery", base: "Experience" },
        accentColor: "#1c1917",
        image: "/product/disc/disc1.webp",
        resultImage: "/product/disc/disc1.webp", 
        noteImage: "/product/disc/disc1.webp", 
        
        // No video for Discovery Set (will fallback to placeholder in UI)
        video: null, 

        hoverImage: null,
        gallery: [
            "/product/disc/disc1.webp",
            "/product/disc/disc2.webp",
            "/product/disc/disc3.webp",
            "/product/disc/disc4.webp"
        ]
    }
};

export const productList = [
    fragranceData["Perfume A"],
    fragranceData["Perfume B"],
    fragranceData["Perfume C"],
    fragranceData["Discovery Set"]
];
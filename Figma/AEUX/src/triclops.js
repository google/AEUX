export function getPostscript(fontName) {
    let postScriptName = matchPostscript(fontName);

    if (!postScriptName) {        // unable to find the font in the list, revert to format: FontName-Style
        postScriptName = `${fontName.family.replace(/ /g, '')}-${fontName.style.replace(/ /g, '')}`
    }

    return postScriptName;
}


function matchPostscript(fontName) {
    try {
        return fontList[fontName.family][fontName.style]
    } catch (error) {
        return false
    }
}

// function searchFontList(fontName) {
//     let ret = false;
//     for (const familyName in fontList) {
//         // if (Object.hasOwnProperty.call(fontList, familyName)) {
//             const familyObj = fontList[familyName];
//             if (familyName == fontName.family) {        // found the family name in fontList
                
//                 for (const styleName in familyObj) {
//                     // if (Object.hasOwnProperty.call(familyObj, styleName)) {
//                         if (styleName == fontName.style) {
//                             ret = familyObj[styleName]
//                             if (ret) { break }
//                         }
//                     // }
//                 }
//                 if (ret) { break }
//             }
//         // }
//     }
//     return ret
// }

let fontList = {
    "Apple Braille": {
        "Regular": "AppleBraille"
    },
    "Arial Hebrew": {
        "Regular": "ArialHebrew"
    },
    ".Keyboard": {
        "Regular": ".Keyboard"
    },
    ".LastResort": {
        "Regular": "LastResort"
    },
    "Apple Symbols": {
        "Regular": "AppleSymbols"
    },
    "Geeza Pro": {
        "Regular": "GeezaPro"
    },
    "Noto Sans Armenian Blk": {
        "Regular": "NotoSansArmenian-Black"
    },
    "Noto Sans Oriya": {
        "Regular": "NotoSansOriya"
    },
    "Symbol": {
        "Regular": "Symbol"
    },
    "Noto Nastaliq Urdu": {
        "Regular": "NotoNastaliqUrdu"
    },
    "Zapf Dingbats": {
        "Regular": "ZapfDingbatsITC"
    },
    "Noto Sans Kannada Black": {
        "Regular": "NotoSansKannada-Black"
    },
    ".SF Compact Rounded": {
        "Regular": "..SFCompactRounded-Regular"
    },
    "System Font": {
        "Regular Italic": ".SFNS-RegularItalic",
        "Regular": ".SFNS-Regular"
    },
    "Avenir Book": {
        "Regular": "Avenir-Book"
    },
    "MuktaMahee Regular": {
        "Regular": "MuktaMahee-Regular"
    },
    "Times": {
        "Regular": "Times-Roman"
    },
    "Noto Serif Myanmar Blk": {
        "Regular": "NotoSerifMyanmar-Black"
    },
    "Helvetica": {
        "Regular": "Helvetica"
    },
    "Noto Sans Myanmar Blk": {
        "Regular": "NotoSansMyanmar-Black"
    },
    "Palatino": {
        "Regular": "Palatino-Roman"
    },
    "Lucida Grande": {
        "Regular": "LucidaGrande"
    },
    "Thonburi": {
        "Regular": "Thonburi"
    },
    "Helvetica Neue": {
        "Regular": "HelveticaNeue"
    },
    "Hiragino Maru Gothic Pro": {
        "W4": "HiraMaruPro-W4"
    },
    "Heiti TC": {
        "Medium": "STHeitiTC-Medium",
        "Light": "STHeitiTC-Light"
    },
    ".Aqua Kana": {
        "Regular": "AquaKana"
    },
    "Hiragino Mincho ProN": {
        "W3": "HiraMinProN-W3"
    },
    "Apple Color Emoji": {
        "Regular": "AppleColorEmoji"
    },
    "Academy Engraved LET": {
        "Plain": "AcademyEngravedLetPlain"
    },
    "Al Nile": {
        "Regular": "AlNile"
    },
    "Al Tarikh": {
        "Regular": "AlTarikh"
    },
    "Al Bayan": {
        "Plain": "AlBayan"
    },
    "Andale Mono": {
        "Regular": "AndaleMono"
    },
    "Apple Chancery": {
        "Chancery": "Apple-Chancery"
    },
    "Arial Black": {
        "Regular": "Arial-Black"
    },
    "Arial Narrow": {
        "Regular": "ArialNarrow"
    },
    "Arial Rounded MT Bold": {
        "Regular": "ArialRoundedMTBold"
    },
    "Ayuthaya": {
        "Regular": "Ayuthaya"
    },
    "Baghdad": {
        "Regular": "Baghdad"
    },
    "Bangla MN": {
        "Regular": "BanglaMN"
    },
    "Bangla Sangam MN": {
        "Regular": "BanglaSangamMN"
    },
    "Beirut": {
        "Regular": "Beirut"
    },
    "Bodoni 72 Oldstyle": {
        "Book": "BodoniSvtyTwoOSITCTT-Book"
    },
    "Bodoni 72 Smallcaps": {
        "Book": "BodoniSvtyTwoSCITCTT-Book"
    },
    "Bodoni 72": {
        "Book": "BodoniSvtyTwoITCTT-Book"
    },
    "Bodoni Ornaments": {
        "Regular": "BodoniOrnamentsITCTT"
    },
    "Brush Script MT": {
        "Italic": "BrushScriptMT"
    },
    "Chalkboard": {
        "Regular": "Chalkboard"
    },
    "Chalkduster": {
        "Regular": "Chalkduster"
    },
    "Comic Sans MS": {
        "Regular": "ComicSansMS"
    },
    "Corsiva Hebrew": {
        "Regular": "CorsivaHebrew"
    },
    "Courier New": {
        "Bold Oblique": "CourierNewPS-BoldItalicMT",
        "Oblique": "CourierNewPS-ItalicMT",
        "Bold": "CourierNewPS-BoldMT",
        "Regular": "Courier"
    },
    "Courier": {
        "Regular": "Courier"
    },
    "DecoType Naskh": {
        "Regular": "DecoTypeNaskh"
    },
    "Devanagari MT": {
        "Regular": "DevanagariMT"
    },
    "Diwan Kufi": {
        "Regular": "DiwanKufi"
    },
    "Arial": {
        "Bold Italic": "Arial-BoldItalicMT",
        "Bold": "Arial-BoldMT",
        "Italic": "Arial-ItalicMT",
        "Regular": "ArialMT"
    },
    "Farah": {
        "Regular": "Farah"
    },
    "Farisi": {
        "Regular": "Farisi"
    },
    "Galvji": {
        "Regular": "Galvji"
    },
    "Georgia": {
        "Regular": "Georgia"
    },
    "Bradley Hand": {
        "Bold": "BradleyHandITCTT-Bold"
    },
    "Gujarati MT": {
        "Regular": "GujaratiMT"
    },
    "Gurmukhi MN": {
        "Regular": "GurmukhiMN"
    },
    "Gurmukhi Sangam MN": {
        "Regular": "GurmukhiSangamMN"
    },
    "Gurmukhi MT": {
        "Regular": "MonotypeGurmukhi"
    },
    "Herculanum": {
        "Regular": "Herculanum"
    },
    "Devanagari Sangam MN": {
        "Regular": "DevanagariSangamMN"
    },
    "Didot": {
        "Regular": "Didot"
    },
    "Hoefler Text Ornaments": {
        "Ornaments": "HoeflerText-Ornaments"
    },
    "Impact": {
        "Regular": "Impact"
    },
    "InaiMathi": {
        "Regular": "InaiMathi"
    },
    "Kannada MN": {
        "Regular": "KannadaMN"
    },
    "Kannada Sangam MN": {
        "Regular": "KannadaSangamMN"
    },
    "Euphemia UCAS": {
        "Regular": "EuphemiaUCAS"
    },
    "Khmer MN": {
        "Regular": "KhmerMN"
    },
    "Khmer Sangam MN": {
        "Regular": "KhmerSangamMN"
    },
    "Krungthep": {
        "Regular": "Krungthep"
    },
    "KufiStandardGK": {
        "Regular": "KufiStandardGK"
    },
    "Lao MN": {
        "Regular": "LaoMN"
    },
    "Lao Sangam MN": {
        "Regular": "LaoSangamMN"
    },
    "Malayalam MN": {
        "Regular": "MalayalamMN"
    },
    "Malayalam Sangam MN": {
        "Regular": "MalayalamSangamMN"
    },
    "Mshtakan": {
        "Regular": "Mshtakan"
    },
    "Muna": {
        "Regular": "Muna"
    },
    "Myanmar MN": {
        "Regular": "MyanmarMN"
    },
    "Myanmar Sangam MN": {
        "Regular": "MyanmarSangamMN"
    },
    "Nadeem": {
        "Regular": "Nadeem"
    },
    "New Peninim MT": {
        "Regular": "NewPeninimMT"
    },
    "Baskerville": {
        "Regular": "Baskerville"
    },
    "Noto Sans CaucAlban": {
        "Regular": "NotoSansCaucasianAlbanian-Regular"
    },
    "Cochin": {
        "Regular": "Cochin"
    },
    "Gujarati Sangam MN": {
        "Regular": "GujaratiSangamMN"
    },
    "Copperplate": {
        "Regular": "Copperplate"
    },
    "Noto Sans HanifiRohg": {
        "Regular": "NotoSansHanifiRohingya-Regular"
    },
    "Diwan Thuluth": {
        "Regular": "DiwanThuluth"
    },
    "Kokonor": {
        "Regular": "Kokonor"
    },
    "Noto Sans ImpAramaic": {
        "Regular": "NotoSansImperialAramaic-Regular"
    },
    "Noto Sans InsPahlavi": {
        "Regular": "NotoSansInscriptionalPahlavi-Regular"
    },
    "Microsoft Sans Serif": {
        "Regular": "MicrosoftSansSerif"
    },
    "Mishafi Gold": {
        "Regular": "DiwanMishafiGold"
    },
    "Noto Sans InsParthi": {
        "Regular": "NotoSansInscriptionalParthian-Regular"
    },
    "Gill Sans": {
        "Regular": "GillSans"
    },
    "Noto Sans EgyptHiero": {
        "Regular": "NotoSansEgyptianHieroglyphs-Regular"
    },
    "Noto Sans Mongolian": {
        "Regular": "NotoSansMongolian"
    },
    "Kailasa": {
        "Regular": "Kailasa"
    },
    "Noto Sans N'Ko": {
        "Regular": "NotoSansNKo-Regular"
    },
    "American Typewriter": {
        "Regular": "AmericanTypewriter"
    },
    "Noto Sans OldHung": {
        "Regular": "NotoSansOldHungarian-Regular"
    },
    "Noto Sans OldNorArab": {
        "Regular": "NotoSansOldNorthArabian-Regular"
    },
    "Mishafi": {
        "Regular": "DiwanMishafi"
    },
    "Noto Sans OldSouArab": {
        "Regular": "NotoSansOldSouthArabian-Regular"
    },
    "Noto Sans PsaPahlavi": {
        "Regular": "NotoSansPsalterPahlavi-Regular"
    },
    "Noto Sans SoraSomp": {
        "Regular": "NotoSansSoraSompeng-Regular"
    },
    "Noto Sans Tai Tham": {
        "Regular": "NotoSansTaiTham"
    },
    "Oriya MN": {
        "Regular": "OriyaMN"
    },
    "Oriya Sangam MN": {
        "Regular": "OriyaSangamMN"
    },
    "Party LET": {
        "Plain": "PartyLetPlain"
    },
    "Plantagenet Cherokee": {
        "Regular": "PlantagenetCherokee"
    },
    "Raanana": {
        "Regular": "Raanana"
    },
    "Sana": {
        "Regular": "Sana"
    },
    "Sathu": {
        "Regular": "Sathu"
    },
    "Savoye LET": {
        "Plain": "SavoyeLetPlain"
    },
    "SignPainter-HouseScript": {
        "Regular": "SignPainter-HouseScript"
    },
    "Silom": {
        "Regular": "Silom"
    },
    "Damascus": {
        "Regular": "Damascus"
    },
    "PT Serif Caption": {
        "Regular": "PTSerif-Caption"
    },
    "Tamil MN": {
        "Regular": "TamilMN"
    },
    "Tamil Sangam MN": {
        "Regular": "TamilSangamMN"
    },
    "Telugu MN": {
        "Regular": "TeluguMN"
    },
    "Telugu Sangam MN": {
        "Regular": "TeluguSangamMN"
    },
    "Trebuchet MS": {
        "Bold Italic": "Trebuchet-BoldItalic",
        "Regular": "TrebuchetMS"
    },
    "Verdana": {
        "Regular": "Verdana"
    },
    "Shree Devanagari 714": {
        "Regular": "ShreeDev0714"
    },
    "Sinhala MN": {
        "Regular": "SinhalaMN"
    },
    "Sinhala Sangam MN": {
        "Regular": "SinhalaSangamMN"
    },
    "Waseem": {
        "Regular": "Waseem"
    },
    "Webdings": {
        "Regular": "Webdings"
    },
    "Wingdings 2": {
        "Regular": "Wingdings2"
    },
    "Wingdings 3": {
        "Regular": "Wingdings3"
    },
    "Zapfino": {
        "Regular": "Zapfino"
    },
    "Tahoma": {
        "Regular": "Tahoma"
    },
    "Times New Roman": {
        "Bold Italic": "TimesNewRomanPS-BoldItalicMT",
        "Italic": "TimesNewRomanPS-ItalicMT",
        "Bold": "TimesNewRomanPS-BoldMT",
        "Regular": "TimesNewRomanPSMT"
    },
    "Trattatello": {
        "Regular": "Trattatello"
    },
    "Snell Roundhand": {
        "Regular": "SnellRoundhand"
    },
    "GB18030 Bitmap": {
        "Regular": "GB18030Bitmap"
    },
    "Seravek": {
        "Regular": "Seravek"
    },
    "AppleGothic": {
        "Regular": "AppleGothic"
    },
    "Songti SC": {
        "Black": "STSongti-SC-Black"
    },
    "AppleMyungjo": {
        "Regular": "AppleMyungjo"
    },
    "Arial Unicode MS": {
        "Regular": "ArialUnicodeMS"
    }
}
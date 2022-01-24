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
    },

    ///// Google fonts Jan 2022
    "Alumni Sans Thin": {
        "Italic": "AlumniSans-ThinItalic",
        "Regular": "AlumniSans-Thin"
    },
    "AmstelvarAlpha Default": {
        "Regular": "AmstelvarAlpha-Default"
    },
    "Archivo SemiBold": {
        "Italic": "Archivo-SemiBoldItalic",
        "Regular": "Archivo-SemiBold"
    },
    "Arvo": {
        "Regular": "Arvo"
    },
    "Assistant ExtraLight": {
        "Regular": "Assistant-ExtraLight"
    },
    "Azeret Mono Thin": {
        "Italic": "AzeretMono-ThinItalic",
        "Regular": "AzeretMono-Thin"
    },
    "Battambang Black": {
        "Regular": "Battambang-Black"
    },
    "Battambang Light": {
        "Regular": "Battambang-Light"
    },
    "Battambang Thin": {
        "Regular": "Battambang-Thin"
    },
    "Be Vietnam ExtraBold": {
        "Regular": "BeVietnam-ExtraBold",
        "Italic": "BeVietnam-ExtraBoldItalic"
    },
    "Be Vietnam Light": {
        "Regular": "BeVietnam-Light",
        "Italic": "BeVietnam-LightItalic"
    },
    "Be Vietnam Medium": {
        "Regular": "BeVietnam-Medium",
        "Italic": "BeVietnam-MediumItalic"
    },
    "Be Vietnam SemiBold": {
        "Regular": "BeVietnam-SemiBold",
        "Italic": "BeVietnam-SemiBoldItalic"
    },
    "Be Vietnam Thin": {
        "Regular": "BeVietnam-Thin",
        "Italic": "BeVietnam-ThinItalic"
    },
    "Be Vietnam Pro Black": {
        "Regular": "BeVietnamPro-Black",
        "Italic": "BeVietnamPro-BlackItalic"
    },
    "Be Vietnam Pro ExtraBold": {
        "Regular": "BeVietnamPro-ExtraBold",
        "Italic": "BeVietnamPro-ExtraBoldItalic"
    },
    "Be Vietnam Pro ExtraLight": {
        "Regular": "BeVietnamPro-ExtraLight",
        "Italic": "BeVietnamPro-ExtraLightItalic"
    },
    "Be Vietnam Pro Light": {
        "Regular": "BeVietnamPro-Light",
        "Italic": "BeVietnamPro-LightItalic"
    },
    "Be Vietnam Pro Medium": {
        "Regular": "BeVietnamPro-Medium",
        "Italic": "BeVietnamPro-MediumItalic"
    },
    "Be Vietnam Pro SemiBold": {
        "Regular": "BeVietnamPro-SemiBold",
        "Italic": "BeVietnamPro-SemiBoldItalic"
    },
    "Be Vietnam Pro Thin": {
        "Regular": "BeVietnamPro-Thin",
        "Italic": "BeVietnamPro-ThinItalic"
    },
    "Big Shoulders Display Thin": {
        "Regular": "BigShouldersDisplay-Thin"
    },
    "Big Shoulders Inline Display Thin": {
        "Regular": "BigShouldersInlineDisplay-Thin"
    },
    "Big Shoulders Inline Text Thin": {
        "Regular": "BigShouldersInlineText-Thin"
    },
    "Big Shoulders Stencil Display Thin": {
        "Regular": "BigShouldersStencilDisplay-Thin"
    },
    "Big Shoulders Stencil Text Thin": {
        "Regular": "BigShouldersStencilText-Thin"
    },
    "Big Shoulders Text Thin": {
        "Regular": "BigShouldersText-Thin"
    },
    "Birthstone Bounce Medium": {
        "Regular": "BirthstoneBounce-Medium"
    },
    "Bitter Thin": {
        "Italic": "Bitter-ThinItalic",
        "Regular": "Bitter-Thin"
    },
    "Blinker Black": {
        "Regular": "Blinker-Black"
    },
    "Blinker ExtraBold": {
        "Regular": "Blinker-ExtraBold"
    },
    "Blinker ExtraLight": {
        "Regular": "Blinker-ExtraLight"
    },
    "Blinker Light": {
        "Regular": "Blinker-Light"
    },
    "Blinker SemiBold": {
        "Regular": "Blinker-SemiBold"
    },
    "Blinker Thin": {
        "Regular": "Blinker-Thin"
    },
    "BM HANNA": {
        "Regular": "BMHANNA"
    },
    "Bungee Color Regular": {
        "Regular": "BungeeColor-Regular"
    },
    "Candal": {
        "Regular": "Candal"
    },
    "Carme": {
        "Regular": "Carme"
    },
    "Carter One": {
        "Regular": "CarterOne"
    },
    "Catamaran Thin": {
        "Regular": "Catamaran-Thin"
    },
    "Caudex": {
        "Regular": "Caudex"
    },
    "Cedarville Cursive": {
        "Regular": "Cedarville-Cursive"
    },
    "Changa One": {
        "Regular": "ChangaOne"
    },
    "Chenla": {
        "Regular": "Chenla"
    },
    "Codystar": {
        "Regular": "Codystar"
    },
    "Commissioner Thin": {
        "Regular": "Commissioner-Thin"
    },
    "Content": {
        "Regular": "Content"
    },
    "Copse": {
        "Regular": "Copse"
    },
    "Covered By Your Grace": {
        "Regular": "CoveredByYourGrace"
    },
    "Damion": {
        "Regular": "Damion"
    },
    "Darker Grotesque Black": {
        "Regular": "DarkerGrotesque-Black"
    },
    "Darker Grotesque ExtraBold": {
        "Regular": "DarkerGrotesque-ExtraBold"
    },
    "Darker Grotesque Light": {
        "Regular": "DarkerGrotesque-Light"
    },
    "Darker Grotesque Medium": {
        "Regular": "DarkerGrotesque-Medium"
    },
    "Darker Grotesque SemiBold": {
        "Regular": "DarkerGrotesque-SemiBold"
    },
    "David Libre Medium": {
        "Regular": "DavidLibre-Medium"
    },
    "Dawning of a New Day": {
        "Regular": "DawningofaNewDay"
    },
    "Decovar Alpha Regular24": {
        "Regular": "DecovarAlpha-Regular24"
    },
    "Dekko": {
        "Regular": "Dekko"
    },
    "Dhurjati": {
        "Regular": "Dhurjati"
    },
    "DM Mono Light": {
        "Regular": "DMMono-Light",
        "Italic": "DMMono-LightItalic"
    },
    "DM Mono Medium": {
        "Regular": "DMMono-Medium",
        "Italic": "DMMono-MediumItalic"
    },
    "DM Sans Medium": {
        "Regular": "DMSans-Medium",
        "Italic": "DMSans-MediumItalic"
    },
    "Encode Sans Condensed Thin": {
        "Regular": "EncodeSans-CondensedThin"
    },
    "Encode Sans SC Condensed Thin": {
        "Regular": "EncodeSansSC-CondensedThin"
    },
    "Esteban": {
        "Regular": "Esteban"
    },
    "Dongle Light": {
        "Regular": "Dongle-Light"
    },
    "Fauna One": {
        "Regular": "FaunaOne"
    },
    "Faustina Light": {
        "Italic": "Faustina-LightItalic",
        "Regular": "Faustina-Light"
    },
    "Fenix": {
        "Regular": "Fenix"
    },
    "Fira Code Light": {
        "Regular": "FiraCode-Light"
    },
    "Forum": {
        "Regular": "Forum"
    },
    "Fraunces": {
        "Italic": "Fraunces-9ptBlackItalic",
        "Regular": "Fraunces-9ptBlack"
    },
    "Fredoka Light": {
        "Regular": "Fredoka-Light"
    },
    "Frijole": {
        "Regular": "Frijole"
    },
    "Gayathri Thin": {
        "Regular": "Gayathri-Thin"
    },
    "Gemunu Libre ExtraLight": {
        "Regular": "GemunuLibre-ExtraLight"
    },
    "Gentium Basic": {
        "Regular": "GentiumBasic"
    },
    "Gentium Book Basic": {
        "Regular": "GentiumBookBasic"
    },
    "Genos Thin": {
        "Italic": "Genos-ThinItalic",
        "Regular": "Genos-Thin"
    },
    "Georama ExtraCondensed Thin": {
        "Italic": "GeoramaItalic-ExtraCondensedThinItalic",
        "Regular": "GeoramaRoman-ExtraCondensedThin"
    },
    "Gidugu": {
        "Regular": "Gidugu"
    },
    "Give You Glory": {
        "Regular": "GiveYouGlory"
    },
    "Gloria Hallelujah": {
        "Regular": "GloriaHallelujah"
    },
    "Glory Thin": {
        "Italic": "Glory-ThinItalic",
        "Regular": "Glory-Thin"
    },
    "Gluten Thin": {
        "Regular": "Gluten-Thin"
    },
    "Goblin One": {
        "Regular": "GoblinOne"
    },
    "Goudy Bookletter 1911": {
        "Regular": "GoudyBookletter1911"
    },
    "Grandstander Thin": {
        "Italic": "Grandstander-ThinItalic",
        "Regular": "Grandstander-Thin"
    },
    "Gravitas One": {
        "Regular": "GravitasOne"
    },
    "Gruppo": {
        "Regular": "Gruppo"
    },
    "Gudea": {
        "Regular": "Gudea"
    },
    "Gurajada": {
        "Regular": "Gurajada"
    },
    "Hanuman Black": {
        "Regular": "Hanuman-Black"
    },
    "Hanuman Light": {
        "Regular": "Hanuman-Light"
    },
    "Hanuman Thin": {
        "Regular": "Hanuman-Thin"
    },
    "Hepta Slab ExtraLight": {
        "Regular": "HeptaSlab-ExtraLight"
    },
    "Hind Colombo Light": {
        "Regular": "HindColombo-Light"
    },
    "Hind Colombo Medium": {
        "Regular": "HindColombo-Medium"
    },
    "Hind Colombo SemiBold": {
        "Regular": "HindColombo-SemiBold"
    },
    "Hind Jalandhar Light": {
        "Regular": "HindJalandhar-Light"
    },
    "Hind Jalandhar Medium": {
        "Regular": "HindJalandhar-Medium"
    },
    "Hind Jalandhar SemiBold": {
        "Regular": "HindJalandhar-SemiBold"
    },
    "Hind Kochi Light": {
        "Regular": "HindKochi-Light"
    },
    "Hind Kochi Medium": {
        "Regular": "HindKochi-Medium"
    },
    "Hind Kochi SemiBold": {
        "Regular": "HindKochi-SemiBold"
    },
    "Hind Mysuru Light": {
        "Regular": "HindMysuru-Light"
    },
    "Hind Mysuru Medium": {
        "Regular": "HindMysuru-Medium"
    },
    "Hind Mysuru SemiBold": {
        "Regular": "HindMysuru-SemiBold"
    },
    "Holtwood One SC": {
        "Regular": "HoltwoodOneSC"
    },
    "IBM Plex Mono ExtraLight": {
        "Regular": "IBMPlexMono-ExtraLight",
        "Italic": "IBMPlexMono-ExtraLightItalic"
    },
    "IBM Plex Mono Light": {
        "Regular": "IBMPlexMono-Light",
        "Italic": "IBMPlexMono-LightItalic"
    },
    "IBM Plex Mono Medium": {
        "Regular": "IBMPlexMono-Medium",
        "Italic": "IBMPlexMono-MediumItalic"
    },
    "IBM Plex Mono SemiBold": {
        "Regular": "IBMPlexMono-SemiBold",
        "Italic": "IBMPlexMono-SemiBoldItalic"
    },
    "IBM Plex Mono Thin": {
        "Regular": "IBMPlexMono-Thin",
        "Italic": "IBMPlexMono-ThinItalic"
    },
    "IBM Plex Sans ExtraLight": {
        "Regular": "IBMPlexSans-ExtraLight",
        "Italic": "IBMPlexSans-ExtraLightItalic"
    },
    "IBM Plex Sans Light": {
        "Regular": "IBMPlexSans-Light",
        "Italic": "IBMPlexSans-LightItalic"
    },
    "IBM Plex Sans Medium": {
        "Regular": "IBMPlexSans-Medium",
        "Italic": "IBMPlexSans-MediumItalic"
    },
    "IBM Plex Sans SemiBold": {
        "Regular": "IBMPlexSans-SemiBold",
        "Italic": "IBMPlexSans-SemiBoldItalic"
    },
    "IBM Plex Sans Thin": {
        "Regular": "IBMPlexSans-Thin",
        "Italic": "IBMPlexSans-ThinItalic"
    },
    "IBM Plex Sans Arabic ExtraLight": {
        "Regular": "IBMPlexSansArabic-ExtraLight"
    },
    "IBM Plex Sans Arabic Light": {
        "Regular": "IBMPlexSansArabic-Light"
    },
    "IBM Plex Sans Arabic Medium": {
        "Regular": "IBMPlexSansArabic-Medium"
    },
    "IBM Plex Sans Arabic SemiBold": {
        "Regular": "IBMPlexSansArabic-SemiBold"
    },
    "IBM Plex Sans Arabic Thin": {
        "Regular": "IBMPlexSansArabic-Thin"
    },
    "IBM Plex Sans Condensed": {
        "Bold": "IBMPlexSansCond-Bold",
        "Bold Italic": "IBMPlexSansCond-BoldItalic",
            "Italic": "IBMPlexSansCond-Italic",
                "Regular": "IBMPlexSansCond-Regular"
    },
    "IBM Plex Sans Condensed ExtraLight": {
        "Regular": "IBMPlexSansCond-ExtraLight",
        "Italic": "IBMPlexSansCond-ExtraLightItalic"
    },
    "IBM Plex Sans Condensed Light": {
        "Regular": "IBMPlexSansCond-Light",
        "Italic": "IBMPlexSansCond-LightItalic"
    },
    "IBM Plex Sans Condensed Medium": {
        "Regular": "IBMPlexSansCond-Medium",
        "Italic": "IBMPlexSansCond-MediumItalic"
    },
    "IBM Plex Sans Condensed SemiBold": {
        "Regular": "IBMPlexSansCond-SemiBold",
        "Italic": "IBMPlexSansCond-SemiBoldItalic"
    },
    "IBM Plex Sans Condensed Thin": {
        "Regular": "IBMPlexSansCond-Thin",
        "Italic": "IBMPlexSansCond-ThinItalic"
    },
    "IBM Plex Sans Devanagari ExtraLight": {
        "Regular": "IBMPlexSansDevanagari-ExtraLight"
    },
    "IBM Plex Sans Devanagari Light": {
        "Regular": "IBMPlexSansDevanagari-Light"
    },
    "IBM Plex Sans Devanagari Medium": {
        "Regular": "IBMPlexSansDevanagari-Medium"
    },
    "IBM Plex Sans Devanagari SemiBold": {
        "Regular": "IBMPlexSansDevanagari-SemiBold"
    },
    "IBM Plex Sans Devanagari Thin": {
        "Regular": "IBMPlexSansDevanagari-Thin"
    },
    "IBM Plex Sans Hebrew ExtraLight": {
        "Regular": "IBMPlexSansHebrew-ExtraLight"
    },
    "IBM Plex Sans Hebrew Light": {
        "Regular": "IBMPlexSansHebrew-Light"
    },
    "IBM Plex Sans Hebrew Medium": {
        "Regular": "IBMPlexSansHebrew-Medium"
    },
    "IBM Plex Sans Hebrew SemiBold": {
        "Regular": "IBMPlexSansHebrew-SemiBold"
    },
    "IBM Plex Sans Hebrew Thin": {
        "Regular": "IBMPlexSansHebrew-Thin"
    },
    "IBM Plex Sans Thai ExtraLight": {
        "Regular": "IBMPlexSansThai-ExtraLight"
    },
    "IBM Plex Sans Thai Light": {
        "Regular": "IBMPlexSansThai-Light"
    },
    "IBM Plex Sans Thai Medium": {
        "Regular": "IBMPlexSansThai-Medium"
    },
    "IBM Plex Sans Thai SemiBold": {
        "Regular": "IBMPlexSansThai-SemiBold"
    },
    "IBM Plex Sans Thai Thin": {
        "Regular": "IBMPlexSansThai-Thin"
    },
    "IBM Plex Sans Thai Looped ExtraLight": {
        "Regular": "IBMPlexSansThaiLooped-ExtraLight"
    },
    "IBM Plex Sans Thai Looped Light": {
        "Regular": "IBMPlexSansThaiLooped-Light"
    },
    "IBM Plex Sans Thai Looped Medium": {
        "Regular": "IBMPlexSansThaiLooped-Medium"
    },
    "IBM Plex Sans Thai Looped SemiBold": {
        "Regular": "IBMPlexSansThaiLooped-SemiBold"
    },
    "IBM Plex Sans Thai Looped Thin": {
        "Regular": "IBMPlexSansThaiLooped-Thin"
    },
    "IBM Plex Serif ExtraLight": {
        "Regular": "IBMPlexSerif-ExtraLight",
        "Italic": "IBMPlexSerif-ExtraLightItalic"
    },
    "IBM Plex Serif Light": {
        "Regular": "IBMPlexSerif-Light",
        "Italic": "IBMPlexSerif-LightItalic"
    },
    "IBM Plex Serif Medium": {
        "Regular": "IBMPlexSerif-Medium",
        "Italic": "IBMPlexSerif-MediumItalic"
    },
    "IBM Plex Serif SemiBold": {
        "Regular": "IBMPlexSerif-SemiBold",
        "Italic": "IBMPlexSerif-SemiBoldItalic"
    },
    "IBM Plex Serif Thin": {
        "Regular": "IBMPlexSerif-Thin",
        "Italic": "IBMPlexSerif-ThinItalic"
    },
    "Imbue Thin": {
        "Regular": "Imbue-Thin"
    },
    "IM FELL Double Pica SC": {
        "Regular": "IM_FELL_Double_Pica_SC"
    },
    "IM FELL English": {
        "Italic": "IM_FELL_English_Italic",
        "Regular": "IM_FELL_English_Roman"
    },
    "IM FELL English SC": {
        "Regular": "IM_FELL_English_SC"
    },
    "IM FELL French Canon": {
        "Italic": "IM_FELL_French_Canon_Italic",
        "Regular": "IM_FELL_French_Canon_Roman"
    },
    "IM FELL French Canon SC": {
        "Regular": "IM_FELL_French_Canon_SC"
    },
    "IM FELL Great Primer": {
        "Italic": "IM_FELL_Great_Primer_Italic",
        "Regular": "IM_FELL_Great_Primer_Roman"
    },
    "IM FELL Great Primer SC": {
        "Regular": "IM_FELL_Great_Primer_SC"
    },
    "IM FELL Double Pica": {
        "Italic": "IM_FELL_Double_Pica_Italic",
        "Regular": "IM_FELL_Double_Pica_Roman"
    },
    "IM FELL DW Pica": {
        "Italic": "IM_FELL_DW_Pica_Italic",
        "Regular": "IM_FELL_DW_Pica_Roman"
    },
    "IM FELL DW Pica SC": {
        "Regular": "IM_FELL_DW_Pica_SC"
    },
    "Inconsolata Black": {
        "Regular": "Inconsolata-Black"
    },
    "Inconsolata Bold": {
        "Regular": "Inconsolata-Bold"
    },
    "Inconsolata Condensed": {
        "Regular": "Inconsolata-CondensedRegular"
    },
    "Inconsolata Condensed Black": {
        "Regular": "Inconsolata-CondensedBlack"
    },
    "Inconsolata Condensed Bold": {
        "Regular": "Inconsolata-CondensedBold"
    },
    "Inconsolata Condensed ExtraBold": {
        "Regular": "Inconsolata-CondensedExtraBold"
    },
    "Inconsolata Condensed ExtraLight": {
        "Regular": "Inconsolata-CondensedExtraLight"
    },
    "Inconsolata Condensed Light": {
        "Regular": "Inconsolata-CondensedLight"
    },
    "Inconsolata Condensed Medium": {
        "Regular": "Inconsolata-CondensedMedium"
    },
    "Inconsolata Condensed SemiBold": {
        "Regular": "Inconsolata-CondensedSemiBold"
    },
    "Inconsolata Expanded": {
        "Regular": "Inconsolata-ExpandedRegular"
    },
    "Inconsolata Expanded Black": {
        "Regular": "Inconsolata-ExpandedBlack"
    },
    "Inconsolata Expanded Bold": {
        "Regular": "Inconsolata-ExpandedBold"
    },
    "Inconsolata Expanded ExtraBold": {
        "Regular": "Inconsolata-ExpandedExtraBold"
    },
    "Inconsolata Expanded ExtraLight": {
        "Regular": "Inconsolata-ExpandedExtraLight"
    },
    "Inconsolata Expanded Light": {
        "Regular": "Inconsolata-ExpandedLight"
    },
    "Inconsolata Expanded Medium": {
        "Regular": "Inconsolata-ExpandedMedium"
    },
    "Inconsolata Expanded SemiBold": {
        "Regular": "Inconsolata-ExpandedSemiBold"
    },
    "Inconsolata ExtraBold": {
        "Regular": "Inconsolata-ExtraBold"
    },
    "Inconsolata ExtraCondensed": {
        "Regular": "Inconsolata-ExtraCondensedRegular"
    },
    "Inconsolata ExtraCondensed Black": {
        "Regular": "Inconsolata-ExtraCondensedBlack"
    },
    "Inconsolata ExtraCondensed Bold": {
        "Regular": "Inconsolata-ExtraCondensedBold"
    },
    "Inconsolata ExtraCondensed ExtraBold": {
        "Regular": "Inconsolata-ExtraCondensedExtraBold"
    },
    "Inconsolata ExtraCondensed ExtraLight": {
        "Regular": "Inconsolata-ExtraCondensedExtraLight"
    },
    "IBM Plex Sans KR ExtraLight": {
        "Regular": "IBMPlexSansKR-ExtraLight"
    },
    "IBM Plex Sans KR Light": {
        "Regular": "IBMPlexSansKR-Light"
    },
    "Inconsolata ExtraCondensed Light": {
        "Regular": "Inconsolata-ExtraCondensedLight"
    },
    "IBM Plex Sans KR Medium": {
        "Regular": "IBMPlexSansKR-Medium"
    },
    "Inconsolata ExtraCondensed Medium": {
        "Regular": "Inconsolata-ExtraCondensedMedium"
    },
    "IBM Plex Sans KR SemiBold": {
        "Regular": "IBMPlexSansKR-SemiBold"
    },
    "Inconsolata ExtraCondensed SemiBold": {
        "Regular": "Inconsolata-ExtraCondensedSemiBold"
    },
    "IBM Plex Sans KR Thin": {
        "Regular": "IBMPlexSansKR-Thin"
    },
    "Inconsolata ExtraExpanded": {
        "Regular": "Inconsolata-ExtraExpandedRegular"
    },
    "Inconsolata ExtraExpanded Black": {
        "Regular": "Inconsolata-ExtraExpandedBlack"
    },
    "Inconsolata ExtraExpanded Bold": {
        "Regular": "Inconsolata-ExtraExpandedBold"
    },
    "Inconsolata ExtraExpanded ExtraBold": {
        "Regular": "Inconsolata-ExtraExpandedExtraBold"
    },
    "Inconsolata ExtraExpanded ExtraLight": {
        "Regular": "Inconsolata-ExtraExpandedExtraLight"
    },
    "Inconsolata ExtraExpanded Light": {
        "Regular": "Inconsolata-ExtraExpandedLight"
    },
    "Inconsolata ExtraExpanded Medium": {
        "Regular": "Inconsolata-ExtraExpandedMedium"
    },
    "Inconsolata ExtraExpanded SemiBold": {
        "Regular": "Inconsolata-ExtraExpandedSemiBold"
    },
    "Inconsolata ExtraLight": {
        "Regular": "Inconsolata-ExtraLight"
    },
    "Inconsolata Light": {
        "Regular": "Inconsolata-Light"
    },
    "Inconsolata Medium": {
        "Regular": "Inconsolata-Medium"
    },
    "Inconsolata SemiBold": {
        "Regular": "Inconsolata-SemiBold"
    },
    "Inconsolata SemiCondensed": {
        "Regular": "Inconsolata-SemiCondensedRegular"
    },
    "Inconsolata SemiCondensed Black": {
        "Regular": "Inconsolata-SemiCondensedBlack"
    },
    "Inconsolata SemiCondensed Bold": {
        "Regular": "Inconsolata-SemiCondensedBold"
    },
    "Inconsolata SemiCondensed ExtraBold": {
        "Regular": "Inconsolata-SemiCondensedExtraBold"
    },
    "Inconsolata SemiCondensed ExtraLight": {
        "Regular": "Inconsolata-SemiCondensedExtraLight"
    },
    "Inconsolata SemiCondensed Light": {
        "Regular": "Inconsolata-SemiCondensedLight"
    },
    "Inconsolata SemiCondensed Medium": {
        "Regular": "Inconsolata-SemiCondensedMedium"
    },
    "Inconsolata SemiCondensed SemiBold": {
        "Regular": "Inconsolata-SemiCondensedSemiBold"
    },
    "Inconsolata SemiExpanded": {
        "Regular": "Inconsolata-SemiExpandedRegular"
    },
    "Inconsolata SemiExpanded Black": {
        "Regular": "Inconsolata-SemiExpandedBlack"
    },
    "Inconsolata SemiExpanded Bold": {
        "Regular": "Inconsolata-SemiExpandedBold"
    },
    "Inconsolata SemiExpanded ExtraBold": {
        "Regular": "Inconsolata-SemiExpandedExtraBold"
    },
    "Inconsolata SemiExpanded ExtraLight": {
        "Regular": "Inconsolata-SemiExpandedExtraLight"
    },
    "Inconsolata SemiExpanded Light": {
        "Regular": "Inconsolata-SemiExpandedLight"
    },
    "Inconsolata SemiExpanded Medium": {
        "Regular": "Inconsolata-SemiExpandedMedium"
    },
    "Inconsolata SemiExpanded SemiBold": {
        "Regular": "Inconsolata-SemiExpandedSemiBold"
    },
    "Inconsolata UltraCondensed": {
        "Regular": "Inconsolata-UltraCondensedRegular"
    },
    "Inconsolata UltraCondensed Black": {
        "Regular": "Inconsolata-UltraCondensedBlack"
    },
    "Inconsolata UltraCondensed Bold": {
        "Regular": "Inconsolata-UltraCondensedBold"
    },
    "Inconsolata UltraCondensed ExtraBold": {
        "Regular": "Inconsolata-UltraCondensedExtraBold"
    },
    "Inconsolata UltraCondensed ExtraLight": {
        "Regular": "Inconsolata-UltraCondensedExtraLight"
    },
    "Inconsolata UltraCondensed Light": {
        "Regular": "Inconsolata-UltraCondensedLight"
    },
    "Inconsolata UltraCondensed Medium": {
        "Regular": "Inconsolata-UltraCondensedMedium"
    },
    "Inconsolata UltraCondensed SemiBold": {
        "Regular": "Inconsolata-UltraCondensedSemiBold"
    },
    "Inconsolata UltraExpanded": {
        "Regular": "Inconsolata-UltraExpandedRegular"
    },
    "Inconsolata UltraExpanded Black": {
        "Regular": "Inconsolata-UltraExpandedBlack"
    },
    "Inconsolata UltraExpanded Bold": {
        "Regular": "Inconsolata-UltraExpandedBold"
    },
    "Inconsolata UltraExpanded ExtraBold": {
        "Regular": "Inconsolata-UltraExpandedExtraBold"
    },
    "Inconsolata UltraExpanded ExtraLight": {
        "Regular": "Inconsolata-UltraExpandedExtraLight"
    },
    "Inconsolata UltraExpanded Light": {
        "Regular": "Inconsolata-UltraExpandedLight"
    },
    "Inconsolata UltraExpanded Medium": {
        "Regular": "Inconsolata-UltraExpandedMedium"
    },
    "Inconsolata UltraExpanded SemiBold": {
        "Regular": "Inconsolata-UltraExpandedSemiBold"
    },
    "Inika": {
        "Regular": "Inika"
    },
    "Inria Sans Light": {
        "Regular": "InriaSans-Light",
        "Italic": "InriaSans-LightItalic"
    },
    "Inria Serif Light": {
        "Regular": "InriaSerif-Light",
        "Italic": "InriaSerif-LightItalic"
    },
    "Jolly Lodger": {
        "Regular": "JollyLodger"
    },
    "Josefin Sans Thin": {
        "Italic": "JosefinSans-ThinItalic",
        "Regular": "JosefinSans-Thin"
    },
    "Josefin Slab Thin": {
        "Italic": "JosefinSlab-ThinItalic",
        "Regular": "JosefinSlab-Thin"
    },
    "jsMath-cmbx10": {
        "cmbx10": "jsMath-cmbx10"
    },
    "jsMath-cmex10": {
        "cmex10": "jsMath-cmex10"
    },
    "jsMath-cmmi10": {
        "cmmi10": "jsMath-cmmi10"
    },
    "jsMath-cmr10": {
        "cmr10": "jsMath-cmr10"
    },
    "jsMath-cmsy10": {
        "cmsy10": "jsMath-cmsy10"
    },
    "jsMath-cmti10": {
        "cmti10": "jsMath-cmti10"
    },
    "JejuGothic": {
        "Regular": "JejuGothic"
    },
    "Jura Light": {
        "Regular": "Jura-Light"
    },
    "Just Me Again Down Here": {
        "Regular": "JustMeAgainDownHere"
    },
    "Kalam Light": {
        "Regular": "Kalam-Light"
    },
    "Kameron": {
        "Regular": "Kameron"
    },
    "Kanit Black": {
        "Regular": "Kanit-Black",
        "Italic": "Kanit-BlackItalic"
    },
    "Kanit ExtraBold": {
        "Regular": "Kanit-ExtraBold",
        "Italic": "Kanit-ExtraBoldItalic"
    },
    "Kanit ExtraLight": {
        "Regular": "Kanit-ExtraLight",
        "Italic": "Kanit-ExtraLightItalic"
    },
    "Kanit Light": {
        "Regular": "Kanit-Light",
        "Italic": "Kanit-LightItalic"
    },
    "Kanit Medium": {
        "Regular": "Kanit-Medium",
        "Italic": "Kanit-MediumItalic"
    },
    "Kanit SemiBold": {
        "Regular": "Kanit-SemiBold",
        "Italic": "Kanit-SemiBoldItalic"
    },
    "Kanit Thin": {
        "Regular": "Kanit-Thin",
        "Italic": "Kanit-ThinItalic"
    },
    "Karantina Light": {
        "Regular": "Karantina-Light"
    },
    "Kdam Thmor": {
        "Regular": "KdamThmor"
    },
    "Khmer": {
        "Regular": "Khmer"
    },
    "JejuHallasan": {
        "Regular": "JejuHallasan"
    },
    "Myanmar Khyay": {
        "Regular": "MyanmarKhyay"
    },
    "Kaisei Decol Medium": {
        "Regular": "KaiseiDecol-Medium"
    },
    "Kaisei HarunoUmi Medium": {
        "Regular": "KaiseiHarunoUmi-Medium"
    },
    "Kaisei Opti Medium": {
        "Regular": "KaiseiOpti-Medium"
    },
    "Kaisei Tokumin ExtraBold": {
        "Regular": "KaiseiTokumin-ExtraBold"
    },
    "Kaisei Tokumin Medium": {
        "Regular": "KaiseiTokumin-Medium"
    },
    "Koh Santepheap Black": {
        "Regular": "KohSantepheap-Black"
    },
    "Koh Santepheap Light": {
        "Regular": "KohSantepheap-Light"
    },
    "Koh Santepheap Thin": {
        "Regular": "KohSantepheap-Thin"
    },
    "Kreon Light": {
        "Regular": "Kreon-Light"
    },
    "JejuMyeongjo": {
        "Regular": "JejuMyeongjo"
    },
    "Kulim Park ExtraLight": {
        "Regular": "KulimPark-ExtraLight",
        "Italic": "KulimPark-ExtraLightItalic"
    },
    "Kulim Park Light": {
        "Regular": "KulimPark-Light",
        "Italic": "KulimPark-LightItalic"
    },
    "Kulim Park SemiBold": {
        "Regular": "KulimPark-SemiBold",
        "Italic": "KulimPark-SemiBoldItalic"
    },
    "La Belle Aurore": {
        "Regular": "LaBelleAurore"
    },
    "Lakki Reddy": {
        "Regular": "LakkiReddy"
    },
    "Lancelot": {
        "Regular": "Lancelot"
    },
    "Kiwi Maru Light": {
        "Regular": "KiwiMaru-Light"
    },
    "Kiwi Maru Medium": {
        "Regular": "KiwiMaru-Medium"
    },
    "Lao Muang Don": {
        "Regular": "LaoMuangDon"
    },
    "Lao Muang Khong": {
        "Regular": "LaoMuangKhong"
    },
    "Lao Sans Pro": {
        "Regular": "LaoSansPro"
    },
    "Lateef": {
        "Regular": "Lateef"
    },
    "League Script": {
        "League Script": "LeagueScript"
    },
    "Libre Franklin Thin": {
        "Italic": "LibreFranklin-ThinItalic",
        "Regular": "LibreFranklin-Thin"
    },
    "Lilita One": {
        "Regular": "LilitaOne"
    },
    "Livvic Black": {
        "Regular": "Livvic-Black",
        "Italic": "Livvic-BlackItalic"
    },
    "Livvic ExtraLight": {
        "Regular": "Livvic-ExtraLight",
        "Italic": "Livvic-ExtraLightItalic"
    },
    "Livvic Light": {
        "Regular": "Livvic-Light",
        "Italic": "Livvic-LightItalic"
    },
    "Livvic Medium": {
        "Regular": "Livvic-Medium",
        "Italic": "Livvic-MediumItalic"
    },
    "Livvic SemiBold": {
        "Regular": "Livvic-SemiBold",
        "Italic": "Livvic-SemiBoldItalic"
    },
    "Livvic Thin": {
        "Regular": "Livvic-Thin",
        "Italic": "Livvic-ThinItalic"
    },
    "Lobster Two": {
        "Regular": "LobsterTwo"
    },
    "Lohit Bengali": {
        "Regular": "Lohit-Bengali"
    },
    "Lohit Devanagari": {
        "Regular": "Lohit-Devanagari"
    },
    "Lohit Tamil": {
        "Regular": "Lohit-Tamil"
    },
    "Klee One SemiBold": {
        "Regular": "KleeOne-SemiBold"
    },
    "Loved by the King": {
        "Regular": "LovedbytheKing"
    },
    "Lusitana": {
        "Regular": "Lusitana"
    },
    "Magra": {
        "Regular": "Magra"
    },
    "Mako": {
        "Regular": "Mako"
    },
    "Mallanna": {
        "Regular": "Mallanna"
    },
    "Mandali": {
        "Regular": "Mandali"
    },
    "Manjari Thin": {
        "Regular": "Manjari-Thin"
    },
    "Manrope ExtraLight": {
        "Regular": "Manrope-ExtraLight"
    },
    "Martel DemiBold": {
        "Regular": "Martel-DemiBold"
    },
    "Martel ExtraBold": {
        "Regular": "Martel-ExtraBold"
    },
    "Martel Heavy": {
        "Regular": "Martel-Heavy"
    },
    "Martel Light": {
        "Regular": "Martel-Light"
    },
    "Martel UltraLight": {
        "Regular": "Martel-UltraLight"
    },
    "Meddon": {
        "Regular": "Meddon"
    },
    "MedievalSharp": {
        "Regular": "MedievalSharp"
    },
    "Megrim": {
        "Medium": "Megrim"
    },
    "Merienda": {
        "Regular": "Merienda-Regular_0_wt"
    },
    "Metamorphous": {
        "Regular": "Metamorphous"
    },
    "Michroma": {
        "Regular": "Michroma"
    },
    "Miniver": {
        "Regular": "Miniver"
    },
    "Modak": {
        "Regular": "Modak"
    },
    "Mohave Light": {
        "Italic": "Mohave-LightItalic",
        "Regular": "Mohave-Light"
    },
    "Monofett": {
        "Regular": "Monofett"
    },
    "Montserrat Thin": {
        "Italic": "Montserrat-ThinItalic",
        "Regular": "Montserrat-Thin"
    },
    "Mulish ExtraLight": {
        "Italic": "Mulish-ExtraLightItalic",
        "Regular": "Mulish-ExtraLight"
    },
    "Murecho Thin": {
        "Regular": "Murecho-Thin"
    },
    "MuseoModerno Thin": {
        "Regular": "MuseoModerno-Thin"
    },
    "Myanmar Sans Pro": {
        "Regular": "MyanmarSansPro"
    },
    "Mystery Quest": {
        "Regular": "MysteryQuest"
    },
    "NanumGothic": {
        "Bold": "NanumGothicBold",
        "Regular": "NanumGothic",
            "ExtraBold": "NanumGothicExtraBold"
    },
    "NATS": {
        "Regular": "NATS"
    },
    "Neucha": {
        "Regular": "Neucha"
    },
    "News Cycle": {
        "Regular": "NewsCycle"
    },
    "M PLUS 1 Thin": {
        "Regular": "MPLUS1-Thin"
    },
    "M PLUS 2 Thin": {
        "Regular": "MPLUS2-Thin"
    },
    "Nanum Brush Script": {
        "Regular": "NanumBrush"
    },
    "NanumGothicCoding": {
        "Regular": "NanumGothicCoding"
    },
    "NanumMyeongjo": {
        "Bold": "NanumMyeongjoBold",
        "ExtraBold": "NanumMyeongjoExtraBold",
            "Regular": "NanumMyeongjo"
    },
    "Nokora Black": {
        "Regular": "Nokora-Black"
    },
    "Nokora Light": {
        "Regular": "Nokora-Light"
    },
    "Nokora Thin": {
        "Regular": "Nokora-Thin"
    },
    "Nothing You Could Do": {
        "Regular": "NothingYouCouldDo"
    },
    "Noto Sans": {
        "Regular": "NotoSans"
    },
    "Noto Sans AnatoHiero": {
        "Regular": "NotoSansAnatolianHieroglyphs-Regular"
    },
    "Noto Sans CaucAlban": {
        "Regular": "NotoSansCaucasianAlbanian-Regular"
    },
    "Noto Sans Devanagari Black": {
        "Regular": "NotoSansDevanagari-Black"
    },
    "Noto Sans Devanagari ExtraBold": {
        "Regular": "NotoSansDevanagari-ExtraBold"
    },
    "Noto Sans Devanagari ExtraLight": {
        "Regular": "NotoSansDevanagari-ExtraLight"
    },
    "Noto Sans Devanagari Light": {
        "Regular": "NotoSansDevanagari-Light"
    },
    "Noto Sans Devanagari Medium": {
        "Regular": "NotoSansDevanagari-Medium"
    },
    "Noto Sans Devanagari SemiBold": {
        "Regular": "NotoSansDevanagari-SemiBold"
    },
    "Noto Sans Devanagari Thin": {
        "Regular": "NotoSansDevanagari-Thin"
    },
    "Noto Sans Devanagari UI Black": {
        "Regular": "NotoSansDevanagariUI-Black"
    },
    "Noto Sans Devanagari UI ExtraBold": {
        "Regular": "NotoSansDevanagariUI-ExtraBold"
    },
    "Noto Sans Devanagari UI ExtraLight": {
        "Regular": "NotoSansDevanagariUI-ExtraLight"
    },
    "Noto Sans Devanagari UI Light": {
        "Regular": "NotoSansDevanagariUI-Light"
    },
    "Noto Sans Devanagari UI Medium": {
        "Regular": "NotoSansDevanagariUI-Medium"
    },
    "Noto Sans Devanagari UI SemiBold": {
        "Regular": "NotoSansDevanagariUI-SemiBold"
    },
    "Noto Sans Devanagari UI Thin": {
        "Regular": "NotoSansDevanagariUI-Thin"
    },
    "Noto Sans EgyptHiero": {
        "Regular": "NotoSansEgyptianHieroglyphs-Regular"
    },
    "Noto Sans Gujarati Black": {
        "Regular": "NotoSansGujarati-Black"
    },
    "Noto Sans Gujarati ExtraBold": {
        "Regular": "NotoSansGujarati-ExtraBold"
    },
    "Noto Sans Gujarati ExtraLight": {
        "Regular": "NotoSansGujarati-ExtraLight"
    },
    "Noto Sans Gujarati Light": {
        "Regular": "NotoSansGujarati-Light"
    },
    "Noto Sans Gujarati Medium": {
        "Regular": "NotoSansGujarati-Medium"
    },
    "Noto Sans Gujarati SemiBold": {
        "Regular": "NotoSansGujarati-SemiBold"
    },
    "Noto Sans Gujarati Thin": {
        "Regular": "NotoSansGujarati-Thin"
    },
    "Noto Sans Gujarati UI Black": {
        "Regular": "NotoSansGujaratiUI-Black"
    },
    "Noto Sans Gujarati UI ExtraBold": {
        "Regular": "NotoSansGujaratiUI-ExtraBold"
    },
    "Noto Sans Gujarati UI ExtraLight": {
        "Regular": "NotoSansGujaratiUI-ExtraLight"
    },
    "Noto Sans Gujarati UI Light": {
        "Regular": "NotoSansGujaratiUI-Light"
    },
    "Noto Sans Gujarati UI Medium": {
        "Regular": "NotoSansGujaratiUI-Medium"
    },
    "Noto Sans Gujarati UI SemiBold": {
        "Regular": "NotoSansGujaratiUI-SemiBold"
    },
    "Noto Sans Gujarati UI Thin": {
        "Regular": "NotoSansGujaratiUI-Thin"
    },
    "Noto Sans HanifiRohg": {
        "Regular": "NotoSansHanifiRohingya-Regular"
    },
    "Noto Sans Hebrew Light": {
        "Regular": "NotoSansHebrew-Light"
    },
    "Noto Sans ImpAramaic": {
        "Regular": "NotoSansImperialAramaic-Regular"
    },
    "Noto Sans InsPahlavi": {
        "Regular": "NotoSansInscriptionalPahlavi-Regular"
    },
    "Noto Sans InsParthi": {
        "Regular": "NotoSansInscriptionalParthian-Regular"
    },
    "Noto Sans Myanmar Blk": {
        "Regular": "NotoSansMyanmar-Black"
    },
    "Noto Sans Myanmar ExtBd": {
        "Regular": "NotoSansMyanmar-ExtraBold"
    },
    "Noto Sans Myanmar ExtLt": {
        "Regular": "NotoSansMyanmar-ExtraLight"
    },
    "Noto Sans Myanmar Light": {
        "Regular": "NotoSansMyanmar-Light"
    },
    "Noto Sans Myanmar Med": {
        "Regular": "NotoSansMyanmar-Medium"
    },
    "Noto Sans Myanmar SemBd": {
        "Regular": "NotoSansMyanmar-SemiBold"
    },
    "Noto Sans Myanmar Thin": {
        "Regular": "NotoSansMyanmar-Thin"
    },
    "Noto Sans Myanmar UI Black": {
        "Regular": "NotoSansMyanmarUI-Black"
    },
    "Noto Sans Myanmar UI ExtraBold": {
        "Regular": "NotoSansMyanmarUI-ExtraBold"
    },
    "Noto Sans Myanmar UI ExtraLight": {
        "Regular": "NotoSansMyanmarUI-ExtraLight"
    },
    "Noto Sans Myanmar UI Light": {
        "Regular": "NotoSansMyanmarUI-Light"
    },
    "Noto Sans Myanmar UI Medium": {
        "Regular": "NotoSansMyanmarUI-Medium"
    },
    "Noto Sans Myanmar UI SemiBold": {
        "Regular": "NotoSansMyanmarUI-SemiBold"
    },
    "Noto Sans Myanmar UI Thin": {
        "Regular": "NotoSansMyanmarUI-Thin"
    },
    "Noto Sans OldHung": {
        "Regular": "NotoSansOldHungarian-Regular"
    },
    "Noto Sans OldNorArab": {
        "Regular": "NotoSansOldNorthArabian-Regular"
    },
    "Noto Sans OldSouArab": {
        "Regular": "NotoSansOldSouthArabian-Regular"
    },
    "Noto Sans Oriya Blk": {
        "Regular": "NotoSansOriya-Black"
    },
    "Noto Sans Oriya Thin": {
        "Regular": "NotoSansOriya-Thin"
    },
    "Noto Sans Oriya UI Blk": {
        "Regular": "NotoSansOriyaUI-Black"
    },
    "Noto Sans Oriya UI Thin": {
        "Regular": "NotoSansOriyaUI-Thin"
    },
    "Noto Sans PsaPahlavi": {
        "Regular": "NotoSansPsalterPahlavi-Regular"
    },
    "Noto Sans Syriac Black": {
        "Regular": "NotoSansSyriac-Black"
    },
    "Noto Sans Syriac Thin": {
        "Regular": "NotoSansSyriac-Thin"
    },
    "Noto Sans Thai Looped Black": {
        "Regular": "NotoSansThaiLooped-Black"
    },
    "Noto Sans Thai Looped Bold": {
        "Bold": "NotoSansThaiLooped-Bold"
    },
    "Noto Sans Thai Looped Extrabold": {
        "Regular": "NotoSansThaiLooped-Extrabold"
    },
    "Noto Sans Thai Looped ExtLight": {
        "Regular": "NotoSansThaiLooped-Extralight"
    },
    "Noto Sans Thai Looped Light": {
        "Regular": "NotoSansThaiLooped-Light"
    },
    "Noto Sans Thai Looped Medium": {
        "Regular": "NotoSansThaiLooped-Medium"
    },
    "Noto Sans Thai Looped Regular": {
        "Regular": "NotoSansThaiLooped-Regular"
    },
    "Noto Sans Thai Looped Semibold": {
        "Regular": "NotoSansThaiLooped-Semibold"
    },
    "Noto Sans Thai Looped Thin": {
        "Regular": "NotoSansThaiLooped-Thin"
    },
    "Noto Sans Zanabazar": {
        "Regular": "NotoSansZanabazarSquare-Regular"
    },
    "Noto Serif": {
        "Regular": "NotoSerif"
    },
    "Noto Serif Myanmar Blk": {
        "Regular": "NotoSerifMyanmar-Black"
    },
    "Noto Serif Myanmar ExtBd": {
        "Regular": "NotoSerifMyanmar-ExtraBold"
    },
    "Noto Serif Myanmar ExtLt": {
        "Regular": "NotoSerifMyanmar-ExtraLight"
    },
    "Noto Serif Myanmar Light": {
        "Regular": "NotoSerifMyanmar-Light"
    },
    "Noto Serif Myanmar Med": {
        "Regular": "NotoSerifMyanmar-Medium"
    },
    "Noto Serif Myanmar SemBd": {
        "Regular": "NotoSerifMyanmar-SemiBold"
    },
    "Noto Serif Myanmar Thin": {
        "Regular": "NotoSerifMyanmar-Thin"
    },
    "Nova Cut": {
        "Book": "NovaCut"
    },
    "Nova Flat": {
        "Book": "NovaFlat"
    },
    "NovaMono": {
        "Regular": "NovaMono"
    },
    "Nova Oval": {
        "Book": "NovaOval"
    },
    "Nova Round": {
        "Book": "NovaRound"
    },
    "Nova Slim": {
        "Book": "NovaSlim"
    },
    "Nova Square": {
        "Book": "NovaSquare"
    },
    "NTR": {
        "Regular": "NTR"
    },
    "Nunito ExtraLight": {
        "Italic": "Nunito-ExtraLightItalic",
        "Regular": "Nunito-ExtraLight"
    },
    "Nunito Sans Black": {
        "Regular": "NunitoSans-Black",
        "Italic": "NunitoSans-BlackItalic"
    },
    "Nunito Sans ExtraBold": {
        "Regular": "NunitoSans-ExtraBold",
        "Italic": "NunitoSans-ExtraBoldItalic"
    },
    "Nunito Sans ExtraLight": {
        "Regular": "NunitoSans-ExtraLight",
        "Italic": "NunitoSans-ExtraLightItalic"
    },
    "Nunito Sans Light": {
        "Regular": "NunitoSans-Light",
        "Italic": "NunitoSans-LightItalic"
    },
    "Nunito Sans SemiBold": {
        "Regular": "NunitoSans-SemiBold",
        "Italic": "NunitoSans-SemiBoldItalic"
    },
    "OFL Sorts Mill Goudy TT": {
        "Italic": "OFLGoudyStMTT-Italic",
        "Regular": "OFLGoudyStMTT"
    },
    "Open Sans Hebrew Extra Bold": {
        "Regular": "OpenSansHebrew-ExtraBold"
    },
    "Open Sans Hebrew Light": {
        "Regular": "OpenSansHebrew-Light",
        "Italic": "OpenSansHebrew-LightItalic"
    },
    "Open Sans Hebrew Condensed Extra Bold": {
        "Regular": "OpenSansHebrewCondensed-ExtraBold"
    },
    "Open Sans Hebrew Condensed Light": {
        "Regular": "OpenSansHebrewCondensed-Light"
    },
    "Outfit Thin": {
        "Regular": "Outfit-Thin"
    },
    "Overpass Mono Light": {
        "Regular": "OverpassMono-Light"
    },
    "Over the Rainbow": {
        "Regular": "OvertheRainbow"
    },
    "Ovo": {
        "Regular": "Ovo"
    },
    "Oxanium ExtraLight": {
        "Regular": "Oxanium-ExtraLight"
    },
    "Pecita": {
        "Book": "Pecita"
    },
    "Peddana": {
        "Regular": "Peddana"
    },
    "Piazzolla Thin Italic": {
        "Italic": "Piazzolla-ThinItalic"
    },
    "Piazzolla Thin": {
        "Regular": "Piazzolla-Thin"
    },
    "Pinyon Script": {
        "Regular": "PinyonScript"
    },
    "Ponnala": {
        "Regular": "Ponnala"
    },
    "Poppins Black": {
        "Regular": "Poppins-Black",
        "Italic": "Poppins-BlackItalic"
    },
    "Poppins ExtraBold": {
        "Regular": "Poppins-ExtraBold",
        "Italic": "Poppins-ExtraBoldItalic"
    },
    "Poppins ExtraLight": {
        "Regular": "Poppins-ExtraLight",
        "Italic": "Poppins-ExtraLightItalic"
    },
    "Poppins Light": {
        "Regular": "Poppins-Light",
        "Italic": "Poppins-LightItalic"
    },
    "Poppins Medium": {
        "Regular": "Poppins-Medium",
        "Italic": "Poppins-MediumItalic"
    },
    "Poppins SemiBold": {
        "Regular": "Poppins-SemiBold",
        "Italic": "Poppins-SemiBoldItalic"
    },
    "Poppins Thin": {
        "Regular": "Poppins-Thin",
        "Italic": "Poppins-ThinItalic"
    },
    "Porter Sans Block": {
        "Block": "PorterSansBlock"
    },
    "Princess Sofia": {
        "Regular": "PrincessSofia"
    },
    "PT Sans Caption": {
        "Bold": "PTSans-CaptionBold",
        "Regular": "PTSans-Caption"
    },
    "PT Sans Narrow": {
        "Bold": "PTSans-NarrowBold",
        "Regular": "PTSans-Narrow"
    },
    "PT Serif Caption": {
        "Italic": "PTSerif-CaptionItalic",
        "Regular": "PTSerif-Caption"
    },
    "Public Sans Thin": {
        "Italic": "PublicSans-ThinItalic",
        "Regular": "PublicSans-Thin"
    },
    "Quattrocento": {
        "Regular": "Quattrocento"
    },
    "Quattrocento Sans": {
        "Regular": "QuattrocentoSans"
    },
    "Quicksand Light": {
        "Regular": "Quicksand-Light"
    },
    "Raleway Thin": {
        "Italic": "Raleway-ThinItalic",
        "Regular": "Raleway-Thin"
    },
    "Ramabhadra": {
        "Regular": "Ramabhadra"
    },
    "Ramaraja": {
        "Regular": "Ramaraja"
    },
    "Redacted Script Light": {
        "Regular": "RedactedScript-Light"
    },
    "Red Hat Display": {
        "Italic": "RedHatDisplay-LightItalic",
        "Regular": "RedHatDisplay-Light"
    },
    "Red Hat Mono": {
        "Italic": "RedHatMono-LightItalic",
        "Regular": "RedHatMono-Light"
    },
    "Red Hat Text": {
        "Italic": "RedHatText-LightItalic",
        "Regular": "RedHatText-Light"
    },
    "Reem Kufi Medium": {
        "Regular": "ReemKufi-Medium"
    },
    "Reem Kufi SemiBold": {
        "Regular": "ReemKufi-SemiBold"
    },
    "Reem Kufi": {
        "Regular": "ReemKufi"
    },
    "Reem Kufi Fun": {
        "Regular": "ReemKufiFun"
    },
    "Reenie Beanie": {
        "Regular": "ReenieBeanie"
    },
    "Roboto Black": {
        "Regular": "Roboto-Black",
        "Italic": "Roboto-BlackItalic"
    },
    "Roboto Light": {
        "Regular": "Roboto-Light",
        "Italic": "Roboto-LightItalic"
    },
    "Roboto Medium": {
        "Regular": "Roboto-Medium",
        "Italic": "Roboto-MediumItalic"
    },
    "Roboto Thin": {
        "Regular": "Roboto-Thin",
        "Italic": "Roboto-ThinItalic"
    },
    "Roboto Condensed Light": {
        "Regular": "RobotoCondensed-Light",
        "Italic": "RobotoCondensed-LightItalic"
    },
    "Roboto Condensed Medium": {
        "Regular": "RobotoCondensed-Medium",
        "Italic": "RobotoCondensed-MediumItalic"
    },
    "Recursive Sans Linear Light": {
        "Regular": "Recursive-SansLinearLight"
    },
    "Rowdies Light": {
        "Regular": "Rowdies-Light"
    },
    "Rubik Light": {
        "Italic": "Rubik-LightItalic",
        "Regular": "Rubik-Light"
    },
    "Ruluko": {
        "Regular": "Ruluko"
    },
    "Ruslan Display": {
        "Regular": "RuslanDisplay"
    },
    "Saira Thin": {
        "Italic": "Saira-ThinItalic",
        "Regular": "Saira-Thin"
    },
    "Sansation Light": {
        "Light": "Sansation-Light",
        "Light Italic": "Sansation-LightItalic"
    },
    "Sansita Swashed Light": {
        "Regular": "SansitaSwashed-Light"
    },
    "Sen ExtraBold": {
        "Regular": "Sen-ExtraBold"
    },
    "Seymour One": {
        "Book": "SeymourOne"
    },
    "Shadows Into Light": {
        "Regular": "ShadowsIntoLight"
    },
    "Shanti": {
        "Regular": "Shanti"
    },
    "Short Stack": {
        "Regular": "ShortStack"
    },
    "Siemreap": {
        "Regular": "Siemreap"
    },
    "Signika Light": {
        "Regular": "Signika-Light"
    },
    "Signika Negative Light": {
        "Regular": "SignikaNegative-Light"
    },
    "Signika Negative SC Light": {
        "Regular": "SignikaNegativeSC-Light"
    },
    "Signika Negative SC SemiBold": {
        "Regular": "SignikaNegativeSC-SemiBold"
    },
    "Signika SC": {
        "Regular": "SignikaSC-Light"
    },
    "Sintony": {
        "Regular": "Sintony"
    },
    "SeoulNamsan CBL": {
        "Regular": "SeN-CBL"
    },
    "SeoulNamsan CEB": {
        "Regular": "SeN-CEB"
    },
    "SeoulNamsan CM": {
        "Regular": "SeN-CM"
    },
    "Six Caps": {
        "Regular": "SixCaps"
    },
    "Skranji": {
        "Regular": "Skranji"
    },
    "Smythe": {
        "Regular": "Smythe"
    },
    "Snippet": {
        "Regular": "Snippet"
    },
    "Sometype Mono Medium": {
        "Regular": "SometypeMono-Medium",
        "Italic": "SometypeMono-MediumItalic"
    },
    "SeoulNamsan B": {
        "Regular": "SeoulNamsanB"
    },
    "SeoulNamsan EB": {
        "Regular": "SeoulNamsanEB"
    },
    "SeoulNamsan L": {
        "Regular": "SeoulNamsanL"
    },
    "SeoulNamsan M": {
        "Regular": "SeoulNamsanM"
    },
    "SeoulNamsan CB": {
        "Regular": "SeN-CB"
    },
    "SeoulNamsan CL": {
        "Regular": "SeN-CL"
    },
    "SeoulNamsan vert": {
        "Regular": "SeoulNamsanvert"
    },
    "Souliyo Unicode": {
        "Regular": "SouliyoUnicode"
    },
    "Source Code Pro": {
        "Italic": "SourceCode_ExtraLight-Italic",
        "Regular": "SourceCode_ExtraLight"
    },
    "Source Sans 3": {
        "Regular": "SourceSans3-Roman"
    },
    "Source Sans Pro Black": {
        "Regular": "SourceSansPro-Black",
        "Italic": "SourceSansPro-BlackItalic"
    },
    "Source Sans Pro ExtraLight": {
        "Regular": "SourceSansPro-ExtraLight",
        "Italic": "SourceSansPro-ExtraLightItalic"
    },
    "Source Sans Pro Light": {
        "Regular": "SourceSansPro-Light",
        "Italic": "SourceSansPro-LightItalic"
    },
    "Source Sans Pro SemiBold": {
        "Regular": "SourceSansPro-SemiBold",
        "Italic": "SourceSansPro-SemiBoldItalic"
    },
    "Source Serif 4": {
        "Italic": "SourceSerif4Italic-Italic",
        "Regular": "SourceSerif4Roman-Regular"
    },
    "Source Serif Pro Black": {
        "Regular": "SourceSerifPro-Black",
        "Italic": "SourceSerifPro-BlackIt"
    },
    "Source Serif Pro": {
        "Bold Italic": "SourceSerifPro-BoldIt",
        "Italic": "SourceSerifPro-It"
    },
    "Source Serif Pro ExtraLight": {
        "Regular": "SourceSerifPro-ExtraLight",
        "Italic": "SourceSerifPro-ExtraLightIt"
    },
    "Source Serif Pro Light": {
        "Regular": "SourceSerifPro-Light",
        "Italic": "SourceSerifPro-LightIt"
    },
    "Source Serif Pro SemiBold": {
        "Regular": "SourceSerifPro-SemiBold",
        "Italic": "SourceSerifPro-SemiBoldIt"
    },
    "SeoulHangang CB": {
        "Regular": "SeH-CB"
    },
    "SeoulHangang CBL": {
        "Regular": "SeH-CBL"
    },
    "SeoulHangang CEB": {
        "Regular": "SeH-CEB"
    },
    "SeoulHangang CL": {
        "Regular": "SeH-CL"
    },
    "SeoulHangang CM": {
        "Regular": "SeH-CM"
    },
    "Space Grotesk Light": {
        "Regular": "SpaceGrotesk-Light"
    },
    "Spartan Thin": {
        "Regular": "Spartan-Thin"
    },
    "SeoulHangang B": {
        "Regular": "SeoulHangangB"
    },
    "SeoulHangang EB": {
        "Regular": "SeoulHangangEB"
    },
    "SeoulHangang L": {
        "Regular": "SeoulHangangL"
    },
    "SeoulHangang M": {
        "Regular": "SeoulHangangM"
    },
    "Sree Krushnadevaraya": {
        "Regular": "SreeKrushnadevaraya"
    },
    "Stick No Bills ExtraLight": {
        "Regular": "StickNoBills-ExtraLight"
    },
    "STIX Two Text": {
        "Regular": "STIXTwoText"
    },
    "Sue Ellen Francisco": {
        "Regular": "SueEllenFrancisco"
    },
    "Suranna": {
        "Regular": "Suranna"
    },
    "Suravaram": {
        "Regular": "Suravaram"
    },
    "Suwannaphum Black": {
        "Regular": "Suwannaphum-Black"
    },
    "Suwannaphum Light": {
        "Regular": "Suwannaphum-Light"
    },
    "Suwannaphum Thin": {
        "Regular": "Suwannaphum-Thin"
    },
    "Swanky and Moo Moo": {
        "Regular": "SwankyandMooMoo"
    },
    "Tauri": {
        "Regular": "TauriRegular"
    },
    "Tenali Ramakrishna": {
        "Regular": "TenaliRamakrishna"
    },
    "Tenor Sans": {
        "Regular": "TenorSans"
    },
    "Texturina Medium": {
        "Italic": "Texturina-MediumItalic",
        "Regular": "Texturina-Medium"
    },
    "Thabit-Bold": {
        "Bold": "Thabit-Bold"
    },
    "Thabit-Bold-Oblique": {
        "Bold Oblique": "Thabit-Bold-Oblique"
    },
    "Thabit-Oblique": {
        "Oblique": "Thabit-Oblique"
    },
    "Thabit": {
        "Regular": "Thabit"
    },
    "TharLon": {
        "Regular": "TharLon"
    },
    "The Girl Next Door": {
        "Regular": "TheGirlNextDoor"
    },
    "Timmana": {
        "Regular": "Timmana"
    },
    "Titan One": {
        "Regular": "TitanOne"
    },
    "Tomorrow Black": {
        "Regular": "Tomorrow-Black",
        "Italic": "Tomorrow-BlackItalic"
    },
    "Tomorrow ExtraBold": {
        "Regular": "Tomorrow-ExtraBold",
        "Italic": "Tomorrow-ExtraBoldItalic"
    },
    "Tomorrow ExtraLight": {
        "Regular": "Tomorrow-ExtraLight",
        "Italic": "Tomorrow-ExtraLightItalic"
    },
    "Tomorrow Light": {
        "Regular": "Tomorrow-Light",
        "Italic": "Tomorrow-LightItalic"
    },
    "Tomorrow Medium": {
        "Regular": "Tomorrow-Medium",
        "Italic": "Tomorrow-MediumItalic"
    },
    "Tomorrow SemiBold": {
        "Regular": "Tomorrow-SemiBold",
        "Italic": "Tomorrow-SemiBoldItalic"
    },
    "Tomorrow Thin": {
        "Regular": "Tomorrow-Thin",
        "Italic": "Tomorrow-ThinItalic"
    },
    "Tourney Thin": {
        "Italic": "Tourney-ThinItalic",
        "Regular": "Tourney-Thin"
    },
    "Trade Winds": {
        "Regular": "TradeWinds"
    },
    "Trispace Thin": {
        "Regular": "Trispace-Thin"
    },
    "Trochut": {
        "Regular": "Trochut"
    },
    "UnifrakturMaguntia": {
        "Book": "UnifrakturMaguntia"
    },
    "Varela": {
        "Regular": "Varela"
    },
    "Varta Light": {
        "Regular": "Varta-Light"
    },
    "Vesper Libre Heavy": {
        "Regular": "VesperLibre-Heavy"
    },
    "Vesper Libre Medium": {
        "Regular": "VesperLibre-Medium"
    },
    "Vibur": {
        "Medium": "Vibur"
    },
    "Voltaire": {
        "Regular": "Voltaire"
    },
    "Waiting for the Sunrise": {
        "Regular": "WaitingfortheSunrise"
    },
    "Wallpoet": {
        "Regular": "Wallpoet"
    },
    "WindSong Medium": {
        "Regular": "WindSong-Medium"
    },
    "Wire One": {
        "Regular": "WireOne"
    },
    "Yaldevi ExtraLight": {
        "Regular": "Yaldevi-ExtraLight"
    },
    "Yanone Kaffeesatz ExtraLight": {
        "Regular": "YanoneKaffeesatz-ExtraLight"
    },
    "Zeyada": {
        "Regular": "Zeyada"
    },
    "Zilla Slab Light": {
        "Regular": "ZillaSlab-Light",
        "Italic": "ZillaSlab-LightItalic"
    },
    "Zilla Slab Medium": {
        "Regular": "ZillaSlab-Medium",
        "Italic": "ZillaSlab-MediumItalic"
    },
    "Zilla Slab SemiBold": {
        "Regular": "ZillaSlab-SemiBold",
        "Italic": "ZillaSlab-SemiBoldItalic"
    },
    "Zen Kaku Gothic Antique Black": {
        "Regular": "ZenKakuGothicAntique-Black"
    },
    "Zen Kaku Gothic Antique Light": {
        "Regular": "ZenKakuGothicAntique-Light"
    },
    "Zen Kaku Gothic Antique Medium": {
        "Regular": "ZenKakuGothicAntique-Medium"
    },
    "Zen Kaku Gothic New Black": {
        "Regular": "ZenKakuGothicNew-Black"
    },
    "Zen Kaku Gothic New Light": {
        "Regular": "ZenKakuGothicNew-Light"
    },
    "Zen Kaku Gothic New Medium": {
        "Regular": "ZenKakuGothicNew-Medium"
    },
    "Zen Maru Gothic Black": {
        "Regular": "ZenMaruGothic-Black"
    },
    "Zen Maru Gothic Light": {
        "Regular": "ZenMaruGothic-Light"
    },
    "Zen Maru Gothic Medium": {
        "Regular": "ZenMaruGothic-Medium"
    },
    "Zen Old Mincho Black": {
        "Regular": "ZenOldMincho-Black"
    },
    "Zen Old Mincho Medium": {
        "Regular": "ZenOldMincho-Medium"
    },
    "Zen Old Mincho SemiBold": {
        "Regular": "ZenOldMincho-SemiBold"
    }
}
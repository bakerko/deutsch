const vocabularyDictionary = [
    {
        german: "die Bewegungsfähigkeit",
        translation: "القدرة الحركية",
        synonyms: ["die Motorik"],
        synonymsTranslation: ["المهارات الحركية"]
    },
    {
        german: "die Demenz",
        translation: "الخَرَف",
        synonyms: ["geistige Behinderung"],
        synonymsTranslation: ["الإعاقة الذهنية"]
    },
    {
        german: "der Fahrtendienst",
        translation: "خدمة النقل",
        synonyms: ["der Abholdienst"],
        synonymsTranslation: ["خدمة التوصيل"]
    },
    {
        german: "die Körperhygiene",
        translation: "النظافة الشخصية",
        synonyms: ["die Körperpflege"],
        synonymsTranslation: ["العناية بالجسم"]
    },
    {
        german: "die Kräftigung",
        translation: "التقوية",
        synonyms: ["die Stärkung"],
        synonymsTranslation: ["تعزيز"]
    },
    {
        german: "die Mobilisation",
        translation: "التعبئة / التنشيط (حسب السياق)",
        synonyms: ["das Bewegen", "das Gehen"],
        synonymsTranslation: ["الحركة", "المشي"]
    },
    {
        german: "der Rollator",
        translation: "مُشَيِّدة (مشاية للكبار)",
        synonyms: ["die Gehhilfe"],
        synonymsTranslation: ["عكاز للمشي"]
    },
    {
        german: "belasten",
        translation: "يُحَمِّل",
        synonyms: ["zur Last fallen"],
        synonymsTranslation: ["يُثْقِل"]
    },
    {
        german: "bewusst",
        translation: "واعٍ",
        synonyms: ["geistig wach"],
        synonymsTranslation: ["متيقظ ذهنيًا"]
    },
    {
        german: "dement",
        translation: "مُصاب بالخَرَف",
        synonyms: ["geistig verwirrt"],
        synonymsTranslation: ["مشوّش ذهنيًا"]
    },
    {
        german: "verwirrt",
        translation: "مشوّش / حائر",
        synonyms: ["durcheinander"],
        synonymsTranslation: ["فوضوي"]
    },
    {
        german: "stundenweise",
        translation: "بالحصة الساعية / حسب الساعة",
        synonyms: ["pro Stunde"],
        synonymsTranslation: ["في الساعة"]
    },
    {
        german: "der Aufwand",
        translation: "الجهد / التكلفة",
        synonyms: ["die Bemühungen", "die Ausbrenungen"],
        synonymsTranslation: ["جهود", "احتراق نفسي (إنهاك)"]
    },
    {
        german: "das Ausmaß",
        translation: "النطاق / الحجم",
        synonyms: ["die Größe", "der Umfang", "die Anzahl"],
        synonymsTranslation: ["الحجم", "المدى", "العدد"]
    },
    {
        german: "die Finanzierung",
        translation: "التمويل",
        synonyms: ["die Bezahlung"],
        synonymsTranslation: ["الدفع"]
    },
    {
        german: "der Genuss",
        translation: "متعة / تَذَوُّق",
        synonyms: ["der Geschmack"],
        synonymsTranslation: ["طعم"]
    },
    {
        german: "abhängig von",
        translation: "يعتمد على",
        synonyms: ["süchtig von"],
        synonymsTranslation: ["مَدْمِن على"]
    },
    {
        german: "anerkannt",
        translation: "مُعترف به",
        synonyms: ["akzeptiert", "nostrifiziert"],
        synonymsTranslation: ["مَقبول", "مُعْتَمد (رسميًا)"]
    },
    {
        german: "angewiesen",
        translation: "مُحْتَاج",
        synonyms: ["Hilfe benötigen"],
        synonymsTranslation: ["يحتاج إلى مساعدة"]
    },
    {
        german: "akustisch",
        translation: "سمعي",
        synonyms: ["klangmäßig", "laut dem Gehör"],
        synonymsTranslation: ["من ناحية الصوت", "حسب السمع"]
    },
    {
        german: "athletisch",
        translation: "رياضي / أطلسي",
        synonyms: ["muskulös", "kräftig"],
        synonymsTranslation: ["عَضَلي", "قوي"]
    },
    {
        german: "barrierefrei",
        translation: "خالٍ من العوائق (لذوي الإعاقة)",
        synonyms: ["leicht zugänglich"],
        synonymsTranslation: ["سهل الوصول"]
    },
    {
        german: "betroffen",
        translation: "مُصاب / مُتأثّر",
        synonyms: ["auf jdn bezogen", "fassungslos"],
        synonymsTranslation: ["متعلق بشخص ما", "ذاهل"]
    },
    {
        german: "depressiv",
        translation: "اكتئابي",
        synonyms: ["sehr traurig", "traurig"],
        synonymsTranslation: ["حزين جدًا", "حزين"]
    },
    {
        german: "gesetzlich",
        translation: "قانوني",
        synonyms: ["rechtlich"],
        synonymsTranslation: ["قانوني (قضائي)"]
    },
    {
        german: "hilfreich",
        translation: "مُفيد",
        synonyms: ["nützlich"],
        synonymsTranslation: ["مُفيد"]
    },
    {
        german: "illegal",
        translation: "غير قانوني",
        synonyms: ["verboten"],
        synonymsTranslation: ["ممنوع"]
    },
    {
        german: "legal",
        translation: "قانوني",
        synonyms: ["gestaltet", "erlaubt"],
        synonymsTranslation: ["مُشَكَّل", "مسموح"]
    },
    {
        german: "optisch",
        translation: "بصري",
        synonyms: ["vom Äußerlichen gesehen"],
        synonymsTranslation: ["من الناحية الخارجية"]
    },
    {
        german: "die Kontrolle",
        translation: "التحكم / المراقبة",
        synonyms: ["die Überwachung"],
        synonymsTranslation: ["المراقبة"]
    },
    {
        german: "die Lebenserwartung",
        translation: "متوسط العمر المتوقع",
        synonyms: ["die Lebensdauer"],
        synonymsTranslation: ["العمر الافتراضي"]
    },
    {
        german: "der Operation",
        translation: "عملية جراحية",
        synonyms: ["die OP"],
        synonymsTranslation: ["عملية"]
    },
    {
        german: "der Rücksicht",
        translation: "مراعاة / اهتمام",
        synonyms: ["der Respekt gegenüber anderen"],
        synonymsTranslation: ["الاحترام towards الآخرين"]
    },
    {
        german: "das Signal",
        translation: "إشارة",
        synonyms: ["das Alarmzeichen"],
        synonymsTranslation: ["علامة إنذار"]
    },
    {
        german: "der Sportverein",
        translation: "النادي الرياضي",
        synonyms: ["der Sportclub"],
        synonymsTranslation: ["النادي الرياضي"]
    },
    {
        german: "die Teilnahme",
        translation: "مشاركة",
        synonyms: ["das Mitmachen", "die Mitwirkung"],
        synonymsTranslation: ["المشاركة", "المساهمة"]
    },
    {
        german: "das Verhalten",
        translation: "سلوك",
        synonyms: ["die Disziplin", "das Benehmen"],
        synonymsTranslation: ["انضباط", "أخلاق"]
    },
    {
        german: "der Verlust",
        translation: "خسارة",
        synonyms: ["der Gewinn"],
        synonymsTranslation: ["ربح (ضد)"]
    },
    {
        german: "konsumieren",
        translation: "يستهلك",
        synonyms: ["einnehmen", "kaufen", "essen"],
        synonymsTranslation: ["يتناول", "يشتري", "يأكل"],
        partOfSpeech: "Verb"
    },
    {
        german: "wandern",
        translation: "يتنزه سيرًا على الأقدام",
        synonyms: ["spazieren in der Natur", "bummeln", "spazieren in der Stadt", "im Einkaufszentrum flanieren"],
        synonymsTranslation: ["يتجول في الطبيعة", "يتسكع", "يتجول في المدينة", "يتنزه في المركز التجاري"],
        partOfSpeech: "Verb"
    },
    {
        german: "schätzungsweise",
        translation: "تقريبيًا",
        synonyms: ["circa", "etwa"],
        synonymsTranslation: ["حوالي", "تقريبًا"],
        partOfSpeech: "Adverb"
    },
    {
        german: "vor allem",
        translation: "قبل كل شيء / خاصة",
        synonyms: ["besonders"],
        synonymsTranslation: ["خاصة"],
        partOfSpeech: "Adverb"
    },
];
const vocabularyDictionary = [
    {
        german: "die Bewegungsfähigkeit",
        translation: "двигательная способность",
        synonyms: ["die Motorik"],
        synonymsTranslation: ["моторика"]
    },
    {
        german: "die Demenz",
        translation: "деменция",
        synonyms: ["geistige Behinderung"],
        synonymsTranslation: ["умственная отсталость"]
    },
    {
        german: "der Fahrtendienst",
        translation: "транспортная служба",
        synonyms: ["der Abholdienst"],
        synonymsTranslation: ["служба доставки"]
    },
    {
        german: "die Körperhygiene",
        translation: "гигиена тела",
        synonyms: ["die Körperpflege"],
        synonymsTranslation: ["уход за телом"]
    },
    {
        german: "die Kräftigung",
        translation: "укрепление",
        synonyms: ["die Stärkung"],
        synonymsTranslation: ["усиление"]
    },
    {
        german: "die Mobilisation",
        translation: "мобилизация",
        synonyms: ["das Bewegen", "das Gehen"],
        synonymsTranslation: ["движение", "ходьба"]
    },
    {
        german: "der Rollator",
        translation: "роллатор",
        synonyms: ["die Gehhilfe"],
        synonymsTranslation: ["ходунки"]
    },
    {
        german: "belasten",
        translation: "нагружать",
        synonyms: ["zur Last fallen"],
        synonymsTranslation: ["обременять"]
    },
    {
        german: "bewusst",
        translation: "сознательный",
        synonyms: ["geistig wach"],
        synonymsTranslation: ["умственно бодрый"]
    },
    {
        german: "dement",
        translation: "дементный",
        synonyms: ["geistig verwirrt"],
        synonymsTranslation: ["умственно запутанный"]
    },
    {
        german: "verwirrt",
        translation: "запутанный",
        synonyms: ["durcheinander"],
        synonymsTranslation: ["беспорядочный"]
    },
    {
        german: "stundenweise",
        translation: "посчасово",
        synonyms: ["pro Stunde"],
        synonymsTranslation: ["в час"]
    },
    {
        german: "der Aufwand",
        translation: "затраты",
        synonyms: ["die Bemühungen", "die Ausbrenungen"],
        synonymsTranslation: ["усилия", "выгорания"]
    },
    {
        german: "das Ausmaß",
        translation: "масштаб",
        synonyms: ["die Größe", "der Umfang", "die Anzahl"],
        synonymsTranslation: ["размер", "объем", "количество"]
    },
    {
        german: "die Finanzierung",
        translation: "финансирование",
        synonyms: ["die Bezahlung"],
        synonymsTranslation: ["оплата"]
    },
    {
        german: "der Genuss",
        translation: "наслаждение",
        synonyms: ["der Geschmack"],
        synonymsTranslation: ["вкус"]
    },{
        german: "abhängig von",
        translation: "зависимый от",
        synonyms: ["süchtig von"],
        synonymsTranslation: ["одержимый от"]
    },
    {
        german: "anerkannt",
        translation: "признанный",
        synonyms: ["akzeptiert", "nostrifiziert"],
        synonymsTranslation: ["принятый", "легализованный"]
    },
    {
        german: "angewiesen",
        translation: "нуждающийся",
        synonyms: ["Hilfe benötigen"],
        synonymsTranslation: ["требующий помощи"]
    },
    {
        german: "akustisch",
        translation: "акустический",
        synonyms: ["klangmäßig", "laut dem Gehör"],
        synonymsTranslation: ["звуковой", "по слуху"]
    },
    {
        german: "athletisch",
        translation: "атлетический",
        synonyms: ["muskulös", "kräftig"],
        synonymsTranslation: ["мускулистый", "сильный"]
    },{
        german: "barrierefrei",
        translation: "безбарьерный",
        synonyms: ["leicht zugänglich"],
        synonymsTranslation: ["легкодоступный"]
    },
    {
        german: "betroffen",
        translation: "пораженный",
        synonyms: ["auf jdn bezogen", "fassungslos"],
        synonymsTranslation: ["относящийся к кому-либо", "ошеломленный"]
    },
    {
        german: "depressiv",
        translation: "депрессивный",
        synonyms: ["sehr traurig", "traurig"],
        synonymsTranslation: ["очень грустный", "грустный"]
    },
    {
        german: "gesetzlich",
        translation: "законный",
        synonyms: ["rechtlich"],
        synonymsTranslation: ["правовой"]
    },
    {
        german: "hilfreich",
        translation: "полезный",
        synonyms: ["nützlich"],
        synonymsTranslation: ["полезный"]
    },
    {
        german: "illegal",
        translation: "незаконный",
        synonyms: ["verboten"],
        synonymsTranslation: ["запрещенный"]
    },
    {
        german: "legal",
        translation: "законный",
        synonyms: ["gestaltet", "erlaubt"],
        synonymsTranslation: ["оформленный", "разрешенный"]
    },
    {
        german: "optisch",
        translation: "оптический",
        synonyms: ["vom Äußerlichen gesehen"],
        synonymsTranslation: ["с внешней точки зрения"]
    },{
        german: "der Genuss",
        translation: "наслаждение",
        synonyms: ["der Geschmack"],
        synonymsTranslation: ["вкус"]
    },
    {
        german: "die Finanzierung",
        translation: "финансирование",
        synonyms: ["die Bezahlung"],
        synonymsTranslation: ["оплата"]
    },
    {
        german: "die Kontrolle",
        translation: "контроль",
        synonyms: ["die Überwachung"],
        synonymsTranslation: ["надзор"]
    },
    {
        german: "die Lebenserwartung",
        translation: "продолжительность жизни",
        synonyms: ["die Lebensdauer"],
        synonymsTranslation: ["срок службы"]
    },
    {
        german: "der Operation",
        translation: "операция",
        synonyms: ["die OP"],
        synonymsTranslation: ["операция"]
    },
    {
        german: "der Rücksicht",
        translation: "учтивость",
        synonyms: ["der Respekt gegenüber anderen"],
        synonymsTranslation: ["уважение к другим"]
    },
    {
        german: "das Signal",
        translation: "сигнал",
        synonyms: ["das Alarmzeichen"],
        synonymsTranslation: ["тревожный знак"]
    },
    {
        german: "der Sportverein",
        translation: "спортивный клуб",
        synonyms: ["der Sportclub"],
        synonymsTranslation: ["спортивный клуб"]
    },
    {
        german: "die Teilnahme",
        translation: "участие",
        synonyms: ["das Mitmachen", "die Mitwirkung"],
        synonymsTranslation: ["сотрудничество", "содействие"]
    },
    {
        german: "das Verhalten",
        translation: "поведение",
        synonyms: ["die Disziplin", "das Benehmen"],
        synonymsTranslation: ["дисциплина", "манеры"]
    },
    {
        german: "der Verlust",
        translation: "потеря",
        synonyms: ["der Gewinn"],
        synonymsTranslation: ["выигрыш (антоним)"]
    },{
        german: "konsumieren",
        translation: "потреблять",
        synonyms: ["einnehmen", "kaufen", "essen"],
        synonymsTranslation: ["принимать", "покупать", "есть"],
        partOfSpeech: "Verb"
    },
    {
        german: "wandern",
        translation: "совершать пешие прогулки",
        synonyms: ["spazieren in der Natur", "bummeln", "spazieren in der Stadt", "im Einkaufszentrum flanieren"],
        synonymsTranslation: ["гулять на природе", "прогуливаться", "гулять по городу", "фланировать в торговом центре"],
        partOfSpeech: "Verb"
    },
    {
        german: "schätzungsweise",
        translation: "приблизительно",
        synonyms: ["circa", "etwa"],
        synonymsTranslation: ["примерно", "около"],
        partOfSpeech: "Adverb"
    },
    {
        german: "vor allem",
        translation: "прежде всего",
        synonyms: ["besonders"],
        synonymsTranslation: ["особенно"],
        partOfSpeech: "Adverb"
    },
];
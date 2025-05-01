import { Country } from '../types/Country';

/**
 * Fallback data for countries API
 * This is used when the external API is blocked or unavailable
 */
export const fallbackCountries: Country[] = [
  {
    name: {
      common: "United States",
      official: "United States of America",
      nativeName: {
        eng: {
          official: "United States of America",
          common: "United States"
        }
      }
    },
    tld: [".us"],
    cca2: "US",
    ccn3: "840",
    cca3: "USA",
    cioc: "USA",
    independent: true,
    status: "officially-assigned",
    unMember: true,
    currencies: {
      USD: {
        name: "United States dollar",
        symbol: "$"
      }
    },
    idd: {
      root: "+1",
      suffixes: ["201", "202", "203", "205", "206", "207", "208", "209", "210", "212", "213", "214", "215", "216", "217", "218", "220", "224", "225", "227", "228", "229", "231", "234", "239", "240", "248", "251", "252", "253", "254", "256", "260", "261", "262", "264", "265", "267", "268", "269", "270", "272", "274", "275", "276", "278", "280", "281", "284", "289", "290", "291", "297", "298", "299", "345", "351", "352", "353", "354", "355", "356", "357", "358", "359", "370", "371", "372", "373", "374", "375", "376", "377", "378", "379", "380", "381", "382", "383", "385", "386", "387", "389", "420", "421", "423", "500", "501", "502", "503", "504", "505", "506", "507", "508", "509", "590", "591", "592", "593", "594", "595", "596", "597", "598", "599", "670", "672", "673", "674", "675", "676", "677", "678", "679", "680", "681", "682", "683", "685", "686", "687", "688", "689", "690", "691", "692", "693", "694", "695", "696", "697", "698", "699", "850", "852", "853", "855", "856", "857", "858", "860", "861", "862", "863", "864", "865", "866", "867", "868", "869", "870", "871", "872", "873", "874", "875", "876", "877", "878", "879", "880", "881", "882", "883", "886", "960", "961", "962", "963", "964", "965", "966", "967", "968", "970", "971", "972", "973", "974", "975", "976", "977", "992", "993", "994", "995", "996", "998"]
    },
    capital: ["Washington, D.C."],
    altSpellings: ["US", "USA", "United States of America"],
    region: "Americas",
    subregion: "North America",
    languages: {
      eng: "English"
    },
    translations: {
      ara: {
        official: "الولايات المتحدة الأمريكية",
        common: "الولايات المتحدة"
      },
      bre: {
        official: "Stadoù-Unanet Amerika",
        common: "Stadoù-Unanet"
      },
      ces: {
        official: "Spojené státy americké",
        common: "Spojené státy"
      },
      cym: {
        official: "United States of America",
        common: "United States"
      },
      deu: {
        official: "Vereinigte Staaten von Amerika",
        common: "Vereinigte Staaten"
      },
      est: {
        official: "Ameerika Ühendriigid",
        common: "Ameerika Ühendriigid"
      },
      fin: {
        official: "Amerikan yhdysvallat",
        common: "Yhdysvallat"
      },
      fra: {
        official: "Les États-Unis d'Amérique",
        common: "États-Unis"
      },
      hrv: {
        official: "Sjedinjene Američke Države",
        common: "Sjedinjene Američke Države"
      },
      hun: {
        official: "Amerikai Egyesült Államok",
        common: "Amerikai Egyesült Államok"
      },
      ita: {
        official: "Stati Uniti d'America",
        common: "Stati Uniti d'America"
      },
      jpn: {
        official: "アメリカ合衆国",
        common: "アメリカ合衆国"
      },
      kor: {
        official: "아메리카 합중국",
        common: "미국"
      },
      nld: {
        official: "Verenigde Staten van Amerika",
        common: "Verenigde Staten"
      },
      per: {
        official: "ایالات متحده آمریکا",
        common: "ایالات متحده آمریکا"
      },
      pol: {
        official: "Stany Zjednoczone Ameryki",
        common: "Stany Zjednoczone"
      },
      por: {
        official: "Estados Unidos da América",
        common: "Estados Unidos"
      },
      rus: {
        official: "Соединенные Штаты Америки",
        common: "США"
      },
      slk: {
        official: "Spojené štáty americké",
        common: "Spojené štáty"
      },
      spa: {
        official: "Estados Unidos de América",
        common: "Estados Unidos"
      },
      swe: {
        official: "Amerikas förenta stater",
        common: "USA"
      },
      tur: {
        official: "Amerika Birleşik Devletleri",
        common: "Amerika Birleşik Devletleri"
      },
      urd: {
        official: "ریاستہائے متحدہ امریکا",
        common: "ریاستہائے متحدہ"
      },
      zho: {
        official: "美利坚合众国",
        common: "美国"
      }
    },
    latlng: [38, -97],
    landlocked: false,
    borders: ["CAN", "MEX"],
    area: 9833517,
    demonyms: {
      eng: {
        f: "American",
        m: "American"
      },
      fra: {
        f: "Américaine",
        m: "Américain"
      }
    },
    flag: "🇺🇸",
    maps: {
      googleMaps: "https://goo.gl/maps/e8M246zY4BSjkjxy6",
      openStreetMaps: "https://www.openstreetmap.org/relation/148838#map=3/38.97/-95.84"
    },
    population: 329484123,
    gini: {
      "2018": 41.4
    },
    fifa: "USA",
    car: {
      signs: ["USA"],
      side: "right"
    },
    timezones: ["UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00", "UTC-07:00", "UTC-06:00", "UTC-05:00", "UTC-04:00", "UTC+10:00", "UTC+12:00"],
    continents: ["North America"],
    flags: {
      png: "https://flagcdn.com/w320/us.png",
      svg: "https://flagcdn.com/us.svg",
      alt: "The flag of the United States of America is composed of thirteen equal horizontal bands of red alternating with white. A blue rectangle, bearing fifty small five-pointed white stars arranged in nine rows where rows of six stars alternate with rows of five stars, is superimposed in the canton."
    },
    coatOfArms: {
      png: "https://mainfacts.com/media/images/coats_of_arms/us.png",
      svg: "https://mainfacts.com/media/images/coats_of_arms/us.svg"
    },
    startOfWeek: "sunday",
    capitalInfo: {
      latlng: [38.7, -77]
    },
    postalCode: {
      format: "#####-####",
      regex: "^\\d{5}(-\\d{4})?$"
    }
  },
  {
    name: {
      common: "United Kingdom",
      official: "United Kingdom of Great Britain and Northern Ireland",
      nativeName: {
        eng: {
          official: "United Kingdom of Great Britain and Northern Ireland",
          common: "United Kingdom"
        }
      }
    },
    tld: [".uk"],
    cca2: "GB",
    ccn3: "826",
    cca3: "GBR",
    cioc: "GBR",
    independent: true,
    status: "officially-assigned",
    unMember: true,
    currencies: {
      GBP: {
        name: "British pound",
        symbol: "£"
      }
    },
    idd: {
      root: "+4",
      suffixes: ["4"]
    },
    capital: ["London"],
    altSpellings: ["GB", "UK", "Great Britain"],
    region: "Europe",
    subregion: "Northern Europe",
    languages: {
      eng: "English"
    },
    translations: {
      ara: {
        official: "المملكة المتحدة لبريطانيا العظمى وأيرلندا الشمالية",
        common: "المملكة المتحدة"
      },
      bre: {
        official: "Rouantelezh-Unanet Breizh-Veur ha Norzhiwerzhon",
        common: "Rouantelezh-Unanet"
      },
      ces: {
        official: "Spojené království Velké Británie a Severního Irska",
        common: "Spojené království"
      },
      cym: {
        official: "United Kingdom of Great Britain and Northern Ireland",
        common: "United Kingdom"
      },
      deu: {
        official: "Vereinigtes Königreich Großbritannien und Nordirland",
        common: "Vereinigtes Königreich"
      },
      est: {
        official: "Suurbritannia ja Põhja-Iiri Ühendkuningriik",
        common: "Suurbritannia"
      },
      fin: {
        official: "Ison-Britannian ja Pohjois-Irlannin yhdistynyt kuningaskunta",
        common: "Yhdistynyt kuningaskunta"
      },
      fra: {
        official: "Royaume-Uni de Grande-Bretagne et d'Irlande du Nord",
        common: "Royaume-Uni"
      },
      hrv: {
        official: "Ujedinjeno Kraljevstvo Velike Britanije i Sjeverne Irske",
        common: "Ujedinjeno Kraljevstvo"
      },
      hun: {
        official: "Nagy-Britannia és Észak-Írorság Egyesült Királysága",
        common: "Egyesült Királyság"
      },
      ita: {
        official: "Regno Unito di Gran Bretagna e Irlanda del Nord",
        common: "Regno Unito"
      },
      jpn: {
        official: "グレートブリテンおよび北アイルランド連合王国",
        common: "イギリス"
      },
      kor: {
        official: "그레이트브리튼 북아일랜드 연합 왕국",
        common: "영국"
      },
      nld: {
        official: "Verenigd Koninkrijk van Groot-Brittannië en Noord-Ierland",
        common: "Verenigd Koninkrijk"
      },
      per: {
        official: "پادشاهی متحد بریتانیای کبیر و ایرلند شمالی",
        common: "بریتانیا"
      },
      pol: {
        official: "Zjednoczone Królestwo Wielkiej Brytanii i Irlandii Północnej",
        common: "Wielka Brytania"
      },
      por: {
        official: "Reino Unido da Grã-Bretanha e Irlanda do Norte",
        common: "Reino Unido"
      },
      rus: {
        official: "Соединенное Королевство Великобритании и Северной Ирландии",
        common: "Великобритания"
      },
      slk: {
        official: "Spojené kráľovstvo Veľkej Británie a Severného Írska",
        common: "Veľká Británia"
      },
      spa: {
        official: "Reino Unido de Gran Bretaña e Irlanda del Norte",
        common: "Reino Unido"
      },
      swe: {
        official: "Förenade konungariket Storbritannien och Nordirland",
        common: "Storbritannien"
      },
      tur: {
        official: "Büyük Britanya ve Kuzey İrlanda Birleşik Krallığı",
        common: "Birleşik Krallık"
      },
      urd: {
        official: "مملکتِ متحدہ برطانیہ عظمی و شمالی آئرلینڈ",
        common: "مملکتِ متحدہ"
      },
      zho: {
        official: "大不列颠及北爱尔兰联合王国",
        common: "英国"
      }
    },
    latlng: [54, -2],
    landlocked: false,
    borders: ["IRL"],
    area: 242900,
    demonyms: {
      eng: {
        f: "British",
        m: "British"
      },
      fra: {
        f: "Britannique",
        m: "Britannique"
      }
    },
    flag: "🇬🇧",
    maps: {
      googleMaps: "https://goo.gl/maps/v8F4F9Ue8Xb1C2Qq7",
      openStreetMaps: "https://www.openstreetmap.org/relation/62149#map=5/54.5/-2"
    },
    population: 67220000,
    gini: {
      "2017": 35.1
    },
    fifa: "ENG",
    car: {
      signs: ["GB"],
      side: "left"
    },
    timezones: ["UTC-08:00", "UTC-05:00", "UTC-04:00", "UTC-03:00", "UTC-02:00", "UTC", "UTC+01:00", "UTC+02:00", "UTC+06:00"],
    continents: ["Europe"],
    flags: {
      png: "https://flagcdn.com/w320/gb.png",
      svg: "https://flagcdn.com/gb.svg",
      alt: "The flag of the United Kingdom — the Union Jack — features a blue field with the red cross of Saint George edged in white superimposed on the diagonal red cross of Saint Patrick which is superimposed on the diagonal white cross of Saint Andrew. A blue five-pointed star is centered on the cross of Saint Patrick."
    },
    coatOfArms: {
      png: "https://mainfacts.com/media/images/coats_of_arms/gb.png",
      svg: "https://mainfacts.com/media/images/coats_of_arms/gb.svg"
    },
    startOfWeek: "monday",
    capitalInfo: {
      latlng: [51.5, -0.08]
    },
    postalCode: {
      format: "@# #@@|@## #@@|@@# #@@|@@## #@@|@#@ #@@|@@#@ #@@|GIR0AA",
      regex: "^(([A-Z]){1}([0-9][0-9A-Z]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA 1ZZ|GIR 0AA)|(([0-9][A-Z]){1}([0-9][0-9A-Z]?)|(([0-9][0-9]){1}([A-Z][A-Z]?)|(([A-Z][0-9]){1}([0-9][A-Z]?)|(([A-Z]{2}){1}([0-9][0-9A-Z]?)|([0-9]{1}([A-Z][A-Z]?)|([A-Z]{1}([0-9][0-9A-Z]?)"
    }
  }
];

export default fallbackCountries; 
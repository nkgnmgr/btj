export interface Country {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
  sections: Section[];
}

export interface Section {
  title: string;
  content: string[];
}

export const countries: Country[] = [
  {
    code: "us-gb",
    name: "USA & UK",
    flag: "🇺🇸🇬🇧",
    nativeName: "English Speakers",
    sections: [
      {
        title: "Visa & Entry",
        content: [
          "US and UK citizens can visit Japan visa-free for up to 90 days for tourism.",
          "A valid passport is required. Ensure it is valid throughout your stay.",
          "Fill in the arrival card (disembarkation card) on the plane or at the airport.",
          "Japan has re-introduced the Visit Japan Web service — register online before arrival to speed up customs.",
        ],
      },
      {
        title: "Money & Payments",
        content: [
          "Japan is still largely a cash society. Carry Japanese Yen (JPY) at all times.",
          "ATMs at 7-Eleven, Japan Post, and international airports accept foreign cards.",
          "Credit cards are accepted at hotels, department stores, and larger restaurants, but many smaller shops and eateries are cash-only.",
          "IC cards (Suica, Pasmo) are convenient for trains and convenience stores — top them up with cash.",
          "Tipping is not practiced in Japan and can sometimes cause confusion.",
        ],
      },
      {
        title: "Transport",
        content: [
          "The Shinkansen (bullet train) network connects major cities efficiently. The JR Pass is worth considering for extensive travel.",
          "IC cards (Suica/Pasmo) work on almost all trains, buses, and subways nationwide.",
          "Taxis are plentiful but expensive. Ride-sharing apps like Uber operate in limited areas.",
          "Driving is on the left side of the road. An International Driving Permit (IDP) is required.",
        ],
      },
      {
        title: "Communication",
        content: [
          "English signage is common in major cities, airports, and tourist areas.",
          "Google Translate works well — the camera mode can translate Japanese text in real time.",
          "Purchase a pocket Wi-Fi device or SIM card at the airport for data connectivity.",
          "Most convenience stores, train stations, and hotels offer free Wi-Fi.",
        ],
      },
      {
        title: "Culture & Etiquette",
        content: [
          "Remove your shoes when entering homes, traditional ryokan, and some restaurants.",
          "Speak quietly in public spaces such as trains and restaurants.",
          "Eating and drinking while walking is generally frowned upon.",
          "Queuing is strictly observed — always wait in line.",
          "Bowing is the standard greeting. A slight bow of the head is sufficient for tourists.",
          "Do not eat or drink on trains (except Shinkansen long-distance services).",
        ],
      },
      {
        title: "Health & Safety",
        content: [
          "Japan is one of the safest countries in the world for tourists.",
          "Tap water is safe to drink throughout Japan.",
          "Healthcare is excellent but can be expensive. Travel insurance is strongly recommended.",
          "Pharmacies (yakkyoku) are widely available; bring prescriptions for any medications.",
          "In emergencies: Police 110, Ambulance/Fire 119.",
        ],
      },
    ],
  },
  {
    code: "fr",
    name: "France",
    flag: "🇫🇷",
    nativeName: "Français",
    sections: [
      {
        title: "Visa et entrée",
        content: [
          "Les citoyens français peuvent visiter le Japon sans visa pour un séjour touristique allant jusqu'à 90 jours.",
          "Un passeport valide est obligatoire pour toute la durée du séjour.",
          "Remplissez la carte de débarquement dans l'avion ou à l'aéroport.",
          "Le service Visit Japan Web permet de s'enregistrer en ligne avant l'arrivée pour accélérer les formalités douanières.",
        ],
      },
      {
        title: "Argent et paiements",
        content: [
          "Le Japon reste une société en grande partie fondée sur les espèces. Ayez toujours des yens japonais (JPY) sur vous.",
          "Les DAB de 7-Eleven, Japan Post et des grands aéroports acceptent les cartes étrangères.",
          "Les cartes de crédit sont acceptées dans les hôtels et les grands magasins, mais de nombreux petits commerces ne les acceptent pas.",
          "Les cartes IC (Suica, Pasmo) sont pratiques pour les transports et les combinis — rechargez-les en espèces.",
          "Le pourboire n'est pas d'usage au Japon et peut parfois être source de confusion.",
        ],
      },
      {
        title: "Transport",
        content: [
          "Le réseau Shinkansen (train à grande vitesse) relie les grandes villes efficacement. Le JR Pass est intéressant pour les voyages intensifs.",
          "Les cartes IC (Suica/Pasmo) fonctionnent sur presque tous les trains, bus et métros.",
          "Les taxis sont nombreux mais chers. Les applications de VTC comme Uber fonctionnent dans un nombre limité de zones.",
          "La conduite se fait à gauche. Un permis de conduire international (PCI) est obligatoire.",
        ],
      },
      {
        title: "Communication",
        content: [
          "Les panneaux en anglais sont courants dans les grandes villes et les zones touristiques, mais pas en français.",
          "Google Traduction fonctionne bien — le mode appareil photo permet de traduire les textes japonais en temps réel.",
          "Achetez un pocket Wi-Fi ou une carte SIM à l'aéroport pour rester connecté.",
          "La plupart des combinis, gares et hôtels proposent le Wi-Fi gratuit.",
        ],
      },
      {
        title: "Culture et étiquette",
        content: [
          "Retirez vos chaussures en entrant dans les maisons, les ryokan traditionnels et certains restaurants.",
          "Parlez à voix basse dans les espaces publics comme les trains et les restaurants.",
          "Manger ou boire en marchant est généralement mal vu.",
          "Le respect des files d'attente est strict — attendez toujours votre tour.",
          "La révérence est le salut habituel. Un léger signe de tête suffit pour les touristes.",
          "Ne mangez pas ni ne buvez pas dans les trains (sauf à bord du Shinkansen).",
        ],
      },
      {
        title: "Santé et sécurité",
        content: [
          "Le Japon est l'un des pays les plus sûrs au monde pour les touristes.",
          "L'eau du robinet est potable partout au Japon.",
          "Les soins médicaux sont excellents mais peuvent être coûteux. Une assurance voyage est vivement recommandée.",
          "Les pharmacies (yakkyoku) sont nombreuses ; apportez les ordonnances pour vos médicaments.",
          "En cas d'urgence : Police 110, Ambulance/Pompiers 119.",
        ],
      },
    ],
  },
  {
    code: "it",
    name: "Italy",
    flag: "🇮🇹",
    nativeName: "Italiano",
    sections: [
      {
        title: "Visto e ingresso",
        content: [
          "I cittadini italiani possono visitare il Giappone senza visto per soggiorni turistici fino a 90 giorni.",
          "È obbligatorio un passaporto valido per tutta la durata del soggiorno.",
          "Compilare la carta di sbarco sull'aereo o all'aeroporto.",
          "Il servizio Visit Japan Web consente di registrarsi online prima dell'arrivo per velocizzare le pratiche doganali.",
        ],
      },
      {
        title: "Denaro e pagamenti",
        content: [
          "Il Giappone è ancora in gran parte una società basata sul contante. Tenere sempre yen giapponesi (JPY) con sé.",
          "I bancomat di 7-Eleven, Japan Post e degli aeroporti internazionali accettano carte straniere.",
          "Le carte di credito sono accettate negli hotel e grandi magazzini, ma molti piccoli negozi e ristoranti accettano solo contanti.",
          "Le schede IC (Suica, Pasmo) sono comode per i trasporti e i convenience store — ricaricarle con contanti.",
          "Le mance non sono usate in Giappone e possono a volte creare imbarazzo.",
        ],
      },
      {
        title: "Trasporti",
        content: [
          "La rete Shinkansen (treno ad alta velocità) collega le principali città in modo efficiente. Il JR Pass vale la pena per chi viaggia molto.",
          "Le schede IC (Suica/Pasmo) funzionano quasi su tutti i treni, autobus e metropolitane.",
          "I taxi sono numerosi ma costosi. Le app di ride-sharing come Uber operano in aree limitate.",
          "Si guida sul lato sinistro della strada. È necessario un Permesso di Guida Internazionale (PGI).",
        ],
      },
      {
        title: "Comunicazione",
        content: [
          "I cartelli in inglese sono comuni nelle grandi città e nelle zone turistiche.",
          "Google Traduttore funziona bene — la modalità fotocamera traduce i testi giapponesi in tempo reale.",
          "Acquistare un dispositivo Wi-Fi tascabile o una SIM card all'aeroporto per la connettività dati.",
          "La maggior parte dei convenience store, stazioni e hotel offre Wi-Fi gratuito.",
        ],
      },
      {
        title: "Cultura ed etichetta",
        content: [
          "Togliersi le scarpe entrando nelle case, nei ryokan tradizionali e in alcuni ristoranti.",
          "Parlare a voce bassa negli spazi pubblici come treni e ristoranti.",
          "Mangiare o bere camminando è generalmente mal visto.",
          "Fare la fila è una regola ferrea — aspettare sempre il proprio turno.",
          "L'inchino è il saluto standard. Un lieve cenno del capo è sufficiente per i turisti.",
          "Non mangiare né bere sui treni (eccetto gli Shinkansen a lunga percorrenza).",
        ],
      },
      {
        title: "Salute e sicurezza",
        content: [
          "Il Giappone è uno dei paesi più sicuri al mondo per i turisti.",
          "L'acqua del rubinetto è potabile in tutto il Giappone.",
          "L'assistenza sanitaria è eccellente ma può essere costosa. L'assicurazione di viaggio è vivamente consigliata.",
          "Le farmacie (yakkyoku) sono diffuse; portare le ricette per i medicinali.",
          "In caso di emergenza: Polizia 110, Ambulanza/Vigili del Fuoco 119.",
        ],
      },
    ],
  },
  {
    code: "in",
    name: "India",
    flag: "🇮🇳",
    nativeName: "English / हिन्दी",
    sections: [
      {
        title: "Visa & Entry",
        content: [
          "Indian citizens require a visa to enter Japan. Apply at the Embassy or Consulate of Japan in India well in advance.",
          "Tourist visas are typically single-entry and valid for 15 or 30 days.",
          "Required documents generally include: passport, application form, photos, bank statements, employment proof, and itinerary.",
          "Fill in the arrival card (disembarkation card) on the plane or at the airport.",
        ],
      },
      {
        title: "Money & Payments",
        content: [
          "Japan relies heavily on cash. Carry Japanese Yen (JPY) at all times.",
          "ATMs at 7-Eleven and Japan Post accept international cards including Visa and Mastercard.",
          "Indian Rupees cannot be exchanged easily in Japan — convert to JPY before departing or at airport exchange counters.",
          "Credit cards are accepted in hotels and large stores but many smaller shops are cash-only.",
          "Tipping is not customary in Japan.",
        ],
      },
      {
        title: "Food & Dietary Needs",
        content: [
          "Vegetarian options exist but may be limited outside major cities — many broths and sauces contain fish or meat.",
          "Vegan and Jain-friendly restaurants are available in Tokyo, Kyoto, and Osaka, but are not common everywhere.",
          "Convenience stores (combini) sell onigiri (rice balls), sandwiches, and noodles — ask staff or check packaging carefully.",
          "Halal-certified restaurants can be found in major cities. Apps like Halal Navi can help locate them.",
          "Do not expect spicy food by default — Japanese cuisine is generally mild.",
        ],
      },
      {
        title: "Transport",
        content: [
          "The Shinkansen (bullet train) is fast, punctual, and efficient. The JR Pass offers good value for multi-city travel.",
          "IC cards (Suica/Pasmo) can be used on trains, buses, and subways across Japan.",
          "Taxis are metered and safe but expensive.",
          "Driving is on the left side. An International Driving Permit (IDP) is required.",
        ],
      },
      {
        title: "Culture & Etiquette",
        content: [
          "Remove shoes when entering homes, traditional inns (ryokan), and some restaurants.",
          "Speak quietly in public spaces — loud conversation on trains is frowned upon.",
          "Queuing strictly is the norm; do not cut lines.",
          "Bowing is the standard greeting — a slight nod suffices for tourists.",
          "Do not eat or drink while walking in public.",
        ],
      },
      {
        title: "Health & Safety",
        content: [
          "Japan is extremely safe for tourists.",
          "Tap water is safe to drink throughout Japan.",
          "Medical facilities are excellent but expensive — travel insurance is strongly recommended.",
          "Bring sufficient supply of any prescription medicines along with the prescription.",
          "In emergencies: Police 110, Ambulance/Fire 119.",
        ],
      },
    ],
  },
  {
    code: "tr",
    name: "Turkey",
    flag: "🇹🇷",
    nativeName: "Türkçe",
    sections: [
      {
        title: "Vize ve Giriş",
        content: [
          "Türk vatandaşları Japonya'ya turistik amaçlı vizesiz olarak 90 güne kadar giriş yapabilir.",
          "Konaklama süresince geçerli bir pasaport zorunludur.",
          "Uçakta veya havalimanında varış kartını (disembarkation card) doldurun.",
          "Gümrük işlemlerini hızlandırmak için Visit Japan Web hizmetine önceden kayıt olabilirsiniz.",
        ],
      },
      {
        title: "Para ve Ödemeler",
        content: [
          "Japonya büyük ölçüde nakit kullanılan bir ülkedir. Yanınızda her zaman Japon Yeni (JPY) bulundurun.",
          "7-Eleven, Japan Post ve uluslararası havalimanlarındaki ATM'ler yabancı kartları kabul eder.",
          "Kredi kartları otellerde ve büyük mağazalarda kabul edilse de küçük dükkânlar ve lokantalar genellikle yalnızca nakit ister.",
          "IC kartlar (Suica, Pasmo) toplu taşıma ve marketlerde kullanışlıdır — nakit ile yükleyin.",
          "Japonya'da bahşiş kültürü yoktur ve zaman zaman karşı tarafı rahatsız edebilir.",
        ],
      },
      {
        title: "Ulaşım",
        content: [
          "Shinkansen (hızlı tren) ağı büyük şehirleri verimli biçimde birbirine bağlar. Yoğun seyahatler için JR Pass düşünülebilir.",
          "IC kartlar (Suica/Pasmo) hemen hemen tüm tren, otobüs ve metro hatlarında geçerlidir.",
          "Taksiler bol ve güvenli olmakla birlikte pahalıdır.",
          "Trafikte sol taraftan gidilir. Uluslararası Sürücü Belgesi (USB) zorunludur.",
        ],
      },
      {
        title: "İletişim",
        content: [
          "Büyük şehirlerde ve turistik bölgelerde İngilizce tabelalar yaygındır.",
          "Google Çeviri iyi çalışır — kamera modu Japonca metinleri anında çevirebilir.",
          "Veri bağlantısı için havalimanında cep Wi-Fi cihazı veya SIM kart satın alın.",
          "Pek çok market, tren istasyonu ve otelde ücretsiz Wi-Fi mevcuttur.",
        ],
      },
      {
        title: "Kültür ve Görgü Kuralları",
        content: [
          "Evlere, geleneksel ryokanlara ve bazı lokantalara girerken ayakkabılarınızı çıkarın.",
          "Tren ve restoran gibi kamuya açık alanlarda alçak sesle konuşun.",
          "Yürürken yemek yemek veya içmek hoş karşılanmaz.",
          "Kuyruğa saygı göstermek olmazsa olmazdır — her zaman sıranızı bekleyin.",
          "Japonya'da selamlama şekli eğilmektir. Turistler için hafif bir baş eğmek yeterlidir.",
          "Trenlerde yemek yemekten kaçının (uzun mesafeli Shinkansen hariç).",
        ],
      },
      {
        title: "Sağlık ve Güvenlik",
        content: [
          "Japonya, turistler için dünyanın en güvenli ülkelerinden biridir.",
          "Japonya genelinde musluk suyu içilebilir.",
          "Sağlık hizmetleri mükemmeldir ancak pahalı olabilir. Seyahat sigortası şiddetle tavsiye edilir.",
          "Reçeteli ilaçlarınızı reçeteleriyle birlikte yeterli miktarda getirin.",
          "Acil durumlar için: Polis 110, Ambulans/İtfaiye 119.",
        ],
      },
    ],
  },
  {
    code: "cn",
    name: "China",
    flag: "🇨🇳",
    nativeName: "中文",
    sections: [
      {
        title: "签证与入境",
        content: [
          "中国公民前往日本须提前申请旅游签证。",
          "请向所在地的日本驻华使馆或领事馆提交申请，并提前充分准备材料。",
          "通常所需材料包括：护照、申请表、照片、银行流水、在职证明及行程单。",
          "抵达时须在飞机上或机场填写入境申报卡（入国記録カード）。",
        ],
      },
      {
        title: "货币与支付",
        content: [
          "日本仍以现金为主。请随时携带足量日元（JPY）。",
          "7-Eleven、日本邮政及各大国际机场的ATM机接受银联卡及Visa/Mastercard。",
          "人民币在日本几乎无法兑换，建议出发前或到达机场后兑换日元。",
          "信用卡在酒店和大型商场可用，但许多小店和餐厅仅收现金。",
          "日本没有给小费的习惯，请勿给小费。",
        ],
      },
      {
        title: "交通出行",
        content: [
          "新干线（子弹头列车）高效连接各主要城市，多城市游可考虑购买JR Pass。",
          "IC卡（Suica/Pasmo）适用于全国几乎所有电车、公交及地铁。",
          "出租车数量充足且安全，但价格较贵。",
          "日本靠左行驶，驾车需持国际驾照（IDP）。",
        ],
      },
      {
        title: "通讯与网络",
        content: [
          "主要城市和旅游区有英文标识，但中文标识较少。",
          "Google翻译在日本可能受限，建议提前下载离线翻译应用（如百度翻译、有道词典）。",
          "可在机场购买口袋WiFi设备或日本当地SIM卡，保持网络畅通。",
          "多数便利店、车站及酒店提供免费Wi-Fi。",
        ],
      },
      {
        title: "文化与礼仪",
        content: [
          "进入民居、传统旅馆（旅館）及部分餐厅时须脱鞋。",
          "在公共场所（如电车、餐厅）请保持安静，不要大声说话。",
          "边走边吃被视为失礼行为。",
          "严格遵守排队秩序，切勿插队。",
          "日本以鞠躬作为打招呼方式，游客轻点头即可。",
          "除新干线远途列车外，请勿在电车内饮食。",
        ],
      },
      {
        title: "健康与安全",
        content: [
          "日本是全球最安全的旅游目的地之一。",
          "全日本自来水均可直接饮用。",
          "医疗水平极高，但费用较贵，强烈建议购买旅行保险。",
          "携带处方药时请附上处方及足够数量的药物。",
          "紧急情况联系方式：警察110，救护车/消防119。",
        ],
      },
    ],
  },
  {
    code: "kr",
    name: "Korea",
    flag: "🇰🇷",
    nativeName: "한국어",
    sections: [
      {
        title: "비자 및 입국",
        content: [
          "한국 국적자는 관광 목적으로 최대 90일간 무비자로 일본에 입국할 수 있습니다.",
          "체류 기간 동안 유효한 여권이 필요합니다.",
          "기내 또는 공항에서 입국 신고서(출입국 기록 카드)를 작성하세요.",
          "Visit Japan Web 서비스에 사전 등록하면 입국 절차를 간소화할 수 있습니다.",
        ],
      },
      {
        title: "환전 및 결제",
        content: [
          "일본은 여전히 현금 사용 비중이 높습니다. 항상 일본 엔화(JPY)를 소지하세요.",
          "7-Eleven, 일본 우체국, 주요 국제공항의 ATM에서 외국 카드를 사용할 수 있습니다.",
          "신용카드는 호텔과 대형 매장에서 사용 가능하지만, 소규모 가게나 식당은 현금만 받는 경우가 많습니다.",
          "IC 카드(Suica, Pasmo)는 교통 및 편의점에서 편리하게 사용할 수 있습니다. 현금으로 충전하세요.",
          "일본에는 팁 문화가 없습니다. 팁을 주는 것은 오히려 당황스러울 수 있습니다.",
        ],
      },
      {
        title: "교통",
        content: [
          "신칸센(고속열차) 네트워크가 주요 도시를 효율적으로 연결합니다. 여러 도시를 여행할 경우 JR 패스를 고려하세요.",
          "IC 카드(Suica/Pasmo)는 전국 대부분의 전철, 버스, 지하철에서 사용할 수 있습니다.",
          "택시는 많지만 요금이 비쌉니다.",
          "일본은 좌측통행입니다. 운전 시 국제운전면허증(IDP)이 필요합니다.",
        ],
      },
      {
        title: "통신",
        content: [
          "주요 도시와 관광지에는 영어 안내가 많으나 한국어 안내는 제한적입니다.",
          "Google 번역이 잘 작동합니다. 카메라 모드를 이용하면 일본어 텍스트를 실시간으로 번역할 수 있습니다.",
          "데이터 연결을 위해 공항에서 포켓 Wi-Fi나 SIM 카드를 구입하세요.",
          "대부분의 편의점, 기차역, 호텔에서 무료 Wi-Fi를 제공합니다.",
        ],
      },
      {
        title: "문화 및 예절",
        content: [
          "집, 료칸(전통 여관), 일부 식당에 들어갈 때는 신발을 벗으세요.",
          "기차나 식당 등 공공장소에서는 조용히 대화하세요.",
          "걸으면서 음식을 먹는 것은 예의에 어긋납니다.",
          "줄서기 문화가 철저합니다. 항상 차례를 지키세요.",
          "인사는 고개를 숙이는 방식입니다. 관광객은 가볍게 목례하면 충분합니다.",
          "기차 안에서는 음식을 먹지 마세요(장거리 신칸센 제외).",
        ],
      },
      {
        title: "건강 및 안전",
        content: [
          "일본은 세계에서 가장 안전한 여행지 중 하나입니다.",
          "일본 전역에서 수돗물을 마실 수 있습니다.",
          "의료 수준은 매우 높지만 비용이 많이 들 수 있습니다. 여행자 보험 가입을 강력히 권장합니다.",
          "처방 의약품은 처방전과 함께 충분한 양을 지참하세요.",
          "긴급 상황: 경찰 110, 구급차/소방 119.",
        ],
      },
    ],
  },
  {
    code: "other",
    name: "Other",
    flag: "🌍",
    nativeName: "All visitors",
    sections: [
      {
        title: "Visa & Entry",
        content: [
          "Visa requirements vary by nationality. Check the Ministry of Foreign Affairs of Japan website (mofa.go.jp) for the latest requirements for your country.",
          "Citizens of many countries can enter visa-free for tourism — typically for 15, 30, or 90 days.",
          "For visa applications, contact the nearest Japanese Embassy or Consulate in your country.",
          "Fill in the arrival card (disembarkation card) on the plane or at the airport upon arrival.",
          "The Visit Japan Web service allows pre-registration to expedite customs and immigration.",
        ],
      },
      {
        title: "Money & Payments",
        content: [
          "Japan is still primarily a cash society. Always carry Japanese Yen (JPY).",
          "ATMs at 7-Eleven, Japan Post, and international airports accept most international cards (Visa, Mastercard, etc.).",
          "Currency exchange is available at airports, banks, and some hotels.",
          "Credit cards are accepted in hotels and large stores; smaller establishments often require cash.",
          "IC cards (Suica, Pasmo) are convenient for trains and convenience stores — recharge with cash.",
          "Tipping is not practiced in Japan.",
        ],
      },
      {
        title: "Transport",
        content: [
          "The Shinkansen (bullet train) is the fastest way to travel between cities. The JR Pass offers unlimited travel on JR lines for a fixed price.",
          "IC cards (Suica/Pasmo) work on nearly all trains, subways, and buses in Japan.",
          "Taxis are widely available but expensive. Ride-sharing apps have limited coverage.",
          "If renting a car, Japan drives on the left side. An International Driving Permit (IDP) is required.",
        ],
      },
      {
        title: "Communication",
        content: [
          "English signage is common in major cities and tourist areas.",
          "Google Translate works well in Japan; the camera mode translates Japanese text in real time.",
          "Purchase a pocket Wi-Fi device or SIM card at the airport for reliable internet access.",
          "Free Wi-Fi is available in most convenience stores, train stations, and hotels.",
        ],
      },
      {
        title: "Culture & Etiquette",
        content: [
          "Remove shoes when entering homes, traditional ryokan inns, and some restaurants.",
          "Keep voices low in public spaces such as trains and restaurants.",
          "Walking while eating or drinking is generally frowned upon.",
          "Queuing is strictly observed — always wait in line.",
          "Bowing is the standard greeting; a slight nod of the head is fine for visitors.",
          "Avoid eating or drinking on trains (long-distance Shinkansen services are an exception).",
        ],
      },
      {
        title: "Health & Safety",
        content: [
          "Japan is one of the safest countries in the world for tourists.",
          "Tap water is safe to drink throughout Japan.",
          "Healthcare is excellent but can be expensive. Travel insurance is strongly recommended.",
          "Pharmacies (yakkyoku) are widely available; bring prescriptions for any medications.",
          "In emergencies: Police 110, Ambulance/Fire 119.",
        ],
      },
    ],
  },
];

export function getCountry(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}

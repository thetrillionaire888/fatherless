// Central data: bilingual (EN/ID) Bible verses, stories, orphanages, help options.
// English Bible: King James Version (KJV).
// Indonesian Bible: Terjemahan Baru (TB) from Lembaga Alkitab Indonesia (LAI).

export type ViewName = "home" | "calendar" | "map" | "gallery" | "donation";

export type Localized = { en: string; id: string };

export type BibleVerse = {
  ref: Localized;
  title: Localized;
  verses: { num: Localized; text: Localized }[];
};

export const BIBLE_VERSES: BibleVerse[] = [
  {
    ref: { en: "Deuteronomy 26:10\u201313", id: "Ulangan 26:10\u201313" },
    title: {
      en: "The Firstfruits & the Fatherless",
      id: "Hasil Pertama & Anak Yatim",
    },
    verses: [
      {
        num: { en: "10", id: "10" },
        text: {
          en: "And now, behold, I have brought the firstfruits of the land, which thou, O LORD, hast given me. And thou shalt set it before the LORD thy God, and worship before the LORD thy God:",
          id: "Maka sekarang sesungguhnya aku telah membawa persembahan dari hasil pertama dari tanah yang Kauberikan kepadaku, ya TUHAN. Lalu kausimpan itu di hadapan TUHAN, Allahmu, dan sujud menyembah di hadapan TUHAN, Allahmu;",
        },
      },
      {
        num: { en: "11", id: "11" },
        text: {
          en: "And thou shalt rejoice in every good thing which the LORD thy God hath given unto thee, and unto thine house, thou, and the Levite, and the stranger that is among you.",
          id: "engkau bersukaria karena segala yang baik yang diberikan TUHAN, Allahmu, kepadamu dan kepada seisi rumahmu, baik engkau sendiri maupun orang Lewi dan orang asing yang ada di antaramu.",
        },
      },
      {
        num: { en: "12", id: "12" },
        text: {
          en: "When thou hast made an end of tithing all the tithes of thine increase the third year, which is the year of tithing, and hast given it unto the Levite, the stranger, the fatherless, and the widow, that they may eat within thy gates, and be filled;",
          id: "Pada tahun ketiga, yaitu tahun persembahan persepuluhan, ketika engkau sudah memberikan seluruh persembahan persepuluhan dari hasil tanahmu dan telah menyerahkannya kepada orang Lewi, kepada orang asing, kepada anak yatim dan kepada janda, supaya mereka dapat makan di dalam tempat-tempatmu sampai kenyang,",
        },
      },
      {
        num: { en: "13", id: "13" },
        text: {
          en: "Then thou shalt say before the LORD thy God, I have brought away the hallowed things out of mine house, and also have given them unto the Levite, and unto the stranger, to the fatherless, and to the widow, according to all thy commandments which thou hast commanded me: I have not transgressed thy commandments, neither have I forgotten them:",
          id: "maka engkau berkata di hadapan TUHAN, Allahmu: Aku telah menyingkirkan yang kudus dari rumahku dan aku telah memberikannya kepada orang Lewi, kepada orang asing, kepada anak yatim dan kepada janda, sesuai dengan segala perintah yang Kauberikan kepadaku; aku tidak melanggar ataupun menyampingkan perintah-Mu itu,",
        },
      },
    ],
  },
  {
    ref: { en: "Malachi 3:7\u201312", id: "Maleakhi 3:7\u201312" },
    title: {
      en: "Prove Me Now Herewith",
      id: "Ujilah Aku, Sungguh",
    },
    verses: [
      {
        num: { en: "7", id: "7" },
        text: {
          en: "Even from the days of your fathers ye are gone away from mine ordinances, and have not kept them. Return unto me, and I will return unto you, saith the LORD of hosts. But ye said, Wherein shall we return?",
          id: "Sejak zaman nenek moyangmu kamu telah menyimpang dari ketetapan-Ku dan tidak memeliharanya. Kembalilah kepada-Ku, maka Aku akan kembali kepadamu, firman TUHAN semesta alam. Tetapi kamu bertanya: Dengan apa kami harus kembali?",
        },
      },
      {
        num: { en: "8", id: "8" },
        text: {
          en: "Will a man rob God? Yet ye have robbed me. But ye say, Wherein have we robbed thee? In tithes and offerings.",
          id: "Bolehkah manusia menipu Allah? Namun kamu menipu Aku. Tetapi kamu bertanya: Dengan apa kami menipu Engkau? Mengenai persembahan persepuluhan dan persembahan khusus.",
        },
      },
      {
        num: { en: "9", id: "9" },
        text: {
          en: "Ye are cursed with a curse: for ye have robbed me, even this whole nation.",
          id: "Kamu kena kutuk, ya kamu seluruh bangsa itu, karena kamu menipu Aku.",
        },
      },
      {
        num: { en: "10", id: "10" },
        text: {
          en: "Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it.",
          id: "Bawalah seluruh persembahan persepuluhan itu ke dalam rumah perbendaharaan, supaya ada persediaan makanan di rumah-Ku. \u201CUjilah Aku, sungguh, beginilah firman TUHAN semesta alam, apakah Aku tidak membukakan tingkap-tingkap langit dan mencurahkan berkat kepadamu sampai berkelimpahan.\u201D",
        },
      },
      {
        num: { en: "11", id: "11" },
        text: {
          en: "And I will rebuke the devourer for your sakes, and he shall not destroy the fruits of your ground; neither shall your vine cast her fruit before the time in the field, saith the LORD of hosts.",
          id: "Aku akan hardik bagi kamu segala pelahak, supaya jangan ia memakan habis hasil tanahmu dan jangan pohon anggur di ladangmu berbuah gugur, firman TUHAN semesta alam.",
        },
      },
      {
        num: { en: "12", id: "12" },
        text: {
          en: "And all nations shall call you blessed: for ye shall be a delightsome land, saith the LORD of hosts.",
          id: "Maka segala bangsa akan menyebut kamu berbahagia, sebab kamu ini negeri yang disayangi, firman TUHAN semesta alam.",
        },
      },
    ],
  },
  {
    ref: { en: "Isaiah 58:6\u20137", id: "Yesaya 58:6\u20137" },
    title: {
      en: "The Fast I Have Chosen",
      id: "Puasa yang Kuingini",
    },
    verses: [
      {
        num: { en: "6", id: "6" },
        text: {
          en: "Is not this the fast that I have chosen? to loose the bands of wickedness, to undo the heavy burdens, and to let the oppressed go free, and that ye break every yoke?",
          id: "Bukankah puasa yang Kuingini ini: membuka tali-tali pengerahan orang-orang yang diperlakukan secara tidak adil, melepaskan tali-tali kuk, membebaskan orang-orang yang tertindas, dan memutuskan setiap kuk?",
        },
      },
      {
        num: { en: "7", id: "7" },
        text: {
          en: "Is it not to deal thy bread to the hungry, and that thou bring the poor that are cast out to thy house? when thou seest the naked, that thou cover him; and that thou hide not thyself from thine own flesh?",
          id: "Bukankah membagi rotimu dengan orang yang lapar, dan membawa ke rumahmu orang-orang miskin yang tidak punya rumah, dan apabila engkau melihat orang telanjang, supaya engkau menutupi dia, dan tidak menyembunyikan diri terhadap saudaramu sendiri?",
        },
      },
    ],
  },
  {
    ref: { en: "James 1:27", id: "Yakobus 1:27" },
    title: {
      en: "Pure Religion Undefiled",
      id: "Ibadah yang Murni",
    },
    verses: [
      {
        num: { en: "27", id: "27" },
        text: {
          en: "Pure religion and undefiled before God and the Father is this, To visit the fatherless and widows in their affliction, and to keep himself unspotted from the world.",
          id: "Ibadah yang murni dan yang tak bernoda di hadapan Allah, Bapa kita, ialah mengunjungi yatim piatu dan janda-janda dalam kesusahan mereka, dan menjaga dirinya supaya tidak ternoda oleh dunia.",
        },
      },
    ],
  },
  {
    ref: { en: "Psalm 68:4\u20135", id: "Mazmur 68:5\u20136" },
    title: {
      en: "A Father of the Fatherless",
      id: "Bapak bagi Anak Yatim",
    },
    verses: [
      {
        num: { en: "4", id: "5" },
        text: {
          en: "Sing unto God, sing praises to his name: extol him that rideth upon the heavens by his name JAH, and rejoice before him.",
          id: "Seorang bapak bagi anak yatim, dan pembela bagi janda-janda, ialah Allah di tempat-Nya yang kudus.",
        },
      },
      {
        num: { en: "5", id: "6" },
        text: {
          en: "A father of the fatherless, and a judge of the widows, is God in his holy habitation.",
          id: "Allah memberi tempat tinggal kepada orang yang sendirian dan membawa orang-orang tawanan keluar menuju kesejahteraan, tetapi orang-orang yang murtad akan diam di tanah yang gersang.",
        },
      },
    ],
  },
];

export type Orphanage = {
  id: string;
  name: Localized;
  location: Localized;
  region: Localized;
  lat: number;
  lng: number;
  children: number;
  story: Localized;
  condition: Localized;
  established: Localized;
  image: string;
  // Optional detailed credentials (present for the main Bantul house)
  fullName?: Localized;
  aksaraJawa?: string;
  fullAddress?: string;
  mapsEmbedUrl?: string;
  mapsLinkUrl?: string;
};

export const ORPHANAGES: Orphanage[] = [
  {
    id: "bantul",
    name: { en: "Yayasan Rumah Buah Hati", id: "Yayasan Rumah Buah Hati" },
    location: { en: "Bantul, Yogyakarta", id: "Bantul, Yogyakarta" },
    region: {
      en: "Yogyakarta, Indonesia",
      id: "Yogyakarta, Indonesia",
    },
    lat: -7.7985,
    lng: 110.4019,
    children: 30,
    story: {
      en: "The home founded by Mrs Telly Panjaitan after a vow made at her child's sickbed. Today it shelters thirty fatherless children, kept in the Christian faith by relentless sacrifice.",
      id: "Rumah yang didirikan oleh Ibu Telly Panjaitan setelah janji yang dibuat di tempat tidur anaknya yang sakit. Kini menaungi tiga puluh anak yatim, yang dijaga dalam iman Kristen melalui pengorbanan tanpa henti.",
    },
    condition: {
      en: "Modest concrete home with a small chapel. Needs rice, school fees, and a new roof before the rainy season.",
      id: "Rumah beton sederhana dengan kapel kecil. Membutuhkan beras, biaya sekolah, dan atap baru sebelum musim hujan.",
    },
    established: {
      en: "Founded from a mother's vow",
      id: "Didirikan dari janji seorang ibu",
    },
    image: "/images/house-real-facade.png",
    // Full official name (Bahasa Indonesia) + archaic Javanese script (Aksara Jawa)
    fullName: {
      en: "Panti Asuhan Rumah Buah Hati",
      id: "Panti Asuhan Rumah Buah Hati",
    },
    aksaraJawa: "\uA9CB\uA9A5\uA9A4\uA9C0\uA9A0\uA9B6\uA984\uA9B1\uA9B8\uA9B2\uA9A4\uA9C0\uA9AB\uA9B8\uA9A9\uA983\uA9A7\uA9B8\uA9AE\uA983\uA9B2\uA9A0\uA9B6",
    fullAddress:
      "Jalan Surya No.24 Tegalrejo, Jomblangan, Banguntapan, Kec. Banguntapan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55198",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.91825026402!2d110.39929901241953!3d-7.798479792189242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5760c7a0d3bf%3A0x314778d9cd4fdeb7!2z6qeL6qal6qak6qeA6qag6qa26qaE6qax6qa46qay6qak6qeA6qar6qa46qap6qaD6qan6qa46qau6qaD6qay6qag6qa2IFBhbnRpIEFzdWhhbiBSdW1haCBCdWFoIEhhdGk!5e0!3m2!1sen!2sid!4v1781942563402!5m2!1sen!2sid",
    mapsLinkUrl:
      "https://www.google.com/maps/place/%EA%A7%8B%EA%A6%A5%EA%A6%A4%EA%A7%80%EA%A6%A0%EA%A6%B6%EA%A6%84%EA%A6%B1%EA%A6%B8%EA%A6%B2%EA%A6%A4%EA%A7%80%EA%A6%AB%EA%A6%B8%EA%A6%A9%EA%A6%83%EA%A6%A7%EA%A6%B8%EA%A6%AE%EA%A6%83%EA%A6%B2%EA%A6%A0%EA%A6%B6+Panti+Asuhan+Rumah+Buah+Hati/@-7.7984798,110.399299,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a5760c7a0d3bf:0x314778d9cd4fdeb7!8m2!3d-7.7984798!4d110.4018793!16s%2Fg%2F1pzpkkdj7?entry=ttu&g_ep=EgoyMDI2MDUxNi4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: "semarang",
    name: { en: "Panti Asuhan Majapahit", id: "Panti Asuhan Majapahit" },
    location: { en: "Majapahit, Semarang", id: "Majapahit, Semarang" },
    region: {
      en: "Central Java, Indonesia",
      id: "Jawa Tengah, Indonesia",
    },
    lat: -6.9667,
    lng: 110.4167,
    children: 22,
    story: {
      en: "A small Christian orphanage in the old Majapahit quarter, quietly caring for children turned away from state-run homes because they would not renounce Christ.",
      id: "Panti asuhan Kristen kecil di kawasan Majapahit lama, yang diam-diam merawat anak-anak yang ditolak dari panti negara karena mereka tidak mau menyangkal Kristus.",
    },
    condition: {
      en: "Weathered two-storey house. The well runs dry in dry season; children share one study table for homework.",
      id: "Rumah dua lantai yang lapuk. Sumur kering di musim kemarau; anak-anak berbagi satu meja belajar untuk mengerjakan PR.",
    },
    established: {
      en: "Caring quietly for over a decade",
      id: "Merawat secara diam-diam selama lebih dari satu dekade",
    },
    image: "/images/orphanage-surabaya.png",
  },
  {
    id: "surabaya",
    name: {
      en: "Rumah Kembang Kuning",
      id: "Rumah Kembang Kuning",
    },
    location: {
      en: "Makam Kembang Kuning, Surabaya",
      id: "Makam Kembang Kuning, Surabaya",
    },
    region: {
      en: "East Java, Indonesia",
      id: "Jawa Timur, Indonesia",
    },
    lat: -7.2575,
    lng: 112.7521,
    children: 18,
    story: {
      en: "Near the old Kembang Kuning tomb district, this home receives infants abandoned at dawn — many left at the gate in cardboard boxes with a scribbled Christian name.",
      id: "Di dekat kawasan makam Kembang Kuning yang lama, rumah ini menerima bayi yang ditinggalkan saat fajar — banyak yang ditinggalkan di gerbang dalam kotak kardus dengan nama Kristen yang dicoret-coret.",
    },
    condition: {
      en: "Cramped rooms, leaking ceiling, and a single kerosene stove for all meals. Volunteers keep watch in shifts through the night.",
      id: "Kamar sempit, atap bocor, dan satu kompor minyak tanah untuk semua makanan. Relawan bergiliran menjaga sepanjang malam.",
    },
    established: {
      en: "A refuge at the city's edge",
      id: "Tempat pengungsian di tepi kota",
    },
    image: "/images/orphanage-surabaya.png",
  },
];

export type Story = {
  id: string;
  perspective: "Caregiver" | "Child" | "Donor" | "Field";
  title: Localized;
  subtitle: Localized;
  body: Localized[];
  image?: string;
  highlight?: boolean;
};

export const STORIES: Story[] = [
  {
    id: "untold",
    perspective: "Field",
    title: {
      en: "The Untold Story",
      id: "Kisah yang Tak Terungkap",
    },
    subtitle: {
      en: "Christian orphans, abandoned by the state, in the world's largest Muslim country.",
      id: "Anak yatim Kristen, ditinggalkan negara, di negara berpenduduk Muslim terbesar di dunia.",
    },
    body: [
      {
        en: "Indonesia is home to more Muslims than any other nation on earth. Its government-backed orphanages are many — yet for a fatherless child who bears the name of Christ, those doors often close, or open only on one condition: that the child convert and leave the faith of their parents.",
        id: "Indonesia adalah rumah bagi lebih banyak umat Muslim daripada negara mana pun di dunia. Panti asuhan yang didukung negara jumlahnya banyak — namun bagi seorang anak yatim yang menyandang nama Kristus, pintu-pintu itu sering tertutup, atau hanya terbuka dengan satu syarat: anak itu masuk agama lain dan meninggalkan iman orang tuanya.",
      },
      {
        en: "Across Java, small Christian houses take in the ones nobody else will claim. They receive no state funding. They are watched. They are pressured. And yet, night after night, they keep the lamp burning for the fatherless — because Someone once said that pure religion is to visit the fatherless in their affliction.",
        id: "Di seluruh Jawa, rumah-rumah Kristen kecil menampung mereka yang tidak diakui siapa pun. Mereka tidak menerima dana negara. Mereka diawasi. Mereka ditekan. Namun, malam demi malam, mereka tetap menyalakan pelita bagi anak yatim — karena Ada yang pernah berkata bahwa ibadah yang murni adalah mengunjungi anak yatim dalam kesusahan mereka.",
      },
      {
        en: "This is the story the cameras do not show. This is the cry that rises from a rotating earth — and zooms, at last, upon a single house in Bantul, Yogyakarta.",
        id: "Inilah kisah yang tidak ditunjukkan kamera. Inilah jeritan yang naik dari bumi yang berputar — dan mendekat, akhirnya, pada satu rumah di Bantul, Yogyakarta.",
      },
    ],
    highlight: true,
    image: "/images/candle-hope.png",
  },
  {
    id: "telly-vow",
    perspective: "Caregiver",
    title: {
      en: "A Mother's Vow at the Fever Bed",
      id: "Janji Seorang Ibu di Tempat Tidur Demam",
    },
    subtitle: {
      en: "How Yayasan Rumah Buah Hati began — with thirty children today.",
      id: "Bagaimana Yayasan Rumah Buah Hati bermula — kini dengan tiga puluh anak.",
    },
    body: [
      {
        en: "Mrs Telly Panjaitan knelt beside her own child, burning with dengue fever, and made a bargain with God. 'If You spare my child,' she whispered, 'I will open my house to the fatherless.' The fever broke. The vow did not.",
        id: "Ibu Telly Panjaitan berlutut di samping anaknya sendiri, yang terbakar oleh demam berdarah, dan membuat janji dengan Tuhan. 'Jika Engkau menyelamatkan anakku,' bisiknya, 'aku akan membuka rumahku untuk anak yatim.' Demamnya surut. Janjinya tidak.",
      },
      {
        en: "One child came. Then two. Then a brother and sister with nowhere else to go. Today, Yayasan Rumah Buah Hati in Bantul counts thirty fatherless children under its roof — fed, schooled, and raised in the knowledge of Christ.",
        id: "Satu anak datang. Lalu dua. Lalu seorang kakak dan adik yang tidak punya tempat lain. Kini, Yayasan Rumah Buah Hati di Bantul menghitung tiga puluh anak yatim di bawah atapnya — diberi makan, disekolahkan, dan dibesarkan dalam pengenalan akan Kristus.",
      },
      {
        en: "Mrs Telly will tell you, plainly, that she is no hero. She is only a mother keeping a promise she made to God in the darkest hour of her life.",
        id: "Ibu Telly akan memberitahumu, dengan jujur, bahwa dia bukan pahlawan. Dia hanyalah seorang ibu yang menepati janji yang dibuat kepada Tuhan di saat tergelap dalam hidupnya.",
      },
    ],
    highlight: true,
    image: "/images/children-hands.png",
  },
  {
    id: "telly-struggle",
    perspective: "Caregiver",
    title: {
      en: "If She Gives Up, They Will Be Lost",
      id: "Jika Dia Menyerah, Mereka Akan Hilang",
    },
    subtitle: {
      en: "The threat of forced conversion hangs over every Christian orphanage.",
      id: "Ancaman pemindahan agama menggantung di atas setiap panti asuhan Kristen.",
    },
    body: [
      {
        en: "The struggle is not only rice and school fees. It is this: if Mrs Telly ever closes her doors, the children will be handed to government-backed orphanages — where, to receive shelter and schooling, they will be pressed to leave Christianity.",
        id: "Perjuangan itu bukan hanya soal beras dan biaya sekolah. Melainkan ini: jika Ibu Telly pernah menutup pintunya, anak-anak akan diserahkan ke panti asuhan yang didukung negara — di mana, untuk mendapatkan tempat tinggal dan sekolah, mereka akan didorong untuk meninggalkan Kekristenan.",
      },
      {
        en: "She has been visited by officials. She has been told to stop. She has wondered, more than once, whether the burden is too great. And every time, she remembers the thirty small souls for whom her house is the last wall between faith and forsaking.",
        id: "Dia telah dikunjungi oleh pejabat. Dia telah diberitahu untuk berhenti. Dia telah bertanya-tanya, lebih dari sekali, apakah beban itu terlalu berat. Dan setiap kali, ia mengingat tiga puluh jiwa kecil yang bagi mereka rumahnya adalah dinding terakhir antara iman dan penyerahan.",
      },
      {
        en: "'If I give up,' she says, 'they will be converted. So I do not give up.'",
        id: "'Jika aku menyerah,' katanya, 'mereka akan dipindahkan agamanya. Jadi aku tidak menyerah.'",
      },
    ],
    image: "/images/open-bible.png",
  },
  {
    id: "maid-baby",
    perspective: "Caregiver",
    title: {
      en: "The Phone Call at Midnight",
      id: "Telepon Tengah Malam",
    },
    subtitle: {
      en: "A young maid, a newborn, and a threat no one should ever have to utter.",
      id: "Seorang pembantu muda, seorang bayi baru lahir, dan ancaman yang tidak boleh diucapkan siapa pun.",
    },
    body: [
      {
        en: "The call came late. A young maid, unmarried, pregnant by her employer, had just given birth alone. She told Mrs Telly she would end her own life — and the baby's — if the child was not taken in before morning.",
        id: "Telepon itu datang terlambat. Seorang pembantu muda, tidak menikah, hamil oleh majikannya, baru saja melahirkan sendirian. Dia memberitahu Ibu Telly bahwa ia akan mengakhiri nyawanya sendiri — dan bayinya — jika anak itu tidak diterima sebelum pagi.",
      },
      {
        en: "Mrs Telly did not ask questions. She drove through the dark. She took the baby into her arms. Today that child calls Rumah Buah Hati home, and calls Mrs Telly 'Mama'.",
        id: "Ibu Telly tidak bertanya. Ia menyetir dalam kegelapan. Ia menggendong bayi itu. Kini anak itu menyebut Rumah Buah Hati sebagai rumah, dan memanggil Ibu Telly 'Mama'.",
      },
      {
        en: "There have been many such calls. Some have happy endings. Some do not. Mrs Telly answers them all.",
        id: "Telah ada banyak panggilan seperti itu. Sebagian berakhir bahagia. Sebagian tidak. Ibu Telly menjawab semuanya.",
      },
    ],
    image: "/images/offering-hands.png",
  },
  {
    id: "influencer",
    perspective: "Field",
    title: {
      en: "The Influencer Who Came, Filmed, and Left Nothing",
      id: "Influencer yang Datang, Syuting, dan Tidak Meninggalkan Apa-apa",
    },
    subtitle: {
      en: "When a documented visit becomes a performance, not a gift.",
      id: "Ketika kunjungan yang didokumentasikan menjadi pertunjukan, bukan pemberian.",
    },
    body: [
      {
        en: "They arrived with ring lights and a camera crew. They filmed the children singing. They cried on camera. They posted the video, and the views — and the ad revenue — rolled in.",
        id: "Mereka datang dengan lampu ring dan kru kamera. Mereka syuting anak-anak yang bernyanyi. Mereka menangis di depan kamera. Mereka memposting video itu, dan penonton — dan pendapatan iklan — mengalir masuk.",
      },
      {
        en: "Then they left. No donation. No rice. No follow-up. The children were props in someone else's content, and the house that had opened its doors was emptier than before they came.",
        id: "Lalu mereka pergi. Tanpa donasi. Tanpa beras. Tanpa kunjungan lanjutan. Anak-anak menjadi alat peraga dalam konten orang lain, dan rumah yang telah membuka pintunya lebih kosong daripada sebelum mereka datang.",
      },
      {
        en: "This is why we ask for help that is real: money that reaches the children, visits that come with hands and hearts, and prayers that ascend when the cameras are gone.",
        id: "Inilah sebabnya kami meminta bantuan yang nyata: uang yang sampai kepada anak-anak, kunjungan yang datang dengan tangan dan hati, dan doa yang naik ketika kamera sudah pergi.",
      },
    ],
    image: "/images/scroll-bg.png",
  },
  {
    id: "child-voice",
    perspective: "Child",
    title: {
      en: "\u201CHere, Nobody Calls Me Orphan\u201D",
      id: "\u201CDi sini, Tidak Ada yang Memanggilku Yatim\u201D",
    },
    subtitle: {
      en: "A voice from inside the house in Bantul.",
      id: "Suara dari dalam rumah di Bantul.",
    },
    body: [
      {
        en: "Before I came here, the other children at school called me the word for a child with no father. Here, Mama Telly says I am her son. She sits with me when I cannot sleep.",
        id: "Sebelum saya datang ke sini, anak-anak lain di sekolah memanggil saya dengan kata untuk anak tanpa ayah. Di sini, Mama Telly mengatakan saya anaknya. Ia duduk bersamaku saat aku tidak bisa tidur.",
      },
      {
        en: "I want to be a doctor one day, so I can help the children who are sick like my little brother was. Mama says God will provide. I believe her, because He provided this house.",
        id: "Aku ingin menjadi dokter satu hari nanti, supaya aku bisa menolong anak-anak yang sakit seperti adikku dulu. Mama bilang Tuhan akan menyediakan. Aku percaya padanya, karena Dia menyediakan rumah ini.",
      },
    ],
    image: "/images/children-hands.png",
  },
  {
    id: "donor-voice",
    perspective: "Donor",
    title: {
      en: "Why I Give — and Why I Come Back",
      id: "Mengapa Aku Memberi — dan Mengapa Aku Kembali",
    },
    subtitle: {
      en: "A recurring donor's testimony.",
      id: "Kesaksian seorang donor tetap.",
    },
    body: [
      {
        en: "I gave once, anonymously, not expecting to feel anything. Then I visited. I saw the thirty children, the single study table, the chapel no bigger than a closet — and I understood that my small gift was a brick in a wall that keeps faith alive.",
        id: "Aku pernah memberi sekali, secara anonim, tidak mengharapkan merasakan apa-apa. Lalu aku berkunjung. Aku melihat tiga puluh anak, satu meja belajar, kapel yang tak lebih besar dari lemari — dan aku mengerti bahwa pemberian kecilku adalah batu bata dalam dinding yang menjaga iman tetap hidup.",
      },
      {
        en: "Now I give monthly, I pray weekly, and I visit when I can. Malachi said to prove God with the tithes. I have proved Him. The windows of heaven are real.",
        id: "Kini aku memberi setiap bulan, aku berdoa setiap minggu, dan aku berkunjung bila bisa. Maleakhi berkata untuk menguji Allah dengan persembahan persepuluhan. Aku telah menguji-Nya. Tingkap-tingkap langit itu nyata.",
      },
    ],
    image: "/images/offering-hands.png",
  },
];

export type HelpOption = {
  id: string;
  kind: "Financially" | "Physically" | "In Prayer";
  title: Localized;
  description: Localized;
  icon: string; // lucide icon name
};

export const HELP_OPTIONS: HelpOption[] = [
  {
    id: "financial",
    kind: "Financially",
    title: { en: "Give Financially", id: "Bantuan Finansial" },
    description: {
      en: "Sponsor a child's rice, schooling, and medical care. One-time or recurring. Every rupiah reaches the children.",
      id: "Biyayai beras, sekolah, dan perawatan medis seorang anak. Sekali atau berkala. Setiap rupiah sampai kepada anak-anak.",
    },
    icon: "HandCoins",
  },
  {
    id: "physical",
    kind: "Physically",
    title: { en: "Visit & Serve", id: "Kunjungi & Layani" },
    description: {
      en: "Come with hands ready — to teach, to repair a roof, to cook a meal, to hold a child. Schedule a visit on the Calendar.",
      id: "Datang dengan tangan yang siap — untuk mengajar, memperbaiki atap, memasak, atau menggendong seorang anak. Jadwalkan kunjungan di Kalender.",
    },
    icon: "HandHeart",
  },
  {
    id: "prayer",
    kind: "In Prayer",
    title: { en: "Commit to Prayer", id: "Berkomitmen Berdoa" },
    description: {
      en: "The children's greatest need is unseen. Commit a weekly hour of prayer and we will remind you by email.",
      id: "Kebutuhan terbesar anak-anak tidak terlihat. Berkomitmenlah satu jam doa setiap minggu dan kami akan mengingatkan Anda melalui email.",
    },
    icon: "HeartHandshake",
  },
];

export const PAYMENT_METHODS = ["QRIS", "Bankwire transfer"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// ---- Contact & bankwire info (merged) ----
export const CONTACT = {
  person: { en: "Mrs Telly Panjaitan", id: "Ibu Telly Panjaitan" },
  phone: "+6281215514500",
  phoneDisplay: "+62 812-1551-4500",
  // WhatsApp number (digits only, no "+"): same mobile number
  whatsappNumber: "6281215514500",
  // Prefilled WhatsApp message, bilingual
  whatsappMessage: {
    en: "Hi, Mrs. Telly Panjaitan. I want to help the fatherless",
    id: "Hi Ibu Telly Panjaitan. Saya ingin membantu anak yatim",
  },
  instagram: "rumahbuahhati",
  instagramUrl: "https://www.instagram.com/rumahbuahhati/",
  email: "care@rumahbuahhati.org",
  // Full official name + archaic Javanese (Aksara Jawa) for the main house
  fullName: { en: "Panti Asuhan Rumah Buah Hati", id: "Panti Asuhan Rumah Buah Hati" },
  aksaraJawa:
    "\uA9CB\uA9A5\uA9A4\uA9C0\uA9A0\uA9B6\uA984\uA9B1\uA9B8\uA9B2\uA9A4\uA9C0\uA9AB\uA9B8\uA9A9\uA983\uA9A7\uA9B8\uA9AE\uA983\uA9B2\uA9A0\uA9B6",
  fullAddress:
    "Jalan Surya No.24 Tegalrejo, Jomblangan, Banguntapan, Kec. Banguntapan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55198",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.91825026402!2d110.39929901241953!3d-7.798479792189242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5760c7a0d3bf%3A0x314778d9cd4fdeb7!2z6qeL6qal6qak6qeA6qag6qa26qaE6qax6qa46qay6qak6qeA6qar6qa46qap6qaD6qan6qa46qau6qaD6qay6qag6qa2IFBhbnRpIEFzdWhhbiBSdW1haCBCdWFoIEhhdGk!5e0!3m2!1sen!2sid!4v1781942563402!5m2!1sen!2sid",
  mapsLinkUrl:
    "https://www.google.com/maps/place/%EA%A7%8B%EA%A6%A5%EA%A6%A4%EA%A7%80%EA%A6%A0%EA%A6%B6%EA%A6%84%EA%A6%B1%EA%A6%B8%EA%A6%B2%EA%A6%A4%EA%A7%80%EA%A6%AB%EA%A6%B8%EA%A6%A9%EA%A6%83%EA%A6%A7%EA%A6%B8%EA%A6%AE%EA%A6%83%EA%A6%B2%EA%A6%A0%EA%A6%B6+Panti+Asuhan+Rumah+Buah+Hati/@-7.7984798,110.399299,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a5760c7a0d3bf:0x314778d9cd4fdeb7!8m2!3d-7.7984798!4d110.4018793!16s%2Fg%2F1pzpkkdj7?entry=ttu&g_ep=EgoyMDI2MDUxNi4wIKXMDSoASAFQAw%3D%3D",
};

export const BANKWIRE = {
  bank: { en: "Bank Rakyat Indonesia (BRI)", id: "Bank Rakyat Indonesia (BRI)" },
  swift: "BRINIDJA",
  account: "7001-01-011679-53-2",
  careOf: { en: "Yayasan Rumah Buah Hati", id: "Yayasan Rumah Buah Hati" },
};

// Mask a display name like "ANO****** GIV*****" — keep first 3 chars of each
// word, mask the rest with asterisks.
export function maskName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word.length <= 3) return word[0] + "*".repeat(word.length - 1);
      return word.slice(0, 3) + "*".repeat(Math.max(3, word.length - 3));
    })
    .join(" ");
}

// Mask an amount as "***"
export function maskAmount(): string {
  return "***";
}

// ---- Currencies (no conversion; sums tracked per currency) ----
export const CURRENCIES = ["USD", "IDR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_META: Record<
  Currency,
  { symbol: string; code: string; locale: string; label: { en: string; id: string } }
> = {
  USD: {
    symbol: "$",
    code: "USD",
    locale: "en-US",
    label: { en: "USD ($)", id: "USD ($)" },
  },
  IDR: {
    symbol: "Rp",
    code: "IDR",
    locale: "id-ID",
    label: { en: "IDR (Rupiah)", id: "IDR (Rupiah)" },
  },
};

// Format an amount with its currency. No conversion — the amount is already
// in the given currency.
export function formatAmount(amount: number, currency: Currency = "USD"): string {
  const meta = CURRENCY_META[currency];
  const formatted = amount.toLocaleString(meta.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  });
  return `${meta.symbol}${formatted}`;
}

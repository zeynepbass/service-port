export const SEED_CATEGORIES = [
  {
    name: "Boya Badana",
    description: "İç ve dış cephe boya işleri",
    image: "/images-slider/slide1.jpg",
    steps: [
      { question: "Kaç oda boyanacak?", options: ["1 oda", "2 oda", "3 oda", "4+ oda"] },
      { question: "Tavanlar da boyanacak mı?", options: ["Evet", "Hayır"] },
      { question: "Boyayı kim temin edecek?", options: ["Ben", "Hizmet veren"] },
    ],
  },
  {
    name: "Ev Temizliği",
    description: "Düzenli veya tek seferlik ev temizliği",
    image: "/images-slider/slide2.jpg",
    steps: [
      { question: "Evin büyüklüğü nedir?", options: ["1+1", "2+1", "3+1", "4+1 ve üzeri"] },
      { question: "Ne sıklıkla temizlik istiyorsun?", options: ["Tek sefer", "Haftalık", "Aylık"] },
    ],
  },
  {
    name: "Tesisat",
    description: "Su ve doğalgaz tesisatı onarımı",
    image: "/images-slider/slide3.jpg",
    steps: [
      { question: "Sorun nerede?", options: ["Mutfak", "Banyo", "Kombi", "Diğer"] },
      { question: "Ne kadar acil?", options: ["Bugün", "Bu hafta", "Esnek"] },
    ],
  },
  {
    name: "Elektrik",
    description: "Elektrik arıza ve tesisat işleri",
    image: "/images-slider/slide4.jpg",
    steps: [
      { question: "Hangi iş yapılacak?", options: ["Arıza", "Priz/anahtar", "Aydınlatma", "Yeni tesisat"] },
      { question: "Ne kadar acil?", options: ["Bugün", "Bu hafta", "Esnek"] },
    ],
  },
  {
    name: "Nakliyat",
    description: "Evden eve ve parça eşya taşıma",
    image: "/images-slider/slide5.jpg",
    steps: [
      { question: "Taşınacak evin büyüklüğü?", options: ["1+1", "2+1", "3+1", "4+1 ve üzeri"] },
      { question: "Paketleme hizmeti istiyor musun?", options: ["Evet", "Hayır"] },
    ],
  },
  {
    name: "Mobilya Montaj",
    description: "Mobilya kurulum ve montaj",
    image: "/images-slider/slide6.jpg",
    steps: [
      { question: "Kaç parça mobilya kurulacak?", options: ["1-2", "3-5", "6+"] },
      { question: "Mobilya türü?", options: ["Dolap", "Yatak", "Masa", "Karışık"] },
    ],
  },
];

export const SEED_USERS = [
  { firstName: "Admin", lastName: "Hizmet Kap", email: "admin@hizmetkap.local", role: "admin" },
  { firstName: "Ayşe", lastName: "Demir", email: "ayse@hizmetkap.local", role: "user" },
  { firstName: "Mehmet", lastName: "Kaya", email: "mehmet@hizmetkap.local", role: "user" },
];

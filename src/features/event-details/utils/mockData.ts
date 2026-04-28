import type { EventDetails } from "../types/event-details.types";

export const mockEvent: EventDetails = {
  id: "evt-001",
  title: "Lollapalooza Brasil 2026",
  image:
    "https://www.tangol.com/Fotos/Tours/festival-lollapalooza-brasil_38661_202501241522020.JPG",
  category: "Festival",
  description: `O maior festival de música do Brasil está de volta! O Lollapalooza Brasil 2026 promete ser a edição mais épica de todos os tempos, reunindo os maiores artistas nacionais e internacionais em três dias de pura energia.

Com palcos de última geração, experiências gastronômicas incríveis e ativações exclusivas, o Lolla 2026 vai transformar o Autódromo de Interlagos em uma verdadeira cidade da música.

Prepare-se para vivenciar performances inesquecíveis, descobrir novos artistas e criar memórias que vão durar para sempre. Seja parte dessa experiência única!

**Destaques desta edição:**
- Mais de 70 atrações em 4 palcos
- Área VIP com open bar premium
- Food Park com 40 opções gastronômicas
- Lounge de descanso e recarga de celular
- Ativações interativas de marcas parceiras`,
  date: {
    start: "2026-09-18T14:00:00",
    end: "2026-09-20T23:00:00",
    doorsOpen: "2026-09-18T12:00:00",
  },
  venue: {
    name: "Autódromo de Interlagos",
    address: "Av. Sen. Teotônio Vilela, 261",
    city: "São Paulo",
    state: "SP",
    zipCode: "04801-010",
    latitude: -23.7013,
    longitude: -46.6977,
  },
  organizer: {
    name: "Live Nation Brasil",
    avatar: "https://ui-avatars.com/api/?name=Live+Nation&background=57c5f4&color=fff&size=128",
    description:
      "A Live Nation é a maior produtora de entretenimento ao vivo do mundo, conectando milhões de fãs a seus artistas favoritos.",
    totalEvents: 342,
    followers: 128500,
    rating: 4.7,
  },
  tickets: [
    {
      id: "tkt-001",
      name: "Pista - Dia 1",
      description: "Acesso à área de pista no primeiro dia do festival",
      price: 390,
      originalPrice: 490,
      available: 1200,
      maxPerPurchase: 4,
      salesEnd: "2026-09-18T12:00:00",
    },
    {
      id: "tkt-002",
      name: "Pista - Passaporte 3 Dias",
      description: "Acesso à área de pista nos três dias do festival",
      price: 890,
      originalPrice: 1190,
      available: 800,
      maxPerPurchase: 4,
      salesEnd: "2026-09-18T12:00:00",
    },
    {
      id: "tkt-003",
      name: "VIP - Dia 1",
      description:
        "Área exclusiva com open bar, vista privilegiada e lounge climatizado",
      price: 790,
      available: 300,
      maxPerPurchase: 2,
      salesEnd: "2026-09-18T12:00:00",
    },
    {
      id: "tkt-004",
      name: "VIP - Passaporte 3 Dias",
      description:
        "Experiência VIP completa nos três dias com todas as comodidades",
      price: 1890,
      available: 150,
      maxPerPurchase: 2,
      salesEnd: "2026-09-18T12:00:00",
    },
    {
      id: "tkt-005",
      name: "Camarote Premium",
      description:
        "Experiência all-inclusive com buffet gourmet, bar premium, meet & greet e estacionamento",
      price: 3500,
      available: 23,
      maxPerPurchase: 2,
      salesEnd: "2026-09-15T23:59:00",
    },
  ],
  policies: [
    {
      icon: "age",
      title: "Classificação Etária",
      description: "Evento para maiores de 16 anos. Menores de 16 somente acompanhados dos pais ou responsáveis legais.",
    },
    {
      icon: "refund",
      title: "Política de Reembolso",
      description: "Reembolso disponível até 7 dias antes do evento, conforme Lei 14.046/2020. Taxa administrativa de 10%.",
    },
    {
      icon: "camera",
      title: "Câmeras Profissionais",
      description: "Câmeras profissionais e equipamentos de gravação não são permitidos. Celulares são liberados.",
    },
    {
      icon: "food",
      title: "Alimentação",
      description: "Não é permitida a entrada com alimentos ou bebidas. O evento conta com praça de alimentação interna.",
    },
    {
      icon: "accessibility",
      title: "Acessibilidade",
      description: "O evento conta com áreas acessíveis, banheiros adaptados e equipe de apoio para PCD.",
    },
    {
      icon: "id",
      title: "Documento com Foto",
      description: "Obrigatória a apresentação de documento oficial com foto na entrada, compatível com o nome no ingresso.",
    },
  ],
  lineup: [
    "Arctic Monkeys",
    "Billie Eilish",
    "Anitta",
    "The Weeknd",
    "Dua Lipa",
    "Matuê",
    "Tame Impala",
    "Luísa Sonza",
    "Post Malone",
    "Alok",
    "Fontaines D.C.",
    "WIU",
    "Marina Sena",
    "Racionais MC's",
    "The 1975",
  ],
  tags: ["Festival", "Música", "Ao Vivo", "Internacional", "Open Air"],
  ageRating: "16+",
  status: "available",
};


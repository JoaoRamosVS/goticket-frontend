export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  available: number;
  maxPerPurchase: number;
  salesEnd: string;
}

export interface EventDate {
  start: string;
  end: string;
  doorsOpen?: string;
}

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface EventOrganizerInfo {
  name: string;
  avatar: string;
  description: string;
  totalEvents: number;
  followers: number;
  rating: number;
}

export interface EventPolicy {
  icon: "age" | "refund" | "camera" | "food" | "accessibility" | "id";
  title: string;
  description: string;
}

export interface EventDetails {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  date: EventDate;
  venue: EventVenue;
  organizer: EventOrganizerInfo;
  tickets: TicketType[];
  policies: EventPolicy[];
  lineup?: string[];
  tags?: string[];
  ageRating: string;
  status: "available" | "sold_out" | "coming_soon" | "cancelled";
}

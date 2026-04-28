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

export interface EventPageCategoryDTO {
  name: string;
  slug: string;
}

export interface EventPageOrganizerDTO {
  legalName: string;
  cnpj: string;
}

export interface EventPageStatusDTO {
  statusID: number;
  name: string;
}

export interface EventPageVenueDTO {
  name: string;
  cnpj: string;
  description: string;
  streetAddress: string;
  streetAddressNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  status: EventPageStatusDTO | null;
}

export interface EventPageBatchDTO {
  batchID: number;
  batchNumber: number;
  price: number;
  totalTickets: number;
  soldTickets: number;
  availableTickets: number;
}

export interface EventPageSectorDTO {
  sectorID: number;
  name: string;
  description: string;
  registerDate: string;
  lastUpdateDate: string;
  hasNumberedSeats: boolean;
  batches: EventPageBatchDTO[];
  soldTickets: number;
  availableTickets: number;
  totalTickets: number;
}

export interface EventPageImageDTO {
  eventImageID: number;
  s3Key: string;
  ordination: number;
}

export interface EventPageDTO {
  title: string;
  description: string;
  ageRestriction: number;
  salesStartDate: string | null;
  startDate: string;
  endDate: string;
  approvalDate: string | null;
  statusId: number;
  eventVisibilityId: number;
  category: EventPageCategoryDTO | null;
  organizer: EventPageOrganizerDTO | null;
  venue: EventPageVenueDTO | null;
  sectors: EventPageSectorDTO[];
  images: EventPageImageDTO[];
}

export interface EventLocationProps {
  venue: EventVenue;
}

export interface EventInfoProps {
  category: string;
  title: string;
  date: EventDate;
  venue: EventVenue;
  ageRating: string;
  tags?: string[];
  status: "available" | "sold_out" | "coming_soon" | "cancelled";
}

export interface EventDescriptionProps {
  description: string;
  lineup?: string[];
}

export interface EventOrganizerProps {
  organizer: EventOrganizerInfo;
}

export interface EventPoliciesProps {
  policies: EventPolicy[];
}

export interface TicketSelectorProps {
  tickets: TicketType[];
}
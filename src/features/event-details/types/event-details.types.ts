export type TicketTypeName = "FULL" | "HALF" | "SOLIDARY";

interface EventDate {
  start: string;
  end: string;
}

interface EventVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

interface EventOrganizerInfo {
  name: string;
  avatar: string;
  description: string;
  totalEvents: number;
  followers: number;
  rating: number;
}

interface EventPolicy {
  icon: "age" | "refund" | "camera" | "food" | "accessibility" | "id";
  title: string;
  description: string;
}

export interface EventDateSummary {
  eventDateId: number;
  start: string;
  end: string;
  statusId: number | null;
  totalTickets: number;
  availableTickets: number;
  startingPrice: number | null;
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
  dates: EventDateSummary[];
  policies: EventPolicy[];
  lineup?: string[];
  tags?: string[];
  ageRating: string;
  status: "available" | "sold_out" | "coming_soon" | "cancelled";
}

interface EventPageCategoryDTO {
  name: string;
  slug: string;
}

interface EventPageOrganizerDTO {
  legalName: string;
  cnpj: string;
}

interface EventPageStatusDTO {
  statusId: number;
  name: string;
}

interface EventPageVenueDTO {
  venueId: number;
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
  sectorMapS3Key?: string | null;
  sectorMapUrl?: string | null;
  status: EventPageStatusDTO | null;
}

export interface EventPageAllotmentDTO {
  allotmentId: number;
  batchNumber: number;
  price: number;
  availableTickets: number;
}

export type EventPageAllotmentsByType = Partial<
  Record<TicketTypeName, EventPageAllotmentDTO>
>;

export interface EventPageDateSectorDTO {
  eventDateSectorId: number;
  name: string;
  description: string;
  hasNumberedSeats: boolean;
  venueSectorId?: number;
  mapElementId?: string | null;
  totalTickets: number;
  availableTickets: number;
  currentAllotments: EventPageAllotmentsByType;
}

export interface EventPageDateDTO {
  eventDateId: number;
  startDate: string;
  endDate: string;
  statusId: number | null;
  dateSectors: EventPageDateSectorDTO[];
}

interface EventPageImageDTO {
  eventImageId: number;
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
  dates: EventPageDateDTO[];
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
  eventId: string;
  dates: EventDateSummary[];
}

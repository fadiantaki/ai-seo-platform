export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: string[];
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  website: string;
  email: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  reviewCount: number;
  hours: Hours;
  menu: MenuItem[];
  images: string[];
  specialties: string[];
  amenities: string[];
  latitude?: number;
  longitude?: number;
  createdAt: string;
  plan: 'free' | 'starter' | 'pro';
}

export interface Hours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSignature?: boolean;
}

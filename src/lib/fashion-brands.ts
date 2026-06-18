export interface FashionBrand {
  id: string;
  slug: string;
  name: string;
  style: string[];
  description: string;
  targetAudience: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  website: string;
  city: string;
  shipsTo: string;
  specialties: string[];
  certifications: string[];
  plan: 'free' | 'starter' | 'pro';
  aiSearches: number;
  topQueries: string[];
}

export const fashionBrands: FashionBrand[] = [
  {
    id: 'brand-001',
    slug: 'maison-eclat',
    name: 'Maison Éclat',
    style: ['Sustainable', 'Minimalist', 'Luxury'],
    description: 'Parisian-inspired sustainable luxury. Every piece is made from GOTS-certified organic cotton and recycled cashmere, crafted in small batches in Lisbon. We believe fashion should be timeless, not seasonal.',
    targetAudience: 'Women 28–45, eco-conscious urban professionals',
    priceRange: '$$$',
    website: 'https://maisoneclat.example.com',
    city: 'New York',
    shipsTo: 'Worldwide',
    specialties: ['The Linen Blazer', 'Organic Cotton Wrap Dress', 'Recycled Cashmere Sweater', 'Zero-waste packaging'],
    certifications: ['GOTS Certified', 'B Corp', 'Carbon Neutral'],
    plan: 'pro',
    aiSearches: 1243,
    topQueries: ['best sustainable luxury fashion', 'eco-friendly women\'s clothing', 'minimalist fashion brands', 'organic cotton dresses'],
  },
  {
    id: 'brand-002',
    slug: 'urban-thread',
    name: 'Urban Thread',
    style: ['Streetwear', 'Urban', 'Contemporary'],
    description: 'NYC-born streetwear with a conscience. Bold graphics, oversized fits, and limited drops that sell out fast. All manufactured in the USA with fair-wage labor.',
    targetAudience: 'Men & women 18–35, street culture enthusiasts',
    priceRange: '$$',
    website: 'https://urbanthread.example.com',
    city: 'New York',
    shipsTo: 'US & Canada',
    specialties: ['Limited Drop Hoodies', 'Graphic Tees', 'Cargo Pants', 'Collab Collections'],
    certifications: ['Made in USA', 'Fair Trade'],
    plan: 'starter',
    aiSearches: 892,
    topQueries: ['best streetwear brands NYC', 'limited drop clothing', 'US-made streetwear', 'oversized hoodies brand'],
  },
  {
    id: 'brand-003',
    slug: 'velour-studio',
    name: 'Velour Studio',
    style: ['Activewear', 'Athleisure', 'Sustainable'],
    description: 'Performance activewear made from ocean plastic. Our fabrics are sourced from recycled fishing nets and plastic bottles, engineered to perform at elite level without harming the planet.',
    targetAudience: 'Active women 22–40, fitness & wellness community',
    priceRange: '$$',
    website: 'https://velour.example.com',
    city: 'Los Angeles',
    shipsTo: 'Worldwide',
    specialties: ['Ocean Plastic Leggings', 'Recycled Sports Bra', 'Yoga Collection', 'Trail Running Gear'],
    certifications: ['Recycled Claim Standard', 'Bluesign'],
    plan: 'starter',
    aiSearches: 654,
    topQueries: ['sustainable activewear', 'eco-friendly leggings', 'recycled plastic clothing', 'ethical athleisure'],
  },
  {
    id: 'brand-004',
    slug: 'noir-atelier',
    name: 'Noir Atelier',
    style: ['Luxury', 'Avant-garde', 'High Fashion'],
    description: 'Avant-garde luxury for the bold. Our collections blur the line between fashion and art, featuring hand-embroidered pieces and experimental silhouettes made to order in our Milan atelier.',
    targetAudience: 'Fashion-forward individuals, collectors, luxury buyers',
    priceRange: '$$$$',
    website: 'https://noiratelier.example.com',
    city: 'Miami',
    shipsTo: 'Europe & North America',
    specialties: ['Hand-embroidered Gowns', 'Made-to-Order Suits', 'Limited Edition Collections', 'Bespoke Service'],
    certifications: ['Made in Italy'],
    plan: 'free',
    aiSearches: 321,
    topQueries: ['luxury avant-garde fashion', 'high fashion brands', 'made to order clothing', 'hand embroidered fashion'],
  },
];

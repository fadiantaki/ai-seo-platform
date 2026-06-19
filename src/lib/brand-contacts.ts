export interface BrandContact {
  name: string;
  slug: string;
  instagram: string;
  type: 'local' | 'international';
  notes?: string;
}

export const brandContacts: BrandContact[] = [
  // Egyptian local brands
  { name: 'Okhtein', slug: 'okhtein', instagram: '@okhtein', type: 'local' },
  { name: 'Temraza', slug: 'temraza', instagram: '@temraza', type: 'local' },
  { name: 'Azza Fahmy', slug: 'azza-fahmy', instagram: '@azzafahmyjewellery', type: 'local' },
  { name: 'Amina K', slug: 'amina-k', instagram: '@amina_k_official', type: 'local' },
  { name: 'UNTY', slug: 'unty', instagram: '@untyeg', type: 'local' },
  { name: 'Bassit', slug: 'bassit', instagram: '@bassit.co', type: 'local' },
  { name: 'Kin Egypt', slug: 'kin-egypt', instagram: '@kin.egypt', type: 'local' },
  { name: 'Palma Egypt', slug: 'palma-egypt', instagram: '@palma.egypt', type: 'local' },
  { name: 'Egyptian Cotton Store', slug: 'egyptian-cotton-store', instagram: '@egyptiancottonstore', type: 'local' },
  { name: 'Mamzi', slug: 'mamzi', instagram: '@mamziofficial', type: 'local' },
  { name: 'Batik Boutique Egypt', slug: 'batik-boutique-egypt', instagram: '@batikboutiqueegypt', type: 'local' },
  { name: 'Norine Farah', slug: 'norine-farah', instagram: '@norinefarah', type: 'local' },
  { name: 'Farida Haidari', slug: 'farida-haidari', instagram: '@faridahaidari', type: 'local' },
  { name: 'Concrete Egypt', slug: 'concrete-egypt', instagram: '@concreteegypt', type: 'local' },
  { name: 'Couverture Egypt', slug: 'couverture-egypt', instagram: '@couvertureegypt', type: 'local' },

  // International brands — target local Egypt marketing accounts
  { name: 'Zara Egypt', slug: 'zara-egypt', instagram: '@zara', type: 'international', notes: 'DM @zara or find Egypt local account' },
  { name: 'H&M Egypt', slug: 'hm-egypt', instagram: '@hm', type: 'international', notes: 'DM @hm or find Egypt local account' },
  { name: 'Mango Egypt', slug: 'mango-egypt', instagram: '@mango', type: 'international', notes: 'DM @mango or find Egypt local account' },
  { name: 'Nike Egypt', slug: 'nike-egypt', instagram: '@nikeegypt', type: 'international' },
  { name: 'Adidas Egypt', slug: 'adidas-egypt', instagram: '@adidasegypt', type: 'international' },
  { name: "Levi's Egypt", slug: 'levis-egypt', instagram: '@levis', type: 'international' },
  { name: 'LC Waikiki Egypt', slug: 'lc-waikiki-egypt', instagram: '@lcwaikikiofficial', type: 'international' },
  { name: 'Tommy Hilfiger Egypt', slug: 'tommy-hilfiger-egypt', instagram: '@tommyhilfiger', type: 'international' },
  { name: 'Calvin Klein Egypt', slug: 'calvin-klein-egypt', instagram: '@calvinklein', type: 'international' },
  { name: 'Michael Kors Egypt', slug: 'michael-kors-egypt', instagram: '@michaelkors', type: 'international' },
  { name: 'Swarovski Egypt', slug: 'swarovski-egypt', instagram: '@swarovski', type: 'international' },
  { name: 'Pandora Egypt', slug: 'pandora-egypt', instagram: '@theofficialpandora', type: 'international' },
  { name: 'Polo Ralph Lauren Egypt', slug: 'polo-ralph-lauren-egypt', instagram: '@ralphlauren', type: 'international' },
  { name: 'Guess Egypt', slug: 'guess-egypt', instagram: '@guess', type: 'international' },
  { name: 'Lacoste Egypt', slug: 'lacoste-egypt', instagram: '@lacoste', type: 'international' },
  { name: 'Puma Egypt', slug: 'puma-egypt', instagram: '@puma', type: 'international' },
  { name: 'New Balance Egypt', slug: 'new-balance-egypt', instagram: '@newbalance', type: 'international' },
  { name: 'Bershka Egypt', slug: 'bershka-egypt', instagram: '@bershka', type: 'international' },
  { name: 'Pull & Bear Egypt', slug: 'pull-bear-egypt', instagram: '@pullandbear', type: 'international' },
  { name: 'Stradivarius Egypt', slug: 'stradivarius-egypt', instagram: '@stradivarius', type: 'international' },
  { name: 'Massimo Dutti Egypt', slug: 'massimo-dutti-egypt', instagram: '@massimodutti', type: 'international' },
  { name: 'Coach Egypt', slug: 'coach-egypt', instagram: '@coach', type: 'international' },
  { name: 'Charles & Keith Egypt', slug: 'charles-keith-egypt', instagram: '@charleskeith', type: 'international' },
  { name: 'Aldo Egypt', slug: 'aldo-egypt', instagram: '@aldoshoes', type: 'international' },
  { name: 'Mohito Egypt', slug: 'mohito-egypt', instagram: '@mohitofashion', type: 'international' },
  { name: 'River Island Egypt', slug: 'river-island-egypt', instagram: '@riverisland', type: 'international' },
  { name: 'Vakko Egypt', slug: 'vakko-egypt', instagram: '@vakko', type: 'international' },
  { name: 'Defacto Egypt', slug: 'defacto-egypt', instagram: '@defactoofficial', type: 'international' },
  { name: 'Boyner Egypt', slug: 'boyner-egypt', instagram: '@boynerofficial', type: 'international' },
  { name: 'Kenzo Egypt', slug: 'kenzo-egypt', instagram: '@kenzo', type: 'international' },
  { name: 'Oasis Egypt', slug: 'oasis-egypt', instagram: '@oasisfashion', type: 'international' },
  { name: 'Loft Egypt', slug: 'loft-egypt', instagram: '@loft', type: 'international' },
  { name: 'Splash Egypt', slug: 'splash-egypt', instagram: '@splashfashions', type: 'international' },
  { name: 'Max Fashion Egypt', slug: 'max-fashion-egypt', instagram: '@maxfashion', type: 'international' },
];

export const instagramDMTemplate = (brandName: string, brandSlug: string): string => `
Hi ${brandName}! 👋

We've added ${brandName} to AIVisible — a free tool that helps fashion brands appear in AI search results (Claude, ChatGPT, Perplexity).

When someone asks an AI "best fashion brands in Egypt" or "where to buy [your style] in Cairo", your brand now shows up.

👉 See your profile: https://ai-seo-platform-dun.vercel.app/biz/${brandSlug}

To get your free embed code (one script tag for your website that activates AI search optimization):
https://ai-seo-platform-dun.vercel.app/dashboard

It's completely free. Takes 2 minutes. No tech knowledge needed.

— AIVisible team
`.trim();

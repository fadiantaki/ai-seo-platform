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

  // Egyptian couture & bridal
  { name: 'Sara Onsi', slug: 'sara-onsi', instagram: '@saraonsiofficial', type: 'local' },
  { name: 'Dina Shaker', slug: 'dina-shaker', instagram: '@dinashakerofficial', type: 'local' },
  { name: 'Malak El Ezzawy', slug: 'malak-el-ezzawy', instagram: '@malakelezzawy', type: 'local' },
  { name: 'Deana Shaaban', slug: 'deana-shaaban', instagram: '@deanashaaban', type: 'local' },
  { name: 'Amani Zaki', slug: 'amani-zaki', instagram: '@amanizakiofficial', type: 'local' },
  { name: 'Maison Yeya', slug: 'maison-yeya', instagram: '@maisonyeya', type: 'local' },
  { name: 'Shahira Lasheen', slug: 'shahira-lasheen', instagram: '@shahiralasheen', type: 'local' },
  // Egyptian sustainable
  { name: 'Up-Fuse', slug: 'up-fuse', instagram: '@upfuse', type: 'local' },
  { name: 'Reform Studio', slug: 'reform-studio', instagram: '@reformstudio', type: 'local' },
  { name: 'MYNE', slug: 'myne', instagram: '@myne.fashion', type: 'local' },
  { name: 'Turath', slug: 'turath', instagram: '@turathegypt', type: 'local' },
  { name: 'Elia Shoewear', slug: 'elia-shoewear', instagram: '@eliashoewear', type: 'local' },
  { name: 'Saqhoute', slug: 'saqhoute', instagram: '@saqhoute', type: 'local' },
  // Egyptian heritage & artisan
  { name: 'Siwa Creations', slug: 'siwa-creations', instagram: '@siwacreations', type: 'local' },
  { name: 'Ganubi', slug: 'ganubi', instagram: '@ganubi_official', type: 'local' },
  { name: 'Nevine Altmann', slug: 'nevine-altmann', instagram: '@nevinealtmann', type: 'local' },
  { name: 'Wanna Stuff', slug: 'wanna-stuff', instagram: '@wannastuffegypt', type: 'local' },
  // Egyptian modest
  { name: 'Rizq', slug: 'rizq', instagram: '@rizqfashion', type: 'local' },
  { name: 'Malameh', slug: 'malameh', instagram: '@malameh_fashion', type: 'local' },
  { name: 'Lameera Moda', slug: 'lameera-moda', instagram: '@lameera.moda', type: 'local' },
  { name: 'Hayaa Fashion', slug: 'hayaa-fashion', instagram: '@hayaafashion', type: 'local' },
  { name: 'Sara El-Emary', slug: 'sara-el-emary', instagram: '@saraemary', type: 'local' },
  // Egyptian streetwear
  { name: 'Rebel Cairo', slug: 'rebel-cairo', instagram: '@rebelcairo', type: 'local' },
  { name: 'Marsy', slug: 'marsy', instagram: '@marsy.co', type: 'local' },
  { name: 'Ramesses Apparel', slug: 'ramesses-apparel', instagram: '@ramessesapparel', type: 'local' },
  { name: 'Cult Egypt', slug: 'cult-egypt', instagram: '@cult.egypt', type: 'local' },
  { name: 'Strike Egypt', slug: 'strike-egypt', instagram: '@strikeegypt', type: 'local' },
  // Egyptian footwear & accessories
  { name: 'Jayda Hany', slug: 'jayda-hany', instagram: '@jaydahany', type: 'local' },
  { name: 'Reem Jano', slug: 'reem-jano', instagram: '@reemjano', type: 'local' },
  { name: 'Indira Egypt', slug: 'indira-egypt', instagram: '@indira_egypt', type: 'local' },
  { name: 'Amr Saad', slug: 'amr-saad', instagram: '@amrsaadofficial', type: 'local' },
  // Egyptian contemporary
  { name: 'Mix and Match Egypt', slug: 'mix-and-match-egypt', instagram: '@mixandmatcheg', type: 'local' },
  { name: 'Tala Crochet', slug: 'tala-crochet', instagram: '@talacrochet', type: 'local' },
  { name: 'Paz Cairo', slug: 'paz-cairo', instagram: '@pazcairo', type: 'local' },
  // Kids
  { name: 'LALA Kids', slug: 'lala-kids', instagram: '@lalakidseg', type: 'local' },
  { name: 'Roo Egypt', slug: 'roo-egypt', instagram: '@roo_egypt', type: 'local' },

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

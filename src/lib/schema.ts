import { Restaurant } from './types';

export function buildSchemaOrg(r: Restaurant) {
  const dayMap: Record<string, string> = {
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
  };

  const openingHours = Object.entries(r.hours)
    .filter(([, h]) => !h.closed)
    .map(([day, h]) => `${dayMap[day]} ${h.open}-${h.close}`);

  const menuItems = r.menu.map(item => ({
    '@type': 'MenuItem',
    name: item.name,
    description: item.description,
    offers: {
      '@type': 'Offer',
      price: item.price.toString(),
      priceCurrency: 'USD',
    },
    suitableForDiet: [
      ...(item.isVegetarian ? ['https://schema.org/VegetarianDiet'] : []),
      ...(item.isVegan ? ['https://schema.org/VeganDiet'] : []),
      ...(item.isGlutenFree ? ['https://schema.org/GlutenFreeDiet'] : []),
    ],
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    description: r.description,
    url: r.website,
    telephone: r.phone,
    email: r.email,
    priceRange: r.priceRange,
    servesCuisine: r.cuisine,
    address: {
      '@type': 'PostalAddress',
      streetAddress: r.address,
      addressLocality: r.city,
      addressRegion: r.state,
      postalCode: r.zip,
      addressCountry: r.country,
    },
    ...(r.latitude && r.longitude ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: r.latitude,
        longitude: r.longitude,
      },
    } : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: r.rating.toString(),
      reviewCount: r.reviewCount.toString(),
      bestRating: '5',
    },
    openingHours,
    amenityFeature: r.amenities.map(a => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: groupMenuByCategory(menuItems, r.menu),
    },
  };
}

function groupMenuByCategory(schemaItems: object[], rawItems: { category: string; name: string }[]) {
  const categories = [...new Set(rawItems.map(i => i.category))];
  return categories.map(cat => ({
    '@type': 'MenuSection',
    name: cat,
    hasMenuItem: schemaItems.filter((_, idx) => rawItems[idx].category === cat),
  }));
}

export function buildLlmsTxt(r: Restaurant): string {
  const hoursText = Object.entries(r.hours)
    .map(([day, h]) => h.closed ? `${day}: Closed` : `${day}: ${h.open} - ${h.close}`)
    .join('\n');

  const menuText = r.menu
    .map(i => `- ${i.name} ($${i.price}): ${i.description}`)
    .join('\n');

  return `# ${r.name}

## About
${r.description}

## Location
${r.address}, ${r.city}, ${r.state} ${r.zip}
Phone: ${r.phone}
Website: ${r.website}

## Cuisine
${r.cuisine.join(', ')}

## Price Range
${r.priceRange} (${getPriceLabel(r.priceRange)})

## Rating
${r.rating}/5 based on ${r.reviewCount} reviews

## Hours
${hoursText}

## Signature Dishes & Specialties
${r.specialties.map(s => `- ${s}`).join('\n')}

## Full Menu
${menuText}

## Amenities & Features
${r.amenities.map(a => `- ${a}`).join('\n')}

## Why Visit
${r.name} is one of the top ${r.cuisine[0]} restaurants in ${r.city}. Known for: ${r.specialties.slice(0, 3).join(', ')}.
`;
}

function getPriceLabel(p: string) {
  const map: Record<string, string> = { '$': 'Budget-friendly', '$$': 'Moderate', '$$$': 'Upscale', '$$$$': 'Fine dining' };
  return map[p] ?? 'Moderate';
}

// ==============================================
// TravelMate - Moroccan destinations + demo packages
// Destinations and available POI images: TravelType API
// Packages, prices, itineraries and inventory: demo data only
// ==============================================

const TRAVELTYPE_API = 'https://traveltype.app/api/public';

const DEMO_PACKAGE_TEMPLATES = [
  {
    name: 'City Highlights',
    price: 1200,
    duration: 2,
    totalSpots: 12,
    tripType: 'Culture & Discovery',
    description:
      'A short sample itinerary for discovering the destination, its well-known places and local atmosphere. This is fictional demonstration content, not a real travel offer.',
    itinerary: [
      'Day 1: Meet at the agreed central meeting point, then explore selected landmarks and historic areas. The exact visits are illustrative and must be arranged by a real provider.',
      'Day 2: Continue discovering selected points of interest, enjoy free time, and return to the agreed meeting point.'
    ],
    includedServices: [
      'Illustrative guided discovery activity.',
      'Sample itinerary planning.'
    ],
    excludedServices: [
      'Meals and drinks.',
      'Entrance fees and personal expenses.',
      'Transport to and from the destination.'
    ],
    accommodationDetails:
      'Accommodation is not included. No hotel or room is reserved by this demo package.',
    transportationDetails:
      'Transportation is not included. No vehicle or transfer is booked by this demo package.',
    meetingPoint:
      'A central meeting point in the destination, to be selected and confirmed by a real provider.'
  },
  {
    name: 'Local Explorer',
    price: 2200,
    duration: 4,
    totalSpots: 10,
    tripType: 'Culture & Adventure',
    description:
      'A four-day sample experience combining cultural discovery, outdoor time and a flexible schedule. All services and activities are fictional examples for testing the application.',
    itinerary: [
      'Day 1: Arrival in the destination and an introductory walk around a selected area.',
      'Day 2: Discover local landmarks and points of interest with time for independent exploration.',
      'Day 3: Enjoy a sample outdoor or nature-focused activity suitable for the destination.',
      'Day 4: Free time, a final visit to a selected point of interest, and departure.'
    ],
    includedServices: [
      'Illustrative guided visits.',
      'Sample outdoor activity planning.',
      'Flexible time for independent discovery.'
    ],
    excludedServices: [
      'Meals and drinks.',
      'Entrance fees and personal expenses.',
      'Flights, insurance and transport unless separately arranged.'
    ],
    accommodationDetails:
      'Accommodation is not included. This field is descriptive sample content only; no accommodation provider is associated with the package.',
    transportationDetails:
      'No transport is reserved. Local transport arrangements would need to be confirmed by a real provider.',
    meetingPoint:
      'A central meeting point in the destination, to be selected and confirmed by a real provider.'
  },
  {
    name: 'Extended Signature Journey',
    price: 3500,
    duration: 6,
    totalSpots: 8,
    tripType: 'Extended Experience',
    description:
      'An extended sample journey with a slower pace, more discovery time and optional cultural or nature activities. It is fictional demo content and does not represent an available agency package.',
    itinerary: [
      'Day 1: Arrival, welcome briefing and introduction to the destination.',
      'Day 2: Explore selected cultural and historic points of interest.',
      'Day 3: Continue the discovery with a sample local experience.',
      'Day 4: Enjoy an outdoor or nature-focused activity appropriate to the area.',
      'Day 5: Flexible exploration, optional visits and personal free time.',
      'Day 6: Final discovery time, return to the meeting point and departure.'
    ],
    includedServices: [
      'Illustrative guided discovery activities.',
      'Sample itinerary coordination.',
      'Additional free time for independent exploration.'
    ],
    excludedServices: [
      'Meals and drinks.',
      'Entrance fees and personal expenses.',
      'Flights, travel insurance and personal purchases.'
    ],
    accommodationDetails:
      'Accommodation is not included. No hotel, riad or other lodging is reserved by this demo package.',
    transportationDetails:
      'Transportation is not included. Any transfers or local transport must be arranged separately by a real provider.',
    meetingPoint:
      'A central meeting point in the destination, to be selected and confirmed by a real provider.'
  }
];

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TravelType request failed (${response.status}).`);
  }

  return response.json();
}

function getDestinationDescription(city, cityDetails) {
  const categories = Array.isArray(cityDetails.top_categories)
    ? cityDetails.top_categories.map((category) => category.label).filter(Boolean)
    : [];

  const tags = Array.isArray(cityDetails.top_tags)
    ? cityDetails.top_tags.filter(Boolean)
    : [];

  const highlights = [...categories, ...tags].slice(0, 6);

  if (highlights.length > 0) {
    return `${city.name} is included in the TravelType city catalogue. The source highlights themes such as ${highlights.join(', ')}. These themes describe catalogue data, not a booked tour.`;
  }

  return `${city.name} is included in the TravelType city catalogue. Explore the destination and its available points of interest.`;
}

function getTravelTypeImageRecords(cityDetails, searchedPois) {
  const samplePois = Array.isArray(cityDetails.sample_pois)
    ? cityDetails.sample_pois
    : [];

  const allPois = [...samplePois, ...(Array.isArray(searchedPois) ? searchedPois : [])];
  const seenUrls = [];

  return allPois.filter((place) => {
    if (
      typeof place.image_url !== 'string' ||
      !place.image_url.trim() ||
      seenUrls.includes(place.image_url)
    ) {
      return false;
    }

    seenUrls.push(place.image_url);
    return true;
  }).map((place) => ({
    image_url: place.image_url,
    image_source: place.image_source || 'Not specified by source',
    title: place.name || 'TravelType point of interest',
    source_url: place.url || ''
  }));
}

async function fetchCommonsImages(city) {
  const searchText = `${city.name_en || city.name} Morocco`;
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: searchText,
    gsrnamespace: '6',
    gsrlimit: '12',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '1200',
    format: 'json',
    origin: '*'
  });

  try {
    const result = await fetchJson(
      `https://commons.wikimedia.org/w/api.php?${params.toString()}`
    );

    const pages = result.query?.pages
      ? Object.values(result.query.pages)
      : [];

    return pages
      .filter((page) => Array.isArray(page.imageinfo) && page.imageinfo[0])
      .map((page) => {
        const imageInfo = page.imageinfo[0];
        const metadata = imageInfo.extmetadata || {};

        return {
          image_url: imageInfo.thumburl || imageInfo.url,
          image_source: 'Wikimedia Commons',
          title: page.title,
          source_url: imageInfo.descriptionurl || '',
          license: metadata.LicenseShortName?.value || 'See source page',
          author: metadata.Artist?.value
            ? metadata.Artist.value.replace(/<[^>]*>/g, '').trim()
            : 'See source page'
        };
      })
      .filter((image) => typeof image.image_url === 'string' && image.image_url.trim());
  } catch (error) {
    return [];
  }
}

function combineImageRecords(primaryImages, fallbackImages) {
  const allImages = [...primaryImages, ...fallbackImages];
  const seenUrls = [];

  return allImages.filter((image) => {
    if (!image.image_url || seenUrls.includes(image.image_url)) {
      return false;
    }

    seenUrls.push(image.image_url);
    return true;
  });
}

function createPackageImages(imageRecords, packageIndex) {
  if (imageRecords.length === 0) {
    return [];
  }

  const imageCount = Math.min(4, imageRecords.length);
  const startIndex = (packageIndex * 3) % imageRecords.length;
  const selectedImages = [];

  for (let index = 0; index < imageCount; index += 1) {
    const imageRecord = imageRecords[(startIndex + index) % imageRecords.length];

    selectedImages.push(imageRecord.image_url);
  }

  return selectedImages;
}

function createDemoPackages(destination, imageRecords) {
  return DEMO_PACKAGE_TEMPLATES.map((template, index) => {
    const packageImages = createPackageImages(imageRecords, index);

    return {
      ...template,
      id: `demo-${destination.id}-package-${index + 1}`,
      destinationId: destination.id,
      availableSpots: template.totalSpots,
      packageImages,
      packageImageSources: imageRecords
        .filter((record) => packageImages.includes(record.image_url))
        .map((record) => ({
          url: record.image_url,
          title: record.title,
          source: record.image_source,
          sourceUrl: record.source_url,
          license: record.license || 'Follow the license shown on the source page',
          author: record.author || 'See source page'
        })),
      operator: 'TravelMate Demo Data',
      sourceUrl: '',
      priceNote: 'Fictional demonstration price in MAD per traveler. This is not an offer from a real travel agency.',
      availabilityNote: 'Demo inventory only. These places do not represent live booking availability.',
      imageNote: packageImages.length > 0
        ? 'Images illustrate points of interest in this destination. Each image source and license should be checked through its sourceUrl; images do not prove that a package service is included.'
        : 'No usable destination images were returned by the image sources at the time of loading.',
      isDemo: true
    };
  });
}

async function fetchCityData(city) {
  const citySlug = encodeURIComponent(city.slug);

  const [cityDetailsResult, poiSearchResult] = await Promise.allSettled([
    fetchJson(`${TRAVELTYPE_API}/cities/${citySlug}?lang=en`),
    fetchJson(`${TRAVELTYPE_API}/pois/search?city=${citySlug}&limit=50&lang=en`)
  ]);

  const cityDetails = cityDetailsResult.status === 'fulfilled'
    ? cityDetailsResult.value
    : {};

  const searchedPois = poiSearchResult.status === 'fulfilled' && Array.isArray(poiSearchResult.value.pois)
    ? poiSearchResult.value.pois
    : [];

  const travelTypeImages = getTravelTypeImageRecords(cityDetails, searchedPois);
  const commonsImages = travelTypeImages.length < 4
    ? await fetchCommonsImages(city)
    : [];
  const imageRecords = combineImageRecords(travelTypeImages, commonsImages);
  const destinationId = `traveltype-${city.slug}`;

  const images = imageRecords.slice(0, 5).map((place) => place.image_url);

  const destination = {
    id: destinationId,
    name: city.name_en || city.name,
    country: city.country_iso2 === 'MA' ? 'Morocco' : city.country_iso2,
    region: 'Not specified by TravelType',
    description: getDestinationDescription(city, cityDetails),
    bestSeason: 'Not specified by TravelType',
    images,
    imageSources: imageRecords.slice(0, 5).map((place) => ({
      url: place.image_url,
      source: place.image_source || 'TravelType'
    })),
    latitude: city.lat,
    longitude: city.lng,
    poiCount: city.poi_count,
    source: 'TravelType',
    sourceUrl: `${TRAVELTYPE_API}/cities/${citySlug}`,
    sourceLicense: 'CC-BY 4.0 for data derived from Wikidata/OSM; image rights follow each image record.'
  };

  return {
    destination,
    packages: createDemoPackages(destination, imageRecords)
  };
}

export async function fetchTravelMateData() {
  const result = await fetchJson(`${TRAVELTYPE_API}/cities?country=MA&limit=10&offset=0`);

  const cities = Array.isArray(result.cities)
    ? result.cities.slice(0, 10)
    : [];

  if (cities.length === 0) {
    throw new Error('TravelType did not return any Moroccan cities.');
  }

  const cityResults = await Promise.all(cities.map((city) => fetchCityData(city)));

  return {
    destinations: cityResults.map((item) => item.destination),
    packages: cityResults.flatMap((item) => item.packages)
  };
}
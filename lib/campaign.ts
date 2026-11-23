// ─────────────────────────────────────────────────────────────────────────────
// LUNA — Private Sale campaign (presentation guard only)
//
// The catalog — prices AND descriptions — lives in the database and is the
// single source of truth (managed from the admin panel). This module does
// NOT override any product data. It only decides whether the sale
// PRESENTATION (the «خصم 20%» / "-20%" badge + struck-through list price)
// applies to a product.
//
// For each of the 9 campaign pieces it records the raised LIST price
// (compare-at) and the EXPECTED sale price now stored in the DB. A product
// gets the badge and compare-at price only while its database price still
// equals the expected sale price; if the price is changed in the admin/DB,
// the product simply falls back to its plain presentation with its real DB
// price and description (fail-safe, nothing to break).
//
// Prices are explicit per-product values (KWD), NOT a computed percentage:
// list 75/75/75/80/80/85/100/105/105 → sale 60/60/60/65/65/70/80/85/85.
// The «خصم 20%» / "-20%" badge is the campaign branding; the effective
// per-piece discount is ~18–20%.
// ─────────────────────────────────────────────────────────────────────────────

export const SALE_PERCENT = 20;

export interface CampaignProduct {
  /** Normalized English-name key, see normalizeProductName() */
  key: string;
  /** Raised list price (KWD) — shown struck through as compare-at */
  listPrice: number;
  /** Final sale price (KWD) as stored in the database — the guard value */
  expectedSalePrice: number;
}

export const CAMPAIGN_PRODUCTS: CampaignProduct[] = [
  { key: 'coral radiance', listPrice: 75, expectedSalePrice: 60 },
  { key: 'malachite', listPrice: 75, expectedSalePrice: 60 },
  { key: 'royal sapphire', listPrice: 75, expectedSalePrice: 60 },
  { key: 'royal jewel', listPrice: 80, expectedSalePrice: 65 },
  { key: 'zamurda fez', listPrice: 80, expectedSalePrice: 65 },
  { key: 'rose authenticity', listPrice: 85, expectedSalePrice: 70 },
  { key: 'rose crown', listPrice: 100, expectedSalePrice: 80 },
  { key: 'diamond sparkle', listPrice: 105, expectedSalePrice: 85 },
  { key: 'velvet luxury', listPrice: 105, expectedSalePrice: 85 },
];

/**
 * Normalizes an English product name for matching, e.g.
 * "The Royal Jewel Caftan" → "royal jewel", "Zamurda Fez Caftan" → "zamurda fez".
 */
export function normalizeProductName(nameEn: string): string {
  return (nameEn || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word !== '' && word !== 'the' && word !== 'caftan')
    .join(' ');
}

const CAMPAIGN_BY_KEY = new Map(CAMPAIGN_PRODUCTS.map((p) => [p.key, p]));

export function getCampaignProduct(nameEn: string): CampaignProduct | undefined {
  return CAMPAIGN_BY_KEY.get(normalizeProductName(nameEn));
}

/** Price string formatting matching the site's own data convention. */
export const formatKwdAr = (amount: number) => `${amount} د.ك`;
export const formatKwdEn = (amount: number) => `${amount} KD`;

interface CampaignProductLike {
  nameEn: string;
  price: string;
  listPrice?: string;
  listPriceEn?: string;
  onSale?: boolean;
}

/**
 * Presentation guard: if the product is a campaign piece AND its database
 * price still equals the campaign's expected sale price, attach the list
 * price as `listPrice`/`listPriceEn` (compare-at, rendered struck through)
 * and flag `onSale` so the badge renders. The product's own price and
 * description are NEVER modified — they come from the database. Any other
 * product (not in the campaign, or price changed in the admin) is returned
 * completely unchanged.
 */
export function applyCampaign<T extends CampaignProductLike>(product: T): T {
  const campaign = getCampaignProduct(product.nameEn);
  if (!campaign) return product;

  const dbPrice = parseFloat((product.price || '').replace(/[^\d.]/g, ''));
  if (Number.isNaN(dbPrice) || dbPrice !== campaign.expectedSalePrice) return product;

  return {
    ...product,
    listPrice: formatKwdAr(campaign.listPrice),
    listPriceEn: formatKwdEn(campaign.listPrice),
    onSale: true,
  };
}

/**
 * Product + step source of truth for the bundle builder.
 *
 * The content mirrors the supplied Wyze reference UI so the rendered prototype
 * matches the provided layout and pricing more closely.
 */
export const STEPS = [
  {
    id: 'cameras',
    title: 'Choose your cameras',
    icon: '/images/step-camera.svg',
    reviewGroup: 'Cameras',
    select: 'quantity',
    nextLabel: 'Next: Choose your plan',
    products: [
      {
        id: 'wyze-cam-v4',
        title: 'Wyze Cam v4',
        description: 'The clearest Wyze Cam ever made.',
        badge: 'Save 22%',
        image: '/images/img.png',
        price: { active: 2798, compareAt: 3598 },
        variants: [
          { id: 'white', label: 'White', swatch: '#edf2e7', image: '/images/wyze-cam-v4.png' },
          { id: 'grey', label: 'Grey', swatch: '#cbcbcb', image: '/images/wyze-cam-v4-2.png' },
          { id: 'black', label: 'Black', swatch: '#111111', image: '/images/wyze-cam-v4-3.png' },
        ],
      },
      {
        id: 'wyze-cam-pan-v3',
        title: 'Wyze Cam Pan v3',
        description: '360° pan and 180° tilt security camera.',
        badge: 'Save 12%',
        image: '/images/img2.png',
        price: { active: 3498, compareAt: 3998 },
        reviewPrice: { active: 2399, compareAt: 2899 },
        // variants: [
        //   { id: 'white', label: 'White', swatch: '#eef3ee' },
        //   { id: 'black', label: 'Black', swatch: '#171717' },
        // ],
        variants: [
          { id: 'white', label: 'White', swatch: '#edf2e7', image: '/images/campan.png' },
          { id: 'grey', label: 'black', swatch: '#111111', image: "/images/campanblack.png" }
    ]},
      {
        id: 'wyze-cam-floodlight-v2',
        title: 'Wyze Cam Floodlight v2',
        description: '2K floodlight camera with a 160° wide-angle view for your garage.',
        image: '/images/img3.png',
        badge: 'Save 22%',
        price: { active: 6998, compareAt: 8998 },
        variants: [
          { id: 'white', label: 'White', swatch: '#f4f4f4', image: '/images/floodlightwhite.png' },
          { id: 'black', label: 'Black', swatch: '#1a1a1a', image: '/images/floodlightblack.png' },
        ],
      },
      {
        id: 'wyze-duo-cam-doorbell',
        title: 'Wyze Duo Cam Doorbell',
        description: 'Two cameras. Two views. Double the porch protection.',
        image: '/images/img4.png',
        price: { active: 6998 },
      },
      {
        id: 'wyze-battery-cam-pro',
        title: 'Wyze Battery Cam Pro',
        description: 'Protect anywhere. See everything in 2.5K HDR. No power outlet or electrician needed.',
        image: '/images/wyze-battery-cam-pro.png',
        price: { active: 8998 },
        variants: [
          { id: 'white', label: 'White', swatch: '#f7f6f1' , image: '/images/batterycamwhite.png' },
          { id: 'black', label: 'Black', swatch: '#252525',image:"/images/batterycamblack.png" },
        ],
      },
    ],
  },
  {
    id: 'plan',
    title: 'Choose your plan',
    icon: '/images/step-plan.svg',
    reviewGroup: 'Plan',
    select: 'single',
    nextLabel: 'Next: Choose your sensors',
    products: [
      {
        id: 'cam-plus',
        title: 'Cam Plus',
        description: 'Smart detections, rich notifications, and full-length recordings.',
        price: { active: 599, compareAt: 799 },
      },
      {
        id: 'cam-unlimited',
        title: 'Cam Unlimited',
        description: 'Complete smart detections across every camera in your system.',
        image: '/images/plan.png',
        price: { active: 999, compareAt: 1299 },
      },
      {
        id: 'cam-unlimited-pro',
        title: 'Cam Unlimited Pro',
        description: 'Advanced alerts, cloud storage, and premium incident history.',
        price: { active: 1499, compareAt: 1899 },
      },
    ],
  },
  {
    id: 'sensors',
    title: 'Choose your sensors',
    icon: '/images/step-sensor.png',
    reviewGroup: 'Sensors',
    select: 'quantity',
    nextLabel: 'Next: Add extra protection',
    products: [
      {
        id: 'wyze-sense-motion-sensor',
        title: 'Wyze Sense Motion Sensor',
        description: 'Motion detection for rooms, hallways, and entries.',
        image: '/images/sensor.png',
        price: { active: 2999 },
      },
      {
        id: 'wyze-sense-hub',
        title: 'Wyze Sense Hub (Required)',
        description: 'Required hub for connecting Wyze Sense accessories.',
        image: '/images/hub.png',
        price: { active: 0, compareAt: 2992 },
      },
      
    ],
  },
  {
    id: 'protection',
    title: 'Add extra protection',
    icon: '/images/step-protect.png',
    reviewGroup: 'Accessories',
    select: 'quantity',
    nextLabel: 'Review your system',
    products: [
      {
        id: 'wyze-microsd-256',
        title: 'Wyze MicroSD Card (256GB)',
        description: 'Local continuous recording and event storage for your cameras.',
        image: '/images/microsd-card.svg',
        price: { active: 2098 },
      },
    ],
  },
];

export const REVIEW_GROUP_ORDER = ['Cameras', 'Sensors', 'Accessories', 'Plan'];

export const PRODUCTS = {};
export const PRODUCT_STEP = {};

for (const step of STEPS) {
  for (const product of step.products) {
    PRODUCTS[product.id] = product;
    PRODUCT_STEP[product.id] = step;
  }
}

export function getProduct(productId) {
  return PRODUCTS[productId] ?? null;
}

export function getVariant(product, variantId) {
  if (!product?.variants || !variantId) return null;
  return product.variants.find((variant) => variant.id === variantId) ?? null;
}

export function defaultVariantId(product) {
  return product?.variants?.[0]?.id ?? null;
}

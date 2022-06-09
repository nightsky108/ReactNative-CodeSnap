import AsyncStorage from '@react-native-community/async-storage';
import S3 from 'aws-sdk/clients/s3';

//= =========Backend Server ========================================
export const ROOT_URL = 'https://xx.com';
export const WS_ROOT_API = 'wss://xx.com/graphql';

export const ROOT_API = `${ROOT_URL}/graphql`;
export const LANG_API = `${ROOT_URL}/api/v1/translation`;

export const STREAM_MEDIA_URI = 'https://xx.com';
export const STREAM_WSS_URI = 'ws://xx:8188/';
export const RECORDING_SERVER_URL = 'https://xx.com';

export const GOOGLE_PLACE_API_KEY = 'xx';
//= ==========wechat========================================================
export const WECHAT_APPID = 'xx';
//= =========Stripe Key=================================
export const STRIPE_KEY = 'pk_test_XX';
export const SHIPPING_SUPPORTED_COUNTRIES = ['US', 'IN', 'CN', 'TH'];
export const allowedCardNetworks = ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'];
export const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
//= ========AWS Constants============================================

export const AWS_ACCESS_KEY_ID = 'XX';
export const AWS_SECRET_ACCESS_KEY = 'XX';
export const AWS_ENDPOINT = 'xx';
export const AWS_REGION = 'bj';
export const s3bucket = new S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
  endpoint: AWS_ENDPOINT,
  signatureVersion: 'v4',
});
console.log('s3bucket', Object.keys(s3bucket));

//= ==========Apps Flyer=======================================================
export const APPS_FLYER_DEV_KEY = 'xx';

/// =============Enum types=============================
export const USER_COUNTRY = { id: 'CN', name: 'China' };
export const AssetType = Object.freeze({
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  PDF: 'PDF',
});

export const SocialActionType = {
  READY: 'READY',
  BLOCKING: 'BLOCKING',
  RATING: 'RATING',
};
export const AssetStatusEnum = {
  UPLOADING: 'UPLOADING',
  UPLOADED: 'UPLOADED',
  FAILED: 'FAILED',
  CANCELED: 'CANCELED',
};
export const CurrencyEnum = {
  AUD: 'AUD',
  CAD: 'CAD',
  EUR: 'EUR',
  GBP: 'GBP',
  INR: 'INR',
  NZD: 'NZD',
  SGD: 'SGD',
  USD: 'USD',
};
export const MarketTypeEnum = {
  DOMESTIC: ['DOMESTIC'],
  INTERNATIONAL: ['INTERNATIONAL'],
  BOTH: ['INTERNATIONAL', 'DOMESTIC'],
};
export const FreeShipType = [
  { id: [], name: '不容许免费邮递' },
  { id: ['DOMESTIC'], name: '容许境内免费邮递' },
  { id: ['INTERNATIONAL'], name: '容许国际免费邮递' },
  { id: ['DOMESTIC', 'DOMESTIC'], name: '容许境内与国际免费邮递' },
];
export const SortFilterType = {
  FEATURED: 'featured',
  PRICEASC: 'priceAsc',
  PRICEDESC: 'priceDec',
  RATING: 'rating',
};
//= ========init values========================

export const initAddress = {
  address1: null,
  street: null,
  city: null,
  country: { name: null },
  region: { name: null },
  zipCode: null,
  addressId: null,
};
//= ========Sort Type=====================
export const SortTypeEnum = {
  DESC: 'DESC',
  ASC: 'ASC',
};
//= =====user setting =========================
export const PushNotification = ['CHATS', 'ORDERS', 'PROFILE'];
export const MeasureSystem = ['SI', 'USC'];
//= =====search types =========================

export const SearchTypes = [
  { id: 'All', label: 'ALL' },
  { id: 'Products', label: 'Live Products' },
  { id: 'LiveStreams', label: 'Shop Live' },
  { id: 'Profiles', label: 'Profile' },
];
//= ====Product==============================
export const ProductSortFeatures = {
  CREATED_AT: 'CREATED_AT',
  PRICE: 'PRICE',
  SOLD: 'SOLD',
};
//= ========Order Filter=====================================

export const OrderTypes = ['ALL', 'DISPATCHED', 'UNFULFILL'];
export const OrderStatus = {
  ALL: 'ALL',
  DISPATCHED: 'DISPATCHED',
  UNFULFILL: 'UNFULFILL',
};
export const OrderSortFeatures = {
  PURCHASE_DATE: 'PURCHASE_DATE',
  DISPATCH_DATE: 'DISPATCH_DATE',
  NAME: 'NAME',
  PRICE: 'PRICE',
};
export const OrderSortValues = {
  DESC: 'DESC',
  ASC: 'ASC',
};
export const OrderTimePeroidTypes = {
  YEAR: 'YEAR',
  MONTH: 'MONTH',
  DATE: 'DATE',
  ALL: 'ALL',
};
export const OrderItemStatus = {
  CREATED: 'CREATED',
  ORDERED: 'ORDERED',
  CARRIER_RECEIVED: 'CARRIER_RECEIVED',
  DELIVERED: 'DELIVERED',
  COMPLETE: 'COMPLETE',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  CANCELED: 'CANCELED',
};
export const PurchaseOrderStatus = {
  CREATED: 'CREATED',
  ORDERED: 'ORDERED',
  CARRIER_RECEIVED: 'CARRIER_RECEIVED',
  DELIVERED: 'DELIVERED',
  COMPLETE: 'COMPLETE',
  CANCELED: 'CANCELED',
};
export const OrderItemStatusFilter = {
  ALL: ['CREATED', 'ORDERED', 'CARRIER_RECEIVED', 'DELIVERED', 'COMPLETE', 'CONFIRMED', 'CANCELED'],
  DISPATCHED: ['CREATED', 'ORDERED'],
  UNFULFILL: ['DELIVERED', 'COMPLETE', 'CARRIER_RECEIVED'],
};
export const PurchaseOrderItemStatusFilter = {
  ALL: ['CREATED', 'ORDERED', 'CARRIER_RECEIVED', 'DELIVERED', 'COMPLETE', 'CANCELED'],
  SHIPPED: ['CREATED', 'ORDERED'],
  DELIVERY: ['DELIVERED', 'COMPLETE', 'CARRIER_RECEIVED'],
};
export const ReportReasonList = {
  NUDITY: 'NUDITY',
  VIOLENCE: 'VIOLENCE',
  SUICIDE_OR_SELF_INJURY: 'SUICIDE_OR_SELF_INJURY',
  HATE_SPEECH: 'HATE_SPEECH',
  VIOLATING_COPYRIGHT: 'VIOLATING_COPYRIGHT',
  USAGE_OF_PROFANITY: 'USAGE_OF_PROFANITY',
  HARASSMENT: 'HARASSMENT',
  FALSE_NEWS: 'FALSE_NEWS',
  ILLEGAL_SALES: 'ILLEGAL_SALES',
};
//= ========Live Stream=============================
export const OrientationMode = {
  LANDSCAPE: 'LANDSCAPE',
  PORTRAIT: 'PORTRAIT',
};
export const MessageTypeEnum = {
  TEXT: 'TEXT',
  STICKER: 'STICKER',
  ASSET: 'ASSET',
};
export const AppFlyerAction = {
  LIVESTREAM: 'LIVESTREAM',
};
export const AssetsBtnObj = {
  type: 'button',
  id: 'button',
};
export const ImagePickerOptions = {
  PHOTO_ACTIONS: ['Take a photo', 'Choose from gallery', 'Cancel'],
  DESTRUCTIVE_INDEX: 2,
  CANCEL_INDEX: 2,
};

export const Image_Options = {
  mediaType: 'photo',
  includeBase64: false,
};
export const Video_Options = {
  mediaType: 'video',
  videoQuality: 'low',
  durationLimit: 10,
  includeBase64: false,
  storageOptions: {
    skipBackup: true,
  },
  saveToPhotos: false,
};
export const StreamChannelStatus = {
  PENDING: 'PENDING',
  STREAMING: 'STREAMING',
  FINISHED: 'FINISHED',
  ARCHIVED: 'ARCHIVED',
  CANCELED: 'CANCELED',
};
export const StreamTypeDataKey = {
  isBroadCasting: 'isBroadCasting',
  isFollowed: 'isFollowed',
  isVideo: 'isVideo',
};
export const StreamTypeData = {
  isBroadCasting: [StreamChannelStatus.STREAMING, StreamChannelStatus.PENDING],
  isFollowed: [
    StreamChannelStatus.STREAMING,
    StreamChannelStatus.PENDING,
    StreamChannelStatus.FINISHED,
  ],
  isVideo: [StreamChannelStatus.FINISHED],
};

//= ====================================
export const SellerColor = ['#C50000', '#738AAA', '#00D7B0', '#2A8CFF'];
//= ======Theme======================================
export const ThemeTypes = {
  NORMAL: 'NORMAL',
  LIMITED_TIME: 'LIMITED_TIME',
  DISCOUNT: 'DISCOUNT',
};
export const ThemeSortFeatures = {
  ORDER: 'ORDER',
  CREATED_AT: 'CREATED_AT',
  NAME: 'NAME',
};
//= =====Organizations===========================================
export const OrganizationSortFeature = {
  ORDER: 'ORDER',
  CREATED_AT: 'CREATED_AT',
};
//= =====Banner===========================================
export const BannerTypes = {
  PNG: 'PNG',
  JPG: 'JPG',
  GIF: 'GIF',
  MP4: 'MP4',
};
export const BannerADTypes = {
  CATEGORY: 'CATEGORY',
  PRODUCT: 'PRODUCT',
  PROMOTION: 'PROMOTION',
  SUGGESTION: 'SUGGESTION',
  THEME: 'THEME',
  THEME_PRODUCT: 'THEME_PRODUCT',
};
export const BannerLayoutTypes = {
  CAROUSEL: 'CAROUSEL',
  FLASH: 'FLASH',
  FLOATING: 'FLOATING',
  ROTATING: 'ROTATING',
  STATIC: 'STATIC',
};
export const BannerSortFeatures = {
  CREATED_AT: 'CREATED_AT',
  NAME: 'NAME',
};
export const AssetTypeEnum = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  PDF: 'PDF',
  CSV: 'CSV',
};
export const PaymentMethodProviders = {
  Stripe: 'Stripe',
  APPLEPAY: 'APPLEPAY',
  GOOGLEPAY: 'GOOGLEPAY',
  RazorPay: 'RazorPay',
  Alipay: 'Alipay',
  WeChatPay: 'WeChatPay',
  LinePay: 'LinePay',
  PayPal: 'PayPal',
  UnionPay: 'UnionPay',
  Braintree: 'Braintree',
};
export const WeightUnitSystemEnum = {
  OUNCE: 'OUNCE',
  GRAM: 'GRAM',
};
export const SizeUnitSystemEnum = {
  INCH: 'INCH',
  CENTIMETER: 'CENTIMETER',
};
export const MetricUnitType = {
  size: SizeUnitSystemEnum.CENTIMETER,
  weight: WeightUnitSystemEnum.GRAM,
};
export const BritishUnitType = {
  size: SizeUnitSystemEnum.INCH,
  weight: WeightUnitSystemEnum.OUNCE,
};

export type ContentType = 'article' | 'recipe';

export interface LongTailAuditItem {
  keyword: string;
  occurrences: number;
  sectionPlaced: string;
  intentCoverage: string;
}

export interface InContentImagePrompt {
  title: string;
  prompt: string;
  altText: string;
  caption: string;
  generatedImageUrl?: string;
}

export interface SuggestedMedia {
  thumbnailPrompt: string;
  thumbnailHeadlineOverlay: string;
  thumbnailBadge: string;
  inContentImagePrompts: InContentImagePrompt[];
}

export interface ArticleSection {
  heading: string;
  level: string; // 'h2' | 'h3'
  content: string;
  calloutTip?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleContent {
  introduction: string;
  sections: ArticleSection[];
  conclusion: string;
  faqs: FaqItem[];
}

export interface RecipeIngredient {
  item: string;
  amount: string;
  unit: string;
  category?: string;
  notes?: string;
}

export interface RecipeInstruction {
  stepNumber: number;
  title: string;
  text: string;
  timerMinutes?: number;
  tempNote?: string;
  chefTip?: string;
}

export interface RecipeNutrition {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sodium?: string;
}

export interface RecipeData {
  recipeTitle: string;
  summary: string;
  cuisine: string;
  category: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: string;
  caloriesPerServing: number;
  dietaryTags: string[];
  equipment: string[];
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  chefTips: string[];
  nutrition: RecipeNutrition;
  storageAndReheating?: string;
  variations?: string[];
  schemaJsonLd: string;
}

export interface PinterestPinRow {
  id: string;
  title: string;
  description: string;
  keywords: string;
  link: string;
  board: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailTitle?: string;
  publishAt?: string;
  status: 'draft' | 'queued' | 'validating' | 'publishing' | 'published' | 'failed';
  pinId?: string;
  publishedUrl?: string;
  error?: string;
}

export interface PinterestBoard {
  id: string;
  name: string;
  category: string;
  pinCount: number;
}

export interface GeneratedContentResponse {
  metaTitle: string;
  metaDescription: string;
  urlSlug: string;
  h1Title: string;
  primaryKeyword: string;
  longTailKeywords: string[];
  searchIntent: string;
  seoScore: number;
  seoStrengths: string[];
  seoRecommendations: string[];
  longTailPlacementAudit: LongTailAuditItem[];
  estimatedReadTimeMinutes: number;
  suggestedMedia: SuggestedMedia;
  articleContent: ArticleContent;
  recipeData?: RecipeData;
}

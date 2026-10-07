import type { GeneratedContentResponse } from '../types.ts';

export function normalizeContentResponse(raw: any): GeneratedContentResponse {
  if (!raw || typeof raw !== 'object') {
    return {
      metaTitle: 'SEO Optimized Content Guide',
      metaDescription: 'Complete step-by-step authoritative guide optimized for search rankings.',
      urlSlug: 'seo-guide',
      h1Title: 'High-Ranking Content & Optimization Guide',
      primaryKeyword: 'seo guide',
      longTailKeywords: [],
      searchIntent: 'Informational',
      seoScore: 92,
      seoStrengths: ['Semantic relevance', 'High-intent structure'],
      seoRecommendations: ['Internal link to related topic'],
      longTailPlacementAudit: [],
      estimatedReadTimeMinutes: 5,
      suggestedMedia: {
        thumbnailPrompt: 'Modern high-resolution editorial graphic',
        thumbnailHeadlineOverlay: 'PRO GUIDE',
        thumbnailBadge: 'RANK #1',
        inContentImagePrompts: [],
      },
      articleContent: {
        introduction: '',
        sections: [],
        conclusion: '',
        faqs: [],
      },
    };
  }

  const primaryKeyword = raw.primaryKeyword || 'seo guide';
  const h1Title = raw.h1Title || raw.metaTitle || 'High-Ranking Guide';

  return {
    metaTitle: raw.metaTitle || h1Title,
    metaDescription: raw.metaDescription || '',
    urlSlug: raw.urlSlug || primaryKeyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    h1Title,
    primaryKeyword,
    longTailKeywords: Array.isArray(raw.longTailKeywords) ? raw.longTailKeywords : [],
    searchIntent: raw.searchIntent || 'Informational & Commercial',
    seoScore: typeof raw.seoScore === 'number' ? raw.seoScore : 92,
    seoStrengths: Array.isArray(raw.seoStrengths) && raw.seoStrengths.length > 0
      ? raw.seoStrengths
      : ['Keyword in Title & H1', 'E-E-A-T Compliant Structure', 'High Readability'],
    seoRecommendations: Array.isArray(raw.seoRecommendations)
      ? raw.seoRecommendations
      : ['Add internal link to supporting content'],
    longTailPlacementAudit: Array.isArray(raw.longTailPlacementAudit) ? raw.longTailPlacementAudit : [],
    estimatedReadTimeMinutes: typeof raw.estimatedReadTimeMinutes === 'number' ? raw.estimatedReadTimeMinutes : 6,
    suggestedMedia: {
      thumbnailPrompt: raw.suggestedMedia?.thumbnailPrompt || `High-CTR photography for ${primaryKeyword}`,
      thumbnailHeadlineOverlay: raw.suggestedMedia?.thumbnailHeadlineOverlay || 'TESTED & PROVEN!',
      thumbnailBadge: raw.suggestedMedia?.thumbnailBadge || 'RANK #1',
      inContentImagePrompts: Array.isArray(raw.suggestedMedia?.inContentImagePrompts)
        ? raw.suggestedMedia.inContentImagePrompts
        : [],
    },
    articleContent: {
      introduction: raw.articleContent?.introduction || '',
      sections: Array.isArray(raw.articleContent?.sections)
        ? raw.articleContent.sections.map((sec: any) => ({
            heading: sec.heading || 'Section Overview',
            level: sec.level === 'h3' ? 'h3' : 'h2',
            content: sec.content || '',
            calloutTip: sec.calloutTip || undefined,
          }))
        : [],
      conclusion: raw.articleContent?.conclusion || '',
      faqs: Array.isArray(raw.articleContent?.faqs)
        ? raw.articleContent.faqs.map((faq: any) => ({
            question: faq.question || '',
            answer: faq.answer || '',
          }))
        : [],
    },
    recipeData: raw.recipeData
      ? {
          recipeTitle: raw.recipeData.recipeTitle || h1Title,
          summary: raw.recipeData.summary || '',
          cuisine: raw.recipeData.cuisine || 'Contemporary Gourmet',
          category: raw.recipeData.category || 'Main Dish',
          prepTimeMinutes: typeof raw.recipeData.prepTimeMinutes === 'number' ? raw.recipeData.prepTimeMinutes : 15,
          cookTimeMinutes: typeof raw.recipeData.cookTimeMinutes === 'number' ? raw.recipeData.cookTimeMinutes : 20,
          totalTimeMinutes: typeof raw.recipeData.totalTimeMinutes === 'number' ? raw.recipeData.totalTimeMinutes : 35,
          servings: typeof raw.recipeData.servings === 'number' ? raw.recipeData.servings : 4,
          difficulty: raw.recipeData.difficulty || 'Easy',
          caloriesPerServing: typeof raw.recipeData.caloriesPerServing === 'number' ? raw.recipeData.caloriesPerServing : 450,
          dietaryTags: Array.isArray(raw.recipeData.dietaryTags) ? raw.recipeData.dietaryTags : ['Quick & Easy'],
          equipment: Array.isArray(raw.recipeData.equipment) ? raw.recipeData.equipment : ['Skillet', 'Chef Knife'],
          ingredients: Array.isArray(raw.recipeData.ingredients)
            ? raw.recipeData.ingredients.map((ing: any) => ({
                item: ing.item || 'Ingredient',
                amount: ing.amount !== undefined ? String(ing.amount) : '1',
                unit: ing.unit || '',
                category: ing.category || 'Pantry',
                notes: ing.notes || undefined,
              }))
            : [],
          instructions: Array.isArray(raw.recipeData.instructions)
            ? raw.recipeData.instructions.map((inst: any, idx: number) => ({
                stepNumber: typeof inst.stepNumber === 'number' ? inst.stepNumber : idx + 1,
                title: inst.title || `Step ${idx + 1}`,
                text: inst.text || '',
                timerMinutes: typeof inst.timerMinutes === 'number' ? inst.timerMinutes : undefined,
                tempNote: inst.tempNote || undefined,
                chefTip: inst.chefTip || undefined,
              }))
            : [],
          chefTips: Array.isArray(raw.recipeData.chefTips) ? raw.recipeData.chefTips : [],
          nutrition: {
            calories: raw.recipeData.nutrition?.calories || '450 kcal',
            protein: raw.recipeData.nutrition?.protein || '35g',
            carbs: raw.recipeData.nutrition?.carbs || '10g',
            fat: raw.recipeData.nutrition?.fat || '28g',
            fiber: raw.recipeData.nutrition?.fiber || '2g',
            sodium: raw.recipeData.nutrition?.sodium || '480mg',
          },
          storageAndReheating: raw.recipeData.storageAndReheating || 'Store refrigerated for up to 3 days in an airtight container.',
          variations: Array.isArray(raw.recipeData.variations) ? raw.recipeData.variations : [],
          schemaJsonLd: typeof raw.recipeData.schemaJsonLd === 'string'
            ? raw.recipeData.schemaJsonLd
            : JSON.stringify({
                '@context': 'https://schema.org/',
                '@type': 'Recipe',
                name: raw.recipeData.recipeTitle || h1Title,
              }),
        }
      : undefined,
  };
}

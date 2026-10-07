import { jsPDF } from 'jspdf';
import { RecipeData } from '../types';

export function downloadRecipePdf(recipe: RecipeData, options?: { scaleMultiplier?: number }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Background Banner
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, y, contentWidth, 32, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(recipe.recipeTitle, contentWidth - 12);
  doc.text(titleLines, margin + 6, y + 10);

  // Subtitle / Cuisine & Category
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  const subText = `${recipe.cuisine || 'Gourmet'} • ${recipe.category || 'Main Dish'} • ${recipe.dietaryTags?.join(', ') || 'Custom Recipe'}`;
  doc.text(subText, margin + 6, y + 20);

  // Key stats bar inside banner
  const mult = options?.scaleMultiplier || 1;
  const scaledServings = Math.round(recipe.servings * mult);
  const statsText = `Prep: ${recipe.prepTimeMinutes}m | Cook: ${recipe.cookTimeMinutes}m | Total: ${recipe.totalTimeMinutes}m | Servings: ${scaledServings} | ${recipe.caloriesPerServing} kcal/srv`;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(251, 191, 36); // amber-400
  doc.text(statsText, margin + 6, y + 27);

  y += 38;

  // Helper for adding page if space runs out
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Recipe Summary
  if (recipe.summary) {
    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    const summaryLines = doc.splitTextToSize(recipe.summary, contentWidth);
    checkPageBreak(summaryLines.length * 5 + 4);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 6;
  }

  // 2-Column Section for Ingredients & Instructions
  const colGap = 8;
  const col1Width = 68; // Ingredients column
  const col2Width = contentWidth - col1Width - colGap; // Instructions column
  const col2X = margin + col1Width + colGap;

  let yCol1 = y;
  let yCol2 = y;

  // --- COLUMN 1: INGREDIENTS & NUTRITION ---
  // Heading: Ingredients
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('INGREDIENTS', margin, yCol1);
  yCol1 += 5;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, yCol1, margin + col1Width, yCol1);
  yCol1 += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  (recipe.ingredients || []).forEach((ing) => {
    // scale amount if numeric
    let displayAmount = ing.amount;
    const num = parseFloat(ing.amount);
    if (!isNaN(num) && mult !== 1) {
      displayAmount = (num * mult).toFixed(mult % 1 === 0 ? 0 : 1);
    }

    const ingText = `[ ] ${displayAmount} ${ing.unit} ${ing.item}${ing.notes ? ` (${ing.notes})` : ''}`;
    const lines = doc.splitTextToSize(ingText, col1Width - 2);

    if (yCol1 + lines.length * 4 > pageHeight - margin) {
      // Keep on same page or break
    }
    doc.setTextColor(51, 65, 85);
    doc.text(lines, margin, yCol1);
    yCol1 += lines.length * 4.2;
  });

  // Nutrition Card in Column 1
  yCol1 += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, yCol1, col1Width, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('NUTRITION (per serving)', margin + 3, yCol1 + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const nutrition = recipe.nutrition || { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fat: 'N/A', fiber: 'N/A' };
  doc.text(`Calories: ${nutrition.calories}`, margin + 3, yCol1 + 9);
  doc.text(`Protein: ${nutrition.protein} | Fat: ${nutrition.fat}`, margin + 3, yCol1 + 13.5);
  doc.text(`Carbs: ${nutrition.carbs} | Fiber: ${nutrition.fiber}`, margin + 3, yCol1 + 18);
  if (nutrition.sodium) {
    doc.text(`Sodium: ${nutrition.sodium}`, margin + 3, yCol1 + 22);
  }
  yCol1 += 28;

  // --- COLUMN 2: INSTRUCTIONS ---
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('METHOD & DIRECTIONS', col2X, yCol2);
  yCol2 += 5;
  doc.setDrawColor(226, 232, 240);
  doc.line(col2X, yCol2, col2X + col2Width, yCol2);
  yCol2 += 4;

  (recipe.instructions || []).forEach((inst) => {
    // Step badge / title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9); // amber-700
    const stepHeader = `Step ${inst.stepNumber}: ${inst.title}${inst.timerMinutes ? ` [Timer: ${inst.timerMinutes} min]` : ''}`;
    doc.text(stepHeader, col2X, yCol2);
    yCol2 += 4.5;

    // Step text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const textLines = doc.splitTextToSize(inst.text, col2Width);
    doc.text(textLines, col2X, yCol2);
    yCol2 += textLines.length * 4 + 3;

    if (inst.chefTip) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      const tipLines = doc.splitTextToSize(`* Chef Note: ${inst.chefTip}`, col2Width);
      doc.text(tipLines, col2X, yCol2);
      yCol2 += tipLines.length * 3.5 + 2;
    }
  });

  y = Math.max(yCol1, yCol2) + 4;

  // Chef Tips Box at bottom
  if (recipe.chefTips && recipe.chefTips.length > 0) {
    checkPageBreak(25);
    doc.setFillColor(254, 243, 199); // amber-100
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14); // amber-800
    doc.text('CHEF PRO TIPS FOR MAXIMUM FLAVOR:', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 53, 15);
    const tipsText = recipe.chefTips.join(' • ');
    const tipLines = doc.splitTextToSize(tipsText, contentWidth - 8);
    doc.text(tipLines, margin + 4, y + 10);
    y += 22;
  }

  // Footer branding
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated by RankCraft SEO Article & Recipe Engine • High-Ranking Structured Recipe`, margin, pageHeight - 8);

  const cleanFilename = recipe.recipeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  doc.save(`${cleanFilename || 'recipe'}-card.pdf`);
}

export function downloadRecipeText(recipe: RecipeData, format: 'txt' | 'md' = 'txt') {
  let content = '';

  if (format === 'md') {
    content = `# ${recipe.recipeTitle}

**Cuisine:** ${recipe.cuisine} | **Category:** ${recipe.category} | **Difficulty:** ${recipe.difficulty}
**Prep Time:** ${recipe.prepTimeMinutes} mins | **Cook Time:** ${recipe.cookTimeMinutes} mins | **Total Time:** ${recipe.totalTimeMinutes} mins
**Servings:** ${recipe.servings} | **Calories:** ${recipe.caloriesPerServing} kcal/serving
**Dietary:** ${recipe.dietaryTags?.join(', ')}

---

## Description
${recipe.summary || ''}

## Equipment
${(recipe.equipment || []).map((eq) => `- ${eq}`).join('\n')}

## Ingredients
${(recipe.ingredients || []).map((ing) => `- [ ] ${ing.amount} ${ing.unit} **${ing.item}**${ing.notes ? ` (${ing.notes})` : ''}`).join('\n')}

## Method & Instructions
${(recipe.instructions || []).map((inst) => `### Step ${inst.stepNumber}: ${inst.title}${inst.timerMinutes ? ` (${inst.timerMinutes} mins)` : ''}
${inst.text}
${inst.chefTip ? `> *Chef Tip: ${inst.chefTip}*` : ''}
`).join('\n')}

## Chef Tips
${(recipe.chefTips || []).map((tip) => `- ${tip}`).join('\n')}

## Nutrition Facts (Per Serving)
- Calories: ${recipe.nutrition?.calories || 'N/A'}
- Protein: ${recipe.nutrition?.protein || 'N/A'}
- Carbohydrates: ${recipe.nutrition?.carbs || 'N/A'}
- Fat: ${recipe.nutrition?.fat || 'N/A'}
- Dietary Fiber: ${recipe.nutrition?.fiber || 'N/A'}
${recipe.nutrition?.sodium ? `- Sodium: ${recipe.nutrition.sodium}` : ''}

${recipe.storageAndReheating ? `## Storage & Reheating\n${recipe.storageAndReheating}\n` : ''}
---
*Generated by RankCraft SEO & Culinary Studio*
`;
  } else {
    content = `${recipe.recipeTitle.toUpperCase()}
==================================================
Cuisine: ${recipe.cuisine} | Category: ${recipe.category} | Difficulty: ${recipe.difficulty}
Prep: ${recipe.prepTimeMinutes}m | Cook: ${recipe.cookTimeMinutes}m | Total: ${recipe.totalTimeMinutes}m | Servings: ${recipe.servings}
Calories: ${recipe.caloriesPerServing} kcal per serving
Dietary Tags: ${(recipe.dietaryTags || []).join(', ')}

DESCRIPTION:
${recipe.summary || ''}

EQUIPMENT NEEDED:
${(recipe.equipment || []).map((e) => `• ${e}`).join('\n')}

INGREDIENTS:
${(recipe.ingredients || []).map((ing) => `[ ] ${ing.amount} ${ing.unit} ${ing.item}${ing.notes ? ` (${ing.notes})` : ''}`).join('\n')}

INSTRUCTIONS:
${(recipe.instructions || []).map((inst) => `STEP ${inst.stepNumber}: ${inst.title}${inst.timerMinutes ? ` [Timer: ${inst.timerMinutes} mins]` : ''}
${inst.text}
${inst.chefTip ? `Chef Tip: ${inst.chefTip}` : ''}
`).join('\n')}

CHEF SECRETS:
${(recipe.chefTips || []).map((t) => `• ${t}`).join('\n')}

NUTRITION:
Calories: ${recipe.nutrition?.calories || 'N/A'} | Protein: ${recipe.nutrition?.protein || 'N/A'} | Carbs: ${recipe.nutrition?.carbs || 'N/A'} | Fat: ${recipe.nutrition?.fat || 'N/A'} | Fiber: ${recipe.nutrition?.fiber || 'N/A'}

STORAGE:
${recipe.storageAndReheating || 'Keep refrigerated in an airtight container for up to 4 days.'}
`;
  }

  const blob = new Blob([content], { type: format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const cleanFilename = recipe.recipeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  link.download = `${cleanFilename || 'recipe'}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

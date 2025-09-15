// VercelRequest and VercelResponse types
interface VercelRequest {
  method?: string;
  body?: any;
  query?: { [key: string]: string | string[] | undefined };
  cookies?: { [key: string]: string };
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

import { products } from '../src/data/products.js';
import type { SubscriptionSuggestion } from '../src/types/index.js';

// GET /api/subscription-suggestions - Get product suggestions for subscriptions
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const type = (req.query?.type as string) || 'weekly'; // 'weekly' or 'monthly'
    const totalWeight = type === 'weekly' ? 4 : 12;

    // Get all meat products for suggestions
    const meatProducts = products.filter(p => p.category === 'meat' && p.stock > 0);

    // Create suggestions based on popular cuts and variety
    const suggestions: SubscriptionSuggestion[] = [
      // Premium cuts (always suggested)
      {
        productId: 'ojo-de-bife',
        productName: 'Ojo de Bife',
        reason: 'Premium ribeye - perfect for special occasions',
        weight: type === 'weekly' ? 1 : 2,
        price: 45
      },
      {
        productId: 'bife-de-chorizo',
        productName: 'Bife de Chorizo',
        reason: 'Classic strip steak - great for grilling',
        weight: type === 'weekly' ? 1 : 2,
        price: 28
      },
      // Popular cuts
      {
        productId: 'entraña',
        productName: 'Entraña',
        reason: 'Tender skirt steak - customer favorite',
        weight: type === 'weekly' ? 0.5 : 1.5,
        price: 24
      },
      {
        productId: 'vacio',
        productName: 'Vacío',
        reason: 'Flank steak - versatile and flavorful',
        weight: type === 'weekly' ? 0.5 : 1.5,
        price: 22
      },
      // Value cuts
      {
        productId: 'asado',
        productName: 'Asado',
        reason: 'Traditional asado - perfect for family meals',
        weight: type === 'weekly' ? 1 : 3,
        price: 22
      },
      {
        productId: 'cuadril',
        productName: 'Colita de cuadril',
        reason: 'Top sirloin - excellent value',
        weight: type === 'weekly' ? 1 : 2,
        price: 24
      }
    ];

    // Filter suggestions to match available products
    const availableSuggestions = suggestions.filter(suggestion => 
      meatProducts.some(product => product.id === suggestion.productId)
    );

    // Calculate total weight of suggestions
    const suggestionWeight = availableSuggestions.reduce((sum, s) => sum + s.weight, 0);
    
    // If suggestions exceed target weight, adjust the largest items
    if (suggestionWeight > totalWeight) {
      const excess = suggestionWeight - totalWeight;
      // Reduce the largest weight items
      availableSuggestions.sort((a, b) => b.weight - a.weight);
      let remainingExcess = excess;
      
      for (let i = 0; i < availableSuggestions.length && remainingExcess > 0; i++) {
        const reduction = Math.min(availableSuggestions[i].weight * 0.5, remainingExcess);
        availableSuggestions[i].weight = Math.max(0.5, availableSuggestions[i].weight - reduction);
        remainingExcess -= reduction;
      }
    }

    return res.status(200).json({ 
      suggestions: availableSuggestions,
      totalWeight: availableSuggestions.reduce((sum, s) => sum + s.weight, 0),
      targetWeight: totalWeight
    });
  } catch (error) {
    console.error('Error fetching subscription suggestions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

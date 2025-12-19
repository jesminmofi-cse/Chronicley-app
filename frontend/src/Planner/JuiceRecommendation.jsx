import React, { useState } from 'react';
import './JuiceRecommendations.css';

const juiceData = [
  {
    category: "Glowing Skin",
    juices: [
      { name: "Citrus Glow Juice", ingredients: "Orange + Lemon + Honey (optional)", benefits: "High in Vitamin C, energizes, supports collagen synthesis, brightens complexion" },
      { name: "Kiwi Green Juice", ingredients: "Kiwi + Cucumber + Green Apple + Mint", benefits: "Hydrating, Vitamins C & E, promotes dewy, supple skin" },
      { name: "Pineapple Radiance", ingredients: "Pineapple + Ginger + Carrot", benefits: "Anti-inflammatory, aids digestion, boosts skin healing" },
      { name: "Tomato-Grape Tonic", ingredients: "Tomato + Grapes + Lemon", benefits: "Lycopene + Resveratrol, anti-aging, collagen protection" },
      { name: "Berry Blast Juice", ingredients: "Strawberries + Blueberries + Mint + Lemon", benefits: "Antioxidants & Vitamin C, fights free radicals" }
    ]
  },
  {
    category: "Hair Health",
    juices: [
      { name: "Carrot-Orange Shine", ingredients: "Carrot + Orange + Ginger", benefits: "Vitamin A & C, supports sebum production, scalp health" },
      { name: "Mango-Coconut Elixir", ingredients: "Mango + Coconut Water", benefits: "Vitamin A & electrolytes, nourishes hair follicles" },
      { name: "Spinach-Apple Booster", ingredients: "Spinach + Green Apple + Lemon", benefits: "Iron & Vitamin C, strengthens hair" },
      { name: "Grape-Beet Power", ingredients: "Grapes + Beetroot + Lemon", benefits: "Iron & antioxidants improve scalp circulation" }
    ]
  },
  {
    category: "Digestion",
    juices: [
      { name: "Pineapple-Ginger Aid", ingredients: "Pineapple + Ginger + Mint", benefits: "Bromelain & gingerol aid digestion, reduce bloating" },
      { name: "Apple-Carrot Tummy Soother", ingredients: "Apple + Carrot + Ginger", benefits: "High fiber, calms stomach, gentle digestion" },
      { name: "Minty Lemon Cooler", ingredients: "Lemon + Mint + Honey (optional)", benefits: "Soothes digestive tract, mild detox" },
      { name: "Papaya Digest Juice", ingredients: "Papaya + Lime", benefits: "Papain enzyme eases digestion, reduces bloating" }
    ]
  },
  {
    category: "Eyesight",
    juices: [
      { name: "Classic Carrot Boost", ingredients: "Carrot + Orange + Lemon", benefits: "Beta-carotene (Vitamin A), night vision, eye health" },
      { name: "Mango-Carrot Delight", ingredients: "Mango + Carrot + Lime", benefits: "Vitamin A & C, protects eyes from oxidative stress" },
      { name: "Tomato-Spinach Juice", ingredients: "Tomato + Spinach + Lemon", benefits: "Lutein + Lycopene, guards against macular degeneration" },
      { name: "Green Vision Juice", ingredients: "Kale + Apple + Lemon", benefits: "Lutein, zeaxanthin, filters harmful blue light" }
    ]
  },
  {
    category: "Immunity Boost",
    juices: [
      { name: "Citrus Immunity Shot", ingredients: "Lemon + Orange + Ginger + Honey", benefits: "Vitamin C + gingerol, fights infections" },
      { name: "Pineapple Turmeric Glow", ingredients: "Pineapple + Turmeric + Black Pepper", benefits: "Curcumin + bromelain, anti-inflammatory, immunity-enhancing" },
      { name: "Berry-Citrus Shield", ingredients: "Strawberries + Orange + Lemon", benefits: "Vitamin C powerhouse against seasonal colds" },
      { name: "Apple-Carrot Defender", ingredients: "Apple + Carrot + Ginger", benefits: "Beta-carotene & antioxidants for immune health" }
    ]
  },
  {
    category: "Energy / Detox",
    juices: [
      { name: "Lemon-Mint Detox", ingredients: "Lemon + Mint + Cucumber", benefits: "Cleanses system, hydrates, refreshes" },
      { name: "Green Cleanser", ingredients: "Spinach + Cucumber + Green Apple + Lemon", benefits: "Alkalizing, chlorophyll-rich, supports liver detox" },
      { name: "Watermelon-Pomegranate Splash", ingredients: "Watermelon + Pomegranate (optional)", benefits: "Hydrating, rich in lycopene, flushes toxins" },
      { name: "Kiwi-Lime Zest", ingredients: "Kiwi + Lime + Mint", benefits: "Vitamin C rich, refreshing, detoxifying" }
    ]
  }
];

export default function JuiceRecommendations() {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <div className="juice-container">
      <h2 className="juice-title"> Juice Recommendations</h2>
      <p className="juice-subtitle">
        Pick your potion of the day! Sip for skin, hair, digestion, eyesight, immunity, or energy.
      </p>
      <div className="categories">
        {juiceData.map((category, idx) => (
          <div key={idx} className="category">
            <button
              className="category-header"
              onClick={() => toggleCategory(idx)}
            >
              {category.category}
              <span className="arrow">{openCategory === idx ? '▲' : '▼'}</span>
            </button>
            {openCategory === idx && (
              <div className="category-content">
                <table>
                  <thead>
                    <tr>
                      <th>Juice Name</th>
                      <th>Ingredients</th>
                      <th>Benefits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.juices.map((juice, jdx) => (
                      <tr key={jdx}>
                        <td>{juice.name}</td>
                        <td>{juice.ingredients}</td>
                        <td>{juice.benefits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

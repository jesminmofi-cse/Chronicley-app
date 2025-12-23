import React, { useState } from 'react';

const categories = [
  'Positive',
  'Wealth',
  'Success',
  'Wisdom',
  'Self-Love',
  'Motivation'
];

const AffirmationData = {
  Positive: [
    "I am calm, capable, and grounded.",
    "Every day I grow stronger and wiser.",
    "I choose peace over perfection.",
    "I am worthy of love and respect.",
    "I embrace the present moment with gratitude.",
    "I am choosing happiness today.",
    "I am enough just as I am.",
    "I am proud of how far I have come.",
    "I radiate positivity and attract good things into my life.",
    "I am in charge of how I feel, and today I am choosing joy.",
    "I am resilient, strong, and brave, and I can’t be destroyed.",
    "I am surrounded by love and support.",
    "I am grateful for the abundance that I have and the abundance on its way.",
    "I am worthy of all the good things life has to offer.",
    "I am a positive thinker and only attract positivity in my life.",
    "I am at peace with my past and looking forward to the future.",
    "I am confident in my ability to solve problems.",
    "I am becoming the best version of myself.",
    "I am deserving of happiness and success."
  ],
  Wealth: [
    "I attract abundance and prosperity.",
    "Money flows to me easily.",
    "I manage my money wisely.",
    "I am financially secure.",
    "I deserve to be wealthy.",
    "My actions create constant prosperity.",
    "I am open to receiving unexpected opportunities for wealth.",
    "I am a magnet for financial abundance.",
    "I am worthy of financial success.",
    "I am grateful for the wealth I have and the wealth that is coming to me.",
    "I am capable of overcoming any money obstacles that stand in my way.",
    "I am aligned with the energy of abundance.",
    "I am financially free.",
    "I am open to new avenues of income.",
    "I am responsible with my finances.",
    "I am attracting lucrative opportunities to create more money.",
    "I am worthy of making more money.",
    "I am grateful for the wealth that flows into my life.",
    "I am open to receiving wealth in various forms.",
    "I am confident in my ability to create wealth.",
    "I am attracting money effortlessly.",
    "I am financially abundant.",
    "I am a successful money manager.",
    "I am open to new financial opportunities.",
    "I am worthy of financial abundance.",
    "I am grateful for the money I have and the money that is coming to me.",
    "I am capable of achieving my financial goals."
  ],
  Success: [
    "I am capable of achieving my goals.",
    "Success comes naturally to me.",
    "I learn from failure and grow stronger.",
    "I am persistent and never give up.",
    "I am focused and determined.",
    "I am worthy of success.",
    "I am confident in my abilities.",
    "I am open to new opportunities for success.",
    "I am surrounded by supportive people who believe in me.",
    "I am constantly improving and growing.",
    "I am resilient in the face of challenges.",
    "I am deserving of all the success I achieve.",
    "I am grateful for my past successes and excited for future ones.",
    "I am a magnet for success and good fortune.",
    "I am proactive in creating my own success.",
    "I am focused on my goals and take consistent action towards them.",
    "I am confident in my ability to overcome obstacles."

  ],
  Wisdom: [
    "I trust my intuition.",
    "I learn from every experience.",
    "I seek clarity and understanding.",
    "I am open to new perspectives.",
    "I grow wiser every day.",
    "I am patient and thoughtful in my decisions.",
    "I embrace challenges as opportunities for growth.",
    "I am open to learning from others.",
    "I reflect on my experiences to gain insight.",
    "I am grateful for the wisdom I have gained.",
    "I am constantly expanding my knowledge and understanding.",
    "I am open to new ideas and perspectives.",
    "I trust my inner wisdom to guide me.",
    "I am patient and take time to make thoughtful decisions."

  ],
  "Self-Love": [
    "I respect my boundaries.",
    "I speak kindly to myself.",
    "I am worthy exactly as I am.",
    "I prioritize my well-being.",
    "I celebrate my uniqueness.",
    "I am deserving of love and happiness.",
    "I honor my needs and desires.",
    "I am proud of who I am becoming."
    
  ],
  Motivation: [
    "I take action every day.",
    "Progress matters more than perfection.",
    "I am disciplined and focused.",
    "I overcome obstacles with ease.",
    "I am driven to achieve my goals.",
    "I am energized and motivated.",
    "I embrace challenges as opportunities to grow.",
    "I am persistent and never give up.",
    "I am focused on my goals and take consistent action towards them.",
    "I am confident in my ability to overcome obstacles."

  ]
};

function CategoryCard({ title, onClick }) {
  return (//returns the jsx for each category card; jsx -is html-like syntax inside JS
    <div
      onClick={onClick}
      style={{
        padding: '18px',//INNER PACING IN THE CELL
        borderRadius: '14px',//ROUND CORNER FO THE BOX
        background:'#d570ecff',//CARD BACKGROUND COLOR
        textAlign: 'center', //TEXT ALIGNMENT
        cursor: 'pointer', //CURSOR POINTER ON HOVER
        fontWeight: '500', //MED- BOLD
        transition: 'all 0.3s ease' 
      }}
    >
      {title}
    </div>
  );
}
function AffirmationPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  //SELECTEDCATEGORY IS THE CURRENTLY CHOSEN CATEGORY
  //CURRENTAFFIRMATION STORES THE DISPLAYED AFFIRMATION
  const showAffirmation = (category) => {
    //FUNCTION THAT RUNS WHEN a category is chosen when next is clicked 
    const list = AffirmationData[category];
    //provide the affirmation array for the given or chosen category 
    const randomIndex = Math.floor(Math.random() * list.length);
    setCurrentAffirmation(list[randomIndex]);
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    showAffirmation(category);
  };
  if (!selectedCategory) {
    return (
      <div
        style={{
          minHeight:'100vh',
          display: 'flex',
          justifyContent:'center',
          alignItems:'center',
          background:'#d8b8ceff',
        }}
      >
        <div
         style={{
            width:'90%',
            maxWidth:'800px',
            padding:'40px',
            background:'#e4c5f4ff',
            borderRadius:'12px',
            boxShadow:'0 4px 12px rgba(198, 20, 230, 0.3)'

        }}>
            <h2 style ={{textAlign:'center', marginBottom:'20px'}}>Choose a focus</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px'
          }}
        >
        {categories.map((category) => (
          <CategoryCard
            key={category}
            title={category}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
      </div>
    </div>
   );
 }
  return (
    <div style={{ minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#c8a6d7ff' 
        }}
        >
        <div style={{
            maxWidth:'600px',
            padding:'40px',
            background:'#e3c9f1ff',
            textAlign:'center' ,
            boxShadow:'0 4px 12px rgba(0,0,0,0.1)',
        }}  
        >  
      <h2>{selectedCategory}</h2>

      <p style={{ fontSize: '22px', lineHeight: '1.6', color: '#333', margin: '30px 0' }}>
        “{currentAffirmation}”
      </p>

      <button onClick={() => showAffirmation(selectedCategory)}>
        Next
      </button>

      <br /><br />

      <button onClick={() => setSelectedCategory(null)}>
        Back
      </button>
      </div>
    </div>
  );
}
export default AffirmationPage;

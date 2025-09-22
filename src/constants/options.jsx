export const SelectTravelList = [
  {
    id: 1,
    title: "Just Me",
    desc: "Solo travelers",
    icon: "🎒",
    people: "1 traveler",
  },
  {
    id: 2,
    title: "Two of us",
    desc: "Couples or duo travelers",
    icon: "🥂",
    people: "2 People(Couples or duo travelers)",
  },
  {
    id: 3,
    title: "Family",
    desc: "Family travelers",
    icon: "🏡",
    people: "family(3-5 People including kids or elderly)",
  },
  {
    id: 4,
    title: "Friends",
    desc: "Small groups of People",
    icon: "😆",
    people: "3-6 People",
  },
  {
    id: 5,
    title: "Large groups",
    desc: "Large groups of People",
    icon: "🚐",
    people: "more than 6 people",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "🪙",
    budget: "Cheap(Stay conscious of costs)",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on the average side",
    icon: "💵",
    budget: "Moderate(Keep cost on the average side)",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Experience the finest",
    icon: "💰",
    budget: "Luxury(Experience the finest)",
  },
];

// 旅行风格选项
export const TravelStyles = [
  { value: 'luxury', label: 'Luxury Experience', icon: '👑' },
  { value: 'comfort', label: 'Comfort & Convenience', icon: '🏨' },
  { value: 'budget', label: 'Budget Friendly', icon: '💰' },
  { value: 'adventure', label: 'Adventure & Thrill', icon: '🏔️' },
  { value: 'cultural', label: 'Cultural Exploration', icon: '🏛️' },
  { value: 'relaxation', label: 'Relaxation & Wellness', icon: '🧘' }
];

// 兴趣选项
export const InterestOptions = [
  { id: 'culture', label: 'Arts & Culture', icon: '🎨' },
  { id: 'food', label: 'Food & Dining', icon: '🍜' },
  { id: 'nature', label: 'Nature & Views', icon: '🏞️' },
  { id: 'adventure', label: 'Adventure Sports', icon: '🏄‍♂️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'history', label: 'Historical Sites', icon: '🏛️' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
  { id: 'photography', label: 'Photography', icon: '📸' }
];

// 生成AI Prompt的函数
export const generateAIPrompt = (formData) => {
  const { location, days, budget, people, travelStyle, interests } = formData;
  
  // 根据预算数值生成预算描述
  const getBudgetDescription = (budgetValue) => {
    if (budgetValue <= 1000) return "budget-friendly (under $1000)";
    if (budgetValue <= 3000) return "moderate budget ($1000-$3000)";
    if (budgetValue <= 6000) return "comfortable budget ($3000-$6000)";
    if (budgetValue <= 10000) return "luxury budget ($6000-$10000)";
    return "premium luxury budget (over $10000)";
  };

  // 根据人数生成描述
  const getPeopleDescription = (peopleValue) => {
    if (peopleValue === 1) return "solo traveler";
    if (peopleValue === 2) return "couple or duo travelers";
    if (peopleValue <= 4) return "small group (3-4 people)";
    if (peopleValue <= 6) return "medium group (5-6 people)";
    return "large group (more than 6 people)";
  };

  const budgetDescription = getBudgetDescription(budget);
  const peopleDescription = getPeopleDescription(people);

  // 构建兴趣描述
  const interestsDescription = interests && interests.length > 0 
    ? ` with interests in: ${interests.join(', ')}`
    : '';

  // 构建旅行风格描述
  const travelStyleDescription = travelStyle 
    ? ` with a focus on ${travelStyle} experiences`
    : '';

  return `Generate a detailed Travel Plan for the location: ${location}, covering ${days} days for ${peopleDescription} with a ${budgetDescription} (total budget: $${budget.toLocaleString()})${travelStyleDescription}${interestsDescription}.

First, provide a list of hotel options with the following details:
- Hotel name
- Hotel address  
- Price per night (considering the ${budgetDescription})
- Hotel image URL (make sure the URL is valid)
- Geo coordinates
- Rating

Second, provide a daily itinerary for each day with **more than 3 places** to visit. For each day, include:
1. "day": Day number (e.g., 1, 2, 3, ...)
2. "bestTime": The best time to visit for the day (e.g., Morning (09:00-12:00), Afternoon (13:00-15:00), etc.)
3. "plan": A list of places to visit on that day, with each place including:
   - "placeName": Name of the place
   - "bestTime": The best time to visit that place (e.g., 09:00-12:00, 13:00-15:00, etc.)
   - "placeDetails": Short description of the place
   - "placeImageUrl": Image URL of the place (make sure the URL is valid)
   - "geoCoordinates": Geographical coordinates of the place (latitude and longitude)
   - "ticketPricing": The cost of entry tickets
   - "rating": Rating of the place
   - "travelTime": Time required to explore the place (e.g., 2 hours, 3 hours)

Please consider the following preferences:
- Budget level: ${budgetDescription} ($${budget.toLocaleString()} total)
- Group size: ${peopleDescription}
- Trip duration: ${days} days
- Location: ${location}${travelStyle ? `\n- Travel style: ${travelStyle}` : ''}${interests && interests.length > 0 ? `\n- Interests: ${interests.join(', ')}` : ''}

CRITICAL: Return ONLY valid JSON format. Do not include any markdown code blocks, explanations, or additional text. The response must be a valid JSON object that can be parsed directly. Do not add any text before or after the JSON.

The final output should be in **JSON format** with the following structure:

{
  "tripDatas": {
    "hotelOptions": [
      {
        "hotelName": "Hotel Name 1",
        "hotelAddress": "123 Example St, City",
        "price": "$150 per night",
        "hotelImageUrl": "https://example.com/image1.jpg",
        "geoCoordinates": "41.1234, -87.1234",
        "rating": "4.5 stars"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "bestTime": "Morning (09:00-12:00)",
        "plan": [
          {
            "placeName": "Place Name 1",
            "bestTime": "09:00-12:00",
            "placeDetails": "A short description of the place.",
            "placeImageUrl": "https://example.com/place1.jpg",
            "geoCoordinates": "41.1234, -87.1234",
            "ticketPricing": "$25",
            "rating": "4.5 stars",
            "travelTime": "2 hours"
          }
        ]
      }
    ]
  }
}`;
};

// 保留原有的简单prompt作为备用
export const AI_PROMPT =
  "Generate a detailed Travel Plan for the location: {location}, covering {days} days for {people} people with a {budget} budget.  First,provide a list of hotel options with: - Hotel name - Hotel address - Price - Geo coordinates - Rating.  Second, for each day, I want an itinerary with **multiple places(more than 3)** to visit.Each day's itinerary should include: 1. Place name 2.Best time to visit(Detailed schedule for each place, specifying **the best times (output should be e.g., 09:00-12:00, 13:00-15:00, etc.)** to visit each place.).  3. Place details 4. Geo coordinates 5. Ticket pricing 6. Rating 7. Travel time spending for the place. Make sure the image URL is valid. Please give the full plan for each day in **JSON format**.";

//   `
// Generate a detailed Travel Plan for the location: {location}, covering {days} days for {people} people with a {budget} budget.

// First, provide a list of hotel options with the following details:
// - Hotel name
// - Hotel address
// - Price
// - Hotel image URL (make sure the URL is valid)
// - Geo coordinates
// - Rating

// Second, provide a daily itinerary for each day with **more than 3 places** to visit. For each day, include:
// 1. "day": Day number (e.g., 1, 2, 3, ...)
// 2. "bestTime": The best time to visit for the day (e.g., Morning (09:00-12:00), Afternoon (13:00-15:00), etc.)
// 3. "plan": A list of places to visit on that day, with each place including:
//    - "placeName": Name of the place
//    - "bestTime": The best time to visit that place (e.g., 09:00-12:00, 13:00-15:00, etc.)
//    - "placeDetails": Short description of the place
//    - "placeImageUrl": Image URL of the place (make sure the URL is valid)
//    - "geoCoordinates": Geographical coordinates of the place (latitude and longitude)
//    - "ticketPricing": The cost of entry tickets
//    - "rating": Rating of the place
//    - "travelTime": Time required to explore the place (e.g., 2 hours, 3 hours)

// The final output should be in **JSON format** with the following structure:

// {
//   "tripDatas": {
//     "hotelOptions": [
//       {
//         "hotelName": "Hotel Name 1",
//         "hotelAddress": "123 Example St, City",
//         "price": "$150 per night",
//         "hotelImageUrl": "https://example.com/image1.jpg",
//         "geoCoordinates": "41.1234, -87.1234",
//         "rating": "4.5 stars"
//       },
//       ...
//     ],
//     "itinerary": [
//       {
//         "day": 1,
//         "bestTime": "Morning (09:00-12:00)",
//         "plan": [
//           {
//             "placeName": "Place Name 1",
//             "bestTime": "09:00-12:00",
//             "placeDetails": "A short description of the place.",
//             "placeImageUrl": "https://example.com/place1.jpg",
//             "geoCoordinates": "41.1234, -87.1234",
//             "ticketPricing": "$25",
//             "rating": "4.5 stars",
//             "travelTime": "2 hours"
//           },
//           {
//             "placeName": "Place Name 2",
//             "bestTime": "13:00-15:00",
//             "placeDetails": "A short description of the place.",
//             "placeImageUrl": "https://example.com/place2.jpg",
//             "geoCoordinates": "41.5678, -87.5678",
//             "ticketPricing": "$30",
//             "rating": "4 stars",
//             "travelTime": "3 hours"
//           },
//           ...
//         ]
//       },
//       {
//         "day": 2,
//         "bestTime": "Afternoon (13:00-16:00)",
//         "plan": [
//           {
//             "placeName": "Place Name 3",
//             "bestTime": "14:00-16:00",
//             "placeDetails": "A short description of the place.",
//             "placeImageUrl": "https://example.com/place3.jpg",
//             "geoCoordinates": "41.9876, -87.9876",
//             "ticketPricing": "$40",
//             "rating": "5 stars",
//             "travelTime": "3 hours"
//           },
//           ...
//         ]
//       }
//     ]
//   }
// }
// `;

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

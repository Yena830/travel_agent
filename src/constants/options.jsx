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
  "Generate a detailed Travel Plan for the location: {location}, covering {days} days for {people} people with a {budget} budget.  First,provide a list of hotel options with: - Hotel name - Hotel address - Price - Hotel image URL - Geo coordinates - Rating - Description. For each day, I want an itinerary with **multiple places** to visit. Second,Each day's itinerary should include: 1. Place name 2. Place details 3. Place image URL 4. Geo coordinates 5. Ticket pricing 6. Rating 7. Travel time spending for that place. I also need a detailed schedule for each day, specifying **the best times (e.g., 09:00-12:00, 13:00-15:00, etc.)** to visit each place. Make sure the image URL is valid. Please give the full plan for each day in **JSON format**.";

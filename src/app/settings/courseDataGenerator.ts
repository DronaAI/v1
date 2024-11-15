import { faker } from '@faker-js/faker';

// Define the structure of a course
interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  category: string;
  rating: number;
}

// List of possible course categories
const categories = [
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Mobile Development',
  'Cloud Computing',
  'Cybersecurity',
  'Blockchain',
  'Artificial Intelligence',
  'DevOps',
  'Game Development'
];

// Function to generate a random course
function generateCourse(): Course {
  return {
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement([
      `${faker.word.adjective()} ${faker.word.noun()} Programming`,
      `Advanced ${faker.word.noun()} Techniques`,
      `Introduction to ${faker.word.noun()} Development`,
      `${faker.word.verb()} with ${faker.word.noun()}`,
      `${faker.word.noun()} Fundamentals`
    ]),
    description: faker.lorem.sentence(),
    difficulty: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
    estimatedHours: faker.number.int({ min: 5, max: 50 }),
    category: faker.helpers.arrayElement(categories),
    rating: Number(faker.number.float({ min: 3.5, max: 5 }).toFixed(1))
  };
}

// Function to generate a list of suggested courses
export function generateSuggestedCourses(count: number = 5): Course[] {
  return Array.from({ length: count }, generateCourse);
}

// Example usage
const suggestedCourses = generateSuggestedCourses();
console.log(suggestedCourses);
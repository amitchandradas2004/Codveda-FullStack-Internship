/**
 * Initial sample tasks data storage
 */
const tasks = [
  {
    id: 1,
    title: 'Learn Express.js',
    description: 'Build a REST API',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Complete Codveda Task',
    description: 'Build REST API for internship',
    status: 'in-progress',
  },
];

/**
 * Auto-incrementing helper function for generating unique numeric IDs
 */
let nextId = 3;

export const getNextId = () => {
  return nextId++;
};

export default tasks;

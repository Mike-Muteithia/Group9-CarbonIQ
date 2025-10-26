export async function getGoals() {
  try {
    const response = await fetch('http://localhost:5000/api/goals'); // adjust URL if needed
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getGoals():', error);
    return []; // fallback to empty array
  }
}

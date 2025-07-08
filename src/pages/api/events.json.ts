export const prerender = false; // This ensures the endpoint runs on each request

export async function GET() {
  try {
    const response = await fetch('https://ai.seattlefoundations.org/api/calendar/events');
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 
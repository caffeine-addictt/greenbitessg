import { IAuthedRouteHandler } from '../route-map';
import { GetEventSuccAPI } from '../lib/api-types/event';

export const getEvent: IAuthedRouteHandler = async (req, res) => {
  // Extract event ID from the request params or query
  const eventId = parseInt(req.params.id, 10); // Ensure eventId is a number

  if (isNaN(eventId)) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid event ID',
    });
  }

  // Fetch event data from a database or another source using eventId
  const eventData = await fetchEventById(eventId);

  if (!eventData) {
    return res.status(404).json({
      status: 404,
      message: 'Event not found',
    });
  }

  return res.status(200).json({
    status: 200,
    data: {
      date: new Date(eventData.date).toISOString(), // Convert Date to string if necessary
      id: eventData.id,
      title: eventData.title,
      time: new Date(eventData.time).toISOString(), // Convert Date to string if necessary
      location: eventData.location,
      description: eventData.description,
    },
  } satisfies GetEventSuccAPI);
};

// Example function to fetch event data by ID
async function fetchEventById(id: number) {
  // Replace with your actual implementation to fetch event data
  // This is just an example; adapt it to your actual data source
  return {
    date: new Date(), // Example data
    id,
    title: 'Event Title',
    time: new Date(),
    location: 'Event Location',
    description: 'Event Description',
  };
}

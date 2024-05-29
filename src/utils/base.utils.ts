const host = import.meta.env.VITE_SERVER_API_HOST;
const port = import.meta.env.VITE_SERVER_API_PORT;

export const BASE_URL = `http://${host}:${port}/api/v1`


export const TICKETS_URL = `${BASE_URL}/tickets/available-services/1`
export const REGISTER_TICKET_URL = `${BASE_URL}/tickets/register`

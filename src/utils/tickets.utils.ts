import axios, { type AxiosResponse } from "axios";

import { TICKETS_URL, REGISTER_TICKET_URL } from "./base.utils";
import type { Ticket } from "@/models/ticket.interface";
import type { Service } from "@/models/services.interface"

export const fetchAvailableServices = async (): Promise<Service[]> => {
    try {
        const response: AxiosResponse<Service[]> = await axios.get<Service[]>(TICKETS_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const registerTicket = async (serviceId: number, branchId: number): Promise<Ticket> => {
    try {
        const response: AxiosResponse<Ticket> = await axios.post<Ticket>(REGISTER_TICKET_URL
            , { serviceId, branchId }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

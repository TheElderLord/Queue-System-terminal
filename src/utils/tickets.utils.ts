import axios, { type AxiosResponse } from "axios";
import Cookies from "js-cookie";


import { TICKETS_URL, REGISTER_TICKET_URL, USER_TICKETS_URL, QUEUE_URL, BASE_URL } from "./base.utils";
import type { Ticket } from "@/models/ticket.interface";
import type { Service } from "@/models/services.interface"
import type { TicketInfo } from "@/models/ticketInfo";

const branch = localStorage.getItem("branch");

export const fetchAvailableServices = async (): Promise<Service[]> => {
    try {
        const response: AxiosResponse<Service[]> = await axios.get<Service[]>(`${TICKETS_URL}/${branch}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const registerTicket = async (info: TicketInfo): Promise<Ticket> => {
    try {
        console.log(info)
        const response: AxiosResponse<Ticket> = await axios.post<Ticket>(REGISTER_TICKET_URL
            , info
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}

export const fetchUserTickets = async (): Promise<Ticket[]> => {
    try {
        const token = Cookies.get('token');
        const response: AxiosResponse<Ticket[]> = await axios.get<Ticket[]>(`${USER_TICKETS_URL}/${token
            }`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const fetchQueueTickets = async (): Promise<Ticket[]> => {
    try {
        // const object = {
        //     serviceId: 1,
        //     branchId: 1,
        //     agent: null
        // }
        const branch = localStorage.getItem("branch");
        const response: AxiosResponse<Ticket[]> = await axios.post<Ticket[]>(`${QUEUE_URL}?branchId=${branch}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const deleteResponse = async (id: number): Promise<Ticket[]> => {
    try {
        const response: AxiosResponse<Ticket[]> = await axios.delete<Ticket[]>(`${BASE_URL}/tickets/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching tickets:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}
export const setRatingRequest = async (id: number, rating: number): Promise<Ticket[]> => {
    try {
        const response: AxiosResponse<Ticket[]> = await axios.put<Ticket[]>(`${BASE_URL}/tickets/rating/${id}?rating=${rating}`);
        return response.data;
    } catch (error) {
        console.error("Error putting rating:", error);
        throw error; // Re-throw the error to handle it elsewhere if needed
    }
}


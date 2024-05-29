import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Ticket } from "../models/ticket.interface";
import type { TicketInfo } from "../models/ticketInfo";


export const useTicketStore = defineStore('ticket', () => {
    const ticket = ref({} as Ticket);

    const setTicket = (newTicket: Ticket) => {
        ticket.value = newTicket;
    }
    const getTicket = () => {
        return ticket.value;
    }

    return { ticket, setTicket, getTicket }
})
export const useStore = defineStore('store', () => {
    const info = ref({} as TicketInfo);

    const setInfo = (value: TicketInfo) => {
        info.value = value;
    }
    const getInfo = () => {
        return info.value;
    }

    return { info, setInfo, getInfo }
})


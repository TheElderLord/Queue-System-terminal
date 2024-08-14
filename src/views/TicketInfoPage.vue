<template>
    <main>
        <div v-if="loading" class="spinner-container">
            <div class="spinner"></div>
        </div>
        <div v-else-if="!incompleteTicketError && ticket" class="ticket-container">
            <div class="ticketNumber text-4xl">
                <h1>{{ ticket.ticketNumber }}</h1>
            </div>
            <div class="serviceName text-3xl">
                <h1>{{ formatService(ticket.serviceName) }}</h1>
            </div>
            <div v-if="ticket.registrationTime" class="date text-3xl">
                <h1>{{ formatDate(ticket.registrationTime) }}</h1>
            </div>
            <div class="serviceName text-3xl">
                <h1>{{ ticket.windowNum }}</h1>
            </div>
        </div>
        <div v-if="incompleteTicketError" class="error-message text-center text-5xl">
            <h2>{{ incompleteTicketErrorMessage }}</h2>
        </div>
    </main>
</template>

<script setup lang="ts">

import { useStore, useLangStore } from '../stores/ticket'
import { onMounted, ref } from 'vue';
import type { TicketInfo } from '../models/ticketInfo';
import type { Ticket } from '../models/ticket.interface'
import { registerTicket } from '../utils/tickets.utils'
import { useRouter } from 'vue-router';
import axios from 'axios';


const store = useStore()
const langStore = useLangStore();
const router = useRouter()

const ticket = ref({} as Ticket);
const loading = ref(true);  // New loading state

const incompleteTicketError = ref(false);
const incompleteTicketErrorMessage = ref("");


const registerT = async () => {
    const info: TicketInfo = store.getInfo();
    console.log(info)
    try {
        ticket.value = await registerTicket(info);
    } catch (error) {
        incompleteTicketError.value = true;
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 403) {
                incompleteTicketErrorMessage.value = `${getLang() === 'RUS' ? 'У вас есть еще не обслуженный билет' :
                    getLang() === 'KAZ' ? 'Сізді әлі қызмет көрсетілмеген билеттер бар' : 'You have unserved tickets'}`;
            } else if (error.response) {
                incompleteTicketErrorMessage.value = `Error: ${error.response.status} - ${error.response.statusText}`;
            } else {
                incompleteTicketErrorMessage.value = "Error fetching tickets: " + error.message;
            }
        } else {
            incompleteTicketErrorMessage.value = "Unexpected error: " + error;
        }
    } finally {
        loading.value = false;  // Set loading to false once the request is completed
    }
    setTimeout(() => {
        router.push("/")
    }, 3000);
}
const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("ru-RU")
}

const formatService = (service: string) => {
    console.log(service)
    try {
        const splitService = service.split(";");
        let formatted;
        splitService.map(e => {
            if (e.includes(getLang()))
                formatted = e.replace(`${getLang()}=`, "");
        })
        return formatted;
    } catch (err) {
        return service;
    }
}

const getLang = () => {
    return langStore.getLang()
}
onMounted(() => {
    registerT();
})
</script>

<style lang="scss" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;

    .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
    }

    .spinner {
        border: 16px solid #f3f3f3;
        border-top: 16px solid #3498db;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    .ticket-container {
        text-align: center;

        div {
            margin: 1rem;
        }
    }
}
</style>

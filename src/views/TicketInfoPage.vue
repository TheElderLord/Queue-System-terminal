<script setup lang="ts">

import { useStore } from '../stores/ticket'
import { onMounted, ref } from 'vue';
import type { TicketInfo } from '../models/ticketInfo';
import type { Ticket } from '../models/ticket.interface'
import { registerTicket } from '../utils/tickets.utils'
import { useRouter } from 'vue-router';


const store = useStore()
const router = useRouter()

const ticket = ref({} as Ticket);


const registerT = async () => {
    const info: TicketInfo = store.getInfo();

    ticket.value = await registerTicket(info.serviceId, info.branchId,info.agent);
    setTimeout(() => {
        router.push("/")
    }, 3000)
}
const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("ru-RU")
}

onMounted(() => {
    registerT();
})
</script>
<template>
    <main>
        <div v-if="ticket" class="ticket-container">
            <div class="ticketNumber text-4xl">
                <h1>{{ ticket.ticketNumber }}</h1>
            </div>
            <div class="serviceName text-3xl">
                <h1>{{ ticket.serviceName }}</h1>
            </div>
            <div class="date text-3xl">
                <h1>{{ formatDate(ticket.registrationTime) }}</h1>
            </div>
            <div class="serviceName text-3xl">
                <h1>{{ ticket.windowNum }}</h1>
            </div>
        </div>
    </main>
</template>
<style lang="scss" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;

    .ticket-container {
        text-align: center;
        div{
            margin: 1rem;
        }
    }
}
</style>
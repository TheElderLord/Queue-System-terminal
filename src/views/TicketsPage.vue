<script setup lang="ts">

import { onMounted, ref } from 'vue';


import type { Ticket } from "../models/ticket.interface"
import { fetchUserTickets } from '@/utils/tickets.utils';

const tickets = ref([] as Ticket[]);

const getRegisteredTickets = async () => {
    tickets.value = await fetchUserTickets();


}
const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("ru-RU")
}

onMounted(() => {
    getRegisteredTickets();
})
</script>
<template>
    <main>
        <div class="container">
            <div class="title text-center p-4 text-3xl">
                <h1>Ваши билеты</h1>
            </div>
            <div class="tickets w-full">
                <div class="ticket  my-2 flex " v-for="ticket in tickets" :key="ticket.id">
                    <div class="ticketNum">
                        <h1>{{ ticket.ticketNumber }}</h1>
                    </div>
                    <div class="service">
                        {{ ticket.serviceName }}
                    </div>
                    <div class="date">
                        {{ formatDate(ticket.registrationTime) }}
                    </div>
                </div>
            </div>

        </div>

    </main>
</template>
<style lang="scss" scoped>
.ticket {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: .5rem;

    div {
        width: 100%;
        text-align: center;
        padding: 1rem;
    }

    .ticketNum h1 {
        font-size: 32px;
    }
}
</style>
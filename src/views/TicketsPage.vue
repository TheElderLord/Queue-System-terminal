<script setup lang="ts">

import { onMounted, ref } from 'vue';


import type { Ticket } from "../models/ticket.interface"
import { fetchUserTickets, deleteResponse, setRatingRequest } from '../utils/tickets.utils';

const tickets = ref([] as Ticket[]);
const isCreateActive = ref(false);
const TicketObject = ref({} as Ticket)
const rating = ref(0);

const getRegisteredTickets = async () => {
    tickets.value = await fetchUserTickets();


}
const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("ru-RU")
}
const close = () => {
    isCreateActive.value = false;
    rating.value = 0;
}
const deleteTicket = async (id: number) => {
    try {
        await deleteResponse(id);
        isCreateActive.value = false;
        await getRegisteredTickets();
    } catch (error) {
        console.log(error)
    }
}
const show = (id: number) => {
    isCreateActive.value = true;
    const found = tickets.value.find(e => e.id == id);
    if (!found) {
        return
    }
    const ticket: Ticket = found
    TicketObject.value = ticket;
}
const rate = (id: number) => {
    setRatingRequest(id, rating.value);
}
const starClick = (value: number) => {
    rating.value = value
    console.log(value)
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
                    <div @click="show(ticket.id)" class="change">
                        <v-btn>Подробнее</v-btn>
                    </div>
                </div>
            </div>
            <div class="modal">
                <v-dialog v-model="isCreateActive" max-width="500">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" color="surface-variant" text="Создать" variant="flat"></v-btn>
                    </template>

                    <template v-slot:default>
                        <v-card title="Информация">
                            <v-card-text>
                                <div class="card">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item text-3xl">
                                            <h1>{{ TicketObject.ticketNumber }}</h1>
                                        </li>
                                        <li class="list-group-item">{{ formatDate(TicketObject.registrationTime) }}</li>
                                        <li class="list-group-item">{{ TicketObject.serviceName }}</li>
                                        <li class="list-group-item">{{ TicketObject.branchName }}</li>
                                        <li class="list-group-item">{{ TicketObject.windowNum }}</li>
                                        <li class="list-group-item">{{ TicketObject.rating === 0 ? `Вы еще не поставили
                                            оценку`: TicketObject.rating }}</li>
                                        <li class="list-group-item">{{ TicketObject.status === "NEW" ?
                                            "Ждет обслуживания" : "Обслужен" }} </li>
                                        <li v-if="TicketObject.status === 'COMPLETED' && TicketObject.rating === 0">
                                            <div class="stars flex w-fit mx-auto">

                                                <div :class="{ 'text-red-500': rating === 1 || rating === 2 || rating === 3 || rating === 4 || rating === 5 }"
                                                    @click="starClick(1)" class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <div :class="{ 'text-red-500': rating === 2 || rating === 3 || rating === 4 || rating === 5 }"
                                                    @click="starClick(2)" class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <div :class="{ 'text-red-500': rating === 3 || (rating === 4 || rating === 5) }"
                                                    @click="starClick(3)" class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <div :class="{ 'text-red-500': rating === 4 || rating === 5 }"
                                                    @click="starClick(4)" class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <div :class="{ 'text-red-500': rating === 5 }" @click="starClick(5)"
                                                    class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>




                                            </div>
                                            <v-btn class="mt-5" @click="rate(TicketObject.id)" text="Оценить"></v-btn>

                                        </li>
                                    </ul>
                                </div>

                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="deleteTicket(TicketObject.id)" text="Отказаться от билета"></v-btn>
                                <v-btn text="Закрыть" @click="close()"></v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>
            </div>
        </div>


    </main>
</template>
<style lang="scss" scoped>
.card {
    text-align: center;
}

.star {
    font-size: 50px;
    cursor: pointer;
}


.ticket {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: .5rem;
    cursor: pointer;

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
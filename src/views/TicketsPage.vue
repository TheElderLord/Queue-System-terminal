<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import Cookies from "js-cookie";


import type { Ticket } from "../models/ticket.interface"
import { fetchUserTickets, deleteResponse, setRatingRequest } from '../utils/tickets.utils';
import { useLangStore } from '@/stores/ticket';
import type { TicketRating } from '@/models/ticketRating.interface';

const tickets = ref([] as Ticket[]);
const isCreateActive = ref(false);
const TicketObject = ref({} as Ticket)
const ratingObject = ref({} as TicketRating);
const comment = ref("");

const lang = useLangStore();



const getRegisteredTickets = async () => {
    console.log("registered tickets")
    const token = Cookies.get('token') || "";
    tickets.value = await fetchUserTickets(token);
    // tickets.value.map(e => {
    //     if (e.status === "INSERVICE") {
    //         playAudio()
    //     }
    // })


}
const formatDate = (date: Date) => {

    return new Date(date).toLocaleString("ru-RU")
}
const close = () => {
    isCreateActive.value = false;
    ratingObject.value = {
        id: 0,
        rating: 0,
        comment: ""
    };
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
const rate = async (id: number) => {
    ratingObject.value.id = id;
    ratingObject.value.comment = comment.value;
    await setRatingRequest(ratingObject.value);
    isCreateActive.value = false;
    await getRegisteredTickets()
}
const starClick = (value: number) => {
    ratingObject.value.rating = value
    console.log(value)
}

const formatService = (service: string) => {
    const splitService = service.split(";");
    let formatted;
    splitService.map(e => {
        if (e.includes(getLang()))
            formatted = e.replace(`${getLang()}=`, "");
    })
    return formatted;
}


const getLang = () => {
    return lang.getLang()
}


onMounted(() => {
    getRegisteredTickets();
    setTimeout(() => {
        getRegisteredTickets();
    }, 3000);

})
</script>
<template>
    <main>

        <div class="tickets-container">
            <div class="title text-center p-4 text-2xl">
                <h1>{{ getLang() === "RUS" ? "Ваши билеты" : getLang() === "KAZ" ? "Сіздің билеттеріңіз" : `Your
                    tickets` }}</h1>
            </div>
            <div v-if="tickets" class="tickets ">
                <div class="ticket my-2 flex " v-for="ticket in tickets" :key="ticket.id">
                    <div class="ticketNum text-lg">
                        {{ ticket.ticketNumber }}
                    </div>
                    <div class="service text-lg">
                        {{ formatService(ticket.serviceName) }}
                    </div>
                    <div class="status text-sm">
                        {{ ticket.status === "NEW" ? `${getLang() === "RUS" ? `В ожидании` : getLang() === "KAZ" ?
                            "Күтіңіз" : "Waiting"}` : ticket.status === "COMPLETED" ? `${getLang() === "RUS" ? 'Обслужен' :
                                getLang() === "KAZ" ? 'Билет обслужен' : "Completed"}` : `${getLang() === "RUS" ? `Подойдите к
                        окну` : getLang() === "KAZ" ? 'Терезеге жақындаңыз' : 'Proceed to window'}: ${ticket.windowNum}`
                        }}
                    </div>
                    <div class="change ">
                        <button @click="show(ticket.id)" class="btn btn-primary text-sm"><i
                                class="fas fa-info-circle"></i></button>
                    </div>
                </div>
            </div>
            <div class="text-3xl text-center" v-else>
                {{ getLang() === "RUS" ? "Пусто" : getLang() === "KAZ" ? "Бос" : "Empty" }}
            </div>
            <div class="modal">
                <v-dialog v-model="isCreateActive" max-width="500">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" color="surface-variant" text="Создать" variant="flat">
                            {{ getLang() === "RUS" ? "Создать" : getLang() === "KAZ" ? "Жасау" : "Create" }}
                        </v-btn>
                    </template>
                    <template v-slot:default>
                        <v-card
                            :title="getLang() === 'RUS' ? 'Информация' : getLang() === 'KAZ' ? 'Ақпарат' : 'Information'">
                            <v-card-text>
                                <div class="card">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item text-3xl">
                                            <h1>{{ getLang() === "RUS" ? 'Номер билета:' : getLang() === "KAZ" ? `Билет
                                                нөмірі: ` : 'Ticket Number: ' }} {{ TicketObject.ticketNumber }}</h1>
                                        </li>
                                        <li class="list-group-item">{{ getLang() === "RUS" ? 'Время регистрации:' :
                                            getLang() === "KAZ" ? 'Тіркелу уақыты:' : 'Registration Time:' }} {{
                                                formatDate(TicketObject.registrationTime) }}</li>
                                        <li class="list-group-item">{{ getLang() === "RUS" ? 'Название услуги:' :
                                            getLang() === "KAZ" ? 'Қызмет атауы:' : 'Service Name:' }} {{
                                                formatService(TicketObject.serviceName) }}</li>
                                        <li class="list-group-item">{{ getLang() === "RUS" ? 'Отделение:' : getLang()
                                            === "KAZ" ? 'Бөлімше:' : 'Branch:' }} {{ TicketObject.branchName }}</li>
                                        <li class="list-group-item">{{ getLang() === "RUS" ? 'Номер окна:' : getLang()
                                            === "KAZ" ? 'Терезе нөмірі:' : 'Window Number:' }} {{ TicketObject.windowNum
                                            }}</li>
                                        <li class="list-group-item">{{ getLang() === "RUS" ? 'Ваша оценка:' : getLang()
                                            === "KAZ" ? 'Сіздің бағаңыз:' : 'Your Rating:' }} {{ TicketObject.rating ===
                                                0 ? getLang() === "RUS" ? 'Не поставили оценку' : getLang() === "KAZ"
                                                    ? 'Баға қоймадыңыз' : 'Not rated yet' :
                                                TicketObject.rating }}</li>
                                        <li class="list-group-item">{{ TicketObject.status === "NEW" ? (getLang() ===
                                            "RUS" ? "Ждет обслуживания" : getLang() === "KAZ" ? `Қызмет көрсетуді күтіп
                                            тұр` : "Waiting for service") : (getLang() === "RUS" ? "Обслужен" :
                                            getLang() === "KAZ" ? "Қызмет көрсетілді" : "Served") }}</li>
                                        <li v-if="TicketObject.status === 'COMPLETED' && TicketObject.rating === 0">
                                            <div class="stars flex w-fit mx-auto">
                                                <div :class="{ 'text-red-500': ratingObject.rating >= 1 }"
                                                    @click="starClick(1)" class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <div :class="{ 'text-red-500': ratingObject.rating >= 2 }"
                                                    @click="starClick(2)" class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <div :class="{ 'text-red-500': ratingObject.rating >= 3 }"
                                                    @click="starClick(3)" class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <div :class="{ 'text-red-500': ratingObject.rating >= 4 }"
                                                    @click="starClick(4)" class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <div :class="{ 'text-red-500': ratingObject.rating === 5 }"
                                                    @click="starClick(5)" class="star">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                            </div>
                                        </li>
                                        <li v-if="TicketObject.status === 'COMPLETED' && TicketObject.rating === 0"
                                            class="list-group-item">
                                            <input class="w-full p-2 border" type="text" v-model="comment"
                                                :placeholder="getLang() === 'RUS' ? 'Ваш комментарий' : getLang() === 'KAZ' ? 'Сіздің пікіріңіз' : 'Your comment'">
                                        </li>
                                        <li v-if="TicketObject.status === 'COMPLETED' && TicketObject.rating !== 0"
                                            class="list-group-item">
                                            {{ getLang() === "RUS" ? 'Комментарии:' : getLang() === "KAZ" ? 'Пікірлер:'
                                                : 'Comments:' }} {{ TicketObject.comment }}
                                        </li>
                                        <li><v-btn class="mt-5" @click="rate(TicketObject.id)" text="Оценить">{{
                                            getLang() === "RUS" ? 'Оценить' : getLang() === "KAZ" ? 'Бағалау' :
                                                'Rate' }}</v-btn></li>
                                    </ul>
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn v-if="TicketObject.status === 'NEW'" @click="deleteTicket(TicketObject.id)"
                                    text="Отказаться от билета">{{ getLang() === "RUS" ? 'Отказаться от билета' :
                                        getLang() === "KAZ" ? 'Билетті қайтару' : 'Cancel Ticket' }}</v-btn>
                                <v-btn text="Закрыть" @click="close()">{{ getLang() === "RUS" ? 'Закрыть' : getLang()
                                    === "KAZ" ? 'Жабу' : 'Close' }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .tickets-container {
        width: 100%;
        height: 100%;

        .tickets {
            width: 100vw;
            height: 100%;
        }
    }
}

.card {
    text-align: center;
}

.star {
    font-size: 50px;
    cursor: pointer;
}


.ticket {
    width: 100%;
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

@media (min-width: 480px) {
    .tickets {
        width: 100vw;

        .ticket {
            .ticketNum h1 {
                font-size: 24px;
            }
        }
    }
}
</style>
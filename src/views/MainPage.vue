<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";

import type { Service } from "../models/services.interface"
import { fetchAvailableServices, } from "../utils/tickets.utils"
import type { TicketInfo } from "../models/ticketInfo";


import { useStore, useLangStore } from "../stores/ticket";
import { useRoute, useRouter } from "vue-router";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';


const store = useStore();
const langStore = useLangStore();
const router = useRouter();
const route = useRoute();


const taps = ref(0)
const isMobile = ref(false);
// const token = ref(Cookies.get('token') || uuidv4() as string);
const services = ref([] as Service[]);
const isChild = ref(false)

const adminRedirect = ref(false);
const username = ref("");
const password = ref("");


const getLang = () => {
    return langStore.getLang();
}

const pageReload = () => {
    location.reload();
}

const getSessionTickets = async () => {
    isChild.value = false
    services.value = await fetchAvailableServices();
    console.log(services.value)
}

const generateToken = () => {
    const newToken = Cookies.get('token') || uuidv4();
    // token.value = newToken;
    console.log(newToken);
    Cookies.set('token', newToken, { expires: 7 }); // Expires in 7 days
};


const registerT = async (serviceId: number) => {
    const service = services.value.find(e => e.id === serviceId);
    if (service.maxServTime === 0) {
        services.value = await fetchAvailableServices(serviceId);
        isChild.value = true
        return
    }
    const object: TicketInfo = {
        serviceId: serviceId,
        branchId: parseInt(localStorage.getItem("branch")),
        agent: isMobile.value === true ? Cookies.get('token') : "",
        terminalType: isMobile.value === true ? "MOBILE" : "TERMINAL",
        language: getLang()
    }
    store.setInfo(object);
    router.push("/info")

    // const result = await registerTicket(serviceId, 1);
    // console.log(result);

}

const handleTaps = () => {
    if (isMobile.value) {
        return
    }
    taps.value++;
    if (taps.value === 5) {
        adminRedirect.value = true;
        // Redirect to another page after 3 taps
    }
}
const goToAdmin = () => {
    if (username.value === "admin" && password.value === "admin")
        router.push("/admin");
}
const getUrlQuery = () => {
    if (isMobile.value === true) {
        if (route.query.branch !== undefined) {
            const query = route.query.branch;
            console.log(query);
            localStorage.setItem("branch", query + "")
        }

    }
}

watch(
    () => store.getMobile(),
    (newValue) => {
        // console.log(typeof newValue)
        isMobile.value = newValue;
        console.log("Mobile status changed:", newValue);
        // if (newValue === true) {
        //     getUrlQuery();
        // }
    }
);
watch(
    () => route.query.branch,
    (newValue) => {
        if (newValue !== undefined) {
            localStorage.setItem("branch", route.query.branch + "")
            pageReload()
            getSessionTickets();
        }


    }
);


onMounted(() => {
    // location.reload()
    getSessionTickets();
    generateToken();

    isMobile.value = store.getMobile()

    getUrlQuery();

})
onUnmounted(() => {

})







</script>
<template>
    <main>

        <div class="ticket-container w-full h-full">
            <div v-if="!isMobile" class="settings float-end absolute right-0">
                <v-btn @click="adminRedirect = !adminRedirect"><i class="fas fa-tools"></i></v-btn>
            </div>
            <v-btn v-if="isChild" @click="getSessionTickets()" class=" absolute left-0">
                <i class="fa-solid fa-arrow-left"></i>
            </v-btn>
            <div class="title text-4xl text-center m-4">
                {{ getLang() === "RUS" ? "Выберите услугу" : getLang() === "KAZ" ? "Қызметті таңдаңыз" : `Select a
                service` }}
            </div>
            <div v-if="services.length > 0" class="services">
                <div @click="registerT(service.id)" v-for="service in services" :key="service.id" class="service">
                    {{ service.name }}
                </div>
            </div>

            <div v-else class="text-3xl text-center">
                <div class="emptyText">{{ getLang() === "RUS" ? "Нет доступных услуг" : getLang() === "KAZ" ?
                    `Қолжетімді
                    қызметтер жоқ`: "No available services" }}</div>
                <v-btn class="m-4 text-center" @click="pageReload()">
                    {{ getLang() === "RUS" ? "Обновить" : getLang() === "KAZ" ? "Жаңарту" : "Reload" }}
                </v-btn>
            </div>


        </div>
        <div class="modal">
            <v-dialog v-model="adminRedirect" max-width="800">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn v-bind="activatorProps" color="surface-variant" text="Создать" variant="flat"></v-btn>
                </template>

                <template v-slot:default>
                    <v-card title="Авторизация">
                        <v-card-text>
                            <div class="card text-center">
                                <div class="form text-center">
                                    <form @submit.prevent="goToAdmin()">
                                        <div class="mb-3">
                                            <label for="exampleInputEmail1" class="form-label">{{ getLang() === "RUS" ?
                                                "Имя пользователя" : getLang() === "KAZ" ? "Қолданушы аты" : `User
                                                name`}}</label>
                                            <input v-model="username" type="text" class="form-control"
                                                id="exampleInputEmail1" aria-describedby="emailHelp">
                                        </div>
                                        <div class="mb-3">
                                            <label for="exampleInputPassword1" class="form-label">{{ getLang() === "RUS"
                                                ?
                                                "Пароль" : getLang() === "KAZ" ? "Құпиясөз" : "Password" }}</label>
                                            <input v-model="password" type="password" class="form-control"
                                                id="exampleInputPassword1">
                                        </div>

                                    </form>
                                </div>
                            </div>

                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="goToAdmin()">{{ getLang() === "RUS" ? "Подтвердить" : getLang() === "KAZ" ?
                                "Растау" : "Submit" }}</v-btn>
                            <v-btn @click="adminRedirect = !adminRedirect">{{ getLang() === "RUS" ? "Закрыть" :
                                getLang() === "KAZ" ?
                                    "Жабу" : "Close" }}</v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
        </div>
    </main>

</template>
<style lang="scss" scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;



    .services {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        width: 100%;
        height: 90%;
        margin-top: 10%;

        .service {
            margin: 0.5rem auto;
            width: 100%;
            text-align: center;
            padding: 1rem;
            font-size: 20px;
            border-radius: 1rem;
            cursor: pointer;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
        }
    }


}
</style>
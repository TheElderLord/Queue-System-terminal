<script setup lang="ts">
import { onMounted, ref, } from "vue";

import type { Service } from "../models/services.interface"
import { fetchAvailableServices, } from "../utils/tickets.utils"

import type { TicketInfo } from "@/models/ticketInfo";


import { useStore } from "../stores/ticket";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const services = ref([] as Service[]);



const session_id = 1;


const getSessionTickets = async () => {
    services.value = await fetchAvailableServices();
}
const registerT = async (serviceId: number) => {
    const object: TicketInfo = {
        serviceId: serviceId,
        branchId: 1
    }
    store.setInfo(object);
    router.push({ path: "/info" })

    // const result = await registerTicket(serviceId, 1);
    // console.log(result);

}



onMounted(() => {
    getSessionTickets();

})


</script>
<template>
    <main>
        <div class="services">
            <div @click="registerT(service.id)" v-for="service in services" :key="service.id" class="service">
                {{ service.name }}
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

    .services {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

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
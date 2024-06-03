<script setup lang="ts">
import { onMounted, ref, } from "vue";



import type { Service } from "../models/services.interface"
import { fetchAvailableServices, } from "../utils/tickets.utils"
import type { TicketInfo } from "@/models/ticketInfo";


import { useStore } from "../stores/ticket";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

const store = useStore();
const router = useRouter();


// const token = ref(Cookies.get('token') || uuidv4() as string);
const services = ref([] as Service[]);




const getSessionTickets = async () => {
    services.value = await fetchAvailableServices();
}

const generateToken = () => {
    const newToken = Cookies.get('token') || uuidv4();
    // token.value = newToken;
    console.log(newToken);
    Cookies.set('token', newToken, { expires: 7 }); // Expires in 7 days
};


const registerT = async (serviceId: number) => {
    const object: TicketInfo = {
        serviceId: serviceId,
        branchId: 1,
        agent: Cookies.get('token')
    }
    store.setInfo(object);
    router.push("/info")

    // const result = await registerTicket(serviceId, 1);
    // console.log(result);

}



onMounted(() => {
    getSessionTickets();
    generateToken();

})


</script>
<template>
    <main>
        <div class="container">
            <div class="services">
                <div @click="registerT(service.id)" v-for="service in services" :key="service.id" class="service">
                    {{ service.name }}
                </div>
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
    height: 100%;

    .services {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;

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
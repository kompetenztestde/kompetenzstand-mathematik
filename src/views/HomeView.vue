<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const startApp = () => {
    router.push(`/step-2`)
}
</script>
<template>
    <div class="greeting">
        <h3>Deine Rückmeldung zu Vera 8 Mathe</h3>
        <button class="startBtn" @click="startApp">Start</button>
    </div>
</template>

<style scoped>
.page {
    padding: 20px;
    text-align: center;
}
button {
    padding: 10px 20px;
    cursor: pointer;
}
.greeting {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    text-align: center;
}
.startBtn {
    padding: 18px 45px;
    font-size: 1.4rem;
    font-weight: bold;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(66, 184, 131, 0.2);
    transition: all 0.3s ease;
}

.startBtn:hover {
    background-color: #3aa876;
    box-shadow: 0 15px 25px rgba(66, 184, 131, 0.3);
}
</style>

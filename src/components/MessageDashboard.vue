<template>
  <div>
    <q-carousel v-model="slide" vertical transition-prev="slide-down" transition-next="slide-up" swipeable animated
      control-color="white" navigation-icon="radio_button_unchecked" navigation padding arrows height="100%"
      class="bg-purple text-white shadow-1 rounded-borders  absolute-full">
      <template v-for="(item, index) in msgs" :key="index">
        <q-carousel-slide :name="index" class="column flex-center">
          <q-icon name="textsms" size="56px" color="info" />
          <div class="q-mt-md ">
            <q-chip size="xl" color="orange" text-color="white" icon="event">
              {{ new Date(item.timestame).toLocaleString() }} (發布者：{{ item.userIp }})
            </q-chip>
            <h2 v-html="item.msg"></h2>
          </div>
        </q-carousel-slide>
      </template>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { BmdActionType, BoadcastMessageDto } from 'src/dto/boadcast-message-dto';
import { reactive, ref } from 'vue';

const props = defineProps<{
  messages?: BoadcastMessageDto[];
}>()

let msgs: BoadcastMessageDto[] = reactive([]);
if (props.messages) {
  msgs = [...props.messages];
} else {
  msgs[0] = {
    target: [],
    action: BmdActionType.boadcast,
    timestame: new Date().getTime(),
    msg: '沒有消息，就是好消息...',
    userIp: '',
  };
}

const slide = ref(0);

window.electronAPI.receive('mqtt:boadcast-message', (event, data: BoadcastMessageDto) => {
  data.msg = data.msg.replace(/\n/g, '<br/>');
  console.log('mqtt:boadcast-message', data);
  msgs.unshift(data);
  slide.value = 0;
});

</script>


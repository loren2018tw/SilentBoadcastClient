<template>
  <div>
    <q-carousel v-model="msgs" vertical transition-prev="slide-down" transition-next="slide-up" swipeable animated
      control-color="white" navigation-icon="radio_button_unchecked" navigation padding arrows height="800px"
      class="bg-purple text-white shadow-1 rounded-borders absolute-full">
      <template v-for="(item, index) in msgs" :key="index">
        <q-carousel-slide name="msgs[index]" class="column no-wrap flex-center">
          <q-icon name="style" size="56px" />
          <div class="q-mt-md text-center">
            <H4>
              <q-chip color="orange" text-color="white" icon="event">
                {{ item.timestame.toLocaleString() }}
              </q-chip>
            </H4>
            <h2>{{ item.msg }}</h2>
          </div>
        </q-carousel-slide>
      </template>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { BoadcastMessageDto } from 'src/boadcast-message-dto';
import { reactive, ref } from 'vue';

const props = defineProps<{
  messages?: BoadcastMessageDto[];
}>()

let msgs: BoadcastMessageDto[] = reactive([]);
if (props.messages) {
  msgs = [...props.messages];
} else {
  msgs[0] = {
    timestame: new Date(),
    msg: '沒有消息，就是好消息...',
  };
}

const slide = ref(msgs[0].timestame);


window.electronAPI.receive('mqtt:boadcast-message', (event, data: BoadcastMessageDto) => {
  console.log(data);
  msgs.unshift(data);
  // msgs[0].timestame = new Date();
});

</script>

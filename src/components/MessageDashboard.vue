<template>
  <div>
    <q-carousel v-model="slide" vertical transition-prev="slide-down" transition-next="slide-up" swipeable animated
      control-color="white" navigation-icon="radio_button_unchecked" navigation padding arrows height="800px"
      class="bg-purple text-white shadow-1 rounded-borders absolute-full">
      <q-carousel-slide name="style" class="column no-wrap flex-center">
        <q-icon name="style" size="56px" />
        <div class="q-mt-md text-center" key="1">
          <H5>
            {{ msgs[0].timestame.toLocaleString() }}
          </H5>
          <h2>{{ msgs[0].msg }}</h2>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { BoadcastMessage } from 'src/boadcast-message';
import { reactive, ref } from 'vue';

const props = defineProps<{
  messages?: BoadcastMessage[];
}>()

let msgs: BoadcastMessage[] = reactive([]);
if (props.messages) {
  msgs = [...props.messages];
} else {
  msgs[0] = {
    timestame: new Date(),
    msg: '請派一位同學到教務處，領取通知單。',
  };
}

const slide = ref('style');


window.electronAPI.receive('mqtt:data', (event, data: BoadcastMessage) => {
  console.log(data);
  msgs[0] = data;
  // msgs[0].timestame = new Date();
});

</script>

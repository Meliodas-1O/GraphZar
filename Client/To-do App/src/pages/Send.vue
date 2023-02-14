<template>
  <q-page class="row items-center justify-evenly">
      <h1>Loading........ Sent"</h1>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import { ref } from 'vue';

export default {
  name: 'IndexPage',
  setup() {
    const todos = ref<Todo[]>([

    ]);
    const meta = ref<Meta>({
      totalCount: 1200
    });
    return { todos, meta };
  }
};
</script>

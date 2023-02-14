<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sù ng-primary">
      <q-input style="width: 100%;" v-model="newTask" standout filled square @keyup.enter="addTask(newTask)" label ="Add a task" bg-color="white">
      </q-input>
    </div>
    <q-list class="bg-white" separator bordered >
      <!--
        Rendering a <label> tag (notice tag="label")
        so QCheckboxes will respond to clicks on QItems to
        change Toggle state.
      -->

      <q-item
        v-for="(task, index) in tasks"
        :key = "task.title"
        @click="task.done=!task.done"
        :class="{ 'done bg-red-2' : task.done}"
        v-ripple clickable>
        <q-item-section avatar>
          <q-checkbox v-model="task.done" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{task.title}}</q-item-label>
        </q-item-section>
        <q-item-section v-if="task.done" side>
          <q-btn flat
            @click.stop="deleteTask(index)"
            round color="primary" icon="delete" />
        </q-item-section>
      </q-item>
    </q-list>

  </q-page>
</template>

<script lang="ts">
import { Meta } from '../components/models';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {},
  setup() {
    const meta = ref<Meta>({
      totalCount: 1200,
    });
    return { meta };
  },
  data() {
    return {
      newTask: '',
      tasks: [
        {
          title: 'name',
          done: false,
        },
      ],
    };
  },
  mounted() {
    this.getTask()
  },
  methods : {
    async getTask(){
      await fetch('http://localhost:7000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
          body: JSON.stringify({
              query: `
                {
                  tasks{
                    id
                    name
                  }
                }
              `
          })
      })
    .then(data => data.json())

    .then((res) => {
        for (var i=0;i<res.data.tasks.length;i++){
            this.tasks.push({
              title : res.data.tasks[i].name,
              done : false,
            })
        }
    })

    .catch(err => console.log(err))

    },
    async deleteTask(index : number){

      await fetch('http://localhost:7000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
          body: JSON.stringify({
              query: `
                mutation{
                  deleteTask(id: $index ){
                    id
                    name
                  }
                }
              `,
              variables : {index}
          })
      })
      .then(data =>console.log(data.json()))
      .then (()=> this.tasks.splice(index,1))

    },
    async addTask(name : string){
      await fetch('http://localhost:7000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
          body: JSON.stringify({
              query: `
                mutation{
                  addTask(name: $name ){
                    id
                    name
                  }
                }
              `,
              variables : {name}
          })
      })
      .then(data =>console.log(data.json()))
      .then (()=> {
        if (this.newTask != ''){
          this.tasks.push({
            title: this.newTask,
            done: false,
          })
         }
        this.newTask = '';
      }
      )
    }
  }
})
</script>

<style lang="scss">
  .done {
    .q-item__label{
      text-decoration: line-through;
      color:crimson ;
    }
  }
</style>

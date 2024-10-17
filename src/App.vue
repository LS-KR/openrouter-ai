<script lang="ts">
import MarkdownContent from '@/components/MarkdownContent.vue'
import { modelList } from '@/logic/config'
import { Message, NonStreamingChoice } from '@/logic/data'
import { complete } from '@/logic/helper'
import { marked } from 'marked'
import { Component, Vue } from 'vue-facing-decorator'
import Swal from 'sweetalert2'

@Component({
  components: {
    MarkdownContent
  }
})
export default class App extends Vue {
  md = [] as string[]
  token = ''
  model = 'null'
  modelList = modelList
  message = ''
  resStr = ''

  ml = [] as Message[]
  i = 0

  send() {
    if (this.model == 'null') {
      Swal.fire({
        icon: 'error',
        title: 'Please select a model',
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      })

      return
    }

    this.md.push(marked(this.message).toString())
    this.ml.push({
      role: 'user',
      content: this.md.toString()
    })
    this.i += 1;

    complete({
      messages: this.ml,
      model: this.model
    }, this.token).then(it => {
      this.resStr = JSON.stringify(it)
      this.md.push(marked((it.choices[0] as NonStreamingChoice).message.content).toString())
      this.ml.push({
        role: 'assistant',
        content: ((it.choices[0] as NonStreamingChoice).message.content).toString()
      })
      localStorage.setItem('token', this.token)
      localStorage.setItem('model', this.model)

      this.i += 1
    })
  }

  mounted() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token')
    }
    if (localStorage.getItem('model')) {
      this.model = localStorage.getItem('model')
    }
  }
}
</script>

<template>
  <div class="left">
    <div class="selection">
      <span class="pan-text">Token</span>
      <span class="pan-input">
        <input placeholder="Enter token..." autocomplete="off" v-model="token" />
      </span>
    </div>
    <div class="selection">
      <span class="pan-text">Model</span>
      <span class="pan-selection">
        <select id="model-selection" v-model="model">
          <option disabled value="null">Select a model</option>
          <option v-for="(e, i) in modelList" :key="i" :value="e">{{ e }}</option>
        </select>
      </span>
    </div>
    <div class="area">
      <MarkdownContent :contents="md" :key="i"/>
      <button v-on:click="send()">Send</button>
      <textarea v-model="message"></textarea>
    </div>
  </div>
  <div class="right">
    <p>Response JSON</p>
    <p v-text="resStr"></p>
  </div>
</template>

<style lang="scss">
@import '@/css/latte';
@import '@/css/font.css';

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  background-color: $base;
  color: $text;
}

#app {
  min-height: 100vh;
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  margin: auto;

  .left{
    flex: 3;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: 0.2rem;

    .selection{
      width: calc(100% - 2rem);
      height: 1.2rem;
      margin: 0.2rem auto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;

      .pan-text{
        width: 14rem;
        text-align: center;
        color: $text;
        height: 1rem;
        font-size: 1rem;
      }

      .pan-input{
        width: 100%;

        input {
          width: calc(100% - 2rem);
          text-align: start;
          color: $text;
          height: 1.2rem;
          font-size: 0.8rem;
          font-family: "JetBrains Mono", monospace;
          border: solid 1px $yellow;
          border-radius: 1rem;
          outline: none;
          background-color: $surface0;
          transition: all 0.2s cubic-bezier(0, 0.55, 0.45, 1);

          &:hover{
            text-decoration: none;
            outline: none;
          }

          &:active{
            text-decoration: none;
            outline: none;
          }
        }
      }

      .pan-selection{
        width: calc(100% - 2rem);
        height: 1.2rem;
        margin: auto 0.5rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: $text;

        select {
          width: calc(100% - 2rem);
        }
      }
    }

    .area{
      width: calc(100% - 2rem);
      min-height: 600px;
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      justify-content: start;

      textarea {
        width: calc(100% - 2rem);
        height: calc(600px - 1.5rem);
      }

      button {
        height: 1.5rem;
        width: calc(100% - 2rem);
      }
    }
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-content: baseline;
    max-width: 300px;

    p {
      font-family: 'JetBrains Mono', monospace;
      text-wrap: wrap;
      word-break: break-all;
      white-space: normal;
    }
  }
}
</style>

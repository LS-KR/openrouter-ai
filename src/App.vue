<script lang="ts">
import GlobalButton from '@/components/GlobalButton.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import { modelList } from '@/logic/config'
import { Message, NonStreamingChoice } from '@/logic/data'
import { complete } from '@/logic/helper'
import { marked } from 'marked'
import { Component, Vue } from 'vue-facing-decorator'
import Swal from 'sweetalert2'

@Component({
  components: {
    MarkdownContent,
    LoadingBlock,
    GlobalButton,
  }
})
export default class App extends Vue {
  md = [] as string[]
  raw = [] as string[]
  token = ''
  model = 'null'
  modelList = modelList
  message = ''
  resStr = ''

  ml = [] as Message[]
  i = 0
  loading = false

  send(proceed: boolean = false) {
    if ((this.model == 'null') && (!proceed)) {
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

    if ((this.token == '') && (!proceed)) {
      Swal.fire({
        icon: 'error',
        title: 'No token provided',
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      })

      return
    }

    if ((this.message == '') && (!proceed)) {
      Swal.fire({
        icon: 'warning',
        title: 'No message provided. Proceed to send this message?',
        showCloseButton: true,
        showConfirmButton: true,
        confirmButtonText: 'YES',
        showCancelButton: true,
        cancelButtonText: 'No'
      }).then(result => {
        if (result.isConfirmed) {
          this.send(true)
        }
      })

      return
    }

    this.raw.push(this.message)
    this.md.push(marked(this.message).toString())
    this.ml.push({
      role: 'user',
      content: this.md.toString()
    })
    this.i += 1;
    this.loading = true;

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });

    complete({
      messages: this.ml,
      model: this.model
    }, this.token).then(it => {
      this.resStr = JSON.stringify(it)
      this.raw.push((it.choices[0] as NonStreamingChoice).message.content)
      this.md.push(marked((it.choices[0] as NonStreamingChoice).message.content).toString())
      this.ml.push({
        role: 'assistant',
        content: ((it.choices[0] as NonStreamingChoice).message.content).toString()
      })
      localStorage.setItem('token', this.token)
      localStorage.setItem('model', this.model)

      this.i += 1
      this.loading = false

      Swal.fire({
        title: 'Response Message Got',
        toast: true,
        icon: 'success',
        showCloseButton: false,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        position: 'top-right'
      })
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

  keybd(e: KeyboardEvent) {
    if (((e.key === 'Enter') || (e.keyCode === 13)) && (e.ctrlKey)) {
      this.send(false);
    }
  }

  copy() {
    navigator.clipboard.writeText(this.raw[this.raw.length - 1]).then(() => {
      Swal.fire({
        title: 'Copied!',
        icon: 'success',
        toast: true,
        showCloseButton: false,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        position: 'top-right'
      })
    })
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
      <button class="ripple" v-on:click="copy()">Copy</button>
      <LoadingBlock v-show="loading" class="loading"/>
      <MarkdownContent :contents="md" :key="i"/>
      <button class="send-button" v-on:click="send()">Send (Ctrl + Enter)</button>
      <textarea v-model="message" v-on:keydown="keybd"></textarea>
    </div>
  </div>
  <div class="right">
    <p>Response JSON</p>
    <p v-text="resStr"></p>
  </div>
  <GlobalButton />
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
    max-width: 75%;

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

      .send-button {
        height: 1.5rem;
        width: calc(100% - 2rem);
        margin: 10px auto;
      }

      .loading {
        width: 240px;
        height: 240px;
      }

      .ripple {
        background-position: center;
        transition: background 0.8s;
        border: none;
        border-radius: 2px;
        padding: 12px 18px;
        font-size: 16px;
        text-transform: uppercase;
        cursor: pointer;
        color: white;
        background-color: #ff9ca8ff;
        box-shadow: 0 0 4px #999;
        outline: none;

        &:hover {
          background: #ff9ca8ff radial-gradient(circle, transparent 1%, #ff9ca8ff 1%) center/15000%;
        }

        &:active {
          background-color: hsl(347, 100%, 84%);
          background-size: 100%;
          transition: background 0s;
        }
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

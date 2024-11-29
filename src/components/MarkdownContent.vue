<script lang="ts">
import { marked } from 'marked'
import { Vue, Component, Prop } from 'vue-facing-decorator'

@Component({})
export default class MarkdownContent extends Vue {
  @Prop({ required: true }) contents: string[];

  rendered = [] as string[];

  mounted() {
    this.rendered = []
    for (const content of this.contents) {
      this.rendered.push(marked(content).toString());
    }
    console.log(JSON.stringify(this.contents));
  }
}
</script>

<template>
  <div class="markdown-content">
    <hr />
    <div class="markdown" v-for="(c, i) in rendered" :key="i" v-html="c"></div>
  </div>
</template>

<style lang="scss">
@import '@/css/latte';
@import '@/css/font.css';

.markdown-content {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  width: 100%;
  height: 100%;
  gap: 0;
  max-width: 100%;

  margin-top: 1rem;

  .markdown {
    &:nth-child(even) {
      color: $text;
    }

    &:nth-child(odd) {
      color: $mauve;
    }

    display: block;
    width: 100%;
    height: fit-content;

    h1, h2 {
      margin-top: 0.5rem;
      color: $flamingo;
      border-bottom: 1px solid $flamingo;
    }

    h3, h4, h5, h6 {
      margin-top: 0.5rem;
      color: $rosewater;
    }

    h1 {
      font-size: 3rem;
    }

    h2 {
      font-size: 2rem;
    }

    h3 {
      font-size: 1.5rem;
    }

    h4 {
      font-size: 1.25rem;
    }

    p {
      line-height: 1.2;
      font-size: 1rem;
    }

    blockquote {
      border-left: 2px solid $lavender;
      padding-left: 1rem;
      border-radius: 0.4rem;
      background-color: #7287fd33;
      margin: 0.5rem auto;
      text-wrap: pretty;
    }

    code, pre {
      font-family: 'JetBrains Mono', monospace;
    }

    code {
      display: inline-block;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      background-color: $surface0;
      border-radius: 0.5rem;
    }

    pre {
      border-left: 2px solid $lavender;
      padding-left: 1rem;
      background-color: $surface0;
      border-radius: 0.4rem;
      margin: 0.5rem auto;
      text-wrap: nowrap;
      overflow-x: scroll;
      max-width: 100%;

      h1, h2, h3, h4, h5, h6 {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1rem;
        border: none !important;
        color: $sky;
      }
    }

    a {
      color: $green;
      text-decoration: none;
      transition: all 0.5s ease;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
      &:active {
        color: $sky;
        text-decoration: none;
      }
    }
  }
}
</style>

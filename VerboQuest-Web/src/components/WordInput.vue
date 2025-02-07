<template>
  <v-container>
    <v-row dense>
      <v-col v-for="(variant, i) in variants" :key="i" cols="12" md="3">
        <v-card
          :variant="variant"
          class="mx-auto"
          color="surface-variant"
          max-width="344"
          subtitle="Greyhound divisely hello coldly fonwderfully"
          title="Headline"
        >
          <template v-slot:actions>
            <v-btn text>Button</v-btn>
          </template>
        </v-card>
        <div class="text-center text-caption">{{ variant }}</div>
      </v-col>
    </v-row>
    <div class="card">
      <span>Multiline message is:</span>
      <p style="white-space: pre-line;">{{ message }}</p>
      <textarea v-model="message" placeholder="add multiple lines"></textarea>
      <div class="explanation" v-html="aiExplanation"></div>
      <button @click="fetchExplanation" :disabled="isLoading">
        {{ isLoading ? '添加中...' : '添加单词' }}
      </button>
    </div>
  </v-container>
</template>

<script>
import { VCard, } from 'vuetify/lib/components/index.mjs';
import { recordWord } from '@/api/word'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      message: '',
      aiExplanation: '', // 存储 AI 解析的内容
      isLoading: false,  // 加载状态
      inputWord: '',
      variants: ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'],
    };
  },
  methods: {
    async fetchExplanation() {
      this.isLoading = true; // 开始加载
      const words = this.message.split('\n')
      
      for (let i = 0; i < words.length; i++) {
        const wordData = { 'word': words[i] }
        new Promise((resolve, reject) => {
          recordWord(wordData).then(response => {
            console.log(response)
            if (response.status == 200) {
              //TODO: 显示固定个数单词在页面
              const { data } = response
              toast(words[i] + "添加成功", {
                "theme": "auto",
                "type": "success",
                "pauseOnFocusLoss": false,
                "autoClose": 2000,
                "transition": "flip",
                "dangerouslyHTMLString": true
              })
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
      this.isLoading = false; // 结束加载
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.explanation {
  margin-top: 20px;
  text-align: left;
}
</style>
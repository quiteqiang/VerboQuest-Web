<template>
  <div class="card">
    <!-- <button @click="fetchExplanation" :disabled="isLoading">
      {{ isLoading ? '生成中...' : '智能解析' }}
    </button> -->
    
    <span>Multiline message is:</span>
    <p style="white-space: pre-line;">{{ message }}</p>
    <textarea v-model="message" placeholder="add multiple lines"></textarea>
    <div class="explanation" v-html="aiExplanation"></div>
    <button @click="fetchExplanation" :disabled="isLoading">
      {{ isLoading ? '添加中...' : '添加单词' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios'
import { onMounted } from 'vue'
import { recordWord } from '@/api/word'

export default {
  props: {
  },
  data() {
    return {
      message: '',
      aiExplanation: '', // 存储 AI 解析的内容
      isLoading: false,  // 加载状态
      inputWord: ''
    };
  },
  methods: {
    async fetchExplanation() {
      this.isLoading = true; // 开始加载
      const wordData = {'word': 'feb'}
      new Promise((resolve, reject) => {
            recordWord(wordData).then(response => {
              if (response.code == 200) {
                const { data } = response
              }
              resolve()
            }).catch(error => {
              reject(error)
            })
          })
      this.isLoading = false; // 结束加载
    },
    filterInputText() {
      
    }
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
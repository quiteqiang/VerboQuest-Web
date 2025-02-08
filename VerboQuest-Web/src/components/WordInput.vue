<template>
  <v-container>
    <v-row dense>
      <v-col v-for="item in cards" :key="item.wordId" cols="16" md="4">
        <v-card
          variant="elevated"
          class="mx-auto"
          color="surface-variant"
          max-width="344"
          :title="item.word"
          :text="item.definition"
        >
        <v-card-subtitle class="normal-white-space">
            {{ item.sentence}}
          </v-card-subtitle>
          <template v-slot:actions>
            <v-btn text>Button</v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <div class="card">
      <span class="fancy-text">Multiline words:</span>
      <p style="white-space: pre-line;">{{ message }}</p>
      <textarea v-model="message" placeholder="add multiple lines words" class="bordered-textarea"></textarea>
      <div class="explanation" v-html="aiExplanation"></div>
      <button @click="fetchExplanation" :disabled="isLoading">
        {{ isLoading ? '添加中...' : '添加单词' }}
      </button>
    </div>
  </v-container>
</template>

<script>
import { VCard, } from 'vuetify/lib/components/index.mjs';
import { recordWord, fetchWords } from '@/api/word'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { onMounted } from 'vue';

export default {
  setup() {
 
    onMounted(() => {
      // 在这里可以执行DOM操作或数据请求
      console.log('组件已挂载');
      try {
        fetchWords(6).then(response => {
          console.log("mounted words")
          console.log(response)
        });
      } catch (error) {
        console.error('请求错误:', error);
      }
      
    });
 
    // 也可以返回一个函数进行清理
    // return {
    //   count
    // };
  },
  data() {
    return {
      message: '',
      aiExplanation: '', // 存储 AI 解析的内容
      isLoading: false,  // 加载状态
      inputWord: '',
      variants: ['elevated', 'tonal', 'elevated',
      'elevated', 'tonal', 'elevated'
      ],
      cards: [
        {
            "wordId": 32,
            "word": "history",
            "timeCreated": "2025-02-08T14:44:45.463+00:00",
            "definition": "The study of past events, particularly in human affairs",
            "sentence": "medieval European history"
        },
        {
            "wordId": 33,
            "word": "heterogeneous",
            "timeCreated": "2025-02-08T14:45:35.410+00:00",
            "definition": "diverse in character or content",
            "sentence": "a large and heterogeneous collection"
        }
    ]
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
            toast(words[i] + "添加失败   🤯", {
                "theme": "auto",
                "type": "error",
                "pauseOnFocusLoss": false,
                "autoClose": 2000,
                "transition": "zoom",
                "dangerouslyHTMLString": true
              })
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

.bordered-textarea {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.fancy-text {
  font-size: 1.5em;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 10px;
  display: block;
}

.v-card .v-card-subtitle {
  white-space: normal;
}
</style>
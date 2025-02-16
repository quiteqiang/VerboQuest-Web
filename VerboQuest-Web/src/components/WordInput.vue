<template>
  <v-container>
    <v-row dense>
      <v-col v-for="item in cards" :key="item.wordId" cols="16" md="4">
        <!-- 卡片大小自动调整，如果例句太长 -->
        <v-card
          variant="elevated"
          class="mx-auto fixed-height-card fill-height"
          color="surface-variant"
          max-width="344"
          :title="item.word"
          :text="item.definition"
        >
        <v-card-subtitle class="normal-white-space">
            {{ item.sentence}}
          </v-card-subtitle>
          <template v-slot:actions>
            <v-tooltip text="I knew this" location="bottom">
              <template v-slot:activator="{ props }">
                <svg-icon v-bind="props" type="mdi" :path="IknewIt" @click="removeKnownCard(item)"></svg-icon>
              </template>
            </v-tooltip>
            <v-tooltip text="Generate def & sentence by AI" location="bottom">
              <template v-slot:activator="{ props }">
                <svg-icon v-bind="props" type="mdi" :path=path @click="genDefAndSentence(item)"></svg-icon>
              </template>
            </v-tooltip>
            <v-tooltip text="Forgot, needs more practice" location="bottom">
              <template v-slot:activator="{ props }">
                <svg-icon v-bind="props" type="mdi" :path=forgot @click="removeForgotCard(item)"></svg-icon>
              </template>
            </v-tooltip>
            <v-tooltip text="Ops, typo, remove word" location="bottom">
              <template v-slot:activator="{ props }">
                <svg-icon v-bind="props" type="mdi" :path=removeWord @click="deleteFromCards(item)"></svg-icon>
              </template>
            </v-tooltip> 
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
import { recordWord, fetchWords, knownWord, forgotWord, nextRandom, deleteWord } from '@/api/word'
import { aiGen } from '@/api/aiChat'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { onMounted, getCurrentInstance } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiRefreshAuto, mdiCloudPlusOutline, mdiHeadPlusOutline, mdiDeleteAlert} from '@mdi/js';

export default {
  components: {
		SvgIcon
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
      path: mdiRefreshAuto,
      IknewIt: mdiCloudPlusOutline,
      forgot: mdiHeadPlusOutline,
      removeWord: mdiDeleteAlert,
      cards: null
    };
  },
  setup() {
    const ins = getCurrentInstance();
    onMounted(() => {
      // 在这里可以执行DOM操作或数据请求
      console.log('组件已挂载');
      try {
        fetchWords(6).then(response => {
          ins.data.cards = response.data.data 
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
    removeKnownCard(item) {
      // 先update 后端-> 200 -> 从前端移出去
      new Promise((resolve, reject) => {
          knownWord(item.wordId).then(response => {
            if (response.status == 200) {
              //TODO: 显示固定个数单词在页面
              const { data } = response
              // 过滤出去选中card
              this.cards = this.cards.filter(function(cd) {
                return cd.wordId != item.wordId
              })
              this.fetchNextrandomword()
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
      })
    },
    removeForgotCard (item) {
      // 先update 后端-> 200 -> 从前端移出去
      new Promise((resolve, reject) => {
        forgotWord(item.wordId).then(response => {
            if (response.status == 200) {
              //TODO: 显示固定个数单词在页面
              const { data } = response
              // 过滤出去选中card
              this.cards = this.cards.filter(function(cd) {
                return cd.wordId != item.wordId
              })
              // GET一个新的word过来
              this.fetchNextrandomword()
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
      })
    },
    async fetchNextrandomword() {
      const wordIds = this.cards.map( wd => wd.wordId)
      const jsonfy = JSON.stringify(wordIds)
      new Promise((resolve, reject) => {
          nextRandom(jsonfy).then(response => {
            console.log(response)
            if (response.status == 200) {
              this.cards.push(response.data.data)
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
    },
    async deleteFromCards(item) {
      new Promise((resolve, reject) => {
        deleteWord(item.wordId).then(response => {
            if (response.status == 200) {
              //TODO: 显示固定个数单词在页面
              const { data } = response
              // 过滤出去选中card
              this.cards = this.cards.filter(function(cd) {
                return cd.wordId != item.wordId
              })
              // GET一个新的word过来
              this.fetchNextrandomword()
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
      })
    },
    async genDefAndSentence(item) {
      new Promise((resolve, reject) => {
        aiGen(item.wordId, item.word).then(response => {
            if (response.status == 200) {
              item.definition = response.data.data.definition
              item.sentence = response.data.data.sentence
              const { data } = response
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
      })
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
  overflow: hidden;
  text-overflow: ellipsis;
}

.fixed-height-card {
  max-height: 400px; /* Set a fixed height */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
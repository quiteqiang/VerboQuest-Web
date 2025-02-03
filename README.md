# VerboQuest-Web 功能说明
## 概述
VerboQuest 是一个基于 Web 的 GRE 词汇记忆辅助工具，旨在帮助用户高效记忆 GRE 单词。通过结合 DeepSeek API，VerboQuest 提供了智能化的文章生成和填空练习功能，帮助用户在真实语境中掌握单词。

## 功能列表
1. [录入单词](#录入单词)
2. [生成对应的文章来填空](#热点文章)
3. [用选择的单词结合最近的网络新闻生成文章](填空文章)


### 录入单词
输入方式：支持单个单词录入或批量导入(**抓紧开发中**)
存储方式：单词数据存储在数据库中，方便后续调用。


### 热点文章
用户可以选择一组单词，VerboQuest 会结合 DeepSeek API 和最近的网络新闻，生成一篇包含这些单词的文章。

#### 输入：

1. 用户选择一组单词（如：ephemeral, ubiquitous, alacrity）。

2. 用户选择新闻主题（可选，如：科技、政治、环境）。（**抓紧开发中**）

#### 输出：
1. 一篇包含选定单词的文章，单词在文章中以高亮显示。
2. 文章来源基于最近的网络新闻，确保内容新颖且相关。

#### 技术实现：
1. 调用 DeepSeek API 生成文章。
```json
{
  "words": ["ephemeral", "ubiquitous", "alacrity"],
  "topic": "technology",
  "language": "en"
}
```

#### 示例输出
The Future of Artificial Intelligence

In today's **ubiquitous** world of technology, artificial intelligence (AI) has become an integral part of our lives. However, the impact of AI may be **ephemeral** if we do not address its ethical implications. With **alacrity**, researchers are working to ensure that AI benefits humanity in the long term.

### 填空文章
基于生成的文章，VerboQuest 可以自动创建填空练习，帮助用户巩固单词记忆。

#### 输入：
1. 生成的文章（来自功能 2）
2. 需要填空的单词列表。

#### 输出：
1. 一篇带有多选填空标记的文章。
2. 用户填写答案后，系统会验证答案的正确性。
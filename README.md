# 🧠 ChatGPT History API

A lightweight **NestJS API** that interacts with OpenAI ChatGPT, stores conversation history in a **JSONL file**, and allows retrieving the latest messages efficiently by reading from the **end of the file**.

---

## 🚀 Features

- Send messages to ChatGPT and get responses.
- Store conversation history in a **JSON Lines (JSONL) file**, enabling **fast append-only writes**.
- Read the latest `N` messages from the history efficiently.
- Supports multiple OpenAI models (`gpt-3.5-turbo`, `gpt-4-turbo`, `gpt-5`, etc.).
- Automatically decodes newline (`\n`) and carriage return (`\r`) characters in stored answers.

---

## 📦 API Endpoints

### 1️⃣ Send Message to AI

**POST** `/ai`

**Request Body:**

| Field    | Type              | Description                            |
| -------- | ----------------- | -------------------------------------- |
| messages | array of objects  | Chat messages (see below)              |
| model    | string (optional) | OpenAI model to use, default `"gpt-5"` |

**Example Request:**

```json
{
  "messages": [
    { "role": "system", "content": "Hello! Set context: JavaScript" }
  ],
  "model": "gpt-5"
}
```

**Example response:**

```json
{
  "message": "Hello! I am ready to help you with your JavaScript questions."
}
```

**GET** `/ai/last-messages/:n`

**Request path params:**

| Field | Type   | Description             |
| ----- | ------ | ----------------------- |
| n     | number | number of last messages |

**Example response:**

```json
[
  {
    "role": "system",
    "content": "Set context: JavaScript"
  }
  {
    "role": "user",
    "content": "Hello, how are you?"
  },
  {
    "role": "assistant",
    "content": "Hello! I am ready to help you with your JavaScript questions"
  },
]
```

### 💻 How to run Locally

1. Clone the Repository

```bash
git clone https://github.com/Misha-Kirichenko/open-ai-as-third-party-test-task
cd open-ai-as-third-party-test-task
```

2. Rename the file `example.env` to `.env` in the root directory of the project.

3. Open the `.env` file and ensure that all the environment variables are set correctly

4. Run command from  project folder


```bash
npm run start
```

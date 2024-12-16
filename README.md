# BlogAI

BlogAI is a simple blog engine that uses AI to generate content. It uses the Grok API to generate content based on the title and the description of the blog post. The content is then stored in a folder and served to the user through Astro. It is composed by 2 separate node applications, the Astro frontend and the backend that generates the content, so that each feature can be used independently. The backend uses a scheduler to generate content for the blog posts, so that the user doesn't have to wait for the content to be generated. The scheduler is optional and can be started with the command `npm run schedule`. The content is generated using the Grok API, which is a paid service, so you will need to create an account and get an API key to use it. The API key should be stored in a file called `.env` in the root of the backend folder. The file should look like this:

```
OPENAI_API_KEY=your_api_key
```

It is also possible to post the contents to X (Twitter). To do this, you will need to create a Twitter Developer account and get the necessary keys. The keys should be stored in the `.env` file in the root of the backend folder. The file should look like this:

```
TWITTER_APP_KEY=your_consumer_key
TWITTER_APP_SECRET=your_consumer_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_token_secret
```

**The post it is by default not posted instantly to X (Twitter)**, but it is scheduled to be posted 1 hour after the content is generated. This can be changed by modifying the `publishXAfter` function in the `config.json` file in the `backend` folder.

Thank you for checking out this project and have fun!

## Technologies

### Frontend

![Astro](https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white)

### Backend

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## Installation

1. Clone the repository

```bash
git clone https://github.com/NoQuitt/BlogAI.git
```

2. Install dependencies

```bash
npm install
```

3. Start the astro server

```bash
npm run start
```

4. Start the scheduler (Optional, but required for the content to be generated)

```bash
npm run schedule
```

**By default the scheduler will generate content for the blog posts every 24 hours, at 09:00AM.** You can change this by modifying the `cronTime` function in the `config.json` file in the `backend` folder.

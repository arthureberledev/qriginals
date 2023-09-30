<a href="https://qriginals.com">
  <img alt="Qriginals is a platform for creating and sharing QR code designs." src="https://qriginals.com/opengraph-image.png">
  <h1 align="center">Qriginals</h1>
</a>

<p align="center">
  An open-source platform for creating and sharing QR code designs.
</p>

<p align="center">
  <a href="https://github.com/arthureberledev/qriginals/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/arthureberledev/qriginals?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
  <a href="https://github.com/arthureberledev/qriginals"><img src="https://img.shields.io/github/stars/arthureberledev/qriginals?style=social" alt="Qriginals's GitHub repo"></a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#setting-up-locally"><strong>Setting Up Locally</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="#license"><strong>License</strong></a>
</p>
<br/>

## Introduction

[Qriginals](https://qriginals.com/) is a platform for creating and sharing QR code designs. See what others have used as prompt and parameters and use it to create your own unique art!

![image](https://github.com/arthureberledev/qriginals/assets/58264696/88a07107-42c3-4572-a2be-4f24ef6660f7)

<br />

## Deploy Your Own
You can deploy your own version of Qriginals to your preferred hosting platform.

<br />

## Setting Up Locally
To set up Qriginals locally, you'll need to clone the repository and create an account for each of the used services and set following environment variables: 

```
OPENAI_API_KEY=
REPLICATE_API_KEY=

SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

NEXT_PUBLIC_SITE_URL=
```

<br />

## Tech Stack
Qriginals is built on the following stack:

- Next.js – frontend/backend
- TailwindCSS – styles
- Supabase - database, authentication and storage
- Replicate - qr code generation
- OpenAI - prompt generation
- Vercel - hosting & analytics
- Upstash - ratelimiting
- Stripe - payments
- Sharp - image processing and thumbnail generation

<br />

## Contributing
Here's how you can contribute:

Open an issue if you believe you've encountered a bug.
Make a pull request to add new features/make quality-of-life improvements/fix bugs.

<br />

<a href="https://github.com/arthureberledev/qriginals/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=arthureberledev/qriginals" />
</a>

<br />

## License
Licensed under the MIT license.

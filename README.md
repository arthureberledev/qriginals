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
You can deploy your own version of Qriginals to your preferred hosting platform. I prefer Vercel for this.

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

## Setting Up (Locally)
To set up Qriginals, you'll need to clone the repository and create an account for each of the used services and set the environment variables. Stripe and Upstash are not needed for the local development, you just need to set a dummy value like "xyz" to the environment values or [t3-env](https://github.com/t3-oss/t3-env) will throw an error.

### Supabase (database/auth/storage)
With Supabase you have the advantage that you can set it up locally without even creating an account. You can follow this [guide](https://supabase.com/docs/guides/cli/getting-started) to do so. After you've set it up and started it with `supabase start` you will see different keys in your terminal:

```
         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: [...]
service_role key: [...]
```

You need the `API URL`, `anon key` and `service_role key`.

### OpenAI (prompt generation)
Go to [OpenAI](https://platform.openai.com/account/api-keys), create an account, create an API key and note it down.

### Replicate (QR Code generation)
Go to [Replicate](https://replicate.com/account/api-tokens), create an account if you don't have one, create an API key and note it down as well.

### Stripe (payments)
I've used this [awesome starter](https://github.com/vercel/nextjs-subscription-payments) for the configuring stripe with supabase and nextjs. There is a much more detailed guide than I could have written here, so I just recommend you follow the steps in the `Configure Stripe` section there.

### Upstash (rate limiting) 
Upstash is used here to prevent malicious acts against the API. A user cannot make more requests than the defined interval in the API route. You can see examples for it in the `/app/api/v1/...` folder. To use it you need to go to the (qstash console)[https://console.upstash.com/] and create a database. Note down the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

### Last but not least
Finally, copy the `.env.local.example` file and remove the `.example` part (should be `.env.local`). Now you can set all the collected environment variables and you're ready to go!

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
Licensed under the [Apache-2.0 license](https://github.com/arthureberledev/qriginals/blob/main/LICENSE).

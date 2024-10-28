# varo.dev

> [!NOTE]  
> This project is currently undergoing a rewrite. If you're interested in the code from the Cebu Hacktoberfest 2024 Hackathon, you can find it in the [`nuxt`](https://github.com/mugnavo/varo.dev/tree/nuxt) branch.

The AI-powered matchmaking platform for developers, open-source projects, and indie hackers.

Built with [TanStack Start](https://tanstack.com/start) and [Vercel AI SDK](https://sdk.vercel.ai/).

## Development

> Node.js 20 or later is recommended.

1. Install [pnpm](https://pnpm.io/installation).
2. Install the necessary dependencies by running `pnpm install` in the root directory of the project.
3. Create a fill in your `.env` file based on the `.env.example` file.

   ```env
   DATABASE_URL=

   GOOGLE_GENERATIVE_AI_API_KEY=

   DISCORD_CLIENT_ID=
   DISCORD_CLIENT_SECRET=
   DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback/discord
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback/github
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
   ```

4. Run the development server with `pnpm dev`.
5. You can now access the development server at `http://localhost:3000`.

## Contributing

Please read our [Contributing Guidelines](./CONTRIBUTING.md) before starting a pull request.

## License

[GPL-3.0](LICENSE)

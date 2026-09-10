To set this up you need to Sign up to Supabase and Upstash Redis (for rate-limiting)
Add the API keys in .env.example file

Open the project and run these in the terminal:

````
npm install
cp .env.example .env
cp .env.example .env.local
npm run supabase:seed
npm run supabase:migrate
````
The commands are to run it locally, for deployment your Hosting manager does the job (if you are using one)

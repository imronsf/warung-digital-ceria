
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/eb8f0714-ab4c-4ae7-b756-6140f2866a6b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/eb8f0714-ab4c-4ae7-b756-6140f2866a6b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up the database
# - Create a MySQL database as described in database-schema.sql
# - Copy .env.example to .env and update the database credentials

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Setting up the MySQL Database

1. Create a new MySQL database for the application:
```sql
CREATE DATABASE umkm_pos;
```

2. Import the schema from the database-schema.sql file:
```sh
mysql -u your_username -p umkm_pos < database-schema.sql
```

3. Configure your database connection:
   - Copy `.env.example` to `.env`
   - Update the database credentials in the `.env` file

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- MySQL (for database)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/eb8f0714-ab4c-4ae7-b756-6140f2866a6b) and click on Share -> Publish.

For production deployment with MySQL, you'll need to:
1. Set up a MySQL database server
2. Configure the database connection in your environment variables
3. Deploy the application to your hosting provider

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

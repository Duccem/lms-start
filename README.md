# LMS Start

This is a starter project for a Learning Management System (LMS) built with Next.js, TypeScript, and other modern technologies.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Database:** [Drizzle ORM](https://orm.drizzle.team/) with [Neon](https://neon.tech/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn](https://ui.shadcn.com/)
- **Internationalization:** [next-international](https://github.com/QuiiBz/next-international)
- **AI:** [Google AI SDK](https://ai.google.dev/)

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lms-start.git
   ```
2. Navigate to the project directory:
   ```bash
   cd lms-start
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `dev`: Starts the development server with Turbopack.
- `build`: Creates a production build of the application.
- `start`: Starts the production server.
- `lint`: Lints the codebase using Next.js's built-in ESLint configuration.

## Project Structure

The project structure is organized as follows:

```
.
├── public/
├── src/
│   ├── app/
│   ├── assets/
│   ├── lib/
│   ├── modules/
│   └── middleware.ts
├── components.json
├── drizzle.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

- `src/app`: Contains the application's routes and pages.
- `src/lib`: Contains the application's core logic, such as authentication, database, and payment processing.
- `src/modules`: Contains the different modules of the LMS, such as courses, users, and enrollments.

## Database

The database schema is defined in `src/lib/database/schema.ts` using Drizzle ORM. To apply database migrations, you can use the following command:

```bash
npx drizzle-kit generate
```

This will generate the necessary SQL files to update the database schema.


# Nuxt 3 Todo Application

A simple yet full-featured Todo application built with Nuxt 3, showcasing modern web development practices.

## Features

*   Create, Read, Update, Delete (CRUD) Todos
*   Toggle Todo completion status
*   Responsive design
*   Input validation (client and server-side)
*   Optimistic updates for a smoother user experience

## Tech Stack

This project utilizes a modern, type-safe, and efficient technology stack:

*   **Framework**: [Nuxt 3](https://nuxt.com/) - Vue.js framework for server-side rendering, static site generation, and more.
*   **UI Components**: [Shadcn-vue](https://www.shadcn-vue.com/) - Re-usable components built using Radix Vue and Tailwind CSS.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
*   **State Management**: [Pinia](https://pinia.vuejs.org/) - The official Vue state management library, offering a simple and intuitive API.
*   **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/) - A TypeScript ORM for SQL databases, known for its type safety and developer experience.
*   **Database**: [SQLite](https://www.sqlite.org/) (via `better-sqlite3`) - A lightweight, file-based SQL database.
*   **Validation**: [Zod](https://zod.dev/) - A TypeScript-first schema declaration and validation library, used for both frontend and backend validation.
*   **Icons**: [Nuxt Icon](https://github.com/nuxt-modules/icon) (using Lucide Icons) - For easily embedding SVG icons.
*   **Language**: TypeScript

## Project Structure Overview

The project follows a standard Nuxt 3 structure with some additions for clarity and organization:

```
todo-app/
├── assets/
│   └── css/
│       └── tailwind.css        # Base Tailwind styles and Shadcn variables
├── components/
│   ├── common/                 # General reusable components
│   │   ├── AppHeader.vue
│   │   └── LoadingSpinner.vue
│   ├── todos/                  # Todo-specific components
│   │   ├── TodoItem.vue
│   │   ├── TodoList.vue
│   │   └── TodoForm.vue
│   └── ui/                     # Shadcn-vue UI components (auto-generated)
├── layouts/
│   └── default.vue             # Default application layout
├── pages/
│   ├── index.vue               # Root page (redirects to /todos)
│   └── todos/
│       └── index.vue           # Main page for displaying and managing todos
├── server/
│   ├── api/
│   │   └── todos/              # API endpoints for todos
│   │       ├── index.get.ts    # GET /api/todos (fetch all)
│   │       ├── index.post.ts   # POST /api/todos (create)
│   │       ├── [id].put.ts     # PUT /api/todos/:id (update)
│   │       ├── [id].delete.ts  # DELETE /api/todos/:id (delete)
│   │       └── [id]/toggle.post.ts # POST /api/todos/:id/toggle (toggle)
│   ├── db/
│   │   ├── migrations/         # Drizzle ORM migration files
│   │   ├── schema.ts           # Drizzle ORM table schemas
│   │   └── index.ts            # Drizzle client setup and DB connection
├── stores/
│   └── todos.ts                # Pinia store for todo state management
├── utils/
│   └── types.ts                # Shared TypeScript interfaces/types
├── zod-schemas/
│   └── todo.ts                 # Zod schemas for validation
├── app.vue                     # Main Vue application component
├── nuxt.config.ts              # Nuxt configuration file
├── drizzle.config.ts           # Drizzle Kit configuration for migrations
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json
└── README.md                   # This file
```

## Setup and Development

Follow these steps to get the project running locally:

**1. Prerequisites:**

*   Node.js (LTS version recommended, e.g., v18 or v20)
*   npm (comes with Node.js)

**2. Clone the repository (if applicable):**

```bash
# If you're working from a cloned repo
git clone <repository-url>
cd todo-app
```

**3. Install Dependencies:**

Navigate to the `todo-app` directory and run:

```bash
npm install
```

This will install all project dependencies, including Nuxt, Drizzle, Shadcn, etc.

**4. Database Setup (Migrations):**

The application uses Drizzle ORM with SQLite. The database file will be created automatically (by default at `.nuxt/db.sqlite3` during development).

The initial migration `0000_silly_baron_zemo.sql` is already included in `server/db/migrations/`. When the application starts for the first time, Drizzle and `better-sqlite3` will create the `db.sqlite3` file. You need to ensure this schema is applied.

*   **If starting fresh (no `db.sqlite3` file yet):** The schema will be empty. You can use `drizzle-kit push:sqlite` (or `npm run db:push` as configured in `package.json`) to directly apply the current schema (`server/db/schema.ts`) to the database. This is often the simplest for starting development.
    ```bash
    npm run db:push
    ```
*   **If you change `server/db/schema.ts` later:**
    1.  Generate a new migration file:
        ```bash
        npm run db:migrate
        ```
    2.  Apply the new migration(s). You might need a separate migration tool or script for applying migrations in SQLite, or you can use `npm run db:push` again if you're okay with Drizzle Kit managing the schema state directly (common in dev).

**5. Run the Development Server:**

```bash
npm run dev
```

This command starts the Nuxt development server, typically available at `http://localhost:3000`. The application will hot-reload on changes.

**6. Build for Production:**

To build the application for production:

```bash
npm run build
```

This will create a `.output` directory with the production-ready build. You can then start the production server using:

```bash
npm run preview # To preview the production build locally
# Or deploy the .output directory to your hosting provider
```

## Using Drizzle Studio (Optional)

Drizzle Kit comes with Drizzle Studio, a local GUI to browse your database.

```bash
npm run db:studio
```

This will open a web interface to inspect your SQLite database tables and data.

---

This README provides a comprehensive guide to understanding, setting up, and developing the Nuxt Todo Application. If you have any questions or encounter issues, please refer to the documentation of the respective technologies used.

# ✨ TaskFlow - Next.js + StatelyDB Tutorial

A modern task management application built with Next.js 14+ and StatelyDB - learn how to build real-time, collaborative todo apps with StatelyDB's powerful backend!

## ✨ Features

- **Real-time Collaboration**: Work together seamlessly with StatelyDB's real-time updates
- **Beautiful Projects**: Create stunning project pages with customizable colors and emojis
- **Unlimited Tasks**: Add as many tasks as you want with priorities, due dates, and tags
- **Team Management**: Collaborate with team members and assign tasks
- **Modern UI**: Clean, responsive design with smooth animations and dark mode support
- **Mobile First**: Fully responsive design that looks great on all devices

## 🚀 Quick Start

### 1. **Clone and Install**

```bash
git clone https://github.com/StatelyCloud/nextjs-task-flow
cd nextjs-task-flow
npm install
```

### 2. **Setup StatelyDB**

1. Create a free account at [StatelyDB](https://stately.cloud)
1. Create a new store and access key to get your credentials. Take note of the Access Key and Store ID.
1. Click on the Schema ID of your newly created store, paste the contents of [the demo schema](/schema.ts) and click `Publish`.
1. Install the Stately CLI and login

   ```bash
    curl -sL https://stately.cloud/install | sh
    stately login
   ```

1. Generate the SDK
   ```bash
   stately schema generate --language typescript --schema-id <your_schema_id> ./generated
   ```
1. Rename and update the `.env.local.example` file in the project root:

   ```bash
   # rename to .env.local and update
   STATELY_STORE_ID=your_store_id_here
   STATELY_ACCESS_KEY=your_access_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 3. **Run the Application**

```bash
npm run dev
```

### 4. **Visit the App**

- Home page: http://localhost:3000/
- Create your first project and start managing tasks!

## 📁 Project Structure

```
nextjs-task-flow/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx         # Root layout with global styles
│   │   ├── page.tsx           # Home page
│   │   ├── projects/          # Projects pages
│   │   │   ├── page.tsx       # Projects list
│   │   │   ├── new/           # Create project
│   │   │   └── [id]/          # Project details
│   │   └── globals.css        # Global Tailwind styles
│   ├── components/            # Reusable React components
│   │   ├── ui/                # Base UI components
│   │   ├── task-card.tsx      # Task display component
│   │   └── project-card.tsx   # Project display component
│   └── lib/
│       └── stately.ts         # StatelyDB integration layer
├── generated/                 # StatelyDB generated code
├── schema.ts                  # StatelyDB schema definition
├── package.json               # Dependencies and scripts
└── tailwind.config.js         # Tailwind CSS configuration
```

## 🔗 StatelyDB Integration

This tutorial demonstrates key StatelyDB concepts:

### **Models** (`src/lib/stately.ts`)

- **Task**: Individual tasks with status, priority, and collaboration
- **Project**: Project containers with progress tracking
- **User**: User management and profiles
- **Comment**: Task discussions and collaboration
- **ProjectMember**: Team access control

### **Real-time Features**

- Automatic updates when tasks change status
- Live collaboration on project tasks
- Real-time progress tracking

### **Key Functions**

- `taskHelpers.createTask()` - Create new tasks with StatelyDB
- `taskHelpers.getProjectTasks()` - Efficiently fetch all project tasks
- `projectHelpers.createProject()` - Set up new projects
- `userHelpers.updateLastActive()` - Track user activity

## 🎨 Customization

### **Adding Task Priorities**

Edit the priority options in `src/components/task-card.tsx` to add new priority levels.

### **Theming**

All styles are in `src/app/globals.css` and `tailwind.config.js` with CSS custom properties for easy theming.

### **StatelyDB Schema**

Check `generated/` directory to see the auto-generated StatelyDB types and client.

## 🛠️ StatelyDB Models

### **Task**

- `id`: Unique identifier (auto-generated sequence)
- `projectId`: Parent project reference
- `title`: Task name
- `description`: Detailed task description
- `status`: Current state (todo, in-progress, completed, archived)
- `priority`: Importance level (low, medium, high, urgent)
- `assigneeId`: User assigned to task
- `dueDate`: Optional deadline
- `tags`: Comma-separated labels
- `commentCount`: Number of discussions

### **Project**

- `id`: Unique identifier
- `name`: Project title
- `description`: Project overview
- `color`: UI theme color
- `emoji`: Project icon
- `ownerId`: Project creator
- `taskCount`: Total tasks
- `completedTaskCount`: Finished tasks
- `isPublic`: Visibility setting

### **User**

- `id`: Unique identifier
- `email`: User email address
- `name`: Display name
- `avatar`: Profile image or emoji
- `timezone`: User's timezone
- `theme`: Preferred UI theme
- `lastActiveAt`: Activity tracking

## 🔧 Technical Details

- **Next.js 14+**: Modern React framework with App Router
- **StatelyDB**: Real-time cloud database with automatic scaling
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **React Server Components**: Optimal performance and SEO

## 🚀 Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to Vercel, Netlify, or your preferred platform
4. Configure StatelyDB for production workloads

### **Environment Variables**

```bash
STATELY_STORE_ID=your_production_store_id
STATELY_ACCESS_KEY=your_production_access_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📚 Learning Resources

- [StatelyDB Documentation](https://docs.stately.cloud)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/react/use-server)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a tutorial project - feel free to fork and extend it for your learning!

### **Development**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📄 License

MIT License - feel free to use this code for learning and building your own applications!
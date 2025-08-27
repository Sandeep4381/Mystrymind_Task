# **App Name**: TaskZen

## Core Features:

- Role-Based Authentication: User authentication with role-based access control (Super Admin, Admin, User). Super Admin creates all accounts; no signup is needed.
- Role-Based Dashboard: Dashboard displaying key metrics for Super Admins and Admins, with task list, but users only view the task list.
- Task Listing: Task list page that has ability to view task names.
- Assignee: A display that provides an editable assignee selection in each task item, mirroring the project management process.
- Task Details: Detailed task view showing task name, assignee, and a comment section.
- Intelligent Assignment: AI-powered tool suggests possible assignees and reviewers based on the task description, past history, and current workload, incorporating elements like skills needed and team familiarity.
- JSON Local Storage: Local JSON storage solution instead of database implementation to persist Tasks. and user details.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) for trust and productivity.
- Background color: Very light blue (#E8EAF6), almost white, for a clean, uncluttered look.
- Accent color: Vibrant purple (#9C27B0) for interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif suitable for both headlines and body text.
- Simple, line-based icons for navigation and task status.
- Clean, card-based layout inspired by Jira and PMP, optimized for information density.
- Subtle transitions and animations to enhance user experience when changing pages and during task status updates.
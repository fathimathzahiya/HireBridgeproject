# Recruitment Platform (Project)

Overview
--
This project is a full-stack recruitment platform with a shared login, role-based redirects (Student / Company / Admin), and separate signup flows. The repo contains `client/` (React) and `server/` (Express) folders.

Authentication Flow
--
- Single Login page where users choose their role then sign in with email/password.
- Post-login redirect by role: `/student/dashboard`, `/company/dashboard`, `/admin/dashboard`.

Recommended Pages / Modules
--
- Public: Home, About, Companies, Jobs, Contact, Login, Student Register, Company Register
- Student: Dashboard, Profile, Jobs, Applications, Interviews, Settings
- Company: Dashboard, Job CRUD, Applicants, Interviews
- Admin: User management, Job moderation, Analytics, Reports

Dev: Run locally
--
From project root, run client and server in separate terminals.

Client
```
cd client
npm install
npm start
```

Server
```
cd server
npm install
npm start
```

Next steps
--
1. Setup backend basics (Express + DB)
2. Setup frontend basics (React shared Login + routing)
3. Implement Student and Company registration flows

See the tracked TODO list in the project chat for step-by-step implementation.

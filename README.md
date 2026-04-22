CloudPulse: Real-Time SaaS Task Management
CloudPulse is a professional-grade Kanban board designed for high-velocity teams. By integrating Firebase's real-time infrastructure with a fluid, drag-and-drop UI, it provides a seamless "live" collaboration experience where every task movement is synchronized across the globe in milliseconds.

🚀 Key Features
Live Synchronization: Leverages Firestore's onSnapshot listeners to update the dashboard instantly across all active clients without manual refreshes.

Fluid Drag-and-Drop: Built with @hello-pangea/dnd for high-performance card reordering and column transitions.

Secure Google Authentication: Integrated Firebase Auth for secure, one-click login and personalized user profiles.

Task persistence: Robust data management ensuring tasks, categories, and statuses are preserved in the cloud, not just local memory.

Responsive SaaS UI: A sleek, dark-themed dashboard optimized for productivity and accessibility.

🛠️ Technical Stack
Frontend: React 18 + Vite

Database & Auth: Google Firebase (Firestore & Authentication)

Drag-and-Drop: @hello-pangea/dnd

Styling: Tailwind CSS

Icons: Lucide-React

Deployment: Vercel

🏗️ Architecture & Insights
Why Firebase?
I chose Firebase to move beyond localStorage. By utilizing a NoSQL Cloud Database, I implemented a system where data is reactive. The app doesn't just "fetch" data; it "subscribes" to it, allowing for a collaborative environment where team members see each other's changes in real-time.

Drag-and-Drop Logic
Implementing @hello-pangea/dnd required a deep understanding of React state. The challenge was ensuring the UI updated instantly (optimistic updates) while simultaneously verifying the status change in the Firestore backend.

👨‍💻 Author
Levin
Full Stack Developer in Training

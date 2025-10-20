# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system for educational institutions. It provides tools for student tracking, counseling, risk assessment, behavioral monitoring, and academic performance analysis. A key feature is its AI-powered profile analysis, which generates standardized student profiles from diverse data sources. The system also includes an AI Assistant for local, AI-powered student counseling, supporting both OpenAI and Ollama (Llama 3.1) models. Built as a full-stack TypeScript application with React, Express.js, and SQLite, Rehber360 aims to drive data standardization and evidence-based interventions for student success.

## Recent Changes
**October 20, 2025 - Exam Management UI Polish:**
- Improved visual separation between QuickExamCreate and Deneme Sınavları cards
- Increased spacing between cards from 20px to 32px for better mobile readability
- Added stronger borders (border-2) and medium shadows (shadow-md) for clearer visual hierarchy
- Enhanced professional appearance without affecting responsive behavior or functionality

**October 20, 2025 - Exam Result Dialog React Query Fix:**
- Fixed React Query refetch logic in ExamResultDialog to properly handle student switching
- Consolidated useEffect hooks for cleaner state management when selectedStudent or existingResults change
- Removed redundant manual refetch calls, now relying on React Query's automatic query key invalidation
- Improved performance by eliminating unnecessary duplicate network requests
- Enhanced state reset logic to prevent stale data between student selections

**October 20, 2025 - Exam Management UX Redesign:**
- Optimized tab structure from 8 to 6 tabs by creating UnifiedAnalysisTab that consolidates Statistics, Comparison, and Trend Analysis
- Added QuickActionsPanel to Dashboard with prominent PDF download access, reducing navigation depth from 7 clicks to 2 clicks
- Redesigned AdvancedAnalyticsTab with accordion groups for better widget organization and discoverability
- Enhanced visual design with gradients, hover effects, icons, and improved spacing for modern, professional appearance
- Fixed TypeScript type conflicts (duplicate PredictionSummary → TimeAnalysisSummary + PredictionSummary)

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Technology Stack:** React 18, TypeScript, Vite, Radix UI, Tailwind CSS, TanStack React Query, React Hook Form + Zod, React Router DOM, Framer Motion, Recharts.
- **Key Decisions:** Feature-based organization with lazy loading, global error boundaries, mobile-first and accessible design (WCAG AAA), React Query for server state, Context API for authentication, and various performance optimizations.
- **Error Handling:** Standardized system using `client/lib/utils/error-utils.ts` and `client/lib/constants/messages.constants.ts` for consistent error messages and handling. Defensive programming with optional chaining and null/undefined checks.

### Backend
- **Technology Stack:** Express.js v5, SQLite with `better-sqlite3`, TypeScript, Zod.
- **Key Decisions:** Modular architecture, Repository Pattern for data access, Service Layer for business logic, shared type safety, robust security measures (input sanitization, prepared statements, CORS, rate limiting), and centralized error handling.
- **Core Features:** Students, Surveys, Academic Data, Student Support, Administrative Functions, and AI features (holistic-profile, standardized-profile, student-profile-ai, ai-assistant, profile-sync).

### Data Architecture
- **Database:** Normalized relational schema in `database.db` for student profiles, behavior, attendance, surveys, counseling, and interventions.
- **Data Standardization:** Utilizes a comprehensive taxonomy (`shared/constants/student-profile-taxonomy.ts`) for consistent values across academic, social-emotional, and behavioral data, enabling deterministic AI analysis.

### AI and Analytics System
- **AI Suggestion Queue System:** User-approval-required AI recommendation system where AI acts as an assistant. Suggestions for profile updates, insights, and interventions are proposed with reasoning, confidence, and priority. Users review, approve, reject, or modify suggestions.
- **Living Student Profile:** AI-powered profile aggregation system that analyzes data from all sources (counseling sessions, surveys, exams, behavior incidents, meetings, attendance) to generate user-approvable profile update suggestions.
- **AI Assistant:** A professional-grade virtual guidance counselor with deep psychological and pedagogical expertise, offering pattern recognition, proactive insights, psychological depth analysis, evidence-based recommendations, and contextual awareness. Supports OpenAI, Ollama, and Gemini with runtime model selection.
- **Advanced AI Features:** Daily Insights, Psychological Depth Analysis, Predictive Risk Timeline, Hourly Action Planner, Student Timeline Analyzer, Comparative Multi-Student Analysis, Notification & Automation, Deep Analysis Engine, Smart Recommendation Engine, Meeting Prep Assistant, AI Dashboard, Unified Scoring Engine, Deterministic Profile Analysis, Early Warning System, and Analytics Caching.
- **Voice Transcription & AI Analysis:** Provider-aware STT (Gemini, OpenAI Whisper, Web Speech API) with AI-powered analysis for auto-summary, keyword extraction, sentiment analysis, and risk word flagging.
- **Enhanced Text Input Features:** `EnhancedTextarea` component with integrated voice input (Web Speech API) and Gemini-powered text enhancement.

### Authentication and Authorization
- **Role-Based Access Control (RBAC):** Four roles (Admin, Counselor, Teacher, Observer) with hierarchical permissions.
- **Security:** Password hashing (bcryptjs), session-based authentication, and permission guards.

### Build and Deployment
- **Build Process:** Two-stage build (client and server) using Vite.
- **Deployment Target:** Replit VM, running `dist/server/production.mjs` on port 3000.
- **Database:** File-based SQLite (`database.db` in root directory) with automatic backups and schema migrations.

## External Dependencies

### Core Runtime
- **Frontend:** `react`, `react-router-dom`, `@tanstack/react-query`, `@tanstack/react-virtual`, Radix UI.
- **Backend:** `express`, `better-sqlite3`, `bcryptjs`, `cors`, `dotenv`.
- **Shared:** `zod`, `xlsx`, `jspdf`.

### Third-Party Services
- **Gemini API:** Primary AI provider.
- **OpenAI API:** Optional integration for AI features.
- **Ollama:** Recommended for local, privacy-focused AI.

### Database
- **SQLite Database:** `database.db` (root directory) using `better-sqlite3` driver.
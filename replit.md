# Rehber360 - Student Guidance System

## Overview
Rehber360 is a comprehensive Turkish-language student guidance and management system for educational institutions. It provides tools for student tracking, counseling, risk assessment, behavioral monitoring, and academic performance analysis. A key feature is its AI-powered profile analysis, which generates standardized student profiles from diverse data sources. The system also includes an AI Assistant for local, AI-powered student counseling, supporting both OpenAI and Ollama (Llama 3.1) models. Built as a full-stack TypeScript application with React, Express.js, and SQLite, Rehber360 aims to drive data standardization and evidence-based interventions for student success.

## Recent Changes
**October 23, 2025 - Student Profile Page Modernization (2025 SIS Standards):**
- Completely redesigned student profile page to modern SIS (Student Information System) standards with enhanced visual hierarchy and user experience
- **Visual Hierarchy Improvements:**
  - StudentHeader: Upgraded to text-3xl headers with gradient backgrounds, modernized badges with icons, added dynamic age calculation, enhanced spacing and shadows
  - ModernDashboard: Implemented consistent section headers with icon + title + description format, added hover effects and animations to all cards
  - MetricCard: Enhanced with large bold scores (text-4xl), color-coded badges, smooth hover animations (scale + shadow), improved progress indicators
  - Tab System: Added borders, shadows, and enhanced active states with smooth transitions across all tab levels
- **Responsive Design Enhancements:**
  - StudentHeader: Breakpoint-optimized font sizes (text-2xl md:text-3xl), flexible layouts (lg:flex-row), full-width mobile buttons
  - ModernDashboard: Optimized grid breakpoints (sm:grid-cols-2 xl:grid-cols-4), reduced mobile spacing, responsive gap adjustments
  - Quick Actions: 3-column responsive grid (sm:grid-cols-2 lg:grid-cols-3) with automatic layout adjustment
  - StudentProfile: Added mobile padding (px-2 md:px-4) for better mobile experience
- **Data Consolidation & Code Cleanup:**
  - Removed 9 deprecated tab constants from constants.tsx (KIMLIK_TABS, RISK_MUDAHALE_TABS, AILE_ILETISIM_TABS, MESLEKI_TABS, AI_TOOLS_TABS, GENEL_TABS, EGITSEL_TABS, KISISEL_GELISIM_TABS, AILE_TABS)
  - Consolidated to 5 modern tab groups (MAIN_TABS, AKADEMIK_TABS_NEW, KISISEL_SOSYAL_TABS_NEW, REHBERLIK_DESTEK_TABS, SISTEM_TABS)
  - Eliminated data duplication and improved maintainability following single source of truth principle
- **Bug Fixes:**
  - Fixed critical ProfileCompletenessIndicator undefined error with defensive null checking and proper fallback handling
  - Enhanced data validation in ModernDashboard with separate default object and deep null coalescing
- Tab structure now follows best practices: Dashboard → Akademik Profil → Kişisel & Sosyal → Rehberlik & Destek → Sistem
- All components now mobile-first with proper breakpoints for tablet and desktop
- Improved accessibility with larger touch targets and better contrast ratios

**October 20, 2025 - Excel Bulk Upload for Survey Responses:**
- Implemented comprehensive Excel bulk upload feature for survey responses
- Created `SurveyExcelUploadDialog` component with drag-and-drop file upload, validation preview, and detailed result display
- Built server-side import service with robust Excel parsing, header detection, and row-by-row validation
- Added `bulkSaveSurveyResponses` repository function with transaction support for atomic batch inserts
- Implemented file validation: MIME type checking, file extension validation, and 10MB size limit
- Enhanced error handling with detailed row-level error reporting for teachers
- Integrated upload dialog into DistributionsList with "Excel Yükle" action button
- Security improvements: fileFilter in multer config blocks non-Excel files and prevents DoS attacks
- Data integrity: Two-pass import (validate all → save valid in transaction) ensures consistency
- Fixed critical header detection bug: changed initialization from 0 to -1 to properly skip instruction rows
- Teachers can now bulk import completed survey responses for entire classes via Excel

**October 20, 2025 - Student Management System Modernization (2025 Standards):**
- Completely rebuilt Students.tsx page with modern component architecture
- Created 9 new specialized components: StatsCards, AdvancedFilters, BulkActions, EnhancedStudentTable, TableControls, StudentDrawer, StudentCard, EmptyState, TableSkeleton
- Implemented 3 custom hooks for separation of concerns: useStudentStats, useStudentFilters, usePagination
- Added comprehensive export functionality (PDF with jspdf-autotable, Excel, CSV) supporting filtered/selected students
- Implemented advanced filtering: search (debounced), class, gender, and risk level with active filter indicators
- Added bulk operations: multi-select, bulk delete, bulk risk level update with confirmation dialogs
- Enhanced table features: sortable columns, column visibility toggle, compact view mode, sticky header
- Built responsive mobile card view with automatic viewport detection
- Implemented student quick preview drawer for rapid profile access
- Added empty states for no students and no results scenarios
- Integrated dashboard statistics: total students, class distribution, risk analysis
- Removed deprecated components: StudentFilters.tsx, StudentRow.tsx, useDebounced.ts, useStudentFilter.ts
- Clean, maintainable code structure with no duplication following DRY principles

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
- **Technology Stack:** Express.js v5, SQLite with `better-sqlite3`, TypeScript, Zod, Multer.
- **Key Decisions:** Modular architecture, Repository Pattern for data access, Service Layer for business logic, shared type safety, robust security measures (input sanitization, prepared statements, CORS, rate limiting), file upload validation (MIME type, size limits), and centralized error handling with transaction support for bulk operations.
- **Core Features:** Students, Surveys (with Excel bulk upload), Academic Data, Student Support, Administrative Functions, and AI features (holistic-profile, standardized-profile, student-profile-ai, ai-assistant, profile-sync).

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
<context>

# Overview  
This project aims to create a simple, fast, and fair way for roommates to track chore contributions based on time spent, not just task count. The app allows any roommate to complete any chore when they notice it needs doing, log the completion quickly, and transparently track contributions over time. It’s designed for shared living spaces like college apartments, co-living arrangements, and young professional households. The product is valuable because it prevents resentment and conflict by providing an objective record of contribution without rigid chore assignments.

# Core Features  
- **Name Selection Screen**
  - Displays a list of roommate names to identify who is logging a chore.
  - Important for personalizing logs and maintaining accountability.
  - Simple button or card-based UI to select user identity.

- **Chore Logging Screen**
  - Displays the list of chores (e.g., unloading dishwasher, taking out trash) with "+" buttons.
  - Each chore has an associated time value that credits minutes to the selected user.
  - Clicking a chore button records a new completion event linked to the user and timestamp.

- **Chore Contribution Dashboard**
  - A histogram showing total minutes contributed per roommate.
  - Refreshes in real time as chores are logged.
  - Allows roommates to easily see participation and equity at a glance.

# User Experience  
- **User Personas**
  - College roommates
  - Young professionals sharing apartments
  - Co-living community members

- **Key User Flows**
  1. Open app → See "I AM" name selection → Tap name
  2. See chore list → Tap "+" next to completed chore
  3. Return to home page → See updated histogram of contributions

- **UI/UX Considerations**
  - Extremely simple, minimal friction flow (two taps maximum to log a chore)
  - Bright, clear visuals with roommate avatars or color-coding
  - Instant feedback after chore logging (e.g., subtle animation or “+12 minutes!”)

</context>

<PRD>

# Technical Architecture  

- **System Components**
  - Front-end application (React Native / simple web app)
  - Lightweight backend (Firebase, Supabase, or basic Express server)
  - Persistent data storage (small database or Firestore)

- **Data Models**
  - **User**: { id, name }
  - **Chore**: { id, name, time_value_minutes }
  - **ChoreCompletion**: { id, user_id, chore_id, timestamp }

- **APIs and Integrations**
  - Basic REST endpoints (or direct client SDK usage for Firebase/Supabase)
  - Optionally simple analytics integration (e.g., count of completed chores per user)

- **Infrastructure Requirements**
  - Very light hosting requirements (small database, basic compute)
  - Can be hosted on free-tier services during MVP stage.

# Development Roadmap  

- **Phase 1: MVP Requirements**
  - Hardcode list of roommates
  - Hardcode list of chores with time values
  - Implement name selection screen
  - Implement chore logging screen
  - Implement histogram/dashboard view
  - Basic persistent storage of chore completions

- **Phase 2: Future Enhancements**
  - Ability to add/edit roommates dynamically
  - Ability to add/edit chores dynamically
  - Monthly summary reports
  - “Chore streaks” and light gamification
  - Notifications/reminders when no chores logged by a user in 7 days
  - Simple user authentication if expanding beyond tight friend group

# Logical Dependency Chain  

1. **Set up basic storage and chore data model** (foundation)
2. **Create name selection screen (I AM screen)** (identity first)
3. **Create chore logging screen with time-weighted chore buttons** (core action flow)
4. **Create dashboard/histogram to visualize contributions** (feedback loop)
5. **Polish UX (animations, colors, responsive behavior)**
6. **Optional: Add real authentication or dynamic list management** (future scaling)

# Risks and Mitigations  

- **Technical Challenges**
  - Risk: Overengineering MVP.
    - Mitigation: Focus strictly on hardcoded first version; avoid feature creep.
  
- **MVP Focus Risk**
  - Risk: Building too many features before getting real feedback.
    - Mitigation: Release minimal, usable version immediately to test daily behavior.

- **Resource Constraints**
  - Risk: Limited time or funding to host/maintain app.
    - Mitigation: Use free-tier hosting initially and minimal backend complexity.

# Appendix  

- **Research Findings**
  - Existing chore apps (Tody, OurHome) don’t solve flexible “anyone can do any task” fairness well.
  - Existing roommate complaints highlight chore resentment as a major cause of conflict.

- **Technical Specifications**
  - Option to use a React front-end (mobile or responsive web app)
  - Firebase/Supabase for back-end and database
  - Basic charting library for histogram (e.g., Chart.js, Recharts)

</PRD>

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## High level plan

### Idea
- Chore tracking app to help roomates equitibly distribute household tasks and keep each other accountable
- No more: Add up the percentage that everyone says they did and it's somehow 300%
  
#### Features
MVP: high priority
- As a user i can join a group by following a link
- As a user i can log a chore
- As a user i can see a list of all logged chores
- As a user i can see a histogram of how many chores each person in the group has done
- As a user i can edit the list of chores that need to get done for my group

Nice to have:
- As a user who has done the most chores this period, i can prioritize the chores that need to get done
- As a user i can get more points for doing high priority chores

Intentional limitations:
- No authentication
- Can only join a single group


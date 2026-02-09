### Skill Exchange and Micro-Collaboration Network for Informal and Local Workforce

#### How do i init the  project?
1. Make sure you have latest bun on your machine
2. Run `bun i` to install the dependencies
3. Run `bun dev` to start the development server
4. For lint & formatting, run `bun check` - you can't commit if you have linting or formatting errors
5. For type checking, run `bun check-types`

#### Structure of the project ?
Uses a monorepo structure with a single application & a shared package for shadcn/ui components. 
To import any component from the shared package, use `@bitwork/ui/components/button` for example.
Check the `packages/ui` folder for all the shared components and utilities.

#### Why turbo monorepo?
nah i am too lazy to write this
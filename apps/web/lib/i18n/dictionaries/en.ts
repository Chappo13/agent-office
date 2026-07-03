import type { Dictionary } from "./ru";

export const en: Dictionary = {
  meta: {
    title: "AI Office",
  },
  brand: {
    prefix: "AI",
    name: "Office",
    mark: "A",
  },
  nav: {
    office: "Office",
    tasks: "Tasks",
    tasksBadge: "3",
    activity: "Activity",
    artifacts: "Artifacts",
  },
  sidebar: {
    coordinatorLabel: "Coordinator",
    coordinatorName: "Alice",
    coordinatorRole: "Coordinator · online",
    teamLabel: "Team · 2 agents",
    bobName: "Bob",
    bobRole: "Researcher · thinking",
    hireName: "Hire an agent",
    hireRole: "choose a role",
    settings: "Settings",
    support: "Support",
    userName: "Sergio",
    userRole: "Owner · no plan",
    creditsLabel: "Credits this month",
    creditsValue: "80",
  },
  topbar: {
    teamSwitch: "Team “Launch”",
    onlinePill: "2 agents online",
    tier: "⚡ Balanced · cheap",
    langRu: "RU",
    langEn: "EN",
  },
  office: {
    caption: "Office · isometric",
    hintPrefix:
      "Click an agent → open a private chat. Real art (webp background + sprites) lands in step",
    hintStep: "A2",
    agentA: "Alice",
    agentB: "Bob",
  },
  chat: {
    title: "Coordinator",
    subtitle: "all tasks land here",
    userMessage:
      "Pull together 5 competitors in our niche and give a short summary of what each is strong at.",
    userWho: "You · just now",
    aliceMessage:
      "Split it into subtasks: Bob is researching and profiling competitors, I'm compiling the table. First results in a couple of minutes.",
    aliceWho: "Alice · Coordinator",
    bobTyping: "searching the web…",
    bobWho: "Bob · Researcher",
    tones: {
      neutral: "Neutral",
      friendly: "Friendly",
      formal: "Formal",
    },
    chips: {
      hints: "Coordinator hints",
      refocus: "Refocus",
      constraint: "New constraint",
      status: "Status update",
    },
    composerPlaceholder: "Message the Coordinator or the selected agent…",
    modelLabel: "Model:",
    modelTier: "⚡ Balanced",
    send: "Send",
  },
};

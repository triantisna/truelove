import type { OccasionSlug } from "@/types/template";

export const categories: Array<{
  slug: OccasionSlug;
  emoji: string;
  name: string;
  description: string;
}> = [
  { slug: "anniversary", emoji: "❤️", name: "Anniversary", description: "Celebrate your time together." },
  { slug: "love-letter", emoji: "💌", name: "Love Letter", description: "Turn a heartfelt message into an experience." },
  { slug: "apology", emoji: "🥺", name: "Apology", description: "Say sorry with more thought and effort." },
  { slug: "birthday", emoji: "🌹", name: "Birthday Surprise", description: "A surprise link made just for them." },
  { slug: "proposal", emoji: "💍", name: "Proposal", description: "Build up to one unforgettable question." },
  { slug: "date-invitation", emoji: "☕", name: "Date Invitation", description: "Invite them out in a playful way." },
  { slug: "our-story", emoji: "📖", name: "Our Story", description: "Tell your relationship from chapter one." }
];

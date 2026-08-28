import type { TemplateDefinition } from "@/types/template";

export const templates: TemplateDefinition[] = [
  {
    id: "love-letter-01",
    name: "Dear You",
    category: "love-letter",
    description: "Interactive letter with a romantic reveal.",
    previewImage: "/placeholders/love-letter-01.svg",

    schema: {
      fields: [
        {
          key: "sender_name",
          type: "text",
          label: "Sender Name",
          placeholder: "Your name",
          required: true
        },
        {
          key: "receiver_name",
          type: "text",
          label: "Receiver Name",
          placeholder: "Their name",
          required: true
        },
        {
          key: "title",
          type: "text",
          label: "Title",
          placeholder: "A little thing for you",
          required: true
        },
        {
          key: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Write something from your heart...",
          required: false
        },
        {
          key: "photos",
          type: "media",
          label: "Photos",
          description: "Photos will be uploaded in the media phase.",
          multiple: true
        },
        {
          key: "music",
          type: "music",
          label: "Background Music",
          placeholder: "https://..."
        }
      ]
    },

    active: true
  },

  {
    id: "anniversary-01",
    name: "Forever With You",
    category: "anniversary",
    description:
      "Anniversary experience with memories and a date counter.",
    previewImage: "/placeholders/anniversary-01.svg",

    schema: {
      fields: [
        {
          key: "sender_name",
          type: "text",
          label: "Sender Name",
          placeholder: "Your name",
          required: true
        },
        {
          key: "receiver_name",
          type: "text",
          label: "Receiver Name",
          placeholder: "Their name",
          required: true
        },
        {
          key: "title",
          type: "text",
          label: "Title",
          placeholder: "Forever With You",
          required: true
        },
        {
          key: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Write your anniversary message...",
          required: false
        },
        {
          key: "event_date",
          type: "date",
          label: "Anniversary Date",
          required: true
        },
        {
          key: "photos",
          type: "media",
          label: "Photos",
          description: "Photos will be uploaded in the media phase.",
          multiple: true
        },
        {
          key: "music",
          type: "music",
          label: "Background Music",
          placeholder: "https://..."
        }
      ]
    },

    active: true
  },

  {
    id: "apology-01",
    name: "Can We Try Again?",
    category: "apology",
    description:
      "A softer way to apologize and communicate intent.",
    previewImage: "/placeholders/apology-01.svg",

    schema: {
      fields: [
        {
          key: "sender_name",
          type: "text",
          label: "Sender Name",
          placeholder: "Your name",
          required: true
        },
        {
          key: "receiver_name",
          type: "text",
          label: "Receiver Name",
          placeholder: "Their name",
          required: true
        },
        {
          key: "title",
          type: "text",
          label: "Title",
          placeholder: "Can We Try Again?",
          required: true
        },
        {
          key: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Write your apology...",
          required: false
        },
        {
          key: "photos",
          type: "media",
          label: "Photos",
          description: "Photos will be uploaded in the media phase.",
          multiple: true
        },
        {
          key: "music",
          type: "music",
          label: "Background Music",
          placeholder: "https://..."
        }
      ]
    },

    active: false
  },

  {
    id: "birthday-01",
    name: "Your Day",
    category: "birthday",
    description:
      "Birthday countdown, photos, wishes, and surprise reveal.",
    previewImage: "/placeholders/birthday-01.svg",

    schema: {
      fields: [
        {
          key: "sender_name",
          type: "text",
          label: "Sender Name",
          placeholder: "Your name",
          required: true
        },
        {
          key: "receiver_name",
          type: "text",
          label: "Receiver Name",
          placeholder: "Their name",
          required: true
        },
        {
          key: "title",
          type: "text",
          label: "Title",
          placeholder: "Your Day",
          required: true
        },
        {
          key: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Write a birthday message...",
          required: false
        },
        {
          key: "event_date",
          type: "date",
          label: "Birthday Date",
          required: true
        },
        {
          key: "photos",
          type: "media",
          label: "Photos",
          description: "Photos will be uploaded in the media phase.",
          multiple: true
        },
        {
          key: "music",
          type: "music",
          label: "Background Music",
          placeholder: "https://..."
        }
      ]
    },

    active: false
  },

  {
    id: "proposal-01",
    name: "One Question",
    category: "proposal",
    description:
      "A cinematic build-up toward the proposal question.",
    previewImage: "/placeholders/proposal-01.svg",

    schema: {
      fields: [
        {
          key: "sender_name",
          type: "text",
          label: "Sender Name",
          placeholder: "Your name",
          required: true
        },
        {
          key: "receiver_name",
          type: "text",
          label: "Receiver Name",
          placeholder: "Their name",
          required: true
        },
        {
          key: "title",
          type: "text",
          label: "Title",
          placeholder: "One Question",
          required: true
        },
        {
          key: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Write your proposal message...",
          required: false
        },
        {
          key: "event_date",
          type: "date",
          label: "Proposal Date",
          required: false
        },
        {
          key: "photos",
          type: "media",
          label: "Photos",
          description: "Photos will be uploaded in the media phase.",
          multiple: true
        },
        {
          key: "music",
          type: "music",
          label: "Background Music",
          placeholder: "https://..."
        }
      ]
    },

    active: false
  },

  {
    id: "date-01",
    name: "Coffee With Me?",
    category: "date-invitation",
    description:
      "A playful interactive invitation for a date.",
    previewImage: "/placeholders/date-01.svg",

    schema: {
      fields: [
        {
          key: "sender_name",
          type: "text",
          label: "Sender Name",
          placeholder: "Your name",
          required: true
        },
        {
          key: "receiver_name",
          type: "text",
          label: "Receiver Name",
          placeholder: "Their name",
          required: true
        },
        {
          key: "title",
          type: "text",
          label: "Title",
          placeholder: "Coffee With Me?",
          required: true
        },
        {
          key: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Write your invitation...",
          required: false
        },
        {
          key: "event_date",
          type: "date",
          label: "Date",
          required: false
        },
        {
          key: "photos",
          type: "media",
          label: "Photos",
          description: "Photos will be uploaded in the media phase.",
          multiple: true
        },
        {
          key: "music",
          type: "music",
          label: "Background Music",
          placeholder: "https://..."
        }
      ]
    },

    active: false
  },

  {
    id: "our-story-01",
    name: "Our Chapters",
    category: "our-story",
    description:
      "Relationship timeline and memory chapters.",
    previewImage: "/placeholders/our-story-01.svg",

    schema: {
      fields: [
        {
          key: "sender_name",
          type: "text",
          label: "Sender Name",
          placeholder: "Your name",
          required: true
        },
        {
          key: "receiver_name",
          type: "text",
          label: "Receiver Name",
          placeholder: "Their name",
          required: true
        },
        {
          key: "title",
          type: "text",
          label: "Title",
          placeholder: "Our Chapters",
          required: true
        },
        {
          key: "message",
          type: "textarea",
          label: "Message",
          placeholder: "Tell your story...",
          required: false
        },
        {
          key: "event_date",
          type: "date",
          label: "Important Date",
          required: false
        },
        {
          key: "photos",
          type: "media",
          label: "Photos",
          description: "Photos will be uploaded in the media phase.",
          multiple: true
        },
        {
          key: "music",
          type: "music",
          label: "Background Music",
          placeholder: "https://..."
        }
      ]
    },

    active: true
  }
];

export function getTemplateById(id: string) {
  return templates.find((template) => template.id === id);
}
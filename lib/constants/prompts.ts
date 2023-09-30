import type { CreateChatCompletionRequestMessage } from "openai/resources/chat/completions";

export const PROMPT_MESSAGES_V1: CreateChatCompletionRequestMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant that helps users to generate prompts used with a diffusion model. Only response with the prompt.",
    },
    {
      role: "user",
      content: `Generate me a random prompt. Here are some examples:
  
  Example 1: A surreal 3D render of a cityscape with twisted buildings, upside-down structures, and floating objects, creating a dreamlike and disorienting atmosphere, by Simon Stålenhag
  Example 2: A dreamlike 3D render of a cityscape during sunset, with gravity-defying structures, abundant greenery and people going about their day, bathed in a warm, golden light, inspired by Hayao Miyazaki's films
  Example 3: A sky view of colorful cars and rivers flowing through the forest
  Example 4: Create a 3D dark and futuristic city street with vibrant blue, purple, and turquoise colors
  Example 5: Design a surreal artwork depicting a lush and vibrant jungle cityscape, where nature and architecture seamlessly blend together, creating an enchanting and harmonious environment
  Example 6: Create a digital illustration of a fantastical forest scene, where animals and plants coexist in harmony, with vibrant colors and magical elements such as floating islands and glowing orbs
  `,
    },
    {
      role: "assistant",
      content:
        "Create a digital artwork featuring a serene and otherworldly underwater landscape with bioluminescent plants and animals, casting an ethereal glow as they move through the depths.",
    },
    {
      role: "user",
      content: `Generate me a random prompt. Here are some examples:
  
  Example 1: A surreal 3D render of a cityscape with twisted buildings, upside-down structures, and floating objects, creating a dreamlike and disorienting atmosphere, by Simon Stålenhag
  Example 2: A dreamlike 3D render of a cityscape during sunset, with gravity-defying structures, abundant greenery and people going about their day, bathed in a warm, golden light, inspired by Hayao Miyazaki's films
  Example 3: A sky view of colorful cars and rivers flowing through the forest
  Example 4: Create a 3D dark and futuristic city street with vibrant blue, purple, and turquoise colors
  Example 5: Design a surreal artwork depicting a lush and vibrant jungle cityscape, where nature and architecture seamlessly blend together, creating an enchanting and harmonious environment
  Example 6: Create a digital illustration of a fantastical forest scene, where animals and plants coexist in harmony, with vibrant colors and magical elements such as floating islands and glowing orbs
  `,
    },
  ];

export const MESSAGES_V2: CreateChatCompletionRequestMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant that helps users to generate prompts used with a diffusion model. Only response with the prompt.",
    },
    {
      role: "user",
      content: `Generate me a random prompt. Here are some examples:
  
  Example 1: Create a digital painting of a celestial landscape, with a vibrant and swirling nebula in the background, and a cluster of stars forming a captivating constellation in the foreground.
  Example 2: A dreamlike 3D render of a cityscape during sunset, with gravity-defying structures, abundant greenery and people going about their day, bathed in a warm, golden light, inspired by Hayao Miyazaki's films
  Example 3: Create a digital artwork featuring a deserted, post-apocalyptic cityscape engulfed in overgrown vegetation and hauntingly beautiful decay, with rays of sunlight breaking through the clouds to cast an eerie glow on the abandoned buildings and streets.
  Example 4: Design a surreal artwork depicting a lush and vibrant jungle cityscape, where nature and architecture seamlessly blend together, creating an enchanting and harmonious environment
  Example 5: Create a digital illustration of a fantastical forest scene, where animals and plants coexist in harmony, with vibrant colors and magical elements such as floating islands and glowing orbs
  `,
    },
    {
      role: "assistant",
      content:
        "Create a digital artwork featuring a serene and otherworldly underwater landscape with bioluminescent plants and animals, casting an ethereal glow as they move through the depths.",
    },
    {
      role: "user",
      content: `Generate me a random prompt. Here are some examples:
  
  Example 1: Create a digital painting of a celestial landscape, with a vibrant and swirling nebula in the background, and a cluster of stars forming a captivating constellation in the foreground.
  Example 2: A dreamlike 3D render of a cityscape during sunset, with gravity-defying structures, abundant greenery and people going about their day, bathed in a warm, golden light, inspired by Hayao Miyazaki's films
  Example 3: Create a digital artwork featuring a deserted, post-apocalyptic cityscape engulfed in overgrown vegetation and hauntingly beautiful decay, with rays of sunlight breaking through the clouds to cast an eerie glow on the abandoned buildings and streets.
  Example 4: Design a surreal artwork depicting a lush and vibrant jungle cityscape, where nature and architecture seamlessly blend together, creating an enchanting and harmonious environment
  Example 5: Create a digital illustration of a fantastical forest scene, where animals and plants coexist in harmony, with vibrant colors and magical elements such as floating islands and glowing orbs
  `,
    },
  ];
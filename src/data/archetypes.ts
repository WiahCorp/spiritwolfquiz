/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArchetypeDetails } from "../types";

export const wolfArchetypes: Record<"A" | "B" | "C" | "D", ArchetypeDetails> = {
  A: {
    id: "A",
    name: "Guardian Wolf",
    emoji: "🐺",
    title: "The Devoted Protector",
    description: "The steadfast anchor of the pack. You hold territory with quiet grit, stepping into conflict to shield the vulnerable. Your strength is a sanctuary.",
    realWolf: {
      name: "Wolf 907F",
      image: "/src/assets/images/guardian_wolf_1780419726112.png",
      story: "907F’s leadership helped hold her pack together even during some of its most difficult periods. As she and her sister 969F were old enough, they both competed for leadership, with control of the female leadership position shifting back and forth and creating tension within the group. During one particularly difficult moment, while 907F was pregnant, 969F maintained control of the den area and core territory, leaving 907F pushed out.\n\nLeft on her own, 907F made the hard decision to leave the area so she could safely give birth.\n\nWith the support of two loyal males, 996M and 1048M, she went on to raise three healthy pups that season. Her decision to step away, guided by patience, wisdom, and protection, reflected her deep commitment to her offspring and the long-term stability of her pack.",
    },
    mirrorParagraph: "You are driven by a deep instinct to protect what matters. When others hesitate, you step forward to create safety and stability. Like 907F, who made the difficult choice to leave in order to protect her unborn pups, you understand that love sometimes means choosing what is uncomfortable to keep your loved ones safe.\n\nYou are the presence that holds things together and the reason others feel safe enough to keep going.",
  },
  B: {
    id: "B",
    name: "Trailblazer Wolf",
    emoji: "🐺",
    title: "The Explorer",
    description: "The wild tracker of new frontiers. You refuse to let boundaries contain you, relying on absolute freedom and unquenchable curiosity to lead the way.",
    realWolf: {
      name: "Wolf Ella",
      image: "/src/assets/images/trailblazer_wolf_1780419738209.png",
      story: "Ella is a young, brave Mexican gray wolf who followed her heart and made a long journey toward Mount Taylor: an area where wolves historically roamed and that holds rich wildlife and open habitat.\n\nEven though society had drawn boundaries around where she was “supposed” to be, she moved beyond them, guided instead by instinct. Ella reminds us that life isn’t about living within boundaries, but having the courage to follow your heart and not letting the limits of society define you.",
    },
    mirrorParagraph: "You refuse to be caged by routines, expectations, or toxic environments that drain your spirit. When life gets stagnant, your soul commands you to move, seek, and redefine what is possible. You are a trailblazer because your exploration is what reveals fresh horizons. Your willingness to walk into the unknown is exactly what helps the pack find new seasons of potential.",
  },
  C: {
    id: "C",
    name: "Visionary Wolf",
    emoji: "🐺",
    title: "The Strategic Architect",
    description: "The tactical mastermind who sees the forest beyond the trees. You synthesize ideas to shape a better future, guiding your pack through insight.",
    realWolf: {
      name: "Wolf 8",
      image: "/src/assets/images/visionary_wolf_1780419782096.png",
      story: "Wolf 8 began as the smallest in his litter, often bullied by his siblings, and overlooked. As a yearling, he defied expectations, joining a widowed alpha female and stepping up to help raise her pups and protect them as his own.\n\nHe was known for fiercely defending his family, defeating rival males larger than himself, and showing remarkable compassion by sparing their lives. His legacy extended far beyond his own achievements because he helped raise a lineage of powerful leaders, including Wolf 21, who became one of the most influential wolves in Yellowstone and carried forward Wolf 8’s strength, empathy, and compassion.",
    },
    mirrorParagraph: "You operate several steps ahead of the world around you. While others are focused on the chaos of the immediate present, you are already building for the future. You are a visionary because your mind is constantly synthesizing ideas, waiting for the right moment to structure meaningful, lasting change. Your wisdom gives direction to the wild energy of the packs.",
  },
  D: {
    id: "D",
    name: "Soul Wolf",
    emoji: "🐺",
    title: "The Intuitive Connector",
    description: "The emotional center and inner compass of the pack. You sense the unspoken undercurrents of life, guiding others through deep empathy, intuition, and emotional awareness.",
    realWolf: {
      name: "Wolf Taylor",
      image: "/src/assets/images/soul_wolf_1780419795731.png",
      story: "Taylor was a Mexican gray wolf who was deeply guided by his intuition. Time and again, humans captured and relocated him, carrying him far from the place they believed he should be. Yet each time, Taylor returned to Mount Taylor. Taylor reminds us that the best path is not the one that society has imposed onto you, but the one your heart feels is right.",
    },
    mirrorParagraph: "As a Soul Wolf, you are guided by something deeper than logic, expectation, or the opinions of others. You have an innate ability to sense when something feels true for you, even when you cannot fully explain why.\n\nYour strength is your intuition. This inner guidance helps you navigate uncertainty, trust your instincts, and make choices that honor your authentic self.",
  },
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Since this is a Vercel serverless function, we define the standard handler
import type { VercelRequest, VercelResponse } from "@vercel/node";

const archetypesMap: Record<string, { name: string; title: string }> = {
  A: { name: "Guardian Wolf", title: "The Devoted Protector" },
  B: { name: "Trailblazer Wolf", title: "The Explorer" },
  C: { name: "Visionary Wolf", title: "The Strategic Architect" },
  D: { name: "Soul Wolf", title: "The Intuitive Connector" }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method Not Allowed" });
  }

  try {
    // Step 1: Read request body
    const { email, archetype } = req.body;
    console.log("[Klaviyo Endpoint] Received subscribe request body:", JSON.stringify(req.body));

    if (!email) {
      return res.status(400).json({ status: "error", message: "Email is required" });
    }

    // Resolve archetype info
    let archetypeName = "Unknown";
    let archetypeTitle = "Unknown";
    if (archetype && typeof archetype === "string") {
      const arch = archetypesMap[archetype.toUpperCase()];
      if (arch) {
        archetypeName = arch.name;
        archetypeTitle = arch.title;
      }
    }

    // Step 3: Use environment variables
    const apiKey = process.env.KLAVIYO_API_KEY;
    const listId = process.env.KLAVIYO_LIST_ID;
    console.log("API Key exists:", !!apiKey);
    console.log("List ID:", listId);

    // Handle simulation mode if API key is not configured
    if (!apiKey) {
      const simMessage = "Subscribed successfully in simulation mode.";
      console.log(`[Klaviyo Simulation] Email captured: ${email} with archetype: ${archetypeName} (${archetypeTitle}). Marketing subscription consent: SUBSCRIBED. Allowed to enter all flows and campaigns. To map this to real Klaviyo profiles, configure KLAVIYO_API_KEY in settings.`);
      return res.status(200).json({
        status: "success",
        message: simMessage,
        email,
        archetype: {
          id: archetype || null,
          name: archetypeName,
          title: archetypeTitle
        }
      });
    }

    // Step 2 & 4: Send to Klaviyo API with consent SUBSCRIBED and SINGLE_OPT_IN
    // Note: custom_source is placed under custom properties since it's not a standard root profile attribute in v3.
    const bodyPayload = {
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email: email,
                  properties: {
                    "custom_source": "Spirit Wolf Quiz",
                    "Spirit Wolf Archetype": archetypeName,
                    "Spirit Wolf Title": archetypeTitle,
                    "Consent Status": "subscribed",
                    "Marketing Opt-In": "True"
                  },
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: "SUBSCRIBED",
                        consented_at: new Date().toISOString(),
                        method: "SINGLE_OPT_IN",
                        method_detail: "Spirit Wolf Quiz Website"
                      }
                    }
                  }
                }
              }
            ]
          }
        },
        relationships: {
          list: {
            data: {
              type: "list",
              id: listId || "DefaultList"
            }
          }
        }
      }
    };

    console.log("Klaviyo payload:", JSON.stringify(bodyPayload, null, 2));
    console.log("[Klaviyo Endpoint] Sending payload to Klaviyo:", JSON.stringify(bodyPayload, null, 2));

    const response = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${apiKey}`,
        "revision": "2024-10-15",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(bodyPayload)
    });

    console.log("[Klaviyo Endpoint] Klaviyo response status:", response.status);

    const data = await response.json();

    // Step 5: Debug (optional but recommended)
    console.log("[Klaviyo Endpoint] Klaviyo response body:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Klaviyo Status:", response.status);
      console.error("List ID:", listId);
      console.error("API Key exists:", !!apiKey);
      console.error("Klaviyo Error Response:", JSON.stringify(data, null, 2));
      console.error("[Klaviyo Core Error] Response details:", JSON.stringify(data));
      return res.status(response.status).json({
        status: "error",
        message: "Klaviyo rejected profile registration",
        details: data,
        sentPayload: bodyPayload
      });
    }

    // Successful Response
    return res.status(200).json({
      status: "success",
      message: "Profile subscribed successfully",
      job: data
    });
  } catch (error: any) {
    console.error("[Klaviyo Server Error] Exception during subscription:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server exception during subscription",
      error: error.message || String(error)
    });
  }
}

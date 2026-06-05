/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { wolfArchetypes } from "./src/data/archetypes";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request body parser
  app.use(express.json());

  // Klaviyo email subscription proxy route
  app.post("/api/subscribe", async (req, res) => {
    const { email, archetype } = req.body;
    if (!email) {
      return res.status(400).json({ status: "error", message: "Email is required" });
    }

    // Resolve archetype details if available
    let archetypeName = "Unknown";
    let archetypeTitle = "Unknown";
    if (archetype && (archetype === "A" || archetype === "B" || archetype === "C" || archetype === "D")) {
      const arch = wolfArchetypes[archetype];
      if (arch) {
        archetypeName = arch.name;
        archetypeTitle = arch.title;
      }
    }

    const apiKey = process.env.KLAVIYO_API_KEY;
    const listId = process.env.KLAVIYO_LIST_ID;

    if (!apiKey) {
      console.log(`[Klaviyo Simulation] Email captured: ${email} with archetype: ${archetypeName} (${archetypeTitle}). Marketing subscription consent: SUBSCRIBED. Allowed to enter all flows and campaigns. To map this to real Klaviyo profiles, configure KLAVIYO_API_KEY in settings.`);
      return res.json({
        status: "simulated_success",
        message: "Subscribed successfully in simulation mode.",
        email,
        archetype: {
          id: archetype || null,
          name: archetypeName,
          title: archetypeTitle
        }
      });
    }

    try {
      // Modern Klaviyo V3 bulk profile subscription creation API
      // Explicitly sets marketing consent to "SUBSCRIBED" using SINGLE_OPT_IN to allow entering flows immediately
      const response = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
        method: "POST",
        headers: {
          "Authorization": `Klaviyo-API-Key ${apiKey}`,
          "revision": "2024-10-15",
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          data: {
            type: "profile-subscription-bulk-create-job",
            attributes: {
              profiles: {
                data: [
                  {
                    type: "profile",
                    attributes: {
                      email: email,
                      custom_source: "Spirit Wolf Quiz",
                      properties: {
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
        })
      });

      const data: any = await response.json();

      if (!response.ok) {
        console.error("[Klaviyo Core Error] Response details:", JSON.stringify(data));
        return res.status(response.status).json({
          status: "error",
          message: "Klaviyo rejected profile registration",
          details: data,
        });
      }

      console.log(`[Klaviyo API Sync Success] Profile created/updated: ${email} with archetype ${archetypeName}. Subscribed with explicit consent.`);
      return res.json({
        status: "success",
        message: "Profile subscribed to target list successfully with active marketing consent.",
        job: data,
      });
    } catch (error: any) {
      console.error("[Klaviyo Server Error] Exception during proxy:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server exception during subscription proxy",
        error: error.message || String(error),
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express Backend] Spirit Wolf server booted on http://0.0.0.0:${PORT}`);
  });
}

startServer();

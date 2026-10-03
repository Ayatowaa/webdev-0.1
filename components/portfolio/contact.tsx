"use client";
import { useState } from "react";
import { profile } from "@/lib/profile";
export function Contact() {
  const [copyState, setCopyState] = useState("");
  return (
    <section className="contact-section wrap" id="contact">
      <div>
        <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
        <h2>
          Let’s build
          <br />
          <span>your next thing.</span>
        </h2>
        <p>Tell me what you’re building, what you need, and your timeline.</p>
      </div>
      <div className="contact-actions">
        <a
          className="button bright"
          href={`mailto:${profile.email}?subject=Project%20enquiry`}
        >
          Start a conversation
        </a>
        <button
          className="text-button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(profile.email);
              setCopyState("Email copied.");
            } catch {
              setCopyState("Please select and copy the email address below.");
            }
          }}
        >
          Copy email address
        </button>
        <p className="email-text">{profile.email}</p>
        <p role="status">{copyState}</p>
      </div>
    </section>
  );
}

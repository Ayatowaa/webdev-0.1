"use client";
import { useState } from "react";
import { profile } from "@/lib/profile";
export function Contact() {
  const [copyState, setCopyState] = useState("");
  async function copyContact(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState(`${label} copied.`);
    } catch {
      setCopyState(`Please select and copy the ${label.toLowerCase()} below.`);
    }
  }
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
          onClick={() => copyContact(profile.email, "Email address")}
        >
          Copy email address
        </button>
        <p className="email-text">{profile.email}</p>
        <div className="contact-details">
          <a className="contact-detail" href={`tel:${profile.phone}`}>
            <span>Phone</span>
            <strong>{profile.phoneDisplay}</strong>
          </a>
          <div className="contact-detail">
            <span>Discord</span>
            <strong>{profile.discord}</strong>
            <button
              className="text-button"
              onClick={() => copyContact(profile.discord, "Discord username")}
            >
              Copy username
            </button>
          </div>
        </div>
        <p role="status" aria-live="polite">{copyState}</p>
      </div>
    </section>
  );
}

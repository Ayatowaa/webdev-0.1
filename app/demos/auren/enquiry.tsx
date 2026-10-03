"use client";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export function EnquiryForm() {
  const [service, setService] = useState("Residential architecture");
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="form-row">
        <label className="field">
          Your name
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Alex Taylor"
            onChange={() => setSubmitted(false)}
          />
        </label>
        <label className="field">
          Email address
          <input
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder="alex@example.com"
            onChange={() => setSubmitted(false)}
          />
        </label>
      </div>
      <div className="field">
        <span id="service-label">What do you have in mind?</span>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger
            aria-labelledby="service-label"
            className="w-full bg-white h-12"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              "Residential architecture",
              "Interior design",
              "Spatial consultation",
            ].map((x) => (
              <SelectItem value={x} key={x}>
                {x}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <label className="field">
        A little about your project
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          placeholder="Your space, your ideas, your timeline…"
          onChange={() => setSubmitted(false)}
        />
      </label>
      <button className="button dark-button" type="submit">
        Preview enquiry
      </button>
      {submitted && (
        <p className="feedback" role="status">
          Your {service.toLowerCase()} enquiry passed validation. This is a demo
          only — no message was sent or stored.
        </p>
      )}
    </form>
  );
}

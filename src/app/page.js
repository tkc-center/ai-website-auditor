"use client";

import { useState } from "react";

export default function Home() {

  const [url, setUrl] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeWebsite = async () => {
    try {

      setLoading(true);
      setScore(null);

      const formattedUrl = url.startsWith("http")
        ? url
        : `https://${url}`;

      if (!url.trim()) {
        alert("Bitte geben Sie eine URL ein.");
        setLoading(false);
        return;
        }

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: formattedUrl,
        }),
      });

      const data = await res.json();

      console.log("API RESPONSE:", data);

      const categories =
        data?.lighthouseResult?.categories;

      if (!categories) {
        alert("No Lighthouse data returned");
        setLoading(false);
        return;
      }

      const perf =
        categories?.performance?.score ?? 0;

      const seo =
        categories?.seo?.score ?? 0;

      const a11y =
        categories?.accessibility?.score ?? 0;

      const best =
        categories?.["best-practices"]?.score ?? 0;

      const finalScore =
        ((perf + seo + a11y + best) / 4) * 100;

      setScore({
        final: finalScore,
        perf: Number(perf || 0) * 100,
        seo: Number(seo || 0) * 100,
        a11y: Number(a11y || 0) * 100,
        best: Number(best || 0) * 100,
      });

      setLoading(false);

    } catch (error) {

      console.error(error);

      setLoading(false);

      alert("Etwas ist schiefgelaufen");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl">

        <h1 className="text-3xl font-bold text-red-500 text-center mb-6">
          KI WEBSITE AUDITOR
        </h1>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border  p-3 rounded-lg mb-4 text-purple-500"
        />

        <button
          onClick={analyzeWebsite}
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white ${
            loading
            ? "bg-gray-400"
            : "bg-black"
        }`}
        >
          Analyzieren
        </button>

        {loading && (
          <p className="text-center text-red-500 mt-6">
            Website wird analysiert...
          </p>
        )}

        {score && (
          <div className="mt-6 space-y-4">

            <h2 className="text-2xl font-bold text-center text-purple-500">
              Overall Score: {score.final.toFixed(0)}%
            </h2>

            <Bar label="Performance" value={score.perf} />
            <Bar label="SEO" value={score.seo} />
            <Bar label="Accessibility" value={score.a11y} />
            <Bar label="Best Practices" value={score.best} />

          </div>
        )}

      </div>

    </main>
  );
}

function Bar({ label, value }) {

  const safeValue = Number(value || 0);

  return (
    <div>

      <div className="flex justify-between mb-1 text-sm">
        <span>{label}</span>
        <span>{safeValue.toFixed(0)}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">

        <div
          className={`h-3 rounded-full ${
            safeValue > 80
              ? "bg-green-500"
              : safeValue > 50
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{
            width: `${safeValue}%`,
          }}
        />

      </div>

    </div>
  );
}
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
    <main className="relative overflow-hidden min-h-screen flex items-center justify-center p-6">

      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />

      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="absolute bottom-0 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full max-w-xl p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">

        <h1 className="text-4xl font-extrabold text-white text-center mb-6 tracking-wide">

          KI WEBSITE AUDITOR

        </h1>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border  p-3 rounded-lg mb-4 text-white"
        />

        <button
          onClick={analyzeWebsite}
          disabled={loading}
          className={`w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 
            text-white font-bold hover:scale-105 transition duration-300 ${
            loading
            ? "bg-gray-400"
            : "bg-black"
        }`}
        >
          Analyzieren
        </button>

        {loading && (
          <p className="text-center text-white mt-6">
            Website wird analysiert...
          </p>
        )}

        {score && (
          <div className="mt-6 space-y-4">

            <h2 className="text-2xl font-bold text-center text-red">
              Gesamtpunktzahl: {score.final.toFixed(0)}%
            </h2>

            <Bar label="Performance" value={score.perf} />
            <Bar label="SEO" value={score.seo} />
            <Bar label="Zugänglichkeit" value={score.a11y} />
            <Bar label="Bewährte Verfahren" value={score.best} />

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

      <div className="flex justify-between mb-1 text-sm text-white">
        <span>{label}</span>
        <span>{safeValue.toFixed(0)}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 text-purple-500">

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
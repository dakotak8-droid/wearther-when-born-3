import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, CloudSun, Share2, RefreshCw, Gift, Sparkles, Baby, Loader2 } from "lucide-react";

interface WeatherLabel {
  label: string;
  emoji: string;
  mood: string;
}

const WEATHER_LABELS: Record<number, WeatherLabel> = {
  0: { label: "Clear sky", emoji: "☀️", mood: "sunny" },
  1: { label: "Mainly clear", emoji: "🌤️", mood: "sunny" },
  2: { label: "Partly cloudy", emoji: "⛅", mood: "cloudy" },
  3: { label: "Overcast", emoji: "☁️", mood: "cloudy" },
  45: { label: "Fog", emoji: "🌫️", mood: "fog" },
  48: { label: "Depositing rime fog", emoji: "🌫️", mood: "fog" },
  51: { label: "Light drizzle", emoji: "🌦️", mood: "rain" },
  53: { label: "Moderate drizzle", emoji: "🌦️", mood: "rain" },
  55: { label: "Dense drizzle", emoji: "🌧️", mood: "rain" },
  56: { label: "Light freezing drizzle", emoji: "🌧️", mood: "rain" },
  57: { label: "Dense freezing drizzle", emoji: "🌧️", mood: "rain" },
  61: { label: "Slight rain", emoji: "🌧️", mood: "rain" },
  63: { label: "Moderate rain", emoji: "🌧️", mood: "rain" },
  65: { label: "Heavy rain", emoji: "🌧️", mood: "rain" },
  66: { label: "Light freezing rain", emoji: "🌧️", mood: "rain" },
  67: { label: "Heavy freezing rain", emoji: "🌧️", mood: "rain" },
  71: { label: "Slight snow fall", emoji: "❄️", mood: "snow" },
  73: { label: "Moderate snow fall", emoji: "❄️", mood: "snow" },
  75: { label: "Heavy snow fall", emoji: "❄️", mood: "snow" },
  77: { label: "Snow grains", emoji: "❄️", mood: "snow" },
  80: { label: "Slight rain showers", emoji: "🌦️", mood: "rain" },
  81: { label: "Moderate rain showers", emoji: "🌧️", mood: "rain" },
  82: { label: "Violent rain showers", emoji: "⛈️", mood: "storm" },
  85: { label: "Slight snow showers", emoji: "🌨️", mood: "snow" },
  86: { label: "Heavy snow showers", emoji: "🌨️", mood: "snow" },
  95: { label: "Thunderstorm", emoji: "⛈️", mood: "storm" },
  96: { label: "Thunderstorm with hail", emoji: "⛈️", mood: "storm" },
  99: { label: "Thunderstorm with heavy hail", emoji: "⛈️", mood: "storm" },
};

const RESULT_COPY: Record<string, { title: string; story: string; twist: string }> = {
  sunny: {
    title: "A bright little entrance",
    story: "The sky showed up in a good mood that day. Sunshine, soft drama, and the kind of light that feels suspiciously like a main-character arrival.",
    twist: "Basically: your baby did not arrive quietly. They arrived like a tiny celebrity.",
  },
  cloudy: {
    title: "A soft and thoughtful kind of day",
    story: "The weather kept things calm, cozy, and just a little mysterious. The sky was clearly setting the stage for a baby with depth, opinions, and excellent future side-eye.",
    twist: "Not flashy. Just iconic in a low-key way.",
  },
  rain: {
    title: "A rainy-day legend was born",
    story: "A little rain outside, a lot of emotion inside. The world may have been damp, but your family’s story got a brand-new center of gravity that day.",
    twist: "Tiny human. Big entrance. Slight chance of lifelong chaos.",
  },
  snow: {
    title: "Cold outside, unforgettable inside",
    story: "The weather brought the drama in fluffy form. It was the kind of day that feels frozen in time — which is perfect, because this is exactly the sort of moment families replay forever.",
    twist: "Snow on the street. Warmth in the heart. Snacks probably required.",
  },
  storm: {
    title: "The dramatic one has entered the chat",
    story: "Thunder, energy, weather with opinions — honestly, the sky understood the assignment. Some babies are born. Others make an entrance worthy of a full soundtrack.",
    twist: "This was not a subtle arrival. And frankly, why start now?",
  },
  fog: {
    title: "A mysterious little arrival",
    story: "The day came wrapped in haze and softness, like the weather itself knew something special was happening but wanted to keep the reveal cinematic.",
    twist: "Low visibility. Maximum emotional impact.",
  },
};

interface Product {
  title: string;
  description: string;
  cta: string;
  href: string;
}

const PRODUCT_MATCH: Record<string, Product[]> = {
  sunny: [
    {
      title: "Funny Baby Tee for Little Sunshine Energy",
      description: "Perfect for babies who enter the world like they already own the room.",
      cta: "Shop sunny little legend styles",
      href: "#shop",
    },
    {
      title: "Funny Mug for Sleep-Deprived Parents",
      description: "Because sunshine babies still wake people up at 4:52 a.m.",
      cta: "See parent survival mugs",
      href: "#shop",
    },
  ],
  cloudy: [
    {
      title: "Cozy Baby Tee with Big Personality",
      description: "For tiny humans with calm faces and suspiciously strong opinions.",
      cta: "Browse cozy classics",
      href: "#shop",
    },
    {
      title: "Funny Fridge Magnet",
      description: "A small daily reminder that your child was born iconic, not average.",
      cta: "See funny magnets",
      href: "#shop",
    },
  ],
  rain: [
    {
      title: "Superhero Baby Tee",
      description: "For babies whose birth weather already hinted at dramatic plot development.",
      cta: "Explore superhero picks",
      href: "#shop",
    },
    {
      title: "Funny Parent Mug",
      description: "Pairs well with rain, memories, and reheated coffee.",
      cta: "See funny mugs",
      href: "#shop",
    },
  ],
  snow: [
    {
      title: "Funny Baby Tee for Cool Little Legends",
      description: "Cold forecast. Warm family chaos. Great outfit potential.",
      cta: "See winter-born favorites",
      href: "#shop",
    },
    {
      title: "Nursery Decor Gift",
      description: "For the kind of memory that deserves wall-worthy storytelling.",
      cta: "Browse decor ideas",
      href: "#shop",
    },
  ],
  storm: [
    {
      title: "Born-to-be-a-Legend Style",
      description: "For babies who arrived with thunder and have not lowered the volume since.",
      cta: "Shop dramatic arrivals",
      href: "#shop",
    },
    {
      title: "Funny Magnet or Mug",
      description: "Because some birth stories deserve to live on the fridge forever.",
      cta: "See giftable keepsakes",
      href: "#shop",
    },
  ],
  fog: [
    {
      title: "Soft, Playful Baby Tee",
      description: "For little ones who arrived quietly and then built a full personality empire.",
      cta: "Browse soft-story styles",
      href: "#shop",
    },
    {
      title: "Funny Keepsake Gift",
      description: "A sweet reminder of a beautifully mysterious day.",
      cta: "See keepsake ideas",
      href: "#shop",
    },
  ],
};

function formatDisplayDate(dateString: string): string {
  try {
    return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
}

function average(numbers: number[]): number | null {
  if (!numbers?.length) return null;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function pickMoodFromCode(code: number | undefined): string {
  if (code === undefined) return "cloudy";
  return WEATHER_LABELS[code]?.mood || "cloudy";
}

function resolveWeatherDescriptor(code: number | undefined): WeatherLabel {
  if (code === undefined) return { label: "Unknown weather", emoji: "🌤️", mood: "cloudy" };
  return WEATHER_LABELS[code] || { label: "Unknown weather", emoji: "🌤️", mood: "cloudy" };
}

interface ResultData {
  cityInput: string;
  date: string;
  locationName: string;
  weatherLabel: string;
  weatherEmoji: string;
  mood: string;
  title: string;
  story: string;
  twist: string;
  tempC: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precipitation: number | null;
  products: Product[];
}

export default function App() {
  const [date, setDate] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<ResultData | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const maxDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!date || !city.trim()) {
      setError("Please enter both a date and a city.");
      return;
    }

    setLoading(true);

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) throw new Error("Could not find that city.");
      const geoData = await geoRes.json();
      const location = geoData?.results?.[0];

      if (!location) {
        throw new Error("I couldn’t find that city. Try adding a state, province, or country.");
      }

      const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${location.latitude}&longitude=${location.longitude}&start_date=${date}&end_date=${date}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Historical weather could not be loaded.");
      const weatherData = await weatherRes.json();

      const code = weatherData?.daily?.weather_code?.[0];
      const maxTemp = weatherData?.daily?.temperature_2m_max?.[0];
      const minTemp = weatherData?.daily?.temperature_2m_min?.[0];
      const precipitation = weatherData?.daily?.precipitation_sum?.[0];
      
      const tempsToAverage = [minTemp, maxTemp].filter((v): v is number => typeof v === "number");
      const meanTemp = average(tempsToAverage);

      const descriptor = resolveWeatherDescriptor(code);
      const mood = pickMoodFromCode(code);
      const copy = RESULT_COPY[mood] || RESULT_COPY.cloudy;
      const products = PRODUCT_MATCH[mood] || PRODUCT_MATCH.cloudy;

      setResult({
        cityInput: city.trim(),
        date,
        locationName: [location.name, location.admin1, location.country].filter(Boolean).join(", "),
        weatherLabel: descriptor.label,
        weatherEmoji: descriptor.emoji,
        mood,
        title: copy.title,
        story: copy.story,
        twist: copy.twist,
        tempC: typeof meanTemp === "number" ? Math.round(meanTemp) : null,
        tempMax: typeof maxTemp === "number" ? Math.round(maxTemp) : null,
        tempMin: typeof minTemp === "number" ? Math.round(minTemp) : null,
        precipitation: typeof precipitation === "number" ? precipitation : null,
        products,
      });
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!result) return;
    const text = `${result.weatherEmoji} ${result.locationName} — ${formatDisplayDate(result.date)}. ${result.weatherLabel}. ${result.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Baby Birth Weather Story",
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled share
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    } catch {
      // fallback
    }
  }

  function resetForm() {
    setResult(null);
    setError("");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative overflow-x-hidden">
      {/* Dynamic Sleek Interface Radial Blur Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-100/40 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none"></div>

      {/* Nav bar */}
      <nav className="mx-auto max-w-6xl px-6 py-8 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c.7 0 1.2-.6 1.2-1.2V6.2c0-.7-.5-1.2-1.2-1.2h-11c-.7 0-1.2.5-1.2 1.2v11.6c0 .6.5 1.2 1.2 1.2h11z"/><path d="M11 10h2"/><path d="M12 9v2"/><path d="M10 14h4"/></svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 font-display">LittleForecast</span>
        </div>
        <div className="flex gap-6 sm:gap-8 text-sm font-medium text-slate-500">
          <a href="#result-container" className="hover:text-indigo-605 transition-colors">The Story</a>
          <a href="#shop" className="hover:text-indigo-605 transition-colors">Gift Ideas</a>
        </div>
      </nav>

      {/* Hero / Main Section */}
      <main className="mx-auto max-w-6xl px-6 py-8 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Form and Intro */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                Historical Weather Engine
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] text-slate-900 font-display tracking-tight">
                What was the sky <br/><span className="text-indigo-600 font-extrabold">on your Day Zero?</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-[500px] font-light">
                Every entrance has its atmosphere. Enter a birth date and city to reveal the weather from that day—and the story it tells about your little one.
              </p>
            </div>

            <form onSubmit={handleLookup} className="bg-white p-6 sm:p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="birth-date" className="text-xs font-bold uppercase text-slate-400 tracking-widest ml-1 block">Birth Date</label>
                <div className="relative">
                  <input
                    id="birth-date"
                    type="date"
                    max={maxDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="birth-city" className="text-xs font-bold uppercase text-slate-400 tracking-widest ml-1 block">Birth City</label>
                <div className="relative">
                  <input
                    id="birth-city"
                    type="text"
                    placeholder="San Francisco, CA"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="col-span-1 sm:col-span-2 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CloudSun className="h-5 w-5" />}
                Reveal the Weather Story
              </button>

              {error && (
                <p className="col-span-1 sm:col-span-2 text-center text-sm font-semibold text-rose-600">
                  {error}
                </p>
              )}

              <p className="col-span-1 sm:col-span-2 text-center text-xs text-slate-400 font-light">
                Powered by Open-Meteo Historical Archive Data
              </p>
            </form>
          </div>

          {/* Glowing Preview Card of Little Birth Skies */}
          <div className="lg:col-span-5 w-full">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-amber-400 rounded-[48px] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-[#0F172A] rounded-[40px] p-8 sm:p-10 text-white shadow-2xl space-y-6 overflow-hidden">
                <div className="absolute right-0 bottom-0 text-9xl transform translate-x-8 translate-y-8 opacity-10 pointer-events-none">🍼</div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-indigo-400 tracking-widest font-mono">Example Profile</p>
                    <h3 className="text-xl font-semibold font-display">London, Ontario</h3>
                    <p className="text-slate-400 text-sm">May 14, 2024</p>
                  </div>
                  <div className="text-5xl animate-bounce">🌧️</div>
                </div>

                <div className="h-px bg-slate-800 relative z-10"></div>

                <div className="space-y-4 relative z-10">
                  <h2 className="text-2xl sm:text-3xl font-bold leading-tight font-display">A rainy-day legend was born</h2>
                  <p className="text-slate-400 leading-relaxed text-base font-light">
                    A little rain outside, a lot of emotion inside. The world may have been damp, but your family’s story got a brand-new center of gravity that day.
                  </p>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                    <p className="text-amber-300 font-medium italic text-sm">
                      "Tiny human. Big entrance. Slight chance of lifelong chaos."
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 text-center font-mono relative z-10">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">High</p>
                    <p className="text-lg font-bold text-white">18°C</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Low</p>
                    <p className="text-lg font-bold text-white">11°C</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Rain</p>
                    <p className="text-lg font-bold text-white">12mm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Pillars section */}
      <section className="mx-auto max-w-6xl px-6 py-8 z-10 relative">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Nostalgic Keepsakes",
              text: "Renders the ambient climate context of a life-changing day with dynamic writing.",
            },
            {
              icon: Gift,
              title: "Perfect For Sharing",
              text: "Download cards, snap direct sharing hooks, and forward adorable stories to family.",
            },
            {
              icon: CloudSun,
              title: "Product Connections",
              text: "Playfully bridges the story to tees, cozy magnets, nursery custom decor, or coffee mugs.",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-100/50 hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-2xl bg-indigo-50 p-3 text-indigo-600 border border-indigo-100/50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 font-light">{item.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Dynamic Results Container */}
      <section className="mx-auto max-w-6xl px-6 pb-20 z-10 relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <Card className="rounded-[40px] border-0 bg-slate-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                <CardContent className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center relative z-10">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-indigo-400 blur opacity-30 animate-pulse" />
                    <Loader2 className="mb-4 h-12 w-12 animate-spin text-indigo-400 relative" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mt-2">Peering Into Yesterday</h3>
                  <p className="mt-3 max-w-xl text-white/70 font-light text-sm sm:text-base leading-relaxed">
                    Calculating historical coordinates, compiling meteorological archives, and preparing a personalized memory with authentic weather readings.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
              id="result-container"
            >
              <div className="relative group w-full">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-amber-400 rounded-[48px] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="grid lg:grid-cols-12 gap-10 items-stretch">
                    
                    {/* Detailed Meteorological Archive View */}
                    <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1.5 border border-indigo-100/50">
                            <MapPin className="h-4 w-4 text-indigo-500" />
                            {result.locationName}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/60 text-slate-600 px-3 py-1.5">
                            <CalendarDays className="h-4 w-4 text-slate-400" />
                            {formatDisplayDate(result.date)}
                          </span>
                        </div>

                        <div className="flex items-start gap-5">
                          <div className="text-6xl p-4 bg-slate-50 rounded-3xl border border-slate-100/80 shadow-inner select-none">
                            {result.weatherEmoji}
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-650">The Birth Atmosphere</span>
                            <h2 className="mt-1 text-3xl sm:text-4xl font-display font-extrabold text-slate-900 leading-tight">
                              {result.title}
                            </h2>
                            <p className="mt-1 text-slate-500 font-medium text-sm sm:text-base">
                              {result.weatherLabel}{result.tempC !== null ? ` • mean of about ${result.tempC}°C` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 text-lg leading-relaxed text-slate-600 font-light pl-6 border-l-4 border-indigo-150">
                          <p>{result.story}</p>
                          <p className="font-display font-bold text-slate-900 text-xl italic mt-3">
                            "{result.twist}"
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 grid-cols-3 pt-6 border-t border-slate-100 text-center font-mono">
                        <div className="rounded-2xl bg-slate-50/80 px-4 py-3 border border-slate-200/40">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">High Temp</span>
                          <span className="text-lg sm:text-2xl font-extrabold text-slate-800">{result.tempMax ?? "—"}°C</span>
                        </div>
                        <div className="rounded-2xl bg-slate-50/80 px-4 py-3 border border-slate-200/40">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Low Temp</span>
                          <span className="text-lg sm:text-2xl font-extrabold text-slate-800">{result.tempMin ?? "—"}°C</span>
                        </div>
                        <div className="rounded-2xl bg-slate-50/80 px-4 py-3 border border-slate-200/40">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Rain / Snow</span>
                          <span className="text-lg sm:text-2xl font-extrabold text-slate-800">{result.precipitation !== null ? `${result.precipitation} mm` : "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dark Premium Shareable Keepsake Graphic */}
                    <div className="lg:col-span-5 bg-[#0F172A] rounded-[32px] p-8 text-white shadow-xl flex flex-col justify-between border border-slate-800">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 block mb-4">Portrait Badge</span>
                        <div className="rounded-2xl bg-slate-900/60 p-6 border border-slate-800 relative overflow-hidden space-y-4">
                          <div className="absolute right-0 bottom-0 text-9xl transform translate-x-10 translate-y-10 opacity-5 pointer-events-none">🍼</div>
                          <p className="text-xs text-indigo-300 font-mono tracking-widest uppercase">DAY ZERO RECORDS</p>
                          <div className="text-5xl">{result.weatherEmoji}</div>
                          <h3 className="text-2xl font-bold font-display leading-snug">{result.title}</h3>
                          <p className="text-xs text-slate-400 font-mono">{formatDisplayDate(result.date)} • {result.locationName}</p>
                          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-705/30">
                            <p className="text-sm italic text-slate-300 leading-relaxed font-light">"{result.twist}"</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button onClick={handleShare} className="rounded-xl flex-1 bg-white hover:bg-slate-100 text-slate-900 font-bold justify-center py-6 cursor-pointer">
                            <Share2 className="mr-2 h-4 w-4 text-slate-900" />
                            Share Keepsake
                          </Button>
                          <Button onClick={resetForm} variant="outline" className="rounded-xl hover:bg-slate-800 border-slate-850 text-slate-300 hover:text-white justify-center py-6 cursor-pointer">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Another Date
                          </Button>
                        </div>

                        {copiedNotification && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 text-center"
                          >
                            ✓ Text story successfully copied to clipboard!
                          </motion.div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Robust Interactive Product Bridge */}
              <section id="shop" className="space-y-8 pt-4">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 block">SOUVENIR DIRECTIONS</span>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900 leading-tight">
                    Your baby didn&rsquo;t just enter the world — they made an iconic entrance.
                  </h3>
                  <p className="max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                    Celebrate that original birth weather energy on your nursery wall, fridge, or in a cozy matching outfit style.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {result.products.map((product, idx) => (
                    <Card key={idx} className="rounded-[32px] border border-slate-100 bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm">
                      <CardHeader className="p-8 pb-3">
                        <Badge variant="outline" className="w-fit mb-3 bg-indigo-50/50 text-indigo-805 border-indigo-100/60 font-bold uppercase text-[10px] tracking-wider px-2.5 py-1">
                          Atmospheric collection
                        </Badge>
                        <CardTitle className="text-xl font-display font-bold text-slate-900">{product.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 flex flex-col justify-between h-full gap-5">
                        <p className="text-slate-500 text-slate-550 leading-relaxed font-light text-sm sm:text-base">{product.description}</p>
                        <Button className="rounded-xl w-full bg-indigo-650 hover:bg-indigo-750 text-white font-bold tracking-tight text-sm py-5 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer">
                          {product.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="rounded-[40px] border-2 border-dashed border-slate-205 bg-slate-50/15 shadow-none">
                <CardContent className="p-12 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 mb-4 select-none">
                    ☁️
                  </div>
                  <p className="text-base leading-relaxed text-slate-500 max-w-lg mx-auto font-light">
                    Enter a birth date and city above to reveal the historical records and formulate the original keepsake atmosphere, certificate badge, and matching souvenir picks.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white/70 relative z-10 py-10 mt-12">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-xs text-slate-400">
          <div className="space-y-1.5">
            <p className="font-semibold text-slate-600">© 2026 LittleForecast — Turning weather into family legends.</p>
            <p>
              Weather details are derived from authentic meteorological grids. <a className="underline font-medium text-slate-500 hover:text-slate-700" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather data by Open-Meteo.com</a>
            </p>
          </div>
          <div className="flex gap-6 font-medium text-slate-505">
            <span className="cursor-pointer hover:text-slate-805 transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-slate-805 transition-colors">Support</span>
            <span className="cursor-pointer hover:text-slate-805 transition-colors">Partnerships</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

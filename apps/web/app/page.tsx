"use client";
import {
  Download,
  Heart,
  Menu,
  PenTool,
  Share2,
  Users,
  X,
  Zap,
} from "lucide-react";
import { ParallelLinesDoodle } from "./doodleIcons/ParallelLinesDoodle";
import { Button } from "@repo/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-inter">
      <nav className="border-b-2 border-gray-900 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-caveat font-bold text-gray-900">
                  SketchFlow
                </h1>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                About
              </a>
              <Button onClick={() => {router.push("/signin")}}>Start Sketching</Button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-900 hover:text-gray-700"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-gray-900 bg-white">
            <div className="px-4 py-4 space-y-4">
              <a
                href="#features"
                className="block text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#about"
                className="block text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                About
              </a>

              <Button>Start Sketching</Button>
            </div>
          </div>
        )}
      </nav>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-caveat font-bold text-gray-900 mb-8 leading-tight relative">
            
              A Real-Time Canvas, Shared in Seconds — Draw Anything, With Anyone
              
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            A real-time whiteboard built for developers, designers, and
            thinkers.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center mb-16">
            <Button onClick={() => {router.push("/signup")}} >Let's get Started</Button>
          </div>
        </div>
      </section>
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-caveat font-bold text-gray-900 mb-4">
              Why developers & designers love it
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Simple tools that get out of your way
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <PenTool size={32} />,
                title: "Hand-drawn feel",
                description:
                  "Every line feels natural and organic, just like sketching on paper",
              },
              {
                icon: <Users size={32} />,
                title: "Real-time collaboration",
                description:
                  "Work together seamlessly with your team in real-time",
              },
              {
                icon: <Download size={32} />,
                title: "Export anywhere",
                description: "Save as PNG, SVG, or share with a simple link",
              },
              {
                icon: <Share2 size={32} />,
                title: "Easy sharing",
                description:
                  "Share your creations instantly with a single click",
              },
              {
                icon: <Zap size={32} />,
                title: "Lightning fast",
                description:
                  "Start sketching immediately, no loading or setup required",
              },
              {
                icon: <Heart size={32} />,
                title: "Open source",
                description:
                  "Built with love by the community, for the community",
              },
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white border-2 border-gray-900 p-6 transform transition-all duration-200 hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="mb-4 text-gray-900">{feature.icon}</div>
                  <h3 className="text-xl font-caveat font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white border-t-2 border-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-caveat font-bold text-gray-900 mb-4">
              Built With
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Modern tools for a smooth experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "React", description: "UI Library" },
              { name: "TypeScript", description: "Type Safety" },
              { name: "Tailwind CSS", description: "Styling" },
              { name: "Vite", description: "Build Tool" },
              { name: "Canvas API", description: "Drawing" },
              { name: "WebSockets", description: "Real-time" },
            ].map((tech, index) => (
              <div key={index} className="group text-center">
                <div className="bg-gray-50 border-2 border-gray-900 p-4 transform transition-all duration-200 hover:translate-x-1 hover:translate-y-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-caveat font-bold text-gray-900 mb-1">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-light">
                    {tech.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50 border-t-2 border-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-caveat font-bold text-gray-900 mb-6">
              Why I Built This
            </h2>
          </div>

          <div className="bg-white border-2 border-gray-900 p-8 transform rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="transform -rotate-1">
              <div className="space-y-6 text-lg text-gray-700 font-light leading-relaxed">
                <p>
                  As a developer, I found myself constantly needing to sketch
                  out ideas, wireframes, and diagrams. While there are many
                  tools available, I wanted something that felt natural and
                  didn't get in the way of creativity.
                </p>
                <p>
                  Excalidraw inspired me with its hand-drawn aesthetic and
                  simplicity. I decided to build my own version to understand
                  the technical challenges behind creating a collaborative
                  drawing tool and to add my own unique features.
                </p>
                <p>
                  This project taught me about canvas manipulation, real-time
                  collaboration, state management, and the importance of smooth
                  user interactions. It's been an incredible learning journey!
                </p>
              </div>
              <div className="mt-8 text-center">
                <div className="inline-block bg-yellow-100 border-2 border-gray-900 px-4 py-2 transform -rotate-2">
                  <p className="text-sm font-caveat font-bold text-gray-900">
                    Made with ❤️ and lots of ☕
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-yellow-50 border-t-2 border-gray-900">
        <div className="max-w-4xl mx-auto flex justify-center items-center flex-col  text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-caveat font-bold text-gray-900 mb-6">
            Ready to start sketching?
          </h2>
          <p className="text-xl text-gray-600 mb-8 font-light">
            Join thousands of creators who use SketchFlow daily
          </p>

          <button></button>
        </div>
      </section>
      <footer className="border-t-2 border-gray-900 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-caveat font-bold text-gray-900">
                SketchFlow
              </h3>
              <p className="text-gray-600 font-light">
                Virtual whiteboard for creative minds
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors font-light"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors font-light"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors font-light"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm font-light">
              Made with ❤️ for creative minds everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

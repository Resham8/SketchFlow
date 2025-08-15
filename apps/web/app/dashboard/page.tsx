"use client";
import React, { useEffect, useState } from "react";
import { Plus, Users, Calendar, MoreVertical, Edit3, Hash, Copy, Check } from "lucide-react";
import { Button } from "@repo/ui/button";
import { ArrowDoodle } from "../doodleIcons/ArrowDoodle";
import { WavyLinesDoodle } from "../doodleIcons/WavyLinesDoodle";
import { ScribbleDoodle } from "../doodleIcons/ScribbleDoodle";
import { CreateRoomModal } from "../components/CreateRoomModal";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

interface Room {
  id?: string;
  name: string;
  slug: string;
  createdAt?: string;
  lastModified?: string;
  collaborators?: number;
}

interface DashboardProps {
  onSignOut: () => void;
}

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const response = axios
      .get(`${BACKEND_URL}/rooms`, {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => setRooms(response.data.rooms));
      
  }, []);


  const copySlugToClipboard = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(slug);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch (err) {
      console.error('Failed to copy slug:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-16 w-24 h-6 opacity-30 transform -rotate-12 text-blue-500">
          <ArrowDoodle />
        </div>
        <div className="absolute top-32 right-20 w-32 h-20 opacity-25 transform rotate-12 text-purple-500">
          <WavyLinesDoodle />
        </div>
        <div className="absolute bottom-24 left-12 w-20 h-16 opacity-30 transform -rotate-6 text-red-500">
          <ScribbleDoodle className="w-10 h-10" />
        </div>
      </div>

      <header className="border-b-2 border-gray-900 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-caveat font-bold text-gray-900">
                SketchBoard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 font-light">
                  Welcome back,
                </p>
                <p className="font-caveat font-bold text-lg text-gray-900">
                  John Doe
                </p>
              </div>
              <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm underline">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Your Sketch Rooms
          </h2>
          <p className="text-gray-600 font-light">
            Create and manage your collaborative drawing spaces
          </p>
        </div>

        <div className="mb-8">
          <Button
            onClick={() => setShowCreateModal(true)}
            size="lg"
            showArrow
            className="transform hover:translate-x-1 hover:translate-y-1"
          >
            <Plus size={20} />
            Manage Room
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <div key={room.id} className="group">
              <div className="bg-white border-2 border-gray-900 p-6 transform transition-all duration-200 hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                {/* Room Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-caveat font-bold text-gray-900 mb-1">{room.name}</h3>
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-500 font-mono">{room.slug}</span>
                      <button
                        onClick={() => copySlugToClipboard(room.slug)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Copy room slug"
                      >
                        {copiedSlug === room.slug ? (
                          <Check size={14} className="text-green-600" />

                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Room Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={16} className="mr-2" />
                    <span>{room.collaborators} collaborator{room.collaborators !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Modified {room.lastModified}</span>
                  </div>
                </div>

                
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-xs text-gray-500 mb-1 font-inter">Share with team:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white px-2 py-1 border border-gray-300 rounded flex-1 font-mono">
                      sketchboard.com/room/{room.slug}
                    </code>
                    <button
                      onClick={() => copySlugToClipboard(room.slug)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Copy room URL"
                    >
                      {copiedSlug === room.slug ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-gray-900 group-hover:text-white"
                  onClick={() => {router.push(`canvas/${room.id}`)}}
                >
                  <Edit3 size={16} />
                  Open Room
                </Button>
              </div>
            </div>
          ))}


          {rooms.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-50 border-2 border-gray-900 p-8 transform rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="transform -rotate-1">
                  <Edit3 size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-2xl font-caveat font-bold text-gray-900 mb-2">
                    No rooms yet!
                  </h3>
                  <p className="text-gray-600 font-light mb-4">
                    Create your first sketch room to get started
                  </p>
                  <Button onClick={() => setShowCreateModal(true)} showArrow>
                    <Plus size={20} />
                    Create Your First Room
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          
        />
      )}
    </div>
  );
}

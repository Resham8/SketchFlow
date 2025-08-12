import React, { useState } from "react";
import { X, Hash, LogIn, Plus, Users, Check, Copy } from "lucide-react";
import { Input } from "./Input";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { headers } from "next/headers";
import { useRouter } from "next/navigation";

interface CreateRoomModalProps {
  onClose: () => void;
  onCreateRoom: (name: string, slug: string) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onClose,
}) => {
  const [roomName, setRoomName] = useState("");
  const [roomSlug, setRoomSlug] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [isLoading, setIsLoading] = useState(false);
  const [joinSlug, setJoinSlug] = useState("");
  const [slugCopied, setSlugCopied] = useState(false);
  const [roomId, setRoomId] = useState();
  const router = useRouter();

  const generateRandomSlug = (): string => {
    const adjectives = [
      "happy",
      "bright",
      "swift",
      "clever",
      "bold",
      "calm",
      "epic",
      "fun",
      "cool",
      "neat",
    ];
    const nouns = [
      "sketch",
      "draw",
      "board",
      "canvas",
      "room",
      "space",
      "studio",
      "lab",
      "zone",
      "hub",
    ];
    const numbers = Math.floor(Math.random() * 1000);

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adjective}-${noun}-${numbers}`;
  };

  const generateNewSlug = () => {
    setRoomSlug(generateRandomSlug());
    setSlugCopied(false);
  };

  const copySlugToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomSlug);
      setSlugCopied(true);
      setTimeout(() => setSlugCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy slug:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !roomSlug.trim()) return;

    setIsLoading(true);
    const response = await axios.post(
      `${BACKEND_URL}/room`,
      {
        name: roomSlug,
      },
      {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      }
    );

    setRoomId(response.data.roomId);

    setIsLoading(false);
  };

  const isValidSlug = /^[a-z0-9-]+$/.test(roomSlug) && roomSlug.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-gray-900 max-w-md w-full transform rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-gray-50 border-2 border-gray-900 p-6 transform -rotate-1">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-caveat font-bold text-gray-900">
                Create New Room
              </h2>
              <p className="text-gray-600 font-inter">
                Set up your collaborative sketch space
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex mb-6 border-2 border-gray-900 bg-white">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-3 px-4 font-inter font-medium border-r-2 border-gray-900 transition-colors ${
                activeTab === "create"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Plus size={16} className="inline mr-2" />
              Create Room
            </button>
            <button
              onClick={() => setActiveTab("join")}
              className={`flex-1 py-3 px-4 font-inter font-medium transition-colors ${
                activeTab === "join"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <LogIn size={16} className="inline mr-2" />
              Join Room
            </button>
          </div>
          {/* Create Room Tab */}
          {activeTab === "create" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                id="roomName"
                label="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="My Awesome Project"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-inter">
                  Room Slug (Auto-generated)
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 border-2 border-gray-900 bg-gray-50 font-mono text-sm flex items-center gap-2">
                    <Hash size={16} className="text-gray-400" />
                    <span className="flex-1">{roomSlug}</span>
                    <button
                      type="button"
                      onClick={copySlugToClipboard}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Copy slug"
                    >
                      {slugCopied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                     onClick={generateNewSlug}
                  >
                    New
                  </Button>
                </div>
              </div>

              {roomSlug && (
                <div className="bg-blue-50 border-2 border-blue-200 p-3 transform -rotate-1">
                  <p className="text-sm text-blue-800 font-inter">
                    <span className="font-medium font-inter">Room URL:</span>{" "}
                    sketchboard.com/room/{roomSlug}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isLoading}
                  disabled={!roomName.trim()}
                  showArrow
                >
                  Create Room
                </Button>
              </div>
            </form>
          )}

          {/* Join Room Tab */}
          {activeTab === "join" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                id="joinSlug"
                label="Room Slug"
                value={joinSlug}
                onChange={(e) => setJoinSlug(e.target.value.toLowerCase())}
                placeholder="project-wireframes"
                icon={<Hash size={20} className="text-gray-400" />}
                // error={
                //   joinSlug && !isValidSlug
                //     ? "Slug can only contain lowercase letters, numbers, and hyphens"
                //     : undefined
                // }
                required
              />

              {/* {joinSlug && isValidJoinSlug && (
                <div className="bg-green-50 border-2 border-green-200 p-3 transform rotate-1">
                  <p className="text-sm text-green-800 font-inter">
                    <span className="font-medium font-inter">Joining:</span> sketchboard.com/room/{joinSlug}
                  </p>
                </div>
              )} */}

              <div className="bg-blue-50 border-2 border-blue-200 p-4 transform -rotate-1">
                <div className="transform rotate-1">
                  <div className="flex items-start gap-3">
                    <Users size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-caveat font-bold text-blue-900 mb-1">
                        How to join a room:
                      </h4>
                      <ul className="text-sm text-blue-800 font-inter space-y-1">
                        <li>• Get the room slug from a team member</li>
                        <li>• Enter it above to join the collaboration</li>
                        <li>• Start sketching together in real-time!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isLoading}
                  showArrow
                  onCanPlay={() => {router(`canvas/${roomId}`)}}
                >
                  Join Room
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

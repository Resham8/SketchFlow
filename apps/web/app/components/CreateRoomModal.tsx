import React, { useState } from 'react';
import { X, Hash } from 'lucide-react';
import { Input } from './Input';
import { Button } from '@repo/ui/button';

interface CreateRoomModalProps {
  onClose: () => void;
  onCreateRoom: (name: string, slug: string) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, onCreateRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [roomSlug, setRoomSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNameChange = (name: string) => {
    setRoomName(name);
    const autoSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setRoomSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !roomSlug.trim()) return;

    setIsLoading(true);    
    await new Promise(resolve => setTimeout(resolve, 1000));
    onCreateRoom(roomName.trim(), roomSlug.trim());
    setIsLoading(false);
  };

  const isValidSlug = /^[a-z0-9-]+$/.test(roomSlug) && roomSlug.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-gray-900 max-w-md w-full transform rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-gray-50 border-2 border-gray-900 p-6 transform -rotate-1">          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-caveat font-bold text-gray-900">Create New Room</h2>
              <p className="text-gray-600 font-inter">Set up your collaborative sketch space</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">            
            <Input
              type="text"
              id="roomName"
              label="Room Name"
              value={roomName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="My Awesome Project"
              required
            />
            
            <Input
              type="text"
              id="roomSlug"
              label="Room Slug"
              value={roomSlug}
              onChange={(e) => setRoomSlug(e.target.value.toLowerCase())}
              placeholder="my-awesome-project"
              icon={<Hash size={20} className="text-gray-400" />}
              error={roomSlug && !isValidSlug ? 'Slug can only contain lowercase letters, numbers, and hyphens' : undefined}
              required
            />
            
            {roomSlug && isValidSlug && (
              <div className="bg-blue-50 border-2 border-blue-200 p-3 transform -rotate-1">
                <p className="text-sm text-blue-800 font-inter">
                  <span className="font-medium font-inter">Room URL:</span> sketchboard.com/room/{roomSlug}
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
                disabled={!roomName.trim() || !isValidSlug}
                showArrow
              >
                Create Room
              </Button>
            </div>
          </form>
                    
        </div>
      </div>
    </div>
  );
};
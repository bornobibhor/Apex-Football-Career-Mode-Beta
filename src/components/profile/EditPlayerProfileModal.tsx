import React, { useState } from 'react';
import { PlayerProfile, Position, Foot, CardRarity } from '../../types/career';
import { X, Save, Upload, User, Sparkles } from 'lucide-react';

interface EditPlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  onSave: (updates: Partial<PlayerProfile>) => void;
}

const POSITIONS: Position[] = [
  'ST', 'CF', 'LW', 'RW',
  'CAM', 'CM', 'CDM', 'LM', 'RM',
  'CB', 'LB', 'RB', 'LWB', 'RWB',
  'GK',
];

export const EditPlayerProfileModal: React.FC<EditPlayerProfileModalProps> = ({
  isOpen,
  onClose,
  player,
  onSave,
}) => {
  const [formData, setFormData] = useState<PlayerProfile>({ ...player });

  if (!isOpen) return null;

  const handleAttributeChange = (key: keyof PlayerProfile['attributes'], val: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: Math.min(99, Math.max(1, val)),
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-display">Edit Player Career Profile</h2>
              <p className="text-xs text-slate-400">Update personal info, clubs, ratings, and FIFA/EA attributes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Personal & Club */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Player Identity & Club Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Display Name (Kit)</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Club</label>
                <input
                  type="text"
                  value={formData.currentClub}
                  onChange={(e) => setFormData({ ...formData, currentClub: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">League</label>
                <input
                  type="text"
                  value={formData.league}
                  onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Squad Number</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formData.squadNumber}
                  onChange={(e) => setFormData({ ...formData, squadNumber: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Position & Physicality */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Position & Physical Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Primary Position</label>
                <select
                  value={formData.preferredPosition}
                  onChange={(e) => setFormData({ ...formData, preferredPosition: e.target.value as Position })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Secondary Position</label>
                <select
                  value={formData.secondaryPosition}
                  onChange={(e) => setFormData({ ...formData, secondaryPosition: e.target.value as Position })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dominant Foot</label>
                <select
                  value={formData.dominantFoot}
                  onChange={(e) => setFormData({ ...formData, dominantFoot: e.target.value as Foot })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                  <option value="Both">Both (5★ Weak Foot)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  min="15"
                  max="45"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Height (cm)</label>
                <input
                  type="number"
                  min="150"
                  max="215"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 180 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min="50"
                  max="115"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 75 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">OVR Rating</label>
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={formData.overallRating}
                  onChange={(e) => setFormData({ ...formData, overallRating: parseInt(e.target.value) || 80 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Potential (POT)</label>
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={formData.potentialRating}
                  onChange={(e) => setFormData({ ...formData, potentialRating: parseInt(e.target.value) || 90 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Card Visuals & Photograph Upload */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Card Style & Photograph
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Card Theme</label>
                <select
                  value={formData.cardStyle}
                  onChange={(e) => setFormData({ ...formData, cardStyle: e.target.value as CardRarity })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="toty">TOTY (Team of the Year - Gold & Royal Blue)</option>
                  <option value="tots">TOTS (Team of the Season - Electric Cyan)</option>
                  <option value="gold">Gold Rare (Brushed Metallic Gold)</option>
                  <option value="icon">Icon / Legend (Ivory & Gold Plaque)</option>
                  <option value="future_stars">Future Stars (Neon Purple / Fuchsia)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Player Photograph</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        photoUrl: '/src/assets/images/player_striker_portrait_1794400814068.jpg',
                      }))
                    }
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Reset Photo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Attribute Sliders (1 - 99) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              EA FC Core 6 Attributes (1 - 99)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {(
                [
                  { key: 'pace', label: 'Pace (PAC)' },
                  { key: 'shooting', label: 'Shooting (SHO)' },
                  { key: 'passing', label: 'Passing (PAS)' },
                  { key: 'dribbling', label: 'Dribbling (DRI)' },
                  { key: 'defending', label: 'Defending (DEF)' },
                  { key: 'physical', label: 'Physical (PHY)' },
                ] as const
              ).map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>{label}</span>
                    <span className="text-amber-400 font-bold tabular-nums font-mono">
                      {formData.attributes[key]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="99"
                    value={formData.attributes[key]}
                    onChange={(e) => handleAttributeChange(key, parseInt(e.target.value) || 50)}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Bio */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Player Biography / Scouting Summary</label>
            <textarea
              rows={2}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              placeholder="Career style, accolades, player traits..."
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CareerProvider, useCareer } from './context/CareerContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardMainView } from './components/dashboard/DashboardMainView';
import { PlayerProfileView } from './components/profile/PlayerProfileView';
import { CareerStatisticsView } from './components/statistics/CareerStatisticsView';
import { MatchHistoryView } from './components/matches/MatchHistoryView';
import { TrophyCabinetView } from './components/trophies/TrophyCabinetView';
import { CareerRecordsView } from './components/records/CareerRecordsView';
import { TransfersView } from './components/transfers/TransfersView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { DataManagementView } from './components/settings/DataManagementView';
import { MatchdaySimulatorModal } from './components/matchday/MatchdaySimulatorModal';
import { EditPlayerProfileModal } from './components/profile/EditPlayerProfileModal';
import { ManageSeasonsModal } from './components/seasons/ManageSeasonsModal';
import { MatchFormModal } from './components/matches/MatchFormModal';
import { TrophyModal } from './components/trophies/TrophyModal';
import { AchievementToast } from './components/common/AchievementToast';
import { Match, Trophy } from './types/career';

function AppContent() {
  const {
    database,
    player,
    seasons,
    activeSeasonId,
    setActiveSeasonId,
    activeSeason,
    filteredMatches,
    allMatches,
    activeStats,
    allTimeStats,
    careerRecords,
    trophies,
    transfers,
    achievements,
    recentUnlockedAchievement,
    clearAchievementNotification,

    updatePlayer,
    addMatch,
    updateMatch,
    deleteMatch,
    addSeason,
    updateSeason,
    deleteSeason,
    unlockTrophy,
    updateTrophy,
    addCustomTrophy,
    removeTrophy,
    addTransfer,
    updateTransfer,
    deleteTransfer,
    exportBackupJson,
    importBackupJson,
    resetToDemo,
    startFreshCareer,
  } = useCareer();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Modals State
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSeasonsModalOpen, setIsSeasonsModalOpen] = useState(false);

  const [isTrophyModalOpen, setIsTrophyModalOpen] = useState(false);
  const [selectedTrophy, setSelectedTrophy] = useState<Trophy | null>(null);

  const handleOpenLogMatch = () => {
    setEditingMatch(null);
    setIsMatchModalOpen(true);
  };

  const handleOpenEditMatch = (m: Match) => {
    setEditingMatch(m);
    setIsMatchModalOpen(true);
  };

  const handleOpenTrophyModal = (t: Trophy) => {
    setSelectedTrophy(t);
    setIsTrophyModalOpen(true);
  };

  const handleNavSelect = (tab: NavTab) => {
    if (tab === 'simulator') {
      setIsSimulatorModalOpen(true);
      return;
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleNavSelect}
        player={player}
        activeSeason={activeSeason}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Sticky Top Header */}
        <Header
          currentTab={currentTab}
          player={player}
          activeSeason={activeSeason}
          activeSeasonId={activeSeasonId}
          seasons={seasons}
          onSelectSeason={setActiveSeasonId}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogMatchClick={handleOpenLogMatch}
          onPlaySimulatorClick={() => setIsSimulatorModalOpen(true)}
          onManageSeasonsClick={() => setIsSeasonsModalOpen(true)}
        />

        {/* Viewport Frame */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardMainView
              player={player}
              activeSeason={activeSeason}
              activeSeasonId={activeSeasonId}
              seasons={seasons}
              onSelectSeason={setActiveSeasonId}
              stats={activeStats}
              filteredMatches={filteredMatches}
              allMatches={allMatches}
              trophies={trophies}
              records={careerRecords}
              achievements={achievements}
              onSelectTab={handleNavSelect}
              onLogMatchClick={handleOpenLogMatch}
              onPlaySimulatorClick={() => setIsSimulatorModalOpen(true)}
              onManageSeasonsClick={() => setIsSeasonsModalOpen(true)}
              onEditProfileClick={() => setIsProfileModalOpen(true)}
              onMatchClick={handleOpenEditMatch}
              onTrophyClick={handleOpenTrophyModal}
            />
          )}

          {currentTab === 'profile' && (
            <PlayerProfileView
              player={player}
              stats={allTimeStats}
              onEditClick={() => setIsProfileModalOpen(true)}
            />
          )}

          {currentTab === 'statistics' && (
            <CareerStatisticsView
              allMatches={allMatches}
              seasons={seasons}
              activeSeasonId={activeSeasonId}
              onSelectSeason={setActiveSeasonId}
            />
          )}

          {currentTab === 'matches' && (
            <MatchHistoryView
              matches={filteredMatches}
              seasons={seasons}
              activeSeasonId={activeSeasonId}
              onSelectSeason={setActiveSeasonId}
              onAddMatch={addMatch}
              onUpdateMatch={updateMatch}
              onDeleteMatch={deleteMatch}
              onPlaySimulatorClick={() => setIsSimulatorModalOpen(true)}
            />
          )}

          {currentTab === 'trophies' && (
            <TrophyCabinetView
              trophies={trophies}
              seasons={seasons}
              onUnlockTrophy={unlockTrophy}
              onUpdateTrophy={updateTrophy}
              onAddCustomTrophy={addCustomTrophy}
              onRemoveTrophy={removeTrophy}
            />
          )}

          {currentTab === 'records' && (
            <CareerRecordsView
              records={careerRecords}
              allMatches={allMatches}
              stats={allTimeStats}
              seasons={seasons}
            />
          )}

          {currentTab === 'transfers' && (
            <TransfersView
              transfers={transfers}
              seasons={seasons}
              matches={allMatches}
              trophies={trophies}
              onAddTransfer={addTransfer}
              onUpdateTransfer={updateTransfer}
              onDeleteTransfer={deleteTransfer}
            />
          )}

          {currentTab === 'achievements' && <AchievementsView achievements={achievements} />}

          {currentTab === 'data' && (
            <DataManagementView
              database={database}
              onExport={exportBackupJson}
              onImport={importBackupJson}
              onResetDemo={resetToDemo}
              onStartFresh={startFreshCareer}
            />
          )}
        </main>
      </div>

      {/* Interactive Matchday Simulator Modal */}
      <MatchdaySimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
        player={player}
        currentSeason={activeSeason || seasons[0] || null}
        onSaveMatch={(m) => {
          addMatch(m);
        }}
      />

      {/* Edit Player Profile Modal */}
      <EditPlayerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        player={player}
        onSave={updatePlayer}
      />

      {/* Manage Seasons Modal */}
      <ManageSeasonsModal
        isOpen={isSeasonsModalOpen}
        onClose={() => setIsSeasonsModalOpen(false)}
        seasons={seasons}
        matches={allMatches}
        activeSeasonId={activeSeasonId}
        onSelectSeason={setActiveSeasonId}
        onAddSeason={addSeason}
        onUpdateSeason={updateSeason}
        onDeleteSeason={deleteSeason}
      />

      {/* Match Form Modal (Add / Edit) */}
      <MatchFormModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        onSave={(m) => {
          if (editingMatch) {
            updateMatch(editingMatch.id, m);
          } else {
            addMatch(m);
          }
        }}
        initialMatch={editingMatch}
        seasons={seasons}
        defaultSeasonId={activeSeasonId === 'all' ? seasons[0]?.id : activeSeasonId}
      />

      {/* Trophy Modal (Unlock / Edit) */}
      <TrophyModal
        isOpen={isTrophyModalOpen}
        onClose={() => setIsTrophyModalOpen(false)}
        trophy={selectedTrophy}
        seasons={seasons}
        onSave={(updates) => selectedTrophy && updateTrophy(selectedTrophy.id, updates)}
        onUnlock={(seasonWon, dateWon, club) =>
          selectedTrophy && unlockTrophy(selectedTrophy.id, seasonWon, dateWon, club)
        }
        onRemove={(id) => removeTrophy(id)}
      />

      {/* Newly Unlocked Achievement Toast Notification */}
      <AchievementToast
        achievement={recentUnlockedAchievement}
        onClose={clearAchievementNotification}
      />
    </div>
  );
}

export default function App() {
  return (
    <CareerProvider>
      <AppContent />
    </CareerProvider>
  );
}

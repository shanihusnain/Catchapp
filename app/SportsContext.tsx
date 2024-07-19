import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sport } from './config/sportsConfig'; // Adjust the import path as necessary

interface ExtendedSport extends Sport {
  hidden: boolean;
}

interface SportsContextType {
  sports: ExtendedSport[];
  updateSports: (newSports: ExtendedSport[]) => Promise<void>;
  toggleSportVisibility: (sportName: string) => Promise<void>;
  visibleSports: ExtendedSport[];
  refreshSports: () => Promise<void>;
  addSport: (newSport: ExtendedSport) => Promise<void>;
  deleteSport: (sportName: string) => Promise<void>;
  editSport: (sportName: string, updatedSport: ExtendedSport) => Promise<void>;
  version: number;
}

const SportsContext = createContext<SportsContextType | undefined>(undefined);

interface SportsProviderProps {
  children: ReactNode;
}

export const SportsProvider: React.FC<SportsProviderProps> = ({ children }) => {
  const [sports, setSports] = useState<ExtendedSport[]>([]);
  const [version, setVersion] = useState(0);

  const loadSports = useCallback(async () => {
    try {
      const storedSports = await AsyncStorage.getItem('extendedSportsConfig');
      if (storedSports) {
        const parsedSports = JSON.parse(storedSports);
        console.log('Loaded sports from storage:', parsedSports);
        setSports(parsedSports);
      } else {
        const { sports: initialSports } = require('./config/sportsConfig');
        const extendedInitialSports: ExtendedSport[] = initialSports.map((sport: Sport) => ({ ...sport, hidden: false }));
        console.log('Initializing sports:', extendedInitialSports);
        setSports(extendedInitialSports);
        await AsyncStorage.setItem('extendedSportsConfig', JSON.stringify(extendedInitialSports));
      }
      setVersion(v => v + 1);
    } catch (error) {
      console.error('Error loading sports:', error);
    }
  }, []);

  useEffect(() => {
    loadSports();
  }, [loadSports]);

  const updateSports = useCallback(async (newSports: ExtendedSport[]) => {
    try {
      await AsyncStorage.setItem('extendedSportsConfig', JSON.stringify(newSports));
      console.log('Updating sports:', newSports);
      setSports([...newSports]);
      setVersion(v => v + 1);
    } catch (error) {
      console.error('Error updating sports:', error);
    }
  }, []);

  const toggleSportVisibility = useCallback(async (sportName: string) => {
    console.log(`Toggling visibility for sport: ${sportName}`);
    const updatedSports = sports.map(sport => 
      sport.name === sportName ? { ...sport, hidden: !sport.hidden } : sport
    );
    await updateSports(updatedSports);
  }, [sports, updateSports]);

  const addSport = useCallback(async (newSport: ExtendedSport) => {
    const updatedSports = [...sports, newSport];
    await updateSports(updatedSports);
  }, [sports, updateSports]);

  const deleteSport = useCallback(async (sportName: string) => {
    const updatedSports = sports.filter(sport => sport.name !== sportName);
    await updateSports(updatedSports);
  }, [sports, updateSports]);

  const editSport = useCallback(async (sportName: string, updatedSport: ExtendedSport) => {
    const updatedSports = sports.map(sport => 
      sport.name === sportName ? { ...updatedSport } : sport
    );
    await updateSports(updatedSports);
  }, [sports, updateSports]);

  const refreshSports = useCallback(async () => {
    await loadSports();
  }, [loadSports]);

  const visibleSports = sports.filter(sport => !sport.hidden);

  useEffect(() => {
    console.log('Sports state updated:', sports);
    console.log('Visible sports:', visibleSports);
  }, [sports, version]);

  const contextValue: SportsContextType = {
    sports,
    updateSports,
    toggleSportVisibility,
    visibleSports,
    refreshSports,
    addSport,
    deleteSport,
    editSport,
    version,
  };

  return (
    <SportsContext.Provider value={contextValue}>
      {children}
    </SportsContext.Provider>
  );
};

export const useSports = () => {
  const context = useContext(SportsContext);
  if (context === undefined) {
    throw new Error('useSports must be used within a SportsProvider');
  }
  return context;
};
// src/config/sportsConfig.ts

export interface Sport {
    name: string;
    color: string;
    icon: string;
  }
  
  export const sports: Sport[] = [
    { name: 'Swimming', color: '#4FC3F7', icon: 'water' },
    { name: 'Running', color: '#FFA726', icon: 'walk' },
    { name: 'Football', color: '#FF7043', icon: 'football' },
    { name: 'Basketball', color: '#7E57C2', icon: 'basketball' },
    { name: 'Cycling', color: '#66BB6A', icon: 'bicycle' },
    { name: 'Tennis', color: '#EC407A', icon: 'tennisball' },
    // Add new sports here
    { name: 'Yoga', color: '#9C27B0', icon: 'body' },
  ];
  
  export const getSportByName = (name: string): Sport | undefined => {
    return sports.find(sport => sport.name === name);
  };
  
  export const getAllSportNames = (): string[] => {
    return sports.map(sport => sport.name);
  };
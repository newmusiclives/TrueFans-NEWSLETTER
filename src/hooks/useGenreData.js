import { useMemo } from 'react';

export const useGenreData = () => {
  return useMemo(() => [
    { 
      id: 'pulse', 
      name: 'PULSE', 
      label: 'Hip-Hop/Rap', 
      day: 'Monday', 
      time: '6 AM', 
      color: 'bg-purple-500', 
      subscribers: 15420, 
      engagement: 42.3,
      growth: 18.7,
      revenue: 28450,
      emoji: '🎤',
      description: 'Underground hip-hop trends, emerging rappers, and street culture intelligence',
      demoAvailable: false
    },
    { 
      id: 'storyteller', 
      name: 'STORYTELLER', 
      label: 'Singer-Songwriter', 
      day: 'Tuesday', 
      time: '6 PM', 
      color: 'bg-green-600', 
      subscribers: 12300, 
      engagement: 51.2,
      growth: 15.8,
      revenue: 24600,
      emoji: '🎸',
      description: 'Intimate singer-songwriter discoveries, confessional folk movement, and authentic storytelling',
      demoAvailable: true,
      featured: true
    },
    { 
      id: 'voltage', 
      name: 'VOLTAGE', 
      label: 'Electronic/EDM', 
      day: 'Tuesday', 
      time: '6 AM', 
      color: 'bg-blue-500', 
      subscribers: 18750, 
      engagement: 45.1,
      growth: 24.6,
      revenue: 35800,
      emoji: '⚡',
      description: 'Electronic music evolution, festival intelligence, and producer spotlights',
      demoAvailable: false
    },
    { 
      id: 'resonance', 
      name: 'RESONANCE', 
      label: 'Pop/Mainstream', 
      day: 'Thursday', 
      time: '6 AM', 
      color: 'bg-pink-500', 
      subscribers: 28900, 
      engagement: 35.8,
      growth: 8.9,
      revenue: 42500,
      emoji: '✨',
      description: 'Pop culture analysis, mainstream trends, and commercial music intelligence',
      demoAvailable: false
    }
  ], []);
};

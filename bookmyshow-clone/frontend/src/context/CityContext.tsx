import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cityAPI } from '../services/api';
import type { City } from '../types';

interface CityContextType {
  cities: City[];
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
  loading: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await cityAPI.getAll();
        setCities(response.data);
        
        // Load selected city from localStorage
        const savedCityId = localStorage.getItem('selectedCityId');
        if (savedCityId) {
          const city = response.data.find(c => c.id === parseInt(savedCityId));
          if (city) {
            setSelectedCity(city);
          }
        } else if (response.data.length > 0) {
          // Default to first city
          setSelectedCity(response.data[0]);
          localStorage.setItem('selectedCityId', response.data[0].id.toString());
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  const handleSetSelectedCity = (city: City | null) => {
    setSelectedCity(city);
    if (city) {
      localStorage.setItem('selectedCityId', city.id.toString());
    } else {
      localStorage.removeItem('selectedCityId');
    }
  };

  return (
    <CityContext.Provider
      value={{
        cities,
        selectedCity,
        setSelectedCity: handleSetSelectedCity,
        loading,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};


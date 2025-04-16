import React, { createContext, useContext, useState, useMemo } from 'react';
import { IAddress } from "@/interfaces/address";

interface DispatchContextType {
  places: IAddress[];
  setPlaces: (updater: (prev: IAddress[]) => IAddress[]) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DispatchContext = createContext<DispatchContextType | undefined>(undefined);

export const DispatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<IAddress[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const value = useMemo(() => ({
    places,
    setPlaces,
    isExpanded,
    setIsExpanded,
    searchQuery,
    setSearchQuery
  }), [places, isExpanded, searchQuery]);

  return (
    <DispatchContext.Provider value={value}>
      {children}
    </DispatchContext.Provider>
  );
};

export const useDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDispatch must be used within a DispatchProvider');
  }
  return context;
}; 
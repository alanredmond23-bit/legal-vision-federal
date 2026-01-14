import { createContext, useContext, ReactNode } from 'react';

export type AttorneyType = 'cooper' | 'rush';

interface AttorneyInfo {
  name: string;
  firm: string;
  shortName: string;
}

interface UserContextType {
  attorney: AttorneyType;
  attorneyInfo: AttorneyInfo;
}

const ATTORNEYS: Record<AttorneyType, AttorneyInfo> = {
  cooper: {
    name: 'Benjamin Cooper',
    firm: 'Daigle Cooper & Associates',
    shortName: 'Ben Cooper'
  },
  rush: {
    name: 'Bill Rush',
    firm: 'Rush Law Offices',
    shortName: 'Bill Rush'
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  attorney: AttorneyType;
}

export function UserProvider({ children, attorney }: UserProviderProps) {
  const value: UserContextType = {
    attorney,
    attorneyInfo: ATTORNEYS[attorney]
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { ATTORNEYS };

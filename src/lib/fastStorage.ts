// Fast storage operations for production environment
import { Leader, Person } from './localStorageOperations';

// In-memory cache for instant access
let leadersCache: Leader[] | null = null;
let personsCache: Person[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Fast save without rebuilding indexes
export const fastSaveLeaders = (leaders: Leader[]): void => {
  try {
    localStorage.setItem('app_leaders', JSON.stringify(leaders));
    leadersCache = leaders;
    cacheTimestamp = Date.now();
    console.log('⚡ Leaders saved instantly');
  } catch (error) {
    console.error('Fast save failed:', error);
  }
};

export const fastSavePersons = (persons: Person[]): void => {
  try {
    localStorage.setItem('app_persons', JSON.stringify(persons));
    personsCache = persons;
    cacheTimestamp = Date.now();
    console.log('⚡ Persons saved instantly');
  } catch (error) {
    console.error('Fast save failed:', error);
  }
};

// Fast load from cache or localStorage
export const fastLoadLeaders = (): Leader[] => {
  const now = Date.now();
  
  // Use cache if valid
  if (leadersCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return leadersCache;
  }
  
  // Load from localStorage
  try {
    const data = localStorage.getItem('app_leaders') || localStorage.getItem('leaders');
    const leaders = data ? JSON.parse(data) : [];
    leadersCache = leaders;
    cacheTimestamp = now;
    return leaders;
  } catch (error) {
    console.error('Fast load failed:', error);
    return [];
  }
};

export const fastLoadPersons = (): Person[] => {
  const now = Date.now();
  
  // Use cache if valid
  if (personsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return personsCache;
  }
  
  // Load from localStorage
  try {
    const data = localStorage.getItem('app_persons') || localStorage.getItem('persons');
    const persons = data ? JSON.parse(data) : [];
    personsCache = persons;
    cacheTimestamp = now;
    return persons;
  } catch (error) {
    console.error('Fast load failed:', error);
    return [];
  }
};

// Fast add operations
export const fastAddLeader = (leaderData: Omit<Leader, 'id' | 'created_at' | 'updated_at'>): Leader => {
  const leaders = fastLoadLeaders();
  const newLeader: Leader = {
    ...leaderData,
    id: Date.now() + Math.floor(Math.random() * 1000),
    created_at: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString().split('T')[0]
  };
  
  leaders.push(newLeader);
  fastSaveLeaders(leaders);
  
  return newLeader;
};

export const fastAddPerson = (personData: Omit<Person, 'id' | 'created_at' | 'updated_at'>): Person => {
  const persons = fastLoadPersons();
  const newPerson: Person = {
    ...personData,
    id: Date.now() + Math.floor(Math.random() * 1000),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  persons.push(newPerson);
  fastSavePersons(persons);
  
  return newPerson;
};

// Fast update operations
export const fastUpdatePerson = (personId: number, updatedData: Partial<Person>): Person | null => {
  try {
    const persons = fastLoadPersons();
    const personIndex = persons.findIndex(person => person.id === personId);
    
    if (personIndex === -1) {
      return null;
    }
    
    const updatedPerson: Person = {
      ...persons[personIndex],
      ...updatedData,
      updated_at: new Date().toISOString()
    };
    
    persons[personIndex] = updatedPerson;
    fastSavePersons(persons);
    
    return updatedPerson;
  } catch (error) {
    console.error('Fast update failed:', error);
    return null;
  }
};

// Fast delete operations
export const fastDeleteLeader = (leaderId: number): boolean => {
  try {
    const leaders = fastLoadLeaders();
    const filteredLeaders = leaders.filter(leader => leader.id !== leaderId);
    fastSaveLeaders(filteredLeaders);
    return true;
  } catch (error) {
    console.error('Fast delete failed:', error);
    return false;
  }
};

export const fastDeletePerson = (personId: number): boolean => {
  try {
    const persons = fastLoadPersons();
    const filteredPersons = persons.filter(person => person.id !== personId);
    fastSavePersons(filteredPersons);
    return true;
  } catch (error) {
    console.error('Fast delete failed:', error);
    return false;
  }
};

// Clear cache when needed
export const clearCache = (): void => {
  leadersCache = null;
  personsCache = null;
  cacheTimestamp = 0;
};

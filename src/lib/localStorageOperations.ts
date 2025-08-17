// Local storage operations for production environment
// Used as fallback when EasySite API is not available

export interface Leader {
  id: number;
  full_name: string;
  residence: string;
  phone: string;
  workplace: string;
  center_info: string;
  station_number: string;
  votes_count: number;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: number;
  leader_name: string;
  full_name: string;
  residence: string;
  phone: string;
  workplace: string;
  center_info: string;
  station_number: string;
  votes_count: number;
  created_at: string;
  updated_at: string;
}

// Generate unique ID for new entries
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Leaders operations
export const getLeadersFromStorage = (): Leader[] => {
  try {
    const stored = localStorage.getItem('app_leaders');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading leaders from localStorage:', error);
    return [];
  }
};

export const saveLeadersToStorage = (leaders: Leader[]): void => {
  try {
    localStorage.setItem('app_leaders', JSON.stringify(leaders));
  } catch (error) {
    console.error('Error saving leaders to localStorage:', error);
  }
};

export const addLeaderToStorage = (leaderData: Omit<Leader, 'id' | 'created_at' | 'updated_at'>): Leader => {
  const leaders = getLeadersFromStorage();
  const newLeader: Leader = {
    ...leaderData,
    id: generateId(),
    created_at: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString().split('T')[0]
  };
  
  leaders.push(newLeader);
  saveLeadersToStorage(leaders);
  return newLeader;
};

export const deleteLeaderFromStorage = (leaderId: number): boolean => {
  try {
    const leaders = getLeadersFromStorage();
    const filteredLeaders = leaders.filter(leader => leader.id !== leaderId);
    saveLeadersToStorage(filteredLeaders);
    return true;
  } catch (error) {
    console.error('Error deleting leader from localStorage:', error);
    return false;
  }
};

export const updateLeaderInStorage = (leaderId: number, updatedData: Partial<Leader>): boolean => {
  try {
    const leaders = getLeadersFromStorage();
    const leaderIndex = leaders.findIndex(leader => leader.id === leaderId);
    
    if (leaderIndex === -1) return false;
    
    leaders[leaderIndex] = {
      ...leaders[leaderIndex],
      ...updatedData,
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    saveLeadersToStorage(leaders);
    return true;
  } catch (error) {
    console.error('Error updating leader in localStorage:', error);
    return false;
  }
};

// Persons operations
export const getPersonsFromStorage = (): Person[] => {
  try {
    const stored = localStorage.getItem('app_persons');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading persons from localStorage:', error);
    return [];
  }
};

export const savePersonsToStorage = (persons: Person[]): void => {
  try {
    localStorage.setItem('app_persons', JSON.stringify(persons));
  } catch (error) {
    console.error('Error saving persons to localStorage:', error);
  }
};

export const addPersonToStorage = (personData: Omit<Person, 'id' | 'created_at' | 'updated_at'>): Person => {
  const persons = getPersonsFromStorage();
  const newPerson: Person = {
    ...personData,
    id: generateId(),
    created_at: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString().split('T')[0]
  };
  
  persons.push(newPerson);
  savePersonsToStorage(persons);
  return newPerson;
};

export const deletePersonFromStorage = (personId: number): boolean => {
  try {
    const persons = getPersonsFromStorage();
    const filteredPersons = persons.filter(person => person.id !== personId);
    savePersonsToStorage(filteredPersons);
    return true;
  } catch (error) {
    console.error('Error deleting person from localStorage:', error);
    return false;
  }
};

export const updatePersonInStorage = (personId: number, updatedData: Partial<Person>): boolean => {
  try {
    const persons = getPersonsFromStorage();
    const personIndex = persons.findIndex(person => person.id === personId);
    
    if (personIndex === -1) return false;
    
    persons[personIndex] = {
      ...persons[personIndex],
      ...updatedData,
      updated_at: new Date().toISOString().split('T')[0]
    };
    
    savePersonsToStorage(persons);
    return true;
  } catch (error) {
    console.error('Error updating person in localStorage:', error);
    return false;
  }
};

// Initialize default data if storage is empty
export const initializeDefaultData = (): void => {
  const leaders = getLeadersFromStorage();
  const persons = getPersonsFromStorage();
  
  if (leaders.length === 0) {
    const defaultLeaders: Leader[] = [
      {
        id: 1,
        full_name: "أحمد محمد علي الحسني",
        residence: "حي الجادرية - بغداد",
        phone: "07901234567",
        workplace: "وزارة التربية",
        center_info: "مركز الجادرية الانتخابي",
        station_number: "101",
        votes_count: 320,
        created_at: "2024-01-15",
        updated_at: "2024-01-20"
      },
      {
        id: 2,
        full_name: "فاطمة حسن محمود الزهراء",
        residence: "حي الكرادة - بغداد",
        phone: "07912345678",
        workplace: "جامعة بغداد",
        center_info: "مركز الكرادة الانتخابي",
        station_number: "205",
        votes_count: 285,
        created_at: "2024-01-16",
        updated_at: "2024-01-21"
      }
    ];
    saveLeadersToStorage(defaultLeaders);
  }
  
  if (persons.length === 0) {
    const defaultPersons: Person[] = [
      {
        id: 1,
        leader_name: "أحمد محمد علي الحسني",
        full_name: "سارة أحمد محمد الكريم",
        residence: "حي الجادرية - بغداد",
        phone: "07801234567",
        workplace: "مدرسة الجادرية الابتدائية",
        center_info: "مركز الجادرية الانتخابي",
        station_number: "101",
        votes_count: 45,
        created_at: "2024-01-15",
        updated_at: "2024-01-20"
      },
      {
        id: 2,
        leader_name: "فاطمة حسن محمود الزهراء",
        full_name: "محمد علي حسن الموسوي",
        residence: "حي الكرادة - بغداد",
        phone: "07812345678",
        workplace: "شركة الاتصالات العراقية",
        center_info: "مركز الكرادة الانتخابي",
        station_number: "205",
        votes_count: 38,
        created_at: "2024-01-16",
        updated_at: "2024-01-21"
      }
    ];
    savePersonsToStorage(defaultPersons);
  }
};

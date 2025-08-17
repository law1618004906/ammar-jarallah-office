// Advanced data indexing and caching system for performance optimization
import { Leader, Person } from './localStorageOperations';

// Index types for fast lookups
interface DataIndexes {
  leaders: {
    byId: Map<number, Leader>;
    byName: Map<string, Leader[]>;
    byPhone: Map<string, Leader>;
    byStation: Map<string, Leader[]>;
    byWorkplace: Map<string, Leader[]>;
    byResidence: Map<string, Leader[]>;
  };
  persons: {
    byId: Map<number, Person>;
    byName: Map<string, Person[]>;
    byPhone: Map<string, Person>;
    byLeader: Map<string, Person[]>;
    byStation: Map<string, Person[]>;
    byWorkplace: Map<string, Person[]>;
    byResidence: Map<string, Person[]>;
  };
}

// Statistics interface
interface LeaderStats {
  totalLeaders: number;
  totalVotes: number;
  averageVotes: number;
  stationCount: number;
  workplaceCount: number;
}

// Cache for computed results
interface CacheData {
  leaderStats: Map<string, LeaderStats>;
  searchResults: Map<string, Leader[] | Person[]>;
  lastUpdated: number;
}

// Cache info interface
interface CacheInfo {
  searchResultsCount: number;
  leaderStatsCount: number;
  lastUpdated: string;
  indexSizes: {
    leadersById: number;
    leadersByName: number;
    personsById: number;
    personsByLeader: number;
  };
}

class DataManager {
  private indexes: DataIndexes;
  private cache: CacheData;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.indexes = {
      leaders: {
        byId: new Map(),
        byName: new Map(),
        byPhone: new Map(),
        byStation: new Map(),
        byWorkplace: new Map(),
        byResidence: new Map(),
      },
      persons: {
        byId: new Map(),
        byName: new Map(),
        byPhone: new Map(),
        byLeader: new Map(),
        byStation: new Map(),
        byWorkplace: new Map(),
        byResidence: new Map(),
      }
    };
    
    this.cache = {
      leaderStats: new Map(),
      searchResults: new Map(),
      lastUpdated: 0
    };
  }

  // Build indexes for leaders
  private buildLeaderIndexes(leaders: Leader[]): void {
    // Clear existing indexes
    Object.values(this.indexes.leaders).forEach(map => map.clear());

    leaders.forEach(leader => {
      // Index by ID
      this.indexes.leaders.byId.set(leader.id, leader);

      // Index by name (normalized)
      const nameKey = leader.full_name.toLowerCase().trim();
      if (!this.indexes.leaders.byName.has(nameKey)) {
        this.indexes.leaders.byName.set(nameKey, []);
      }
      this.indexes.leaders.byName.get(nameKey)!.push(leader);

      // Index by phone
      if (leader.phone) {
        this.indexes.leaders.byPhone.set(leader.phone, leader);
      }

      // Index by station
      if (leader.station_number) {
        const stationKey = leader.station_number;
        if (!this.indexes.leaders.byStation.has(stationKey)) {
          this.indexes.leaders.byStation.set(stationKey, []);
        }
        this.indexes.leaders.byStation.get(stationKey)!.push(leader);
      }

      // Index by workplace (normalized)
      if (leader.workplace) {
        const workplaceKey = leader.workplace.toLowerCase().trim();
        if (!this.indexes.leaders.byWorkplace.has(workplaceKey)) {
          this.indexes.leaders.byWorkplace.set(workplaceKey, []);
        }
        this.indexes.leaders.byWorkplace.get(workplaceKey)!.push(leader);
      }

      // Index by residence (normalized)
      if (leader.residence) {
        const residenceKey = leader.residence.toLowerCase().trim();
        if (!this.indexes.leaders.byResidence.has(residenceKey)) {
          this.indexes.leaders.byResidence.set(residenceKey, []);
        }
        this.indexes.leaders.byResidence.get(residenceKey)!.push(leader);
      }
    });
  }

  // Build indexes for persons
  private buildPersonIndexes(persons: Person[]): void {
    // Clear existing indexes
    Object.values(this.indexes.persons).forEach(map => map.clear());

    persons.forEach(person => {
      // Index by ID
      this.indexes.persons.byId.set(person.id, person);

      // Index by name (normalized)
      const nameKey = person.full_name.toLowerCase().trim();
      if (!this.indexes.persons.byName.has(nameKey)) {
        this.indexes.persons.byName.set(nameKey, []);
      }
      this.indexes.persons.byName.get(nameKey)!.push(person);

      // Index by phone
      if (person.phone) {
        this.indexes.persons.byPhone.set(person.phone, person);
      }

      // Index by leader
      if (person.leader_name) {
        const leaderKey = person.leader_name.toLowerCase().trim();
        if (!this.indexes.persons.byLeader.has(leaderKey)) {
          this.indexes.persons.byLeader.set(leaderKey, []);
        }
        this.indexes.persons.byLeader.get(leaderKey)!.push(person);
      }

      // Index by station
      if (person.station_number) {
        const stationKey = person.station_number;
        if (!this.indexes.persons.byStation.has(stationKey)) {
          this.indexes.persons.byStation.set(stationKey, []);
        }
        this.indexes.persons.byStation.get(stationKey)!.push(person);
      }

      // Index by workplace (normalized)
      if (person.workplace) {
        const workplaceKey = person.workplace.toLowerCase().trim();
        if (!this.indexes.persons.byWorkplace.has(workplaceKey)) {
          this.indexes.persons.byWorkplace.set(workplaceKey, []);
        }
        this.indexes.persons.byWorkplace.get(workplaceKey)!.push(person);
      }

      // Index by residence (normalized)
      if (person.residence) {
        const residenceKey = person.residence.toLowerCase().trim();
        if (!this.indexes.persons.byResidence.has(residenceKey)) {
          this.indexes.persons.byResidence.set(residenceKey, []);
        }
        this.indexes.persons.byResidence.get(residenceKey)!.push(person);
      }
    });
  }

  // Rebuild all indexes
  public rebuildIndexes(leaders: Leader[], persons: Person[]): void {
    this.buildLeaderIndexes(leaders);
    this.buildPersonIndexes(persons);
    this.cache.lastUpdated = Date.now();
    
    // Clear search cache when data changes
    this.cache.searchResults.clear();
    this.cache.leaderStats.clear();
  }

  // Fast search for leaders
  public searchLeaders(query: string, leaders: Leader[]): Leader[] {
    if (!query.trim()) return leaders;

    const cacheKey = `leaders_${query.toLowerCase()}`;
    const cached = this.cache.searchResults.get(cacheKey);
    if (cached && (Date.now() - this.cache.lastUpdated) < this.CACHE_TTL) {
      return cached;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results = new Set<Leader>();

    // Search in indexes
    leaders.forEach(leader => {
      if (
        leader.full_name.toLowerCase().includes(normalizedQuery) ||
        leader.phone?.includes(query) ||
        leader.residence?.toLowerCase().includes(normalizedQuery) ||
        leader.workplace?.toLowerCase().includes(normalizedQuery) ||
        leader.station_number?.includes(query) ||
        leader.center_info?.toLowerCase().includes(normalizedQuery)
      ) {
        results.add(leader);
      }
    });

    const finalResults = Array.from(results);
    this.cache.searchResults.set(cacheKey, finalResults);
    return finalResults;
  }

  // Fast search for persons
  public searchPersons(query: string, selectedLeader: string, persons: Person[]): Person[] {
    const cacheKey = `persons_${query.toLowerCase()}_${selectedLeader}`;
    const cached = this.cache.searchResults.get(cacheKey);
    if (cached && (Date.now() - this.cache.lastUpdated) < this.CACHE_TTL) {
      return cached as Person[];
    }

    let filteredPersons = persons;

    // Filter by leader first if specified
    if (selectedLeader) {
      const leaderPersons = this.indexes.persons.byLeader.get(selectedLeader.toLowerCase().trim());
      filteredPersons = leaderPersons || [];
    }

    // Apply search query
    if (!query.trim()) {
      this.cache.searchResults.set(cacheKey, filteredPersons);
      return filteredPersons;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results = filteredPersons.filter(person =>
      person.full_name.toLowerCase().includes(normalizedQuery) ||
      person.phone?.includes(query) ||
      person.residence?.toLowerCase().includes(normalizedQuery) ||
      person.workplace?.toLowerCase().includes(normalizedQuery) ||
      person.leader_name?.toLowerCase().includes(normalizedQuery) ||
      person.station_number?.includes(query) ||
      person.center_info?.toLowerCase().includes(normalizedQuery)
    );

    this.cache.searchResults.set(cacheKey, results);
    return results;
  }

  // Get leader by ID (O(1) lookup)
  public getLeaderById(id: number): Leader | undefined {
    return this.indexes.leaders.byId.get(id);
  }

  // Get person by ID (O(1) lookup)
  public getPersonById(id: number): Person | undefined {
    return this.indexes.persons.byId.get(id);
  }

  // Get persons by leader name (O(1) lookup)
  public getPersonsByLeader(leaderName: string): Person[] {
    return this.indexes.persons.byLeader.get(leaderName.toLowerCase().trim()) || [];
  }

  // Get leaders by station (O(1) lookup)
  public getLeadersByStation(stationNumber: string): Leader[] {
    return this.indexes.leaders.byStation.get(stationNumber) || [];
  }

  // Get persons by station (O(1) lookup)
  public getPersonsByStation(stationNumber: string): Person[] {
    return this.indexes.persons.byStation.get(stationNumber) || [];
  }

  // Get unique values for filters
  public getUniqueLeaderNames(persons: Person[]): string[] {
    const names = new Set<string>();
    persons.forEach(person => {
      if (person.leader_name) {
        names.add(person.leader_name);
      }
    });
    return Array.from(names).sort();
  }

  // Get statistics with caching
  public getLeaderStats(leaders: Leader[]): LeaderStats {
    const cacheKey = 'leader_stats';
    const cached = this.cache.leaderStats.get(cacheKey);
    if (cached && (Date.now() - this.cache.lastUpdated) < this.CACHE_TTL) {
      return cached;
    }

    const stats = {
      totalLeaders: leaders.length,
      totalVotes: leaders.reduce((sum, leader) => sum + (leader.votes_count || 0), 0),
      averageVotes: leaders.length > 0 ? 
        Math.round(leaders.reduce((sum, leader) => sum + (leader.votes_count || 0), 0) / leaders.length) : 0,
      stationCount: new Set(leaders.map(l => l.station_number).filter(Boolean)).size,
      workplaceCount: new Set(leaders.map(l => l.workplace).filter(Boolean)).size
    };

    this.cache.leaderStats.set(cacheKey, stats);
    return stats;
  }

  // Clear all caches
  public clearCache(): void {
    this.cache.searchResults.clear();
    this.cache.leaderStats.clear();
    this.cache.lastUpdated = 0;
  }

  // Get cache info for debugging
  public getCacheInfo(): CacheInfo {
    return {
      searchResultsCount: this.cache.searchResults.size,
      leaderStatsCount: this.cache.leaderStats.size,
      lastUpdated: new Date(this.cache.lastUpdated).toLocaleString(),
      indexSizes: {
        leadersById: this.indexes.leaders.byId.size,
        leadersByName: this.indexes.leaders.byName.size,
        personsById: this.indexes.persons.byId.size,
        personsByLeader: this.indexes.persons.byLeader.size
      }
    };
  }
}

// Singleton instance
export const dataManager = new DataManager();

// Utility functions for debounced search
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Performance monitoring
export const performanceMonitor = {
  startTimer: (operation: string) => {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        console.log(`⚡ ${operation} completed in ${duration.toFixed(2)}ms`);
        return duration;
      }
    };
  }
};

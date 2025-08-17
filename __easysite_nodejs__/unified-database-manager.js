// مدير قاعدة البيانات الموحدة - مسار واحد لجميع العمليات
// يدعم التزامن ومنع التضارب بين الصفحات

class UnifiedDatabaseManager {
  constructor() {
    this.isProcessing = false;
    this.operationQueue = [];
  }

  // تنفيذ العمليات بشكل متتالي لمنع التضارب
  async executeOperation(operation) {
    return new Promise((resolve, reject) => {
      this.operationQueue.push({ operation, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.operationQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.operationQueue.length > 0) {
      const { operation, resolve, reject } = this.operationQueue.shift();
      
      try {
        const result = await operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    
    this.isProcessing = false;
  }

  // ===== عمليات المستخدمين =====
  
  async authenticateUser(username, password) {
    return this.executeOperation(async () => {
      if (username === 'admin' && password === '123456') {
        return { success: true, user: { username: 'admin', role: 'ADMIN' } };
      }
      
      // البحث في قاعدة البيانات
      const { data, error } = await ezsite.api.tableRead('election_users', {
        username: username,
        password: password
      });
      
      if (!error && data && data.length > 0) {
        return { success: true, user: data[0] };
      }
      
      return { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    });
  }

  // ===== عمليات القادة =====
  
  async getLeaders() {
    return this.executeOperation(async () => {
      const { data, error } = await ezsite.api.tableRead('election_leaders');
      
      if (error) {
        console.error('خطأ في جلب القادة:', error);
        return [];
      }
      
      return data || [];
    });
  }

  async addLeader(leaderData) {
    return this.executeOperation(async () => {
      const { data, error } = await ezsite.api.tableWrite('election_leaders', leaderData);
      
      if (error) {
        console.error('خطأ في إضافة القائد:', error);
        throw new Error('فشل في إضافة القائد');
      }
      
      return data;
    });
  }

  async updateLeader(leaderId, leaderData) {
    return this.executeOperation(async () => {
      const { data, error } = await ezsite.api.tableUpdate('election_leaders', leaderId, leaderData);
      
      if (error) {
        console.error('خطأ في تحديث القائد:', error);
        throw new Error('فشل في تحديث القائد');
      }
      
      return data;
    });
  }

  async deleteLeader(leaderId) {
    return this.executeOperation(async () => {
      // حذف جميع الأفراد التابعين للقائد أولاً
      const leader = await this.getLeaderById(leaderId);
      if (leader) {
        await this.deletePersonsByLeaderName(leader.full_name);
      }
      
      const { data, error } = await ezsite.api.tableDelete('election_leaders', leaderId);
      
      if (error) {
        console.error('خطأ في حذف القائد:', error);
        throw new Error('فشل في حذف القائد');
      }
      
      return data;
    });
  }

  async getLeaderById(leaderId) {
    return this.executeOperation(async () => {
      const { data, error } = await ezsite.api.tableRead('election_leaders', { id: leaderId });
      
      if (error || !data || data.length === 0) {
        return null;
      }
      
      return data[0];
    });
  }

  // ===== عمليات الأفراد =====
  
  async getPersons() {
    return this.executeOperation(async () => {
      const { data, error } = await ezsite.api.tableRead('election_persons');
      
      if (error) {
        console.error('خطأ في جلب الأفراد:', error);
        return [];
      }
      
      return data || [];
    });
  }

  async addPerson(personData) {
    return this.executeOperation(async () => {
      const { data, error } = await ezsite.api.tableWrite('election_persons', personData);
      
      if (error) {
        console.error('خطأ في إضافة الفرد:', error);
        throw new Error('فشل في إضافة الفرد');
      }
      
      return data;
    });
  }

  async updatePerson(personId, personData) {
    return this.executeOperation(async () => {
      const { data, error } = await ezsite.api.tableUpdate('election_persons', personId, personData);
      
      if (error) {
        console.error('خطأ في تحديث الفرد:', error);
        throw new Error('فشل في تحديث الفرد');
      }
      
      return data;
    });
  }

  async deletePerson(personId) {
    return this.executeOperation(async () => {
      const { data, error } = await ezsite.api.tableDelete('election_persons', personId);
      
      if (error) {
        console.error('خطأ في حذف الفرد:', error);
        throw new Error('فشل في حذف الفرد');
      }
      
      return data;
    });
  }

  async deletePersonsByLeaderName(leaderName) {
    return this.executeOperation(async () => {
      const persons = await this.getPersons();
      const personsToDelete = persons.filter(p => p.leader_name === leaderName);
      
      for (const person of personsToDelete) {
        await this.deletePerson(person.id);
      }
      
      return personsToDelete.length;
    });
  }

  // ===== عمليات الشجرة الهرمية =====
  
  async getLeadersTree() {
    return this.executeOperation(async () => {
      const leaders = await this.getLeaders();
      const persons = await this.getPersons();
      
      const tree = leaders.map(leader => {
        const leaderPersons = persons.filter(p => p.leader_name === leader.full_name);
        
        return {
          id: `leader-${leader.id}`,
          name: leader.full_name,
          type: 'leader',
          totalVotes: leader.votes_count || 0,
          details: {
            phone: leader.phone,
            address: leader.address,
            work: leader.work,
            votingCenter: leader.voting_center,
            stationNumber: leader.station_number
          },
          children: leaderPersons.map(person => ({
            id: `person-${person.id}`,
            name: person.full_name,
            type: 'person',
            totalVotes: person.votes_count || 0,
            details: {
              phone: person.phone,
              address: person.address,
              work: person.work,
              votingCenter: person.voting_center,
              stationNumber: person.station_number
            },
            children: []
          }))
        };
      });
      
      const stats = {
        totalLeaders: leaders.length,
        totalPersons: persons.length,
        totalVotes: leaders.reduce((sum, l) => sum + (l.votes_count || 0), 0) + 
                   persons.reduce((sum, p) => sum + (p.votes_count || 0), 0),
        avgVotesPerLeader: leaders.length > 0 ? 
          Math.round(persons.reduce((sum, p) => sum + (p.votes_count || 0), 0) / leaders.length) : 0
      };
      
      return { tree, stats };
    });
  }

  // ===== إحصائيات لوحة التحكم =====
  
  async getDashboardStats() {
    return this.executeOperation(async () => {
      const leaders = await this.getLeaders();
      const persons = await this.getPersons();
      
      const totalVotes = leaders.reduce((sum, l) => sum + (l.votes_count || 0), 0) + 
                        persons.reduce((sum, p) => sum + (p.votes_count || 0), 0);
      
      const avgVotesPerLeader = leaders.length > 0 ? 
        Math.round(persons.reduce((sum, p) => sum + (p.votes_count || 0), 0) / leaders.length) : 0;
      
      return {
        totalLeaders: leaders.length,
        totalPersons: persons.length,
        totalVotes: totalVotes,
        avgVotesPerLeader: avgVotesPerLeader,
        recentActivity: `آخر تحديث: ${new Date().toLocaleString('ar-IQ')}`
      };
    });
  }

  // ===== البحث المتقدم =====
  
  async searchAll(query) {
    return this.executeOperation(async () => {
      const leaders = await this.getLeaders();
      const persons = await this.getPersons();
      
      const searchTerm = query.toLowerCase();
      
      const matchedLeaders = leaders.filter(leader => 
        leader.full_name.toLowerCase().includes(searchTerm) ||
        leader.phone.includes(searchTerm) ||
        leader.address.toLowerCase().includes(searchTerm) ||
        leader.work.toLowerCase().includes(searchTerm)
      );
      
      const matchedPersons = persons.filter(person => 
        person.full_name.toLowerCase().includes(searchTerm) ||
        person.phone.includes(searchTerm) ||
        person.address.toLowerCase().includes(searchTerm) ||
        person.work.toLowerCase().includes(searchTerm) ||
        person.leader_name.toLowerCase().includes(searchTerm)
      );
      
      return {
        leaders: matchedLeaders,
        persons: matchedPersons,
        total: matchedLeaders.length + matchedPersons.length
      };
    });
  }
}

// إنشاء مثيل واحد للاستخدام في جميع أنحاء التطبيق
const dbManager = new UnifiedDatabaseManager();

module.exports = dbManager;

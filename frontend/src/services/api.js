const mockData = {
  '/api/auth/login': { token: 'static-token', user: { id: 'admin1', name: 'Admin User', role: 'admin' } },
  '/api/auth/me': { id: 'admin1', name: 'Admin User', role: 'admin' },
  '/api/stats': { totalTeachers: 5, totalClasses: 3, totalBatches: 2, totalStudents: 2 },
  '/api/teachers': [
    { id: 't1', user: { name: 'Dr. Evelyn Reed' }, subject: 'Physics' },
    { id: 't2', user: { name: 'Mr. Samuel Carter' }, subject: 'Mathematics' },
  ],
  '/api/classes': [
    { id: 'c1', name: 'Class 10A', teacher: { user: { name: 'Dr. Evelyn Reed' } } },
    { id: 'c2', name: 'Class 10B', teacher: { user: { name: 'Mr. Samuel Carter' } } },
  ],
  '/api/batches': [
    { id: 'b1', name: '2024-2025', academicYear: '2024' },
    { id: 'b2', name: '2023-2024', academicYear: '2023' },
  ],
  '/api/students': [
    { id: 's1', user: { name: 'Alice Johnson' }, studentId: 'STU2024001', class: { name: 'Class 10A' } },
    { id: 's2', user: { name: 'Bob Williams' }, studentId: 'STU2024002', class: { name: 'Class 10B' } },
  ],
  '/api/profile': {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-0101',
    studentDetails: {
        studentId: 'STU2024001',
        rollNumber: '101',
        dateOfBirth: '2008-05-10T00:00:00.000Z',
        class: { name: 'Class 10A' },
        batch: { name: '2024-2025', academicYear: '2024' },
    },
    mockTestMarks: [
        { subject: 'Physics', marks: 85, total: 100 },
        { subject: 'Mathematics', marks: 92, total: 100 },
        { subject: 'Chemistry', marks: 78, total: 100 },
    ],
    fees: {
        totalFees: 5000,
        paidFees: 3000,
        remainingFees: 2000,
        dueDate: '2025-10-15',
    }
  }
};

export const apiRequest = async (method, url, data = null) => {
  console.log(`[Static API] ${method} ${url}`, data);

  // Find a matching mock data entry
  const urlKey = Object.keys(mockData).find(key => url.startsWith(key));
  const responseData = urlKey ? mockData[urlKey] : { message: `No mock data for ${url}` };

  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(responseData),
  };
};

export const fetchWithAuth = async (url) => {
  return apiRequest('GET', url);
};
// Mock data for frontend display purposes
export const mockBooks = [
  {
    id: "1",
    title: "Engineering Mathematics",
    author: "Dr. John Smith",
    description: "Comprehensive guide covering calculus, linear algebra, and differential equations for engineering students.",
    condition: "GOOD",
    priceOrRent: 25,
    type: "RENT",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    isAvailable: true,
    createdAt: "2024-01-15T10:30:00Z",
    owner: {
      id: "owner1",
      name: "Alice Johnson",
      email: "alice@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    _count: { requests: 3 }
  },
  {
    id: "2",
    title: "Data Structures and Algorithms",
    author: "Thomas Cormen",
    description: "Essential computer science textbook covering fundamental algorithms and data structures with practical examples.",
    condition: "LIKE_NEW",
    priceOrRent: 150,
    type: "SELL",
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    isAvailable: true,
    createdAt: "2024-01-10T14:20:00Z",
    owner: {
      id: "owner2",
      name: "Bob Wilson",
      email: "bob@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    _count: { requests: 1 }
  },
  {
    id: "3",
    title: "Digital Electronics",
    author: "Morris Mano",
    description: "Complete guide to digital logic design, circuits, and computer architecture fundamentals.",
    condition: "NEW",
    priceOrRent: 30,
    type: "RENT",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    isAvailable: false,
    createdAt: "2024-01-08T09:15:00Z",
    owner: {
      id: "owner3",
      name: "Carol Davis",
      email: "carol@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    _count: { requests: 5 }
  },
  {
    id: "4",
    title: "Fundamentals of Physics",
    author: "David Halliday",
    description: "Comprehensive physics textbook covering mechanics, thermodynamics, and electromagnetism with solved examples.",
    condition: "GOOD",
    priceOrRent: 120,
    type: "SELL",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=400&fit=crop",
    isAvailable: true,
    createdAt: "2024-01-05T16:45:00Z",
    owner: {
      id: "owner4",
      name: "David Kumar",
      email: "david@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    _count: { requests: 2 }
  },
  {
    id: "5",
    title: "Machine Learning Basics",
    author: "Andrew Ng",
    description: "Introduction to machine learning concepts, algorithms, and practical applications in Python.",
    condition: "FAIR",
    priceOrRent: 20,
    type: "RENT",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=400&fit=crop",
    isAvailable: true,
    createdAt: "2024-01-03T11:30:00Z",
    owner: {
      id: "owner5",
      name: "Eva Martinez",
      email: "eva@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face"
    },
    _count: { requests: 4 }
  }
]

export const mockEvents = [
  {
    id: "1",
    title: "Tech Fest 2024",
    description: "Annual technology festival featuring coding competitions, hackathons, and tech talks by industry experts.",
    category: "TECHNICAL",
    date: "2024-02-15",
    time: "09:00",
    location: "Main Auditorium, JSSSTU",
    maxParticipants: 500,
    club: "Computer Science Club",
    department: "Computer Science & Engineering",
    createdAt: "2024-01-20T10:00:00Z",
    organizer: {
      id: "org1",
      name: "Tech Club Admin",
      email: "tech@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 125 },
    isInterestedByUser: false
  },
  {
    id: "2",
    title: "Cultural Night",
    description: "Celebrate diversity with music, dance, and cultural performances from students representing different states.",
    category: "CULTURAL",
    date: "2024-02-20",
    time: "18:00",
    location: "Open Air Theatre",
    maxParticipants: 1000,
    club: "Cultural Committee",
    department: null,
    createdAt: "2024-01-18T15:30:00Z",
    organizer: {
      id: "org2",
      name: "Cultural Team",
      email: "culture@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 234 },
    isInterestedByUser: true
  },
  {
    id: "3",
    title: "AI Workshop",
    description: "Hands-on workshop on artificial intelligence and machine learning with practical coding sessions.",
    category: "WORKSHOP",
    date: "2024-02-25",
    time: "14:00",
    location: "Computer Lab 1",
    maxParticipants: 50,
    club: "AI Club",
    department: "Computer Science & Engineering",
    createdAt: "2024-01-15T12:00:00Z",
    organizer: {
      id: "org3",
      name: "Dr. Sarah Tech",
      email: "sarah@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 48 },
    isInterestedByUser: false
  },
  {
    id: "4",
    title: "Sports Day",
    description: "Inter-department sports competition including cricket, football, basketball, and track events.",
    category: "SPORTS",
    date: "2024-03-01",
    time: "08:00",
    location: "Sports Complex",
    maxParticipants: 300,
    club: "Sports Committee",
    department: null,
    createdAt: "2024-01-12T09:45:00Z",
    organizer: {
      id: "org4",
      name: "Sports Coordinator",
      email: "sports@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 156 },
    isInterestedByUser: true
  },
  {
    id: "5",
    title: "Startup Seminar",
    description: "Entrepreneurship seminar featuring successful startup founders sharing their journey and insights.",
    category: "SEMINAR",
    date: "2024-03-05",
    time: "10:00",
    location: "Conference Hall",
    maxParticipants: 200,
    club: "Entrepreneurship Cell",
    department: "Management Studies",
    createdAt: "2024-01-10T14:20:00Z",
    organizer: {
      id: "org5",
      name: "E-Cell Team",
      email: "ecell@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 89 },
    isInterestedByUser: false
  },
  {
    id: "6",
    title: "BCA Web Development Bootcamp",
    description: "Intensive 3-day bootcamp covering HTML5, CSS3, JavaScript, React, and Node.js. Perfect for BCA students looking to build modern web applications.",
    category: "WORKSHOP",
    date: "2024-03-10",
    time: "09:00",
    location: "BCA Computer Lab",
    maxParticipants: 40,
    club: "BCA Students Association",
    department: "Bachelor of Computer Applications (BCA)",
    createdAt: "2024-02-01T10:00:00Z",
    organizer: {
      id: "org6",
      name: "Priya Sharma",
      email: "priya.bca@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 35 },
    isInterestedByUser: false
  },
  {
    id: "7",
    title: "Database Design & SQL Masterclass",
    description: "Learn advanced database concepts, MySQL, PostgreSQL, and NoSQL databases. Includes hands-on projects with real-world scenarios for BCA curriculum.",
    category: "WORKSHOP",
    date: "2024-03-15",
    time: "14:00",
    location: "Database Lab, BCA Block",
    maxParticipants: 30,
    club: "BCA Students Association",
    department: "Bachelor of Computer Applications (BCA)",
    createdAt: "2024-02-05T12:30:00Z",
    organizer: {
      id: "org7",
      name: "Rahul Mehta",
      email: "rahul.bca@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 28 },
    isInterestedByUser: true
  },
  {
    id: "8",
    title: "BCA Project Exhibition 2024",
    description: "Annual showcase of final year BCA projects featuring innovative software solutions, mobile apps, and web applications developed by students.",
    category: "ACADEMIC",
    date: "2024-03-20",
    time: "10:00",
    location: "BCA Exhibition Hall",
    maxParticipants: 200,
    club: "BCA Students Association",
    department: "Bachelor of Computer Applications (BCA)",
    createdAt: "2024-02-08T09:15:00Z",
    organizer: {
      id: "org8",
      name: "Dr. Anjali Gupta",
      email: "anjali.prof@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 87 },
    isInterestedByUser: false
  },
  {
    id: "9",
    title: "Mobile App Development with Flutter",
    description: "Learn to build cross-platform mobile applications using Flutter and Dart. Covers UI design, state management, and app deployment.",
    category: "TECHNICAL",
    date: "2024-03-25",
    time: "11:00",
    location: "Mobile Development Lab",
    maxParticipants: 25,
    club: "BCA Students Association",
    department: "Bachelor of Computer Applications (BCA)",
    createdAt: "2024-02-10T14:45:00Z",
    organizer: {
      id: "org9",
      name: "Arjun Patel",
      email: "arjun.bca@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 42 },
    isInterestedByUser: true
  },
  {
    id: "10",
    title: "Industry Connect: Career in IT",
    description: "Interactive session with IT industry professionals discussing career opportunities, interview tips, and skill requirements for BCA graduates.",
    category: "SEMINAR",
    date: "2024-04-01",
    time: "15:30",
    location: "BCA Seminar Hall",
    maxParticipants: 100,
    club: "BCA Students Association",
    department: "Bachelor of Computer Applications (BCA)",
    createdAt: "2024-02-12T11:20:00Z",
    organizer: {
      id: "org10",
      name: "Kavya Reddy",
      email: "kavya.placement@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 76 },
    isInterestedByUser: false
  },
  {
    id: "11",
    title: "BCA Coding Championship",
    description: "Competitive programming contest featuring algorithmic challenges, data structures problems, and time-bound coding challenges for BCA students.",
    category: "COMPETITION",
    date: "2024-04-05",
    time: "13:00",
    location: "Programming Lab 1 & 2",
    maxParticipants: 60,
    club: "BCA Students Association",
    department: "Bachelor of Computer Applications (BCA)",
    createdAt: "2024-02-15T16:00:00Z",
    organizer: {
      id: "org11",
      name: "Vikash Kumar",
      email: "vikash.bca@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    _count: { interests: 54 },
    isInterestedByUser: true
  }
]

export const mockBookRequests = [
  {
    id: "req1",
    message: "Hi! I'm interested in renting this book for the upcoming semester. When would be a good time to meet?",
    status: "PENDING",
    createdAt: "2024-01-16T09:30:00Z",
    requester: {
      id: "user1",
      name: "John Student",
      email: "john@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    }
  },
  {
    id: "req2",
    message: "I need this book for my final year project. Can we discuss the rental terms?",
    status: "PENDING",
    createdAt: "2024-01-15T14:20:00Z",
    requester: {
      id: "user2",
      name: "Jane Doe",
      email: "jane@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    }
  }
]

export const mockEventInterests = [
  {
    id: "int1",
    createdAt: "2024-01-21T10:15:00Z",
    user: {
      id: "user1",
      name: "John Student",
      email: "john@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    }
  },
  {
    id: "int2",
    createdAt: "2024-01-20T15:30:00Z",
    user: {
      id: "user2",
      name: "Jane Doe",
      email: "jane@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    }
  },
  {
    id: "int3",
    createdAt: "2024-01-19T11:45:00Z",
    user: {
      id: "user3",
      name: "Alex Brown",
      email: "alex@jssstu.edu.in",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    }
  }
]
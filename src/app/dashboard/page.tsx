// src/app/login/dashboard.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useSession, signOut } from 'next-auth/react';
import { FiBriefcase, FiCalendar, FiActivity, FiUser, FiBell, FiLogOut, FiSearch, FiMapPin, FiDollarSign, FiThumbsUp, FiThumbsDown, FiSettings, FiUpload, FiEdit3, FiX, FiCheck, FiAward, FiBookmark } from 'react-icons/fi';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import Image from 'next/image';
import NotificationDropdown from '@/app/components/NotificationDropdown';
import React from 'react';
import { Alert } from "@/app/components/Alert"
import { Check, Info, AlertTriangle, X as XIcon } from 'lucide-react';

// Add interface for user profile
interface UserProfile {
  name: string;
  email: string;
  about: string;
  resumeUrl: string | null;
  profileImage: string | null;
  settings: {
    shareResume: boolean;
    emailNotifications: boolean;
    publicProfile: boolean;
  };
}

// Add interface for application tracking
interface ApplicationTrack {
  jobId: number;
  companyName: string;
  jobTitle: string;
  dateApplied: string;
  resumeShared: boolean;
  status: string;
}

// Add interface for survey data
interface SurveyData {
  skills: string[];
  location: string;
  qualification: string;
  graduationYear: string;
  interests: string[];
  preferredCompanies: string[];
}

// Sample job data
const sampleJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Innovators",
    logo: "https://ui-avatars.com/api/?name=Tech+Innovators&background=0D8ABC&color=fff",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    description: "We're looking for an experienced frontend developer with React expertise to join our innovative team. You'll be working on cutting-edge projects that shape the future of web development.",
    requirements: ["5+ years React", "TypeScript", "Next.js"],
    benefits: ["Remote Work", "Health Insurance", "401k Match", "Unlimited PTO"],
    postedDate: "2 days ago",
    companySize: "50-200 employees",
    industry: "Technology",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupX",
    logo: "https://ui-avatars.com/api/?name=StartupX&background=6366F1&color=fff",
    location: "Remote",
    salary: "$100k - $130k",
    description: "Join our fast-growing team to build the next generation of web apps. We're looking for a passionate developer who loves working with modern technologies.",
    requirements: ["Node.js", "React", "MongoDB"],
    benefits: ["Equity", "Flexible Hours", "Learning Budget", "Home Office Stipend"],
    postedDate: "1 day ago",
    companySize: "10-50 employees",
    industry: "SaaS",
  },
  {
    id: 3,
    title: "React Native Developer",
    company: "Mobile Tech",
    logo: "https://ui-avatars.com/api/?name=Mobile+Tech&background=22C55E&color=fff",
    location: "New York, NY",
    salary: "$110k - $140k",
    description: "Join our mobile team to build cross-platform applications that millions of users love. We're seeking a talented developer who's passionate about mobile development.",
    requirements: ["React Native", "TypeScript", "Mobile Development"],
    benefits: ["Annual Bonus", "Health & Dental", "Gym Membership", "Stock Options"],
    postedDate: "3 days ago",
    companySize: "100-500 employees",
    industry: "Mobile Technology",
  },
  // Add more sample jobs as needed
];

const applicationHistory = [
  {
    id: 1,
    company: "Tech Corp",
    role: "Senior Frontend Developer",
    status: "Interview Scheduled",
    date: "2024-03-15",
    statusColor: "text-green-400",
  },
  {
    id: 2,
    company: "Innovation Labs",
    role: "Full Stack Engineer",
    status: "Application Sent",
    date: "2024-03-14",
    statusColor: "text-blue-400",
  },
  {
    id: 3,
    company: "StartupX",
    role: "React Developer",
    status: "Rejected",
    date: "2024-03-10",
    statusColor: "text-red-400",
  },
];

type FormState = {
  currentSkill: string;
  currentInterest: string;
  currentCompany: string;
};

type InputType = 'skills' | 'interests' | 'preferredCompanies';

const SurveyModal = ({
  showSurvey,
  setShowSurvey,
  surveyData,
  setSurveyData,
  setSurveyCompleted,
  showAlert
}: {
  showSurvey: boolean;
  setShowSurvey: (show: boolean) => void;
  surveyData: SurveyData;
  setSurveyData: (data: SurveyData | ((prev: SurveyData) => SurveyData)) => void;
  setSurveyCompleted: (completed: boolean) => void;
  showAlert: (description: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}) => {
  const [formState, setFormState] = useState<FormState>({
    currentSkill: "",
    currentInterest: "",
    currentCompany: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSurveyCompleted(true);
    setShowSurvey(false);
    showAlert('Survey completed successfully! We\'ll use this information to find better matches for you.', 'success');
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    type: InputType
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = formState[`current${type.charAt(0).toUpperCase() + type.slice(1, -1)}` as keyof FormState];
      if (value.trim()) {
        addItem(type, value);
      }
    }
  };

  const addItem = (type: InputType, value: string) => {
    if (!value.trim()) return;
    setSurveyData((prev: SurveyData) => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }));
    
    setFormState(prev => ({
      ...prev,
      [`current${type.charAt(0).toUpperCase() + type.slice(1, -1)}` as keyof FormState]: ""
    }));
  };

  const removeItem = (type: InputType, index: number) => {
    setSurveyData((prev: SurveyData) => ({
      ...prev,
      [type]: prev[type].filter((_: string, i: number) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Skills Survey</h2>
            <button
              onClick={() => setShowSurvey(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Skills</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formState.currentSkill}
                  onChange={(e) => setFormState(prev => ({ ...prev, currentSkill: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, 'skills')}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a skill (press Enter)"
                />
                <button
                  type="button"
                  onClick={() => addItem('skills', formState.currentSkill)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {surveyData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeItem('skills', index)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={surveyData.location}
                onChange={(e) => setSurveyData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your preferred location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Qualification</label>
              <select
                value={surveyData.qualification}
                onChange={(e) => setSurveyData(prev => ({ ...prev, qualification: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select qualification</option>
                <option value="Bachelor's">Bachelor's Degree</option>
                <option value="Master's">Master's Degree</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Graduation Year</label>
              <input
                type="number"
                min="1900"
                max="2030"
                value={surveyData.graduationYear}
                onChange={(e) => setSurveyData(prev => ({ ...prev, graduationYear: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Year of graduation"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Interests</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formState.currentInterest}
                  onChange={(e) => setFormState(prev => ({ ...prev, currentInterest: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, 'interests')}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add an interest (press Enter)"
                />
                <button
                  type="button"
                  onClick={() => addItem('interests', formState.currentInterest)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {surveyData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeItem('interests', index)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Preferred Companies</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formState.currentCompany}
                  onChange={(e) => setFormState(prev => ({ ...prev, currentCompany: e.target.value }))}
                  onKeyPress={(e) => handleKeyPress(e, 'preferredCompanies')}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a company (press Enter)"
                />
                <button
                  type="button"
                  onClick={() => addItem('preferredCompanies', formState.currentCompany)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {surveyData.preferredCompanies.map((company, index) => (
                  <span
                    key={index}
                    className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {company}
                    <button
                      type="button"
                      onClick={() => removeItem('preferredCompanies', index)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => setShowSurvey(false)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Skip for now
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [applications, setApplications] = useState<ApplicationTrack[]>([]);
  const [loadedJobs, setLoadedJobs] = useState(sampleJobs.slice(0, 5)); // Load jobs in chunks
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    about: '',
    resumeUrl: null,
    profileImage: null,
    settings: {
      shareResume: true,
      emailNotifications: true,
      publicProfile: false,
    }
  });
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    skills: [],
    location: "",
    qualification: "",
    graduationYear: "",
    interests: [],
    preferredCompanies: []
  });
  const [alert, setAlert] = useState<{
    show: boolean;
    title: string;
    description: string;
    icon?: React.ReactNode;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (currentJobIndex >= loadedJobs.length - 2 && loadedJobs.length < sampleJobs.length) {
      const nextBatch = sampleJobs.slice(loadedJobs.length, loadedJobs.length + 5);
      setLoadedJobs(prev => [...prev, ...nextBatch]);
    }
  }, [currentJobIndex, loadedJobs.length]);

  const currentJob = React.useMemo(() => 
    loadedJobs[currentJobIndex] || null,
    [loadedJobs, currentJobIndex]
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) return null;
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const clientX = 'touches' in event ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
    setDragStart({ x: clientX, y: 0 });
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isDragging || !currentJob) return;
    
    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);
    const direction = info.velocity.x > 0 ? 'right' : 'left';
    
    if (Math.abs(info.offset.x) > threshold || velocity > 300) {
      requestAnimationFrame(() => {
        if (direction === 'right') {
          handleJobAction('apply');
        } else {
          handleJobAction('pass');
        }
      });
    }
    
    setIsDragging(false);
  };

  const handleJobAction = (action: 'apply' | 'pass') => {
    if (!currentJob) return;

    if (action === 'apply') {
      const newApplication: ApplicationTrack = {
        jobId: currentJob.id,
        companyName: currentJob.company,
        jobTitle: currentJob.title,
        dateApplied: new Date().toISOString().split('T')[0],
        resumeShared: userProfile.settings.shareResume && userProfile.resumeUrl !== null,
        status: 'Applied'
      };
      
      setApplications(prev => [...prev, newApplication]);
      showAlert(
        `Your application for ${currentJob.title} position at ${currentJob.company} has been submitted successfully. We'll notify you when the company responds.`,
        'success'
      );
    } else {
      showAlert('Job skipped - We\'ll show you more relevant positions', 'info');
    }
    
    requestAnimationFrame(() => {
      if (currentJobIndex < loadedJobs.length - 1) {
        setCurrentJobIndex(prev => prev + 1);
      } else if (currentJobIndex === loadedJobs.length - 1 && loadedJobs.length === sampleJobs.length) {
        showAlert("You've reviewed all available jobs! Check your applications tab or start over.", 'info');
      }
    });
  };

  const handleInterviewScheduled = (company: string, date: string, position: string) => {
    showAlert(
      `Interview scheduled with ${company} for ${position} position on ${date}. Check your email for meeting details.`,
      'success'
    );
  };

  const handleStatusUpdate = (applicationId: number, newStatus: string) => {
    const updatedApplications = applications.map(app => {
      if (app.jobId === applicationId) {
        if (newStatus === 'Interview Scheduled') {
          const interviewDate = new Date();
          interviewDate.setDate(interviewDate.getDate() + 3);
          handleInterviewScheduled(
            app.companyName,
            interviewDate.toLocaleDateString(),
            app.jobTitle
          );
        }
        return { ...app, status: newStatus };
      }
      return app;
    });
    setApplications(updatedApplications);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'profile') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    
    if (type === 'resume') {
      setUserProfile(prev => ({ ...prev, resumeUrl: url }));
    } else {
      setUserProfile(prev => ({ ...prev, profileImage: url }));
    }
  };

  const handleSettingChange = (setting: keyof UserProfile['settings']) => {
    setUserProfile(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting as keyof UserProfile['settings']]
      }
    }));
  };

  const handleUserProfileUpdate = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showAlert = (description: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const icons = {
      success: <Check className="h-6 w-6 text-blue-700 flex-shrink-0" />,
      error: <XIcon className="h-6 w-6 text-red-700 flex-shrink-0" />,
      warning: <AlertTriangle className="h-6 w-6 text-yellow-700 flex-shrink-0" />,
      info: <Info className="h-6 w-6 text-blue-700 flex-shrink-0" />
    };

    const titles = {
      success: 'Success!',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };

    setAlert({
      show: true,
      title: titles[type],
      description,
      icon: icons[type]
    });

    setTimeout(() => setAlert(null), 3000);
  };

  const handleWithdraw = async (jobId: number) => {
    try {
      // Update local state first for immediate UI feedback
      setApplications(prev => prev.filter(app => app.jobId !== jobId));
      
      // Make API call to withdraw application
      const response = await fetch('/api/applications/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw application');
      }

      showAlert('Application withdrawn successfully', 'success');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      showAlert('Failed to withdraw application. Please try again.', 'error');
      // Optionally, you could refresh the applications list here to restore the withdrawn application
    }
  };

  const SettingsPanel = () => (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full w-80 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto z-50"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <button
          onClick={() => setShowSettings(false)}
          className="text-gray-400 hover:text-white"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {userProfile.profileImage ? (
              <Image
                src={userProfile.profileImage}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                <FiUser className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full cursor-pointer">
              <FiEdit3 className="w-4 h-4" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'profile')}
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Personal Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => handleUserProfileUpdate('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userProfile.email}
              onChange={(e) => handleUserProfileUpdate('email', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              About
            </label>
            <textarea
              value={userProfile.about}
              onChange={(e) => handleUserProfileUpdate('about', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Resume
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => document.getElementById('resume-upload')?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
            >
              <FiUpload />
              <span>Upload Resume</span>
            </button>
            <input
              id="resume-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e, 'resume')}
            />
            {userProfile.resumeUrl && (
              <span className="text-green-400">✓ Uploaded</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Privacy Settings</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Share Resume Automatically</span>
            <button
              onClick={() => handleSettingChange('shareResume')}
              className={`w-12 h-6 rounded-full transition-colors ${
                userProfile.settings.shareResume ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                  userProfile.settings.shareResume ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Email Notifications</span>
            <button
              onClick={() => handleSettingChange('emailNotifications')}
              className={`w-12 h-6 rounded-full transition-colors ${
                userProfile.settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                  userProfile.settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Public Profile</span>
            <button
              onClick={() => handleSettingChange('publicProfile')}
              className={`w-12 h-6 rounded-full transition-colors ${
                userProfile.settings.publicProfile ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                  userProfile.settings.publicProfile ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => {
              setShowSettings(false);
              showAlert("Settings saved successfully", 'success');
            }}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 mr-4"
              >
                <FiSettings className="h-6 w-6" />
              </button>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'dashboard' 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => setActiveTab('swipe')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'swipe' 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Job Search
                  </button>
                  <button 
                    onClick={() => setActiveTab('applications')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'applications' 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Applications
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-150"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showSettings && <SettingsPanel />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <>
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">Welcome back, {session.user?.name}!</h1>
                  <p className="mt-1 text-gray-400">Here's what's happening with your job search</p>
                </div>
                <div className="relative mt-4 md:mt-0">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full md:w-64 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300"
                  />
                  <FiSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiBriefcase className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Total Applications</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-white">10</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                            <span>+2 this week</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-blue-500 hover:text-blue-400 cursor-pointer">
                      View all applications →
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiActivity className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Response Rate</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-white">75%</div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-400">
                            <span>+5% this month</span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-green-500 hover:text-green-400 cursor-pointer">
                      View analytics →
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiCalendar className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Upcoming Interviews</dt>
                        <dd className="mt-1">
                          <div className="text-white">
                            <div className="font-semibold">Tech Innovators</div>
                            <div className="text-sm text-gray-400">Today at 10:00 AM</div>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-purple-400 hover:text-purple-300 cursor-pointer">
                      View schedule →
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiUser className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Profile Strength</dt>
                        <dd className="mt-1">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-700 rounded-full h-2 mr-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-sm text-yellow-500">85%</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Add a resume to reach 100%</p>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-yellow-500 hover:text-yellow-400 cursor-pointer">
                      Complete profile →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-6">
                {[
                  {
                    date: 'Today',
                    events: [
                      { time: '10:00 AM', title: 'Interview scheduled', company: 'Tech Corp', type: 'interview' },
                      { time: '9:30 AM', title: 'Application viewed', company: 'Innovation Labs', type: 'view' }
                    ]
                  },
                  {
                    date: 'Yesterday',
                    events: [
                      { time: '3:45 PM', title: 'Application submitted', company: 'Future Systems', type: 'application' },
                      { time: '1:15 PM', title: 'Profile updated', company: null, type: 'profile' }
                    ]
                  }
                ].map((day, index) => (
                  <div key={index} className="relative">
                    <div className="text-sm text-gray-400 mb-3">{day.date}</div>
                    <div className="space-y-4">
                      {day.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="flex items-start">
                          <div className="flex-shrink-0 w-10">
                            <div className="text-sm text-gray-400">{event.time}</div>
                          </div>
                          <div className="flex-grow ml-4">
                            <div className="text-white">{event.title}</div>
                            {event.company && (
                              <div className="text-sm text-gray-400">{event.company}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Tips to Boost Your Job Search</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-blue-400 mb-2">💡 Profile Optimization</div>
                  <p className="text-gray-300 text-sm">Keep your profile updated with latest skills and experiences.</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-green-400 mb-2">📝 Application Quality</div>
                  <p className="text-gray-300 text-sm">Tailor your resume for each application to increase response rates.</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-purple-400 mb-2">🎯 Interview Prep</div>
                  <p className="text-gray-300 text-sm">Practice common interview questions in your field.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'swipe' && (
          <div className="px-4 py-5">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Job Feed</h2>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2">
                    <FiSearch className="w-4 h-4" />
                    Search Jobs
                  </button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2">
                    <FiSettings className="w-4 h-4" />
                    Filters
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {sampleJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                            <Image
                              src={job.logo}
                              alt={job.company}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                              <p className="text-gray-300">{job.company}</p>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700">
                              <FiBookmark className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="mt-4 flex flex-wrap gap-3">
                            <div className="flex items-center text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
                              <FiMapPin className="mr-2 text-blue-400" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
                              <FiDollarSign className="mr-2 text-green-400" />
                              {job.salary}
                            </div>
                            <div className="flex items-center text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
                              <FiBriefcase className="mr-2 text-purple-400" />
                              {job.industry}
                            </div>
                            <div className="flex items-center text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
                              <FiCalendar className="mr-2 text-yellow-400" />
                              Posted {job.postedDate}
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="text-white font-semibold mb-2">About the Role</h4>
                            <p className="text-gray-300 leading-relaxed">{job.description}</p>
                          </div>

                          <div className="mt-6">
                            <h4 className="text-white font-semibold mb-2">Requirements</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20"
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6">
                            <h4 className="text-white font-semibold mb-2">Benefits</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {job.benefits.map((benefit, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center text-gray-300 text-sm"
                                >
                                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                                  {benefit}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-6 pt-6 border-t border-gray-700">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-400">
                                {job.companySize} • {job.industry}
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleJobAction('pass')}
                                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                                >
                                  <FiThumbsDown className="w-4 h-4" />
                                  Not Interested
                                </button>
                                <button
                                  onClick={() => handleJobAction('apply')}
                                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <FiThumbsUp className="w-4 h-4" />
                                  Easy Apply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setCurrentJobIndex(0)}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Load More Jobs
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="px-4 py-5">
            <h2 className="text-2xl font-bold text-white mb-6">Your Applications</h2>
            <div className="space-y-4">
              {applications.map((application) => (
                <motion.div
                  key={application.jobId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{application.jobTitle}</h3>
                      <p className="text-gray-400">{application.companyName}</p>
                    </div>
                    <span className={`font-medium ${application.status === 'Withdrawn' ? 'text-gray-400' : 'text-blue-400'}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="mt-4 text-sm">
                    <p className="text-gray-400">Applied on: {application.dateApplied}</p>
                    <p className={application.resumeShared ? "text-green-400" : "text-yellow-400"}>
                      {application.resumeShared ? "Resume shared ✓" : "Resume not shared"}
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-150"
                      onClick={() => {
                        // View details functionality can be implemented here
                        showAlert('Viewing application details...', 'info');
                      }}
                    >
                      View Details
                    </button>
                    {application.status !== 'Withdrawn' && (
                      <button 
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-150"
                        onClick={() => handleWithdraw(application.jobId)}
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {applications.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <p>No applications yet. Start swiping to apply!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!surveyCompleted && (
          <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Complete Your Profile</h3>
                <p className="text-gray-400">Take our skills survey to get better job recommendations</p>
              </div>
              <button
                onClick={() => setShowSurvey(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FiAward className="w-5 h-5" />
                Take Survey
              </button>
            </div>
          </div>
        )}
      </div>

      {showSurvey && (
        <SurveyModal
          showSurvey={showSurvey}
          setShowSurvey={setShowSurvey}
          surveyData={surveyData}
          setSurveyData={setSurveyData}
          setSurveyCompleted={setSurveyCompleted}
          showAlert={showAlert}
        />
      )}

      {alert?.show && (
        <Alert
          title={alert.title}
          description={alert.description}
          icon={alert.icon}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}

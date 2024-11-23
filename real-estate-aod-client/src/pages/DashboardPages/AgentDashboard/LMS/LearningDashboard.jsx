'use client'

import { useState } from 'react'
import LearningModules from './LearningModules'
import InteractiveQuizzes from './InteractiveQuizzes'

const modules = [
  {
    id: 1,
    title: "Introduction to Real Estate",
    description: "Overview of the Real Estate Industry",
    progress: 80,
    subsections: [
      { 
        id: 101, 
        title: "Key Stakeholders in Real Estate", 
        description: "Learn the fundamental structure real estate",
        progress: 100,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML"
      },
      { 
        id: 102, 
        title: "Types of Real Estate Properties", 
        description: "Residential, Commercial, Industrial, Agricultural",
        progress: 60,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps"
      },
      { 
        id: 103, 
        title: "Real Estate Terminology", 
        description: "Get started with programming for the web.",
        progress: 80,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps"
      }
    ]
  },
  {
    id: 2,
    title: "Real Estate Market Analysis",
    description: "Deep dive into JavaScript ES6+ features and best practices.",
    progress: 40,
    subsections: [
      { 
        id: 201, 
        title: "ES6 Syntax", 
        description: "Explore modern JavaScript syntax and features.",
        progress: 20,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements"
      },
      { 
        id: 202, 
        title: "Async Programming", 
        description: "Master asynchronous JavaScript programming.",
        progress: 50,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        articleUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous"
      }
    ]
  }
]

const quizzes = [
  { id: 1, title: "Real Estate Market Basics Quiz", difficulty: "Beginner", status: "Completed", score: 95 },
  { id: 2, title: "Property Valuation Essentials Quiz", difficulty: "Beginner", status: "Not Started" },
  { id: 3, title: "Real Estate Finance Concepts Quiz", difficulty: "Intermediate", status: "In Progress" },
  { id: 4, title: "Legal Aspects of Real Estate Quiz", difficulty: "Intermediate", status: "Completed", score: 78 },
  { id: 5, title: "Advanced Real Estate Investment Strategies Quiz", difficulty: "Advanced", status: "Completed", score: 88 }
];

export function LearningDashboard() {
  const [activeTab, setActiveTab] = useState('modules')

  const totalModules = modules.length
  const completedModules = modules.filter(module => module.progress === 100).length

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Learning Modules Dashboard</h1>
        <p className="text-xl">
          {completedModules} of {totalModules} modules completed
        </p>
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-blue-200 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedModules / totalModules) * 100}%` }}
          ></div>
        </div>
      </header>

      <div className="mb-6">
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-md">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'modules'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('modules')}
          >
            Learning Modules
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === 'quizzes'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('quizzes')}
          >
            Interactive Quizzes
          </button>
        </div>
      </div>

      {activeTab === 'modules' ? (
        <LearningModules modules={modules} />
      ) : (
        <InteractiveQuizzes quizzes={quizzes} />
      )}
    </div>
  )
}

export default LearningDashboard;

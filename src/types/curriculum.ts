export type PriorityLevel = 'CORE' | 'HIGH VALUE' | 'STRETCH';

export type ProblemStatus = 'GREEN' | 'YELLOW' | 'RED' | 'GREY';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type ResourceAccess = 'free' | 'free-account' | 'partially-free' | 'paid-reference';

export interface ResourceItem {
  id: string;
  title: string;
  provider: string; // e.g., 'Striver A2Z', 'LeetCode', 'GeeksforGeeks', 'VisuAlgo', 'Oracle Java'
  url: string;
  type: 'article' | 'video' | 'interactive' | 'roadmap' | 'documentation';
  access: ResourceAccess;
  order: number;
  verified: boolean;
  verifiedDate?: string;
  notes?: string;
}

export interface PracticeProblem {
  id: string;
  title: string;
  platform: 'LeetCode' | 'CodeChef' | 'GeeksforGeeks' | 'HackerRank' | 'Striver' | 'Custom';
  url: string;
  difficulty: DifficultyLevel;
  pattern: string;
  topicId: string;
  subtopicId?: string;
  order: number;
}

export interface SubtopicItem {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  javaSnippet?: string;
  commonPitfalls?: string[];
  checklistItems: string[];
}

export interface TopicModule {
  id: string;
  slug: string;
  moduleNumber: number;
  title: string;
  subtitle: string;
  description: string;
  priority: PriorityLevel;
  estimatedHours: number;
  prerequisites: string[]; // Topic IDs
  learningObjectives: string[];
  practicalApplications: string[];
  patternClues: string[];
  complexityNotes: {
    time: string;
    space: string;
    intuition: string;
  };
  javaImplementationNotes: {
    coreDataStructures: string;
    tricks: string[];
    gotchas: string[];
    codeTemplate: string;
  };
  commonMistakes: string[];
  boundaryCases: string[];
  subtopics: SubtopicItem[];
  resources: ResourceItem[];
  practiceProblems: PracticeProblem[];
}

export interface JavaEssentialTopic {
  id: string;
  title: string;
  category: 'Primitives & Memory' | 'Collections Framework' | 'Comparators & Lambdas' | 'Strings & I/O' | 'Recursion & Stack';
  description: string;
  keyRules: string[];
  codeExample: string;
  complexityCost: string;
  interviewTip: string;
}

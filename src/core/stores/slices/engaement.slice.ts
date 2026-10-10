import {StateCreator} from 'zustand';

export interface QuestionAndAnswer {
  id: number;
  question: string;
  answer: any;
  answerString?: string;
}

export interface EngagementState {
  quiz: QuestionAndAnswer[];
  safetyPlan: QuestionAndAnswer[];
  statergies: QuestionAndAnswer[];
  messageCount: {date: string; count: number};
  prompt: string;
  lastGreeted: string;
  preferences: string[];
}

export interface EngagementActions {
  clearEngagement: () => void;
  addQuiz: (val: QuestionAndAnswer) => void;
  addSafetyPlan: (val: QuestionAndAnswer) => void;
  addStrategy: (val: QuestionAndAnswer) => void;
  setMessageCount: (val: {date: string; count: number}) => void;
  setPrompt: (val: string) => void;
  setLastGreeted: (val: string) => void;
  getQuizWithID: (id: number) => QuestionAndAnswer;
  getSafetyPlanWithID: (id: number) => QuestionAndAnswer;
  getStatergiesWithID: (id: number) => QuestionAndAnswer;
  setStatergyWithID: (id: number, answer: string) => void;
  setSafetyPlanWithID: (id: number, answer: string) => void;
  addPreference: (preference: string) => void;
  removePreference: (preference: string) => void;
  clearPreference: () => void;
}

export interface EngagementSlice {
  engagement: EngagementState & EngagementActions;
}

const initialEngagementState: EngagementState = {
  quiz: [],
  safetyPlan: [],
  statergies: [],
  messageCount: {date: '', count: 0},
  prompt: '',
  lastGreeted: '',
  preferences: [],
};

const upsert = (
  list: QuestionAndAnswer[],
  item: QuestionAndAnswer,
): QuestionAndAnswer[] => {
  const index = list.findIndex(q => q.id === item.id);
  if (index !== -1) {
    const updated = [...list];
    updated[index] = item;
    return updated;
  }
  return [...list, item];
};

const createEngagementSlice: StateCreator<
  EngagementSlice,
  [],
  [],
  EngagementSlice
> = (set, get) => ({
  engagement: {
    ...initialEngagementState,

    clearEngagement() {
      set(state => ({
        engagement: {
          ...state.engagement,
          quiz: [],
          safetyPlan: [],
          statergies: [],
          messageCount: {date: '', count: 0},
          prompt: '',
          lastGreeted: '',
        },
      }));
    },

    addQuiz(val: QuestionAndAnswer) {
      set(state => ({
        engagement: {
          ...state.engagement,
          quiz: upsert(state.engagement.quiz, val),
        },
      }));
    },

    addSafetyPlan(val: QuestionAndAnswer) {
      set(state => ({
        engagement: {
          ...state.engagement,
          safetyPlan: upsert(state.engagement.safetyPlan, val),
        },
      }));
    },

    addStrategy(val: QuestionAndAnswer) {
      set(state => ({
        engagement: {
          ...state.engagement,
          statergies: upsert(state.engagement.statergies, val),
        },
      }));
    },

    setMessageCount(val: {date: string; count: number}) {
      set(state => ({
        engagement: {
          ...state.engagement,
          messageCount: val,
        },
      }));
    },

    setPrompt(val: string) {
      set(state => ({
        engagement: {
          ...state.engagement,
          prompt: val,
        },
      }));
    },

    setLastGreeted(val: string) {
      set(state => ({
        engagement: {
          ...state.engagement,
          lastGreeted: val,
        },
      }));
    },

    getQuizWithID(id) {
      const quizItem = get().engagement.quiz.find(q => q.id === id);
      return quizItem!;
    },

    getSafetyPlanWithID(id) {
      const safetyItem = get().engagement.safetyPlan.find(q => q.id === id);
      return safetyItem!;
    },

    getStatergiesWithID(id) {
      const statergyItem = get().engagement.statergies.find(q => q.id === id);
      return statergyItem!;
    },

    setStatergyWithID(id: number, answer: string) {
      set(state => ({
        engagement: {
          ...state.engagement,
          statergies: upsert(state.engagement.statergies, {
            id,
            answer,
            question: '',
          }),
        },
      }));
    },

    setSafetyPlanWithID(id: number, answer: string) {
      set(state => ({
        engagement: {
          ...state.engagement,
          safetyPlan: upsert(state.engagement.safetyPlan, {
            id,
            answer,
            question: '',
          }),
        },
      }));
    },

    addPreference(preference) {
      set(state => ({
        engagement: {
          ...state.engagement,
          preferences: [...state.engagement.preferences, preference],
        },
      }));
    },

    removePreference(preference) {
      set(state => ({
        engagement: {
          ...state.engagement,
          preferences: state.engagement.preferences.filter(
            item => item !== preference,
          ),
        },
      }));
    },

    clearPreference() {
      set(state => ({
        engagement: {
          ...state.engagement,
          preferences: [],
        },
      }));
    },
  },
});

export default createEngagementSlice;

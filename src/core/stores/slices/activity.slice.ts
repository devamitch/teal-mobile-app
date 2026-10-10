import {StateCreator} from 'zustand';

export interface QuestionAndAnswer {
  id?: number;
  question?: string;
  answer?: string | string[] | number | number[] | boolean | boolean[] | null;
  options?: string[];
  correctAnswer?:
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[]
    | null;
  isCorrect?: boolean;
  isAnswered?: boolean;
  isSubmitted?: boolean;
  timeTaken?: number; // in seconds
  questionType?: 'single' | 'multiple' | 'text' | 'number' | 'boolean';
  videoID?: number; // ID of the video this question belongs to
  questionString?: string;
  answerString?: string;
  correctAnswerString?: string;
  optionsString?: string[];
  userAnswerString?: string;
  userCorrectAnswerString?: string;
  userOptionsString?: string[];
  userQuestionString?: string;
  userQuestionType?: 'single' | 'multiple' | 'text' | 'number' | 'boolean';
  userTimeTaken?: number; // in seconds
  userVideoID?: number; // ID of the video this question belongs to
  userID?: string; // ID of the user who answered the question
  userName?: string; // Name of the user who answered the question
  createdAt?: Date; // Timestamp when the question was created
  updatedAt?: Date; // Timestamp when the question was last updated
  isActive?: boolean; // Whether the question is active or not
  isDeleted?: boolean; // Whether the question is deleted or not
  isFlagged?: boolean; // Whether the question is flagged or not
  isReviewed?: boolean; // Whether the question has been reviewed or not
  reviewComments?: string; // Comments from the reviewer
  reviewerID?: string; // ID of the user who reviewed the question
  reviewerName?: string; // Name of the user who reviewed the question
  reviewDate?: Date; // Date when the question was reviewed
  reviewStatus?: 'pending' | 'approved' | 'rejected'; // Status of the review
  feedback?: string; // Feedback from the reviewer
  tags?: string[]; // Tags associated with the question
  difficultyLevel?: 'easy' | 'medium' | 'hard'; // Difficulty level of the question
  category?: string; // Category of the question
  subCategory?: string; // Sub-category of the question
  videoTitle?: string; // Title of the video this question belongs to
  videoDescription?: string; // Description of the video this question belongs to
  videoDuration?: number; // Duration of the video in seconds
  videoThumbnail?: string; // URL of the video's thumbnail image
  videoURL?: string; // URL of the video
  videoSource?: 'local' | 'remote'; // Source of the video (local or remote)
  videoQuality?: 'low' | 'medium' | 'high'; // Quality of the video
  videoFormat?: 'mp4' | 'webm' | 'mkv'; // Format of the video
  videoSize?: number; // Size of the video in bytes
  videoLanguage?: string; // Language of the video
  videoSubtitles?: string[]; // Subtitles available for the video
  videoTags?: string[]; // Tags associated with the video
  videoCreatedAt?: Date; // Timestamp when the video was created
  videoUpdatedAt?: Date; // Timestamp when the video was last updated
  videoUploaderID?: string; // ID of the user who uploaded the video
  videoUploaderName?: string; // Name of the user who uploaded the video
  videoUploaderEmail?: string; // Email of the user who uploaded the video
  videoUploaderProfilePicture?: string; // Profile picture of the user who uploaded the video
  videoUploaderBio?: string; // Bio of the user who uploaded the video
  videoUploaderWebsite?: string; // Website of the user who uploaded the video
  videoUploaderSocialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  }; // Social links of the user who uploaded the video
  videoUploaderCreatedAt?: Date; // Timestamp when the user was created
  videoUploaderUpdatedAt?: Date; // Timestamp when the user was last updated
  videoUploaderIsActive?: boolean; // Whether the user is active or not
  videoUploaderIsDeleted?: boolean; // Whether the user is deleted or not
}

export interface VideoActivityState {
  quiz: QuestionAndAnswer[];
}

export interface VideoActivityActions {
  clearVideoActivity: () => void;
  addQuiz: (val: QuestionAndAnswer) => void;
  getQuizWithID: (id: number) => QuestionAndAnswer;
}

export interface VideoActivitySlice {
  videoActivity: VideoActivityState & VideoActivityActions;
}

const initialVideoActivityState: VideoActivityState = {
  quiz: [],
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

const createVideoActivitySlice: StateCreator<
  VideoActivitySlice,
  [],
  [],
  VideoActivitySlice
> = (set, get) => ({
  videoActivity: {
    ...initialVideoActivityState,

    clearVideoActivity() {
      set(state => ({
        videoActivity: {
          ...state.videoActivity,
          quiz: [],
        },
      }));
    },

    addQuiz(val: QuestionAndAnswer) {
      set(state => ({
        videoActivity: {
          ...state.videoActivity,
          quiz: upsert(state.videoActivity.quiz, val),
        },
      }));
    },

    getQuizWithID(id) {
      const quizItem = get().videoActivity.quiz.find(q => q.id === id);
      return quizItem!;
    },
  },
});

export default createVideoActivitySlice;

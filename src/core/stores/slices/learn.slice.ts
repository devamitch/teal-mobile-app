import { FeedItem } from 'react-native-rss-parser';
import type {StateCreator} from 'zustand';

interface LearnState {
    article: FeedItem[];
    podcast: FeedItem[];
    interactiveVideo: string[];
}

interface LearnActions {
    clearBookMarked: () => void;
    saveArticle: (item: FeedItem, onSave?: () => void) => void;
    removeArticle: (key: FeedItem, onRemove?: () => void) => void;
    isArticleSaved: (item: FeedItem) => boolean;
    savePodcast: (item: FeedItem, onSave?: () => void) => void;
    removePodcast: (key: FeedItem, onRemove?: () => void) => void;
    isPodcastSaved: (item: FeedItem) => boolean;
    saveInteractiveVideo: (item: string, onSave?: () => void) => void;
    removeInteractiveVideo: (key: string, onRemove?: () => void) => void;
    isInteractiveVideoSaved: (item: string) => boolean;
}

export interface LearnSlice {
  learn: LearnState & LearnActions;
}

const initialUserState: LearnState = {
    article: [],
    podcast: [],
    interactiveVideo: [],
};

const createLearnSlice: StateCreator<LearnSlice, [], [], LearnSlice> = (
  set,
  get,
) => ({
    learn: {
        ...initialUserState,

        clearBookMarked: () => {
            set(state => ({
                learn: {
                    ...state.learn,
                    ...initialUserState,
                }
            }))
        },

        saveArticle:(item, onSave) => {
            set(state => ({
                learn:{
                    ...state.learn,
                    article: [
                        ...state.learn.article,
                        item,
                    ]
                }
            }))

            if(onSave){
                onSave();
            }
        },

        removeArticle: (item, onRemove) => {
            const article = get().learn.article;
            set(state =>({
                learn:{
                    ...state.learn,
                    article: article.filter(val => val !== item),
                }
            }))

            if(onRemove){
                onRemove();
            }
        },

        isArticleSaved: (item) => {
            const articles = get().learn.article;
            if(articles.includes(item))
                return true;
            return false;
        },

        savePodcast:(item, onSave) => {
            set(state => ({
                learn:{
                    ...state.learn,
                    podcast: [
                        ...state.learn.podcast,
                        item,
                    ]
                }
            }))

            if(onSave){
                onSave();
            }
        },

        removePodcast: (item, onRemove) => {
            const podcast = get().learn.podcast;
            set(state =>({
                learn:{
                    ...state.learn,
                    podcast: podcast.filter(val => val !== item),
                }
            }))

            if(onRemove){
                onRemove();
            }
        },

        isPodcastSaved: (item) => {
            const podcasts = get().learn.podcast;
            if(podcasts.includes(item))
                return true;
            return false;
        },

        saveInteractiveVideo:(item, onSave) => {
            set(state => ({
                learn:{
                    ...state.learn,
                    interactiveVideo: [
                        ...state.learn.interactiveVideo,
                        item,
                    ]
                }
            }))

            if(onSave){
                onSave();
            }
        },

        removeInteractiveVideo: (item, onRemove) => {
            const interactiveVideo = get().learn.interactiveVideo;
            set(state =>({
                learn:{
                    ...state.learn,
                    interactiveVideo: interactiveVideo.filter(val => val !== item),
                }
            }))

            if(onRemove){
                onRemove();
            }
        },

        isInteractiveVideoSaved: (item) => {
            const interactiveVideo = get().learn.interactiveVideo;
            if(interactiveVideo.includes(item))
                return true;
            return false;
        },
    }
});

export default createLearnSlice;

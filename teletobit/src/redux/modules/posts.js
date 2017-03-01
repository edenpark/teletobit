import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

/* Actions */
const PAGE_NUM_SET = 'posts/PAGE_NUM_SET';
const POST_STORE_UPDATE = 'posts/POST_STORE_UPDATE';

const POST_UPVOTE_UPDATE = 'posts/POST_UPVOTE_UPDATE';
const POST_SORT_UPDATE ='posts/POST_SORT_UPDATE';

/* action creators */
export const setPageNum = createAction(PAGE_NUM_SET);
export const updatePostStore = createAction(POST_STORE_UPDATE);

export const updateUpvotePost = createAction(POST_UPVOTE_UPDATE);
export const updateSortPost = createAction(POST_SORT_UPDATE);

const sortValues = {
    // values mapped to firebase locations at baseRef/posts
    클릭: 'views',
    최신: 'time',
    추천: 'upvotes'
};

/* initialState */
const initialState = Map({
    pageNum: 1,
    loading: true,
    posts: [],
    currentPage: 1,
    nextPage: true,
    sortOptions: Map({
        currentValue: '클릭',
        values: sortValues
    })
});

/* reducers */
export default handleActions({
    [PAGE_NUM_SET]: (state, action) => {
        const value = action.payload;
        return state.set('pageNum', value);
    },
    [POST_STORE_UPDATE]: (state, action) => {
        const data = action.payload;
        return state.merge({
            loading: false,
            posts: data.posts,
            nextPage: data.nextPage,
            currentPage: data.currentPage,
        });
    },
    [POST_UPVOTE_UPDATE]: (state, action) => {
        const { postId, upvotes } = action.payload;
        const indexOfListingToUpdate = state.get('posts').findIndex(listing => {
          return listing.get('id') === postId;
        });
        return state.setIn(['posts', indexOfListingToUpdate, 'upvotes'], upvotes);
    },
    [POST_SORT_UPDATE]: (state, action) => {
        const value = action.payload;
        return state.setIn(['sortOptions', 'currentValue'], value);
    }
}, initialState);

import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('1 == 1', function () {
        expect(true).toBe(true)
    });

    //see on korras!
    it('render the correct amount of posts', () => {
        const items = wrapper.findAll('.post')
        expect(items.length).toEqual(testData.length);
    });

    //no clue ausalt, kuidas neid tüüpe kätte saada
    it('test if post has media', () => {
        const mediaItems = wrapper.findAll('.post-image');
        const images = testData.filter(item => item.media.type === 'image');
        const videos = testData.filter(item => item.media.type === 'video');
        const noMedia = testData.filter(item => item.media === 'null');

        if (!mediaItems.isEmpty()) {
            if (mediaItems.contains(images)) {
                expect(mediaItems).toContain(images);
            }
            else {
                expect(mediaItems).toContain(videos);
            }
        }
        else {
            expect(mediaItems).toContain(noMedia);
        }
    });

    // kuidas saada vastavas formaadis createTime kätte
    it('test if the create time is in correct format', () => {
        const dateandtime = testData.filter(item => item.createTime);

        let now = new Date();
        let monthNames = ["January", "February", "March", "April", "Mai", "June", "July", "August", "September", "October", "November","December"];
        let weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let year = now.getFullYear();
        let month = monthNames[now.getMonth()];
        let weekday = weekdayNames[now.getDay()];
        let date = now.getDate();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let format = weekday + ", " + month + " " + date + ", " + year + " " + hours + ":" + minutes + " PM";

        expect(dateandtime.toString()).toMatch(format);
    });

});
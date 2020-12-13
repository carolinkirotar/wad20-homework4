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

    // peaks töötama
    it('test if post has media', () => {
        const items = wrapper.findAll('.post')
        const mediaItems = wrapper.findAll('.post-image'); // size of items and mediaItems are not the same, duh


        expect(mediaItems.at(0).get("img").exists()).toBe(true)
        expect(items.at(1).find(".post-image").exists()).toBe(false)
        expect(mediaItems.at(1).get("video").exists()).toBe(true)
        /*

        for (let i = 0; i < items.length; i++) {
            if (testData[i].media == null){
                expect(mediaItems[i].exists()).toBe(false)
            }
            if (testData[i].media!= null){
                if (testData[i].media.type === "image"){
                    expect(mediaItems[i].find('image').exists()).toBe(true)
                }
                if (testData[i].media.type === "video"){
                    expect(mediaItems[i].find('video').exists()).toBe(true)
                }
            }
        }

         */
    });

    // peaks töötama
    it('test if the create time is in correct format', () => {
        const items = wrapper.findAll('.post')

        const single = items.at(0).find(".post-author").findAll("small").at(1) //Index 1 - date
        expect(single.text()).toBe("Saturday, December 5, 2020 1:53 PM"); // Running the tests showed this date as what it should equal
/*
        for (let i = 0; i < items.length; i++) {
            const actual = testData[i].createTime;
            const temp = items.at(i).find(testData[i].createTime)

            expect(temp.text()).toEqual(actual))
        }
 */
    });
});
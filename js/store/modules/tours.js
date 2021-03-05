import axios from 'axios';
import Vue from 'vue';

export const state = {
    list: [],
    current: { stops: [], route: [], },
    wasModified: false,
    originalRoutes: [],

    url: '',

    currentStop: { routes: [], },

    stopChanges: false,
    stopMode: 'map',
    formViewMode: 'tour', // options: tour, stop
    isInitialMap: true,
}

export const getters = {
    list: state => state.list,
    count: state => state.list.length,
    current: state => state.current,
    saveUrl: state => `${state.url}tours/${state.current.id}`,
    createUrl: state => `${state.url}tours`,
    mediaUrl: state => `${state.url}media/upload`,
    createStopUrl: state => `${state.url}tours/${state.current.id}/stops`,
    orderUrl: state => `${state.url}tours/${state.current.id}/stop-order`,
    saveStopUrl: state => `${state.url}tours/${state.current.id}/stops/${state.currentStop.id}`,
    savePromoCodeUrl: state => `${state.url}tours/${state.current.id}/promo-code`,
    currentStop: state => state.currentStop,
    isInitialMap: state => state.isInitialMap, // only true when tour map is initialized first
    getStopRoute: (state) => (next_id) => {
        return state.currentStop.routes.find(obj => {
            return obj.next_stop_id == next_id;
        });
    },
    getStopChanges: (state) => {
        return state.stopChanges;
    },
    stopMode: (state) => {
        return state.stopMode;
    },
    getStopFromid: (state) => (stop_id) => {
        return state.current.stops.find(obj => {
            return obj.id == stop_id;
        });
    },
    getNextStopOrder: (state) => {
        let max = 0;
        state.current.stops.forEach(item => {
            if (item.order > max) {
                max = item.order;
            }
        });

        return max + 1;
    },
}

export const mutations = {
    setFormViewMode(state, mode) {
        Vue.set(state, 'formViewMode', mode);
    },

    setOriginalRoutes(state, routes) {
        Vue.set(state, 'originalRoutes', routes);
    },

    setStopMode(state, mode) {
        if (mode == state.stopMode) {
            return;
        }
        
        Vue.set(state, 'stopMode', mode);
    },
    setWasModified(state, yesno) {
        Vue.set(state, 'wasModified', yesno);
    },
    setStopChanges(state, yesno) {
        Vue.set(state, 'stopChanges', yesno);
    },
    setIsInitialMap(state, isInitialMap) {
        Vue.set(state, 'isInitialMap', isInitialMap);
    },
    clearStopRoute(state, next_id) {
        let routes = state.currentStop.routes.filter(obj => {
            return obj.next_stop_id != next_id;
        })

        console.log('modified routes:');
        console.log(routes);

        // state.currentStop.routes = routes;
        Vue.set(state, 'currentStop', {
            ...state.currentStop,
            routes,
        });
    },

    setStopRoute(state, stopRoute) {
        let index = state.currentStop.routes.findIndex(obj => {
            return obj.next_stop_id == stopRoute.next_stop_id;
        });
        if (index > -1) {
            // update current
            console.log("updating route");
            state.currentStop.routes.splice(index, 1, stopRoute);
            return;
        }

        // add new
        console.log("adding new route");
        state.currentStop.routes.push(stopRoute);
    },

    setUrl(state, url) {
        Vue.set(state, 'url', url);
    },

    fetchToursSuccess(state, { list }) {
        state.list = list
    },

    fetchToursFailure(state, { list }) {
        state.list = []
    },

    pushToList(state, tour) {
        state.list.push(tour)
    },

    setCurrent(state, tour) {
        Vue.set(state, 'current', tour)
    },

    setStartOrEndPoint(state, stop) {
        let tour = state.current;
        switch (stop.form.role) {
            case 0: {
                tour['start_point_id'] = stop.stopID;
                tour['start_image'] = stop.form.start_image;
                tour['start_message'] = stop.form.start_message;
                tour['start_video_url'] = stop.form.start_video_url;
                if (tour['end_point_id'] === stop.stopID) {
                    tour['end_point_id'] = '';
                    tour['end_image'] = '';
                    tour['end_message'] = '';
                    tour['end_video_url'] = '';
                }
                break;
            }
            case 1: {
                if (tour['end_point_id'] === stop.stopID) {
                    tour['end_point_id'] = '';
                    tour['end_image'] = '';
                    tour['end_message'] = '';
                    tour['end_video_url'] = '';
                }
                if (tour['start_point_id'] === stop.stopID) {
                    tour['start_point_id'] = '';
                    tour['start_image'] = '';
                    tour['start_message'] = '';
                    tour['start_video_url'] = '';
                }
                break;
            }
            case 2: {
                tour['end_point_id'] = stop.stopID;
                tour['end_image'] = stop.form.end_image;
                tour['end_message'] = stop.form.end_message;
                tour['end_video_url'] = stop.form.end_video_url;
                if (tour['start_point_id'] === stop.stopID) {
                    tour['start_point_id'] = '';
                    tour['start_image'] = '';
                    tour['start_message'] = '';
                    tour['start_video_url'] = '';
                }
            }
            break;
        }
        Vue.set(state, 'current', tour);
    },

    clearCurrentTour(state) {
        Vue.set(state, 'current', { stops: [], route: [], })
    },

    mediaUploadSuccess(state, {field, media}) {
        let tour = state.current;
        tour[`${field}_id`] = media.id;
        tour[field] = media;
        Vue.set(state, 'current', tour)
    },

    pushStop(state, stop) {
        state.current.stops.push(stop)
    },

    setCurrentStop(state, stop) {
        Vue.set(state, 'currentStop', JSON.parse(JSON.stringify(stop)));
    },

    updateStop(state, stop) {
        let index = state.current.stops.findIndex(obj => obj.id == stop.id);
        if (index > -1) {
            state.current.stops.splice(index, 1, stop);
            Vue.set(state, 'currentStop', stop);
        }
    },

    removeStop(state, stopId) {
        let index = state.current.stops.findIndex(obj => obj.id == stopId);
        if (index > -1) {
            state.current.stops.splice(index, 1);
        }
    },

    setTourRoute(state, route) {
        Vue.set(state, 'current', {...state.current, route});
    },

    setEmptyStop(state, location = {}) {
        Vue.set(state, 'currentStop', {
            id: null,
            title: '',
            description: '',

            location: location,
            is_multiple_choice: false,
            question: '',
            question_answer: '',
            question_success: '',
            next_stop_id: null,
            choices: [],    
            video_url: '',

            intro_audio: "",
            intro_audio_id: "",
            background_audio: "",
            background_audio_id: "",
            play_radius: 0,
            main_image: '',
            main_image_id: '',
            image1: '',
            image1_id: '',
            image2: '',
            image2_id: '',
            image3: '',
            image3_id: '',

            routes: [],
        });
    },

    setEmptyTour(state) {
        Vue.set(state, 'current', {
            id: null,
            title: "",
            description: "",
            type: "",
            pricing_type: "",

            location: {
                latitude: "",
                longitude: "",
                address1: "",
                address2: "",
                city: "",
                state: "",
                country: "",
                zipcode: ""
            },
            background_audio: "",
            background_audio_id: "",
            deleted_at: "",
            end_image: "",
            end_message: "",
            end_point_id: "",
            end_video_url: "",
            facebook_url: "",
            image1: "",
            image1_id: "",
            image2: "",
            image2_id: "",
            image3: "",
            image3_id: "",
            instagram_url: "",
            intro_audio: "",
            intro_audio_id: "",
            main_image: "",
            main_image_id: "",
            pin_image: "",
            pin_image_id: "",
            pricing_type: "",
            prize_location: {
                latitude: "",
                longitude: "",
                address1: "",
                address2: "",
                city: "",
                state: "",
                country: "",
                zipcode: ""
            },
            has_prize: false,
            prize_details: "",
            prize_instructions: "",
            prize_time_limit: "",
            published_at: "",
            start_image: "",
            start_message: "",
            start_point_id: "",
            start_video_url: "",
            stops: [],
            route: [],
            title: "",
            trophy_image: "",
            trophy_image_id: "",
            twitter_url: "",
            type: "",
            video_url: "",
            in_app_id: '',
            token_cost: 10,
            local_token_cost: 10,
            currency: 'USD',
            promo_code_limit: 0,
            promo_codes: []
        });
    },

    updateStopOrder(state, order) {
        let i = 0;

        order.forEach(id => {
            i++;
            
            let index = state.current.stops.findIndex(obj => obj.id == id);
            if (index > -1) {
                let stop = state.current.stops[index];
                state.current.stops.splice(index, 1, {...stop, order: i});
            }
            if (state.currentStop.id == id) {
                Vue.set(state, 'currentStop', {...state.currentStop, order: i});
            }
        });

    },
}

export const actions = {
    saveToken ({ commit, dispatch }, payload) {
        commit('saveToken', payload)
    },

    async fetchTours ({ commit }) {
        try {
            const { data } = await axios.get(state.url + 'tours')
            
            commit('fetchToursSuccess', { list: data })
        } catch (e) {
            commit('fetchToursFailure')
        }
    },

    async fetchTour ({ commit }, id) {
        try {
            commit('clearCurrentTour');
            const response = await axios.get(state.url + `tours/${id}`)
            
            if (response.status == 200) {
                commit('setCurrent', response.data)
                console.log("response");
            } 
            
        } catch (e) {
            console.log(e);
            commit('clearCurrentTour')
        }
    },

    async deleteStop ({ commit }, id) {
        try {
            const response = await axios.delete(getters.saveUrl(state) + `/stops/${id}`)
            if (response.status == 200) {
                return true;
            } 
        } catch (e) {
            return e;
        }
    },

    async saveStopOrder({ commit, dispatch }) {
        let stopOrder = state.current.stops.map(obj => {
            return obj.id;
        })
        
        axios.put(getters.orderUrl(state), { order: stopOrder })
            .then(({ data }) => {
                commit('updateStopOrder', data.data.order);
            })
            .catch(e => {
                console.log("save order error:");
                console.log(e);
            });
    },
}

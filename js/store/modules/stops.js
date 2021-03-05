import axios from 'axios';
import Vue from 'vue';

export const state = {
    viewMode: 'map', // options: map, list
    mapPosition: {
        zoom: 4,
        center: {lat: 39.0, lng: -93.0}
    }
}

export const getters = {
    mapPosition: state => state.mapPosition
    // yyyyyyyyyy: state => state.list,
    // xxxxxxxx: (state) => (stop_id) => {
    //     return state.current.stops.find(obj => {
    //         return obj.id == stop_id;
    //     });
    // }
}

export const mutations = {
    setViewMode(state, mode) {
        if (mode == state.viewMode) {
            return;
        }
        
        Vue.set(state, 'viewMode', mode);
    },
    setMapPosition(state, newPosition) {
        Vue.set(state, 'mapPosition', newPosition);
    }
    // ttttttttttttttttt(state) {
    //     Vue.set(state, 'current', { stops: [], route: [], })
    // },
}

export const actions = {
    destroy({ commit, dispatch }, stop_id) {
        // commit('saveToken', payload)
        
    },
}

<template>
    <div>
        <!-- FEATURE IMAGE -->
        <input id="main_image" name="main_image" type="file" class="input-file" @change="uploadImage" hidden>
        <div v-if="! form.main_image_id" class="feature-box empty" @click.stop="openFileDialog('main_image')" v-b-tooltip.hover title="Images must be at least 700 x 400 pixels, in landscape orientation, and in high resolution for image quality.">
            <div class="addlink">
                <fa v-if="busyUploading == 'main_image'" class="fa-spin" size="lg" :icon="['fas', 'spinner']" />
                <fa v-else size="lg" :icon="['fas', 'plus']" />
                <br>Add Feature Image
            </div>
        </div>
        <div v-else 
            class="feature-box" 
            @click.stop="openFileDialog('main_image')"
            :style="{ 'background-image': `url('${imagePath(form.main_image, 'sm')}')` }" 
            v-b-tooltip.hover title="Images must be at least 700 x 400 pixels, in landscape orientation, and in high resolution for image quality."
        >
            <div class="delete" @click.stop="deleteMedia('main_image')">
                <fa :icon="['fas', 'times']" />
            </div>
        </div>

        <div class="p-3">
            <h4>Title</h4>
            <b-form-group>
                <b-form-input id="title"
                    :disabled="form.busy"
                    type="text"
                    v-model="form.title"
                    required
                    maxlength="35"
                    placeholder="Title">
                </b-form-input>
                <input-help :form="form" field="title" text=""></input-help>
            </b-form-group>
            
            <h4 style="line-height: 26px;">
                Description
                <span class="info-icon" v-b-tooltip.hover title="The description should have a minimum of 250 words.">
                    <div class="j-icon mgt-3">j</div>
                </span>
            </h4>
            <b-form-group>
                <b-form-textarea id="description"
                    :disabled="form.busy"
                    type="text"
                    v-model="form.description"
                    required
                    rows="5"
                    placeholder="Description">
                </b-form-textarea>
                <input-help :form="form" field="description" text=""></input-help>
            </b-form-group>

            <div v-if="tour.type != 'indoor'">
                <div class="flex align-items-base">
                    <h4 class="f-1">Location</h4>
                    <a v-if="!useMapForLocation" href="#" class="reverse mr-2" @click.prevent="useMap()">
                        <fa :icon="['fas', 'map-marker-alt']" />&nbsp;Use Map
                    </a>
                    <a v-else href="#" class="reverse mr-2" @click.prevent="cancelUseMap()">
                        Cancel
                    </a>
                </div>
                <address-form 
                    :form="form" 
                    v-model="form.location" 
                    @input="updateCurrentStop" 
                    :overlay="useMapForLocation" />

                <h4 class="mt-4 info-heading">
                    Trigger Radius<span style="text-transform: lowercase"> (meters)</span>
                    <span class="info-icon" v-b-tooltip.hover title="This tells you how far away from the location the user has to be in meters before the audio will play automatically.">
                        <div class="j-icon mgt-3">j</div>
                    </span>
                </h4>

                <b-form-group>
                    <b-form-input id="play_radius"
                        :disabled="form.busy"
                        type="number"
                        v-model="form.play_radius"
                        required
                        @input="updateCurrentStop"
                        placeholder="Location Trigger">
                    </b-form-input>
                    <input-help :form="form" field="play_radius" text=""></input-help>
                </b-form-group>
            </div>

            <!-- AUDIO -->
            <h4 class="info-heading">
                Audio
                <span class="info-icon" v-b-tooltip.hover title="Audio must be in MP3 format, mono recommended">
                    <span class="j-icon mgt-3">j</span>
                </span>
            </h4>
            
            <h3 v-if="tour.type == 'indoor'">Intro Audio</h3>
            <input id="intro_audio" name="intro_audio" type="file" class="input-file" @change="uploadAudio" hidden>
            <custom-audio-player 
                id="intro_audio"
                :source="audioCustomSource(form.intro_audio)"
                :busy="busyUploading == 'intro_audio'"
                @upload="openFileDialog('intro_audio')"
                @delete="deleteMedia('intro_audio')"
            />
            <audio-recorder
                :upload-url="mediaUrl"
                :attempts="1"
                :time="5"
                :before-upload="upload"
                :successful-upload="uploadSuccess"
                :failed-upload="uploadFail"
            />
            
            <div v-if="tour.type == 'indoor'">
                <h3>Background Audio</h3>
                <input id="background_audio" name="background_audio" type="file" class="input-file" @change="uploadAudio" hidden>
                <custom-audio-player 
                    id="background_audio"
                    :source="audioCustomSource(form.background_audio)" 
                    :busy="busyUploading == 'background_audio'"
                    @upload="openFileDialog('background_audio')" 
                    @delete="deleteMedia('background_audio')"
                />
            </div>
            
            
            
            <!-- MEDIA -->
            <h4 class="info-heading mt-3">
                Media
                <span class="info-icon" v-b-tooltip.hover :title="`Images must be at least 700 x 400 pixels, in landscape orientation, and in high resolution for image quality.`">
                    <div class="j-icon mgt-3">j</div>
                </span>
            </h4>

            <!-- IMAGES  -->
            <b-row class="image-row mb-3">
                <b-col lg="4">
                    <input id="image1" name="image1" type="file" class="input-file" @change="uploadImage" hidden>
                    <image-box 
                        id="image1"
                        :url="imagePath(form.image1, 'sm')" 
                        :busy="busyUploading == 'image1'"
                        @click="openFileDialog('image1')" 
                        @delete="deleteMedia('image1')"
                    ></image-box>
                </b-col>
                <b-col lg="4">
                    <input id="image2" name="image2" type="file" class="input-file" @change="uploadImage" hidden>
                    <image-box 
                        id="image2"
                        :url="imagePath(form.image2, 'sm')" 
                        :busy="busyUploading == 'image2'"
                        @click="openFileDialog('image2')" 
                        @delete="deleteMedia('image2')"
                    ></image-box>
                </b-col>
                <b-col lg="4">
                    <input id="image3" name="image3" type="file" class="input-file" @change="uploadImage" hidden>
                    <image-box 
                        id="image3"
                        :url="imagePath(form.image3, 'sm')" 
                        :busy="busyUploading == 'image3'"
                        @click="openFileDialog('image3')" 
                        @delete="deleteMedia('image3')"
                    ></image-box>
                </b-col>
            </b-row>
            <!-- /end IMAGES -->

            <!-- YOUTUBE -->
            <youtube-input :form="form" id="video_url" v-model="form.video_url"></youtube-input>
            <!-- /end YOUTUBE -->

            <!-- QUESTIONS-->
            <!-- If the stop is end point, no decisions for this stop-->
            <div v-if="tour.type === 'adventure' && this.form.role !== 2">
                <h4 class="info-heading mt-3">
                    Decisions
                    <span class="info-icon" v-b-tooltip.hover title="Decisions are the choices that the user will make after they receive all the information you provided on this stop. The choice that they make will help determine their points and reveal the next location that the user will go to. Decisions are either multiple choice or fill in the blank. Each choice must lead to another stop.">
                        <div class="j-icon mgt-3">j</div>
                    </span>
                </h4>

                <h3 class="sub-title">
                    Question Prompt
                    <span class="info-icon" v-b-tooltip.hover title="The question is limited to 60 characters.">
                        <div class="j-icon mgt-3">j</div>
                    </span>
                </h3>
                <b-form-group>
                    <b-form-textarea id="question"
                        :disabled="form.busy"
                        type="text"
                        v-model="form.question"
                        required
                        rows="4"
                        maxlength="60"
                        placeholder="">
                    </b-form-textarea>
                    <p :class="isMaxDescription ? 'character-count c-red' : 'character-count'">{{ charactersLeft }}</p>
                    <input-help :form="form" field="question" text=""></input-help>
                </b-form-group>
                
                <b-tabs pills class="mt-3" v-model="isMultipleChoice">
                    <b-tab title="Fill-In-The-Blank" :active="! form.is_multiple_choice">
                        <h3 class="mt-3">Correct Answer</h3>
                        <b-form-group>
                            <b-form-textarea id="question_answer"
                                :disabled="form.busy"
                                type="text"
                                v-model="form.question_answer"
                                required
                                rows="4"
                                placeholder="">
                            </b-form-textarea>
                            <input-help :form="form" field="question_answer" text=""></input-help>
                        </b-form-group>

                        <h3>Success Message</h3>
                        <b-form-group>
                            <b-form-textarea id="question_success"
                                :disabled="form.busy"
                                type="text"
                                v-model="form.question_success"
                                required
                                rows="4"
                                placeholder="">
                            </b-form-textarea>
                            <input-help :form="form" field="question_success" text=""></input-help>
                        </b-form-group>

                        <h3>Next Stop</h3>
                        <next-stop-dropdown v-model="form.next_stop_id" :busy="form.busy" @changeRoute="updateRoutes" />
                    </b-tab>

                    <b-tab title="Multiple Choice" :active="form.is_multiple_choice">
                        <!-- Multiple Choice -->
                        <h3 class="mt-3 sub-title">
                            Options
                            <span class="info-icon" v-b-tooltip.hover title="The answers are limited to 60 characters.">
                                <div class="j-icon mgt-3">j</div>
                            </span>
                        </h3>

                        <stop-choice v-for="(item, index) in form.choices"
                            :key="index + '' + item.id"
                            :busy="form.busy"
                            v-model="form.choices[index]"
                            @delete="deleteChoice(index)"
                            @changeRoute="updateRoutes"
                        ></stop-choice>
                        
                        <b-btn size="sm" variant="primary" class="w-100 mt-3" @click="addChoice">
                        <fa :icon="['fas', 'map-marker-alt']"/>&nbsp;&nbsp;Add Decision Point</b-btn>
                        <!-- /end Multiple Choice -->
                    </b-tab>
                </b-tabs>

                <!-- /end QUESTIONS -->
            </div>
            <div v-if="tour.type === 'adventure'">
                <h4 class="info-heading mt-3">
                    Role
                    <span class="info-icon" v-b-tooltip.hover title="Decisions are the choices that the user will make after they receive all the information you provided on this stop. The choice that they make will help determine their points and reveal the next location that the user will go to. Decisions are either multiple choice or fill in the blank. Each choice must lead to another stop.">
                        <div class="j-icon mgt-3">j</div>
                    </span>
                </h4>
                <p>Only one stop can be either the start or the end point</p>
                <b-tabs pills class="mt-3" v-model="isStartOrEndPoint">
                    <b-tab title="SET START POINT">
                        <b-form-group class="mt-3">
                            <b-form-textarea id="start_message"
                                :disabled="form.busy"
                                type="text"
                                v-model="form.start_message"
                                required
                                rows="3"
                                placeholder="Start Point Message">
                            </b-form-textarea>
                            <input-help :form="form" field="start_message" text=""></input-help>
                        </b-form-group>

                        <h3>Start Point Media</h3>
                        <b-row class="image-row mb-3">
                            <b-col lg="4">
                                <input id="start_image" name="start_image" type="file" class="input-file" @change="uploadImage" hidden>
                                <image-box 
                                    id="start_image"
                                    :url="imagePath(form.start_image, 'sm')" 
                                    :busy="busyUploading == 'start_image'"
                                    @click="openFileDialog('start_image')" 
                                    @delete="deleteMedia('start_image')"
                                ></image-box>
                            </b-col>
                        </b-row>

                        <youtube-input :form="form" id="start_video_url" v-model="form.start_video_url"></youtube-input>
                    </b-tab>
                    <b-tab title="DECISION POINT">
                    </b-tab>
                    <b-tab title="SET END POINT">
                        <b-form-group class="mt-3">
                            <b-form-textarea id="end_message"
                                :disabled="form.busy"
                                type="text"
                                v-model="form.end_message"
                                required
                                rows="3"
                                placeholder="End Point Message">
                            </b-form-textarea>
                            <input-help :form="form" field="end_message" text=""></input-help>
                        </b-form-group>

                        <h3>End Point Media</h3>
                        <b-row class="image-row mb-3">
                            <b-col lg="4">
                                <input id="end_image" name="end_image" type="file" class="input-file" @change="uploadImage" hidden>
                                <image-box 
                                    id="end_image"
                                    :url="imagePath(form.end_image, 'sm')" 
                                    :busy="busyUploading == 'end_image'"
                                    @click="openFileDialog('end_image')" 
                                    @delete="deleteMedia('end_image')"
                                ></image-box>
                            </b-col>
                        </b-row>

                        <youtube-input :form="form" id="end_video_url" v-model="form.end_video_url"></youtube-input>
                    </b-tab>
                </b-tabs>
                
            </div>
            <!-- <div v-if="tour.type == 'outdoor'">
                <h4 class="info-heading mt-3">
                    Next Stop
                    <span class="info-icon" v-b-tooltip.hover title="Set the route to the next stop here">
                        <span class="j-icon">j</span>
                    </span>
                    <next-stop-dropdown class="mt-2" v-model="form.next_stop_id" :busy="form.busy" :no-routes="true" />
                </h4>
            </div> -->

            <!-- SAVE -->
            <b-row class="mt-5">
                <b-col lg="6">
                    <busy-button :busy="form.busy" variant="primary" class="w-100" @click="save" :disabled="!hasChanges">
                        <fa :icon="['fas', 'check']"/>&nbsp;&nbsp;Save
                    </busy-button>
                </b-col>
                <b-col lg="6">
                    <busy-button :busy="form.busy" variant="danger" class="w-100" @click="deleteStop">
                        <fa :icon="['fas', 'times']"/>&nbsp;&nbsp;Delete
                    </busy-button>
                </b-col>
            </b-row>
        </div>

        <!-- Confirmation modal -->
        <confirm-modal ref="confirm" yesButton="Delete">
            Are you sure you want to delete this stop?
        </confirm-modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UploadsMedia from '../mixins/UploadsMedia';
import Geocoding from '../mixins/Geocoding';

export default {
    mixins: [ UploadsMedia, Geocoding ],
    props: ['isEndPoint', 'isStartPoint'],
    data: () => ({
        maxDescriptionCharacters: 60,
        isMaxDescription: false,
        form: new Form({
            id: null,
            title: '',
            description: '',

            location: {},
            is_multiple_choice: false,
            question: '',
            question_answer: '',
            question_success: '',
            next_stop_id: null,
            choices: [],
            video_url: '',
            role: 1,
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

            start_image: "",
            start_message: "",
            start_video_url: "",

            end_image: "",
            end_message: "",
            end_video_url: "",
        }),
        useMapForLocation: false,
    }),

    computed: {
        ...mapGetters({
            tour: 'tours/current',
            stop: 'tours/currentStop',
            createStopUrl: 'tours/createStopUrl',
            saveStopUrl: 'tours/saveStopUrl',
            clickedPoint: 'map/clickedPoint',
            saveTourUrl: 'tours/saveUrl',
            mediaUrl: 'tours/mediaUrl',
            routes: 'routes/current',
            routeMode: 'routes/mode',
            draggedMarker: 'map/draggedMarker',
            hasChanges: 'tours/getStopChanges',
        }),
        
        hasStop() {
            return this.stop.id ? true : false;
        },

        isMultipleChoice: {
            get: function () {
                return this.form.is_multiple_choice ? 1 : 0;
            },
            set: function (newValue) {
                this.form.is_multiple_choice = newValue == 1;
            }
        },

        isStartOrEndPoint: {
            get: function () {
                var isStartOrEndPoint = 1;
                if (this.isStartPoint) {
                    isStartOrEndPoint = 0;
                }
                if (this.isEndPoint) {
                    isStartOrEndPoint = 2;
                }
                return isStartOrEndPoint;
            },
            set: function (newValue) {
                this.form.role = newValue;
            }
        },

        charactersLeft: function () {
            let char = this.form.question ? this.form.question.length : 0;
            const limit = this.maxDescriptionCharacters
            if (char >= limit) {
                this.isMaxDescription = true;
            } else {
                this.isMaxDescription = false;
            }
            return char + ' / ' + limit;
        }
    },

    methods: {
        updateRoutes(routes) {
            this.form.routes = routes;
        },

        submit() {
            let url = this.createStopUrl;
            let method = 'post';

            if (this.hasStop) {
                url = this.saveStopUrl;
                method = 'patch'
            }

            return this.form.submit(method, url);
        },

        upload(data) {
            var field = 'intro_audio';
            this.busyUploading = field;
            this.form.busy = true;
        },

        uploadSuccess(data) {
            console.log(data);
            var field = 'intro_audio'
            this.form[`${field}_id`] = data.data.data.id;
            this.form[field] = data.data.data;
            this.form.busy = false;
            this.busyUploading = '';
            alerts.addMessage('success', data.data.message);
        },

        uploadFail(data) {
            alerts.addMessage('error', data.data.message);
        },

        async save() {
            this.$store.commit('tours/setStartOrEndPoint', {stopID: this.stop.id, form: this.form});
            // remove other type of questions when switching type
            if (this.isMultipleChoice) {
                this.form.next_stop_id = null;
                this.form.question_answer = '';
                this.form.question_success = '';

                // reset choice order
                for (var i = 1; i <= this.form.choices.length; i++) {
                    this.form.choices[i-1].order = i;
                }
            } else {
                this.form.choices = [];
            }

            this.submit()
                .then( ({ data }) => {
                    if (this.hasStop) {
                        this.$store.commit('tours/updateStop', data.data);
                    } else {
                        this.$store.commit('tours/pushStop', data.data);
                        this.$store.commit('tours/setCurrentStop', data.data);
                    }
                    
                    this.form.fill(this.stop);

                    Vue.nextTick(() => {
                        this.markFormAsChanged(false);
                    });
                })
                .catch(e => {
                    console.log('save stop error:');
                    console.log(e);
                });
        },

        addChoice() {
            console.log('adding choice...');
            this.form.choices.push({
                id: '',
                tour_stop_id: this.stop.id,
                order: this.form.choices.length + 1,
                answer: '',
                next_stop_id: null,
            });
        },

        deleteChoice(index) {
            this.form.choices.splice(index, 1);
        },

        addStop() {
            console.log('adding stop...');
            this.$emit('addStop')
        },
        
        updateCurrentStop() {
            console.log('update current changed');
            if (this.form.isDirty()) {
                // console.log('stop location changed');
                this.$store.commit('tours/setCurrentStop', {...this.form.data()});
                this.markFormAsChanged(true);
            }
        },

        async deleteStop(confirm = true) {
            this.$refs.confirm.confirm(() => {
                this.form.busy = true;
                axios.delete(this.saveTourUrl + `/stops/${this.stop.id}`)
                    .then( ({ data }) => {
                        this.$emit('deleted');
                        this.form.busy = false;
                    })
                    .catch( e => {
                        alerts.addMessage('error', e.response.data.message);
                        this.form.busy = false;
                    })  
            });
        },

        useMap() {
            this.$store.commit('map/setCursor', 'n-resize');
            this.useMapForLocation = true;
            this.$store.commit('stops/setViewMode', 'map');
        },

        cancelUseMap() {
            this.useMapForLocation = false
            this.$store.commit('map/setCursor', undefined);
        },

        markFormAsChanged(changed = false) {
            this.$store.commit('tours/setStopChanges', changed);
        },
    },

    async mounted() {
        this.form.fill(this.stop);

        this.form.role = this.isStartOrEndPoint;
        this.form.start_image = this.tour.start_image;
        this.form.start_message = this.tour.start_message;
        this.form.start_video_url = this.tour.start_video_url;
        this.form.end_image = this.tour.end_image;
        this.form.end_message = this.tour.end_message;
        this.form.end_video_url = this.tour.end_video_url;

        await Vue.nextTick();
        this.markFormAsChanged(false);
    },

    watch: {
        async stop(newVal, oldVal) {
            // this is a fix because when the stop form changes for some reason
            // the v-model syncs twice and updates this value signaling 'changes' 
            // in the stop form.
            // this.form.next_stop_id = '';
            // await Vue.nextTick();
            console.log('stop watch changed');
            if (! newVal.id) {
                // new stop
                console.log('new stop');
                this.form = new Form(newVal);

                await Vue.nextTick();
                this.markFormAsChanged(true);
                return;
            }

            if (newVal.id != oldVal.id) {
                // stop has actually changed
                console.log("stop form stop changed");
                if (this.tour.type == 'adventure') {
                    this.$store.commit('routes/clearCurrent');
                }
                this.form.fill(newVal);
                await Vue.nextTick();
                this.markFormAsChanged(false);
                return;
            }

            if (! oldVal.id) {
                // stop is set initially
                this.form.fill(newVal);
                this.markFormAsChanged(false);
                return;
            }

            // this.form.fill(newVal);
        },

        'form': {
            handler() {
                if (this.form.isDirty()) {
                    console.log('stop form changes');
                    this.markFormAsChanged(true);
                }
            },
            deep: true,
        },
        
        async clickedPoint(newVal, oldVal) {
            if (this.useMapForLocation) {
                this.useMapForLocation = false;
                this.$store.commit('map/setCursor', undefined);

                let address = await this.reverseLookup(newVal.latitude, newVal.longitude)

                this.form.location = {
                    ...address,
                    latitude: newVal.latitude,
                    longitude: newVal.longitude,
                }

                // this.markFormAsChanged(true);
                this.updateCurrentStop();
            }
        },

        async draggedMarker(newVal, oldVal) {
            if (newVal.stop.id != this.stop.id) {
                return;
            }

            let address = await this.reverseLookup(newVal.latLng.lat, newVal.latLng.lng)

            this.form.location = {
                ...address,
                latitude: newVal.latLng.lat,
                longitude: newVal.latLng.lng,
            }

            // this.markFormAsChanged(true);
            this.updateCurrentStop();
        },

        'form.choices': {
            handler(newVal, oldVal) {
                // console.log(newVal);
                // console.log(newVal == this.form.choices);
            },
            deep: true,
        },
    },
}
</script>

<style lang="scss">
$audioGray: #d9d1d1;
$blue:    #79acd1 !default;
$darkBlue: #3e4759 !default;
$red:     #e20e24 !default;
$darkRed: #ad1a28 !default;
.ar-icon__lg {
    width: 52px !important;
    height: 52px !important;
}
.ar-icon__sm {
    width: 35px !important;
    height: 35px !important;
}
.ar {
    margin-bottom: 10px;
}
p.character-count {
    float: right;
    font-size: 12px;
    margin-right: 15px;
}
.c-red {
    color: red;
}
.sub-title {
    display: flex;
    line-height: 26px;
}
</style>
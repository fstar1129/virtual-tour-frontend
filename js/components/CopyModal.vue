<template>
    <b-modal id="confirmDelete" :title="title" v-model="show" size="lg">
        <slot>
            <div style="cursor: default;">
                <div :class="tourPremium === 'premium' ? 'link-section' : ''">
                    <p>The two links are ways to share your Junket. They each serve a different purpose. </p>
                    <p><strong>1. Deep Link</strong></p>
                    <p>If the Junket app is already installed on a device, when this link is clicked, it will open the Junket app and take the user directly to your Junket inside the app. When sharing this, be sure to tell people that they should download the app first.</p>
                    <div class="link-items">
                        <div>{{appLink}}</div>
                        <b-btn variant="outline-primary" @click.prevent="copyAppLink()">Copy link</b-btn>
                    </div>
                    <p><strong>2. Web based Junket link</strong></p>
                    <p>You can add this link to your website or share with others to open up the junket in a web browser, outside of the app.</p>
                    <div class="link-items">
                        <div>{{webLink}}</div>
                        <b-btn variant="outline-primary" @click.prevent="copyWebLink()">Copy link</b-btn>
                    </div>
                    <p><strong>3. Webhook for FareHarbor</strong></p>
                    <p>You can register this link to your FareHarbor website to sell your junket.</p>
                    <div class="link-items">
                        <div>{{fareharborLink}}</div>
                        <b-btn variant="outline-primary" @click.prevent="copyFareharborLink()">Copy link</b-btn>
                    </div>
                </div>
                <div v-if="tourPremium === 'premium'">
                    <strong>Web share code for "BOOK NOW" button</strong>
                    <h4 style="line-height: 26px;">
                        HTML
                        <span class="info-icon" v-b-tooltip.hover title="You should include this code in HTML">
                            <div class="j-icon mgt-3">j</div>
                        </span>
                    </h4>
                    <b-form-group>
                        <b-form-textarea id="description"
                            type="text"
                            v-model="htmlCode"
                            required
                            rows="1"
                            class="code-form"
                            placeholder="">
                        </b-form-textarea>
                    </b-form-group>
                    <h4 style="line-height: 26px;">
                        Javascript
                        <span class="info-icon" v-b-tooltip.hover title="You should include this code in Javascript">
                            <div class="j-icon mgt-3">j</div>
                        </span>
                    </h4>
                    <b-form-group>
                        <b-form-textarea id="description"
                            type="text"
                            v-model="jsCode"
                            required
                            rows="1"
                            class="code-form"
                            placeholder="">
                        </b-form-textarea>
                    </b-form-group>
                </div>
            </div>
        </slot>
        <div slot="modal-footer" class="copy-modal-footer" style="flex-direction: column;">
            <div class="link-item">
                <b-btn variant="outline-secondary" @click.prevent="hideModal()">Cancel</b-btn>
            </div>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: 'CopyModal',

    props: {
        title: {
            type: String,
            default: 'Copy Link!',
        },
        link: {
            type: String | Number,
            default: '',
        },
        tourTitle: {
            type: String,
            default: '',
        },
        tourCity: {
            type: String,
            default: '',
        },
        tourPremium: {
            type: String,
            default: '',
        },
    },

    data: () => ({
        show: false,
        callback: null,
        webLink: '',
        appLink: '',
        fareharborLink: '',
        htmlCode: '',
        jsCode: ''
    }),

    mounted() {
        var string = this.link;
        this.appLink = "https://wejunket.com/junket/" + this.link;
        this.webLink = "https://wejunket.com/junkets/" + (this.tourCity && this.changeSpaceToHyphen(this.tourCity)) + '/' +this.changeSpaceToHyphen(this.tourTitle) + '/' + this.link;
        this.fareharborLink= "https://api.wejunket.com/purchase-junket-from-fareharbor/" + this.link;
        this.htmlCode = '<button id="wejunketbookWidgetOpenModal">Book now</button>\n' + 
            '<div id="wejunketbookWidgetModal" class="modal">\n\t' +
            '<div class="modal-content">\n\t' +
                '\t<div class="wejunketbook-widget" data-id="' + this.link + '"></div>\n\t' +
            '</div>\n' +
            '</div>';
        this.jsCode = "<scr" + "ipt>\n\t" +
            "(function (w,d,s,o,f,js,fjs) {\n\t" +
                "\tw['JS-Widget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };\n\t" +
                "\tjs = d.createElement(s), fjs = d.getElementsByTagName(s)[0];\n\t" +
                "\tjs.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);\n\t" +
            "}(window, document, 'script', 'mw', 'https://wejunket.com/js/widget.js'));\n\t" +
            "mw('init');\n\t" +
            "mw('book-now');\n" +
            "</scr" + "ipt>";
    },

    methods: {
        confirm(callback, cancelCallback = null, noCallback = null) {
            this.show = true;
            this.callback = callback;
        },

        copyAppLink () {
            var textarea = document.createElement('textarea');
            textarea.textContent = this.appLink;
            document.body.appendChild(textarea);
            var selection = document.getSelection();
            var range = document.createRange();
            range.selectNode(textarea);
            selection.removeAllRanges();
            selection.addRange(range);
            console.log('copy success', document.execCommand('copy'));
            selection.removeAllRanges();
            document.body.removeChild(textarea);
        },

        copyWebLink () {
            var textarea = document.createElement('textarea');
            textarea.textContent = this.webLink;
            document.body.appendChild(textarea);
            var selection = document.getSelection();
            var range = document.createRange();
            range.selectNode(textarea);
            selection.removeAllRanges();
            selection.addRange(range);
            console.log('copy success', document.execCommand('copy'));
            selection.removeAllRanges();
            document.body.removeChild(textarea);
        },
        
        copyFareharborLink () {
            var textarea = document.createElement('textarea');
            textarea.textContent = this.fareharborLink;
            document.body.appendChild(textarea);
            var selection = document.getSelection();
            var range = document.createRange();
            range.selectNode(textarea);
            selection.removeAllRanges();
            selection.addRange(range);
            console.log('copy success', document.execCommand('copy'));
            selection.removeAllRanges();
            document.body.removeChild(textarea);
        },

        changeSpaceToHyphen(tourTitle) {
            var temp = tourTitle.toLowerCase();
            var replaced = temp.split(' ').join('_');
            return replaced;
        },

        hideModal() {
            this.show = false;
        }
    }
}
</script>
<style>
.link-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 1rem;
    width: 100%;
}
.link-items {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    width: 100%;
}
.link-section {
    border-bottom: 1px solid #e9ecef;
    margin-bottom: 1rem;
}
.code-form {
    border-radius: 5px !important;
}
</style>
